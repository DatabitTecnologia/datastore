import React, { useState, useEffect, useMemo } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Gift } from 'react-feather';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { apiList, apiDropdown } from 'datareact/src/api/crudapi';
import { Decode64 } from 'datareact/src/utils/crypto';
import AGGrid from '../../../../components/AGGrid';
import Pie from '../../../../components/Pie';
import { LoadingOverlay } from '../../../../utils/databit/screenprocess';
import Dropdown from '../../../../components/Dropdown';
import { getDefaultStartDate, getDefaultEndDate } from '../../../../utils/databit/dateutils';
import { totalizarLista } from '../../../../utils/databit/total';

// === Utilitários externos ===

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 3 },
  desktop: { breakpoint: { max: 1024, min: 768 }, items: 3 },
  tablet: { breakpoint: { max: 768, min: 464 }, items: 2 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
};

const CustomLeftArrow = ({ onClick }) => (
  <button className="custom-arrow left-arrow" onClick={onClick}>
    ⬅
  </button>
);

const CustomRightArrow = ({ onClick }) => (
  <button className="custom-arrow right-arrow" onClick={onClick}>
    ➡
  </button>
);

function agruparESomar(dados, campo) {
  const agrupado = dados.reduce((acc, item) => {
    const chave = item[campo];
    if (!acc[chave]) acc[chave] = { qtde: 0, valor: 0 };
    acc[chave].qtde += 1;
    if (campo !== 'situacao') {
      acc[chave].valor += item.vlrbeneficio;
    } else {
      switch (item.possituacao) {
        case 1: {
          acc[chave].valor += item.vlrrestante;
          break;
        }
        case 2: {
          acc[chave].valor += item.vlrutilizado;
          break;
        }
        case 3: {
          acc[chave].valor += item.vlrexpirado;
          break;
        }
        case 4: {
          acc[chave].valor += item.vlraguardando;
          break;
        }
      }
    }

    return acc;
  }, {});
  return Object.entries(agrupado)
    .sort((a, b) => b[1].valor - a[1].valor)
    .map(([nome, valores], index) => ({
      id: index + 1,
      nome,
      qtde: valores.qtde,
      valor: valores.valor
    }));
}

// === Componentes auxiliares ===

const Item = ({ title, data, loading, columns2 }) => (
  <div style={{ padding: '5px' }}>
    <Card style={{ borderRadius: '12px' }}>
      <Card.Header>
        <Card.Title as="h5">{title}</Card.Title>
      </Card.Header>
      <Row style={{ padding: '10px' }}>
        <Pie height={'300px'} width={'100%'} data={data} showLabels={false} />
      </Row>
      <Row style={{ padding: '10px' }}>
        <AGGrid width="100%" height="293px" rows={data} columns={columns2} loading={loading} tools={false} />
      </Row>
    </Card>
  </div>
);

// === Componente principal ===

const LoginBeneficio = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemselec, setItemselec] = useState([]);
  const [itens, setItens] = useState([]);
  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(getDefaultEndDate());
  const [totais, setTotais] = useState([]);
  const [situacoes, setSituacoes] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [tiposelec, setTiposelec] = useState('ALL');
  const [situacaoselec, setSituacaoselec] = useState('ALL');

  const columns = useMemo(
    () => [
      { headerClassName: 'header-list', field: 'codigo', headerName: 'Código', width: 86 },
      { headerClassName: 'header-list', field: 'data', headerName: 'Data', width: 104, type: 'date' },
      { headerClassName: 'header-list', field: 'situacao', headerName: 'Situação', width: 110 },
      { headerClassName: 'header-list', field: 'tipo', headerName: 'Tipo', width: 110 },
      { headerClassName: 'header-list', field: 'mes', headerName: 'Mês', width: 83 },
      { headerClassName: 'header-list', field: 'validade', headerName: 'Validade', width: 108, type: 'date' },
      { headerClassName: 'header-list', field: 'vlrbeneficio', headerName: 'Concedido', width: 95, type: 'number', decimal: 2 },
      { headerClassName: 'header-list', field: 'vlrdisponibilizado', headerName: 'Disponível', width: 95, type: 'number', decimal: 2 },
      { headerClassName: 'header-list', field: 'vlrexpirado', headerName: 'Expirado', width: 95, type: 'number', decimal: 2 },
      { headerClassName: 'header-list', field: 'vlraguardando', headerName: 'Aguardando', width: 95, type: 'number', decimal: 2 },
      { headerClassName: 'header-list', field: 'vlrutilizado', headerName: 'Utilizado', width: 95, type: 'number', decimal: 2 },
      { headerClassName: 'header-list', field: 'vlrrestante', headerName: 'Restante', width: 95, type: 'number', decimal: 2 },
      { headerClassName: 'header-list', field: 'origem', headerName: 'Origem', width: 90 },
      { headerClassName: 'header-list', field: 'nomecli', headerName: 'Nome do Cliente', width: 300 }
    ],
    []
  );

  const columns2 = useMemo(
    () => [
      { headerClassName: 'header-list', field: 'nome', headerName: 'Descrição', width: 170 },
      { headerClassName: 'header-list', field: 'qtde', headerName: 'Qtde.', width: 70, type: 'number' },
      { headerClassName: 'header-list', field: 'valor', headerName: 'R$ Total', width: 110, type: 'number', decimal: 2 }
    ],
    []
  );

  useEffect(() => {
    setLoading(true);
    let tmpsituacoes = [];
    tmpsituacoes.push({ value: 'ALL', label: 'Todas as Situações' });
    apiDropdown('VW02337', 'possituacao', 'situacao', '').then((response) => {
      if (response.status === 200) {
        const listsituacoes = response.data;
        listsituacoes.forEach((element) => {
          tmpsituacoes.push(element);
        });
        setSituacoes(tmpsituacoes);
      }
    });
  }, []);

  useEffect(() => {
    let tmptipos = [];
    tmptipos.push({ value: 'ALL', label: 'Todos os Tipos' });
    if (situacoes.length > 0) {
      apiDropdown('VW02337', 'classificacao', 'tipo', '').then((response) => {
        if (response.status === 200) {
          const listipos = response.data;
          listipos.forEach((element) => {
            tmptipos.push(element);
          });
          setTipos(tmptipos);
          Filtrar();
        }
      });
    }
  }, [situacoes]);

  useEffect(() => {
    if (!rows.length) return;

    const tmpitens = [
      { title: 'Ranking por Situação', data: agruparESomar(rows, 'situacao') },
      { title: 'Ranking por Tipo', data: agruparESomar(rows, 'tipo') },
      { title: 'Ranking por Mes', data: agruparESomar(rows, 'mes') }
    ];

    const tmptotais = [
      { data: totalizarLista(rows, 'vlrbeneficio', 'Total Concedido', 2), icon: <Gift></Gift>, color: '#00cc00' },
      { data: totalizarLista(rows, 'vlrdisponibilizado', 'Total Disponível', 2), icon: <Gift></Gift>, color: '#0099ff' },
      { data: totalizarLista(rows, 'vlrexpirado', 'Total Expirado', 2), icon: <Gift></Gift>, color: '#ff000d' },
      { data: totalizarLista(rows, 'vlraguardando', 'Total Aguardando', 2), icon: <Gift></Gift>, color: '#cccc00' },
      { data: totalizarLista(rows, 'vlrutilizado', 'Total Utilizado', 2), icon: <Gift></Gift>, color: '#130365' },
      { data: totalizarLista(rows, 'vlrrestante', 'Total Restante', 2), icon: <Gift></Gift>, color: '#045008' }
    ];

    setItens(tmpitens);
    setTotais(tmptotais);
  }, [rows]);

  const Filtrar = () => {
    setLoading(true);
    const codcli = Decode64(sessionStorage.getItem('client'));
    const grupo = Decode64(sessionStorage.getItem('group'));

    let filter =
      " (codcli = '" +
      codcli +
      "' or codcli in (select tb01008_codigo from tb01008 where tb01008_grupo = '" +
      grupo +
      "' and TB01008_GRUPO <> '0000')) ";

    const tmdata1 = Date.parse(startDate);
    const dt1 = new Date(tmdata1);
    const data1 = dt1.toLocaleDateString('en-US');

    const tmdata2 = Date.parse(endDate);
    const dt2 = new Date(tmdata2);
    const data2 = dt2.toLocaleDateString('en-US');

    filter += " and data BETWEEN '" + data1 + " 00:00:00' AND '" + data2 + " 23:59:00' ";

    if (situacaoselec !== 'ALL') {
      filter += " and possituacao = '" + situacaoselec + "' ";
    }

    if (tiposelec !== 'ALL') {
      filter += " and classificacao = '" + tiposelec + "' ";
    }

    apiList('RevendedorBeneficioVW', '*', '', filter).then((response) => {
      if (response.status === 200) {
        setRows(response.data);
        setLoading(false);
      }
    });
  };

  return (
    <div>
      <Card style={{ borderRadius: '12px' }}>
        <Card.Header>
          <Card.Title as="h5">Meus Benefícios</Card.Title>
        </Card.Header>
        <Row style={{ padding: '10px' }}>
          <Col lg={10}>
            <Row>
              <Col lg={2}>
                <label className="form-label">Período de:</label>
                <DatePicker
                  selected={startDate}
                  onChange={setStartDate}
                  className="form-control"
                  popperClassName="custom-datepicker-popper"
                  placeholderText="DD/MM/AAAA"
                  dateFormat="dd/MM/yyyy"
                  locale="en"
                />
              </Col>
              <Col lg={2}>
                <label className="form-label">Até:</label>
                <DatePicker
                  selected={endDate}
                  onChange={setEndDate}
                  className="form-control"
                  popperClassName="custom-datepicker-popper"
                  placeholderText="DD/MM/AAAA"
                  dateFormat="dd/MM/yyyy"
                  locale="en"
                />
              </Col>
              <Col lg={4}>
                <Dropdown
                  label="Filtro por Situação:"
                  style={{ marginTop: '1px', width: '330px' }}
                  options={situacoes}
                  onChange={(e) => setSituacaoselec(e)}
                />
              </Col>
              <Col lg={4}>
                <Dropdown
                  label="Filtro por Tipo:"
                  style={{ marginTop: '1px', width: '330px' }}
                  options={tipos}
                  onChange={(e) => setTiposelec(e)}
                />
              </Col>
            </Row>
          </Col>
          <Col style={{ marginTop: '30px' }}>
            <Row style={{ textAlign: 'right' }}>
              <Col>
                <Button className="btn color-button-primary shadow-2  mb-3" onClick={(e) => Filtrar()}>
                  <i className={'feather icon-filter'} /> Filtrar
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row style={{ padding: '10px' }}>
          <AGGrid
            width="100%"
            height="450px"
            rows={rows}
            columns={columns}
            loading={loading}
            item={itemselec}
            setItem={setItemselec}
            focus
            totalizadores={totais}
            counttotal={6}
          />
        </Row>
      </Card>

      <Carousel
        responsive={responsive}
        infinite
        autoPlay={false}
        customLeftArrow={<CustomLeftArrow />}
        customRightArrow={<CustomRightArrow />}
        autoPlaySpeed={3000}
        keyBoardControl
        arrows={false}
        showDots={false}
        containerClass="carousel-inner-wrapper"
      >
        {itens.map((item, index) => (
          <Item key={index} {...item} loading={loading} columns2={columns2} />
        ))}
      </Carousel>

      {loading && <LoadingOverlay />}
    </div>
  );
};

export default LoginBeneficio;
