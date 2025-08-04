import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Button, Card } from 'react-bootstrap';
import Carousel from 'react-multi-carousel';
import { DollarSign, Hash } from 'react-feather';
import 'react-multi-carousel/lib/styles.css';
import DatePicker from 'react-datepicker';
import { getDefaultStartDate, getDefaultEndDate } from '../../../../utils/databit/dateutils';
import { apiList } from 'datareact/src/api/crudapi';
import { Decode64 } from 'datareact/src/utils/crypto';
import AGGrid from '../../../../components/AGGrid';
import Pie from '../../../../components/Pie';
import { LoadingOverlay } from '../../../../utils/databit/screenprocess';
import 'react-datepicker/dist/react-datepicker.css';
import { downloadXML, gerarNFe } from 'datareact/src/api/nfe';
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
    acc[chave].qtde += item.qtde;
    acc[chave].valor += item.valor;
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

const LoginCompra = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemselec, setItemselec] = useState([]);
  const [itens, setItens] = useState([]);
  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(getDefaultEndDate());
  const [totais, setTotais] = useState([]);

  const columns = useMemo(
    () => [
      { headerClassName: 'header-list', field: 'ntfisc', headerName: 'Nota', width: 90 },
      { headerClassName: 'header-list', field: 'data', headerName: 'Data', width: 110, type: 'date' },
      { headerClassName: 'header-list', field: 'qtde', headerName: 'Qtde.', width: 80, type: 'number' },
      { headerClassName: 'header-list', field: 'valor', headerName: 'R$ Compra', width: 110, type: 'number', decimal: 2 },
      { headerClassName: 'header-list', field: 'pgto', headerName: 'Condição Pgto', width: 180 },
      { headerClassName: 'header-list', field: 'operacao', headerName: 'Operação de Venda', width: 220 },
      { headerClassName: 'header-list', field: 'numnfe', headerName: 'Número NFe', width: 370 }
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
    Filtrar();
  }, []);

  useEffect(() => {
    if (!rows.length) return;

    const tmpitens = [
      { title: 'Ranking por Mês', data: agruparESomar(rows, 'mes') },
      { title: 'Ranking por Ano', data: agruparESomar(rows, 'ano') },
      { title: 'Ranking por Condição de Pagto', data: agruparESomar(rows, 'pgto') },
      { title: 'Ranking por Operação', data: agruparESomar(rows, 'operacao') }
    ];

    const tmptotais = [
      { data: totalizarLista(rows, 'qtde', 'Quantidade de Itens', 0), icon: <Hash></Hash>, color: '#00cc00' },
      { data: totalizarLista(rows, 'valor', 'Total de Compras', 2), icon: <DollarSign></DollarSign>, color: '#0099ff' }
    ];

    setItens(tmpitens);
    setTotais(tmptotais);
  }, [rows]);

  const Filtrar = () => {
    setLoading(true);
    const codcli = Decode64(sessionStorage.getItem('client'));
    let filter = "codcli = '" + codcli + "' ";
    const tmdata1 = Date.parse(startDate);
    const dt1 = new Date(tmdata1);
    const data1 = dt1.toLocaleDateString('en-US');

    const tmdata2 = Date.parse(endDate);
    const dt2 = new Date(tmdata2);
    const data2 = dt2.toLocaleDateString('en-US');

    filter += " and data BETWEEN '" + data1 + " 00:00:00' AND '" + data2 + " 23:59:00' ";

    apiList('RevendedorCompraVW', '*', '', filter).then((response) => {
      if (response.status === 200) {
        setRows(response.data);
        setLoading(false);
      }
    });
  };

  const NFe = async () => {
    setLoading(true);
    await gerarNFe('NFe' + itemselec.numnfe + '.PDF', itemselec.xml);
    setLoading(false);
  };

  return (
    <div>
      <Card style={{ borderRadius: '12px' }}>
        <Card.Header>
          <Card.Title as="h5">Minhas Últimas Compras</Card.Title>
        </Card.Header>
        <Row style={{ padding: '10px' }}>
          <Col lg={3}>
            <Row>
              <Col>
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
              <Col>
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
            </Row>
          </Col>

          <Col style={{ marginTop: '30px' }}>
            <Row style={{ textAlign: 'right' }}>
              <Col>
                <Button className="btn color-button-primary shadow-2  mb-3" onClick={(e) => Filtrar()}>
                  <i className={'feather icon-filter'} /> Filtrar
                </Button>
                {itemselec && (
                  <Button
                    className="btn color-button-primary shadow-2  mb-3"
                    disabled={!itemselec.numnfe}
                    onClick={(e) => downloadXML(itemselec.xml, 'NFe' + itemselec.numnfe + '.xml')}
                  >
                    <i className={'feather icon-download'} /> Download XML
                  </Button>
                )}
                {itemselec && (
                  <Button className="btn color-button-primary shadow-2  mb-3" disabled={!itemselec.numnfe} onClick={(e) => NFe()}>
                    <i className={'feather icon-printer'} /> Imprimir Danfe
                  </Button>
                )}
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
        arrows
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

export default LoginCompra;
