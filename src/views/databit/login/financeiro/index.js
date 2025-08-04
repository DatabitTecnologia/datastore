import React, { useState, useEffect, useMemo } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { DollarSign } from 'react-feather';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { apiList, apiDropdown } from 'datareact/src/api/crudapi';
import { Decode64 } from 'datareact/src/utils/crypto';
import AGGrid from '../../../../components/AGGrid';
import Pie from '../../../../components/Pie';
import { LoadingOverlay } from '../../../../utils/databit/screenprocess';
import pago from '../../../../assets/images/databit/pago.png';
import vencido from '../../../../assets/images/databit/vencido.png';
import vencer from '../../../../assets/images/databit/avencer.png';
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
      acc[chave].valor += item.vlrtitulo;
    } else {
      if (item.possituacao === 1) {
        acc[chave].valor += item.vlrpago;
      } else {
        acc[chave].valor += item.vlrtitulo;
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

const LoginFinanceiro = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemselec, setItemselec] = useState([]);
  const [itens, setItens] = useState([]);
  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(getDefaultEndDate());
  const [totais, setTotais] = useState([]);
  const [situacoes, setSituacoes] = useState([]);
  const [situacaoselec, setSituacaoselec] = useState('ALL');
  const [tipodata, setTipodata] = useState(-1);

  const columns = useMemo(
    () => [
      { headerClassName: 'header-list', field: 'titulo', headerName: 'Título', width: 100 },
      { headerClassName: 'header-list', field: 'data', headerName: 'Data', width: 105, type: 'date' },
      { headerClassName: 'header-list', field: 'mes', headerName: 'Mês', width: 85 },
      { headerClassName: 'header-list', field: 'dtvenc', headerName: 'Venc.', width: 105, type: 'date' },
      { headerClassName: 'header-list', field: 'vlrbruto', headerName: 'R$ Bruto', width: 100, type: 'number', decimal: 2 },
      { headerClassName: 'header-list', field: 'vlrdesconto', headerName: 'R$ Desc.', width: 80, type: 'number', decimal: 2 },
      { headerClassName: 'header-list', field: 'vlracres', headerName: 'R$ Acresc.', width: 80, type: 'number', decimal: 2 },
      { headerClassName: 'header-list', field: 'vlrtitulo', headerName: 'R$ Título', width: 100, type: 'number', decimal: 2 },
      { headerClassName: 'header-list', field: 'vlrpago', headerName: 'R$ Pago', width: 100, type: 'number', decimal: 2 },
      { headerClassName: 'header-list', field: 'dtbaixa', headerName: 'Dt. Baixa', width: 105, type: 'date' },
      { headerClassName: 'header-list', field: 'situacao', headerName: 'Situação', width: 90 },
      { headerClassName: 'header-list', field: 'diasatraso', headerName: 'Dias', width: 60, type: 'number' },
      {
        headerClassName: 'header-list',
        field: 'picture',
        headerName: '',
        width: 52,

        renderCell: (params) => {
          switch (params.data.possituacao) {
            case 0: {
              return <img src={vencer} alt={params.data.codigo} className="rounded-circle" width="35" height="35" />;
            }
            case 1: {
              return <img src={pago} alt={params.data.codigo} className="rounded-circle" width="35" height="35" />;
            }
            case 2: {
              return <img src={vencido} alt={params.data.codigo} className="rounded-circle" width="35" height="35" />;
            }
          }
        }
      }
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
    tmpsituacoes.push({ value: 'ALL', label: 'Todas os Títulos' });
    apiDropdown('VW04057', 'possituacao', 'situacao', '').then((response) => {
      if (response.status === 200) {
        const listsituacoes = response.data;
        listsituacoes.forEach((element) => {
          tmpsituacoes.push(element);
        });
        tmpsituacoes.push({ value: 3, label: 'Em aberto' });
        setSituacoes(tmpsituacoes);
      }
    });
  }, []);

  useEffect(() => {
    Filtrar();
  }, [situacoes]);

  const Filtrar = () => {
    setLoading(true);
    const codcli = Decode64(sessionStorage.getItem('client'));
    let filter = "codcli = '" + codcli + "'";

    const tmdata1 = Date.parse(startDate);
    const dt1 = new Date(tmdata1);
    const data1 = dt1.toLocaleDateString('en-US');

    const tmdata2 = Date.parse(endDate);
    const dt2 = new Date(tmdata2);
    const data2 = dt2.toLocaleDateString('en-US');

    switch (parseInt(tipodata)) {
      case 0: {
        filter += " and data BETWEEN '" + data1 + " 00:00:00' AND '" + data2 + " 23:59:00' ";
        break;
      }
      case 1: {
        filter += " and dtvenc BETWEEN '" + data1 + " 00:00:00' AND '" + data2 + " 23:59:00' ";
        break;
      }
      case 2: {
        filter += " and dtbaixa BETWEEN '" + data1 + " 00:00:00' AND '" + data2 + " 23:59:00' ";
        break;
      }
    }

    if (situacaoselec !== 'ALL') {
      if (situacaoselec !== '3') {
        filter += " and possituacao = '" + situacaoselec + "' ";
      } else {
        filter += " and possituacao <> '1' ";
      }
    }
    console.log(filter);
    apiList('RevendedorFinanceiroVW', '*', '', filter).then((response) => {
      if (response.status === 200) {
        setRows(response.data);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    if (!rows.length) return;

    const tmpitens = [
      { title: 'Ranking por Mês de Competência', data: agruparESomar(rows, 'mes') },
      { title: 'Ranking por Situação', data: agruparESomar(rows, 'situacao') },
      { title: 'Ranking por Tipo Documento', data: agruparESomar(rows, 'tipodoc') }
    ];

    const tmptotais = [
      { data: totalizarLista(rows, 'vlrbruto', 'Total Bruto', 2), icon: <DollarSign></DollarSign>, color: '#00cc00' },
      { data: totalizarLista(rows, 'vlrdesconto', 'Total Desconto', 2), icon: <DollarSign></DollarSign>, color: '#ff6600' },
      { data: totalizarLista(rows, 'vlracres', 'Total Acréscimo', 2), icon: <DollarSign></DollarSign>, color: '#bbff00' },
      { data: totalizarLista(rows, 'vlrtitulo', 'Total Líquido', 2), icon: <DollarSign></DollarSign>, color: '#2500cc' },
      {
        data: totalizarLista(rows, 'vlrvencer', 'Total à Vencer', 2),
        icon: <DollarSign></DollarSign>,
        color: '#59f5a7'
      },
      {
        data: totalizarLista(rows, 'vlrvencido', 'Total Vencido', 2),
        icon: <DollarSign></DollarSign>,
        color: '#ff000d'
      },
      { data: totalizarLista(rows, 'vlrpago', 'Total Pago', 2), icon: <DollarSign></DollarSign>, color: '#539af8' }
    ];

    setItens(tmpitens);
    setTotais(tmptotais);
  }, [rows]);

  return (
    <div>
      <Card style={{ borderRadius: '12px' }}>
        <Card.Header>
          <Card.Title as="h5">Minha Posição Financeira</Card.Title>
        </Card.Header>
        <Row style={{ padding: '10px' }}>
          <Col lg={10}>
            <Row>
              <Col lg={2}>
                <Dropdown
                  label="Filtro por:"
                  style={{ marginTop: '1px', width: '150px' }}
                  options={[
                    { value: -1, label: 'Sem filtro' },
                    { value: 0, label: 'Emissão' },
                    { value: 1, label: 'Vencimento' },
                    { value: 2, label: 'Pagamento' }
                  ]}
                  onChange={(e) => setTipodata(e)}
                />
              </Col>
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
                  disabled={tipodata === -1}
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
                  disabled={tipodata === -1}
                />
              </Col>

              <Col lg={2}>
                <Dropdown
                  label="Filtro por Situação:"
                  style={{ marginTop: '1px', width: '190px' }}
                  options={situacoes}
                  onChange={(e) => setSituacaoselec(e)}
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
            rowHeight={40}
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

export default LoginFinanceiro;
