import React, { useState, useEffect, useMemo } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReactImageMagnify from 'react-image-magnify';
import { useToasts } from 'react-toast-notifications';
import { DollarSign, Hash } from 'react-feather';
import { apiDropdown, apiGetPicturelist, apiInsert, apiFind } from 'datareact/src/api/crudapi';
import { Decode64 } from 'datareact/src/utils/crypto';
import Dropdown from '../../../../components/Dropdown';
import AGGrid from '../../../../components/AGGrid';
import Pie from '../../../../components/Pie';
import { LoadingOverlay } from '../../../../utils/databit/screenprocess';
import { totalizarLista } from '../../../../utils/databit/total';
import { getDefaultStartDate, getDefaultEndDate } from '../../../../utils/databit/dateutils';
import semfoto from '../../../../assets/images/databit/semfoto.png';
import { adicionarCarrinho } from '../../../../utils/databit/carrinho';

// === Utilitários externos ===

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 2 },
  desktop: { breakpoint: { max: 1024, min: 768 }, items: 2 },
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
    acc[chave].qtde += item.qtprod;
    acc[chave].valor += item.vlrtotal;
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

const LoginProduto = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemselec, setItemselec] = useState([]);
  const [itens, setItens] = useState([]);
  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(getDefaultEndDate());
  const [totais, setTotais] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [marcaselec, setMarcaselec] = useState('ALL');
  const [nome, setNome] = useState('');
  const [foto, setFoto] = React.useState();
  const { addToast } = useToasts();

  const columns = useMemo(
    () => [
      { headerClassName: 'header-list', field: 'produto', headerName: 'Cód.', width: 70 },
      { headerClassName: 'header-list', field: 'nomeproduto', headerName: 'Descrição Produto', width: 500 },
      { headerClassName: 'header-list', field: 'qtprod', headerName: 'Qtde.', width: 80, type: 'number' },
      { headerClassName: 'header-list', field: 'vlrtotal', headerName: 'R$ Total', width: 110, type: 'number', decimal: 2 }
    ],
    []
  );

  const columns2 = useMemo(
    () => [
      { headerClassName: 'header-list', field: 'nome', headerName: 'Descrição', width: 370 },
      { headerClassName: 'header-list', field: 'qtde', headerName: 'Qtde.', width: 70, type: 'number' },
      { headerClassName: 'header-list', field: 'valor', headerName: 'R$ Total', width: 110, type: 'number', decimal: 2 }
    ],
    []
  );

  useEffect(() => {
    setLoading(false);
    let tmpmarcas = [];
    tmpmarcas.push({ value: 'ALL', label: 'Todas as Marcas' });
    apiDropdown('TB01047', 'TB01047_CODIGO', 'TB01047_NOME', '').then((response) => {
      if (response.status === 200) {
        const listmarcas = response.data;
        listmarcas.forEach((element) => {
          tmpmarcas.push(element);
        });
        setMarcas(tmpmarcas);
        Filtrar();
      }
    });
  }, []);

  useEffect(() => {
    if (itemselec) {
      setFoto(itemselec.picture);
    }
  }, [itemselec]);

  useEffect(() => {
    if (!rows.length) return;

    const tmpitens = [
      { title: 'Ranking por Produto', data: agruparESomar(rows, 'nomeproduto') },
      { title: 'Ranking por Marca', data: agruparESomar(rows, 'nomemarca') }
    ];

    const tmptotais = [
      { data: totalizarLista(rows, 'qtprod', 'Quantidade de Itens', 0), icon: <Hash></Hash>, color: '#00cc00' },
      { data: totalizarLista(rows, 'vlrtotal', 'Total de Compras', 2), icon: <DollarSign></DollarSign>, color: '#0099ff' }
    ];

    setItens(tmpitens);
    setTotais(tmptotais);
  }, [rows]);

  const Filtrar = () => {
    setLoading(true);
    const codcli = Decode64(sessionStorage.getItem('client'));
    const tmdata1 = Date.parse(startDate);
    const dt1 = new Date(tmdata1);
    const data1 = dt1.toLocaleDateString('en-US');

    const tmdata2 = Date.parse(endDate);
    const dt2 = new Date(tmdata2);
    const data2 = dt2.toLocaleDateString('en-US');

    apiGetPicturelist(
      "FT02026 ('" + data1 + " 00:00:00', '" + data2 + " 23:59:00', '" + codcli + "', 'ALL','ALL','" + marcaselec + "','" + nome + "')",
      'produto',
      'foto',
      ' 0 = 0 order by vlrtotal desc ',
      'produto,nomeproduto,nomegrupo,nomesubgrupo,nomemarca,qtprod,vlrbruto,vlrdesc,vlrliquido,vlrfrete,vlrimpostos,vlrtotal,web',
      '',
      'S'
    ).then((response) => {
      setRows(response.data);
      setLoading(false);
    });
  };

  const handleMarca = (value) => {
    setMarcaselec(value);
  };

  const addFavorito = async () => {
    const client = Decode64(sessionStorage.getItem('client'));
    setLoading(true);
    const responsefind = await apiFind(
      'ProdutoFavorito',
      '*',
      '',
      "TB01164_PRODUTO = '" + itemselec.produto + "' and TB01164_CODCLI = '" + client + "' "
    );
    if (responsefind.status === 200) {
      if (responsefind.data) {
        setLoading(false);
        addToast('Produto já adiciondo anteriormente !', {
          placement: 'bottom-rigth',
          appearance: 'success',
          autoDismiss: true
        });
      } else {
        const item = {
          produto: itemselec.produto,
          codcli: client
        };
        const responseinsert = await apiInsert('ProdutoFavorito', item);
        if (responseinsert.status === 200) {
          setLoading(false);
          addToast('Produto adicionado com SUCESSO !', {
            placement: 'bottom-rigth',
            appearance: 'success',
            autoDismiss: true
          });
          window.dispatchEvent(new Event('favoritosAtualizado'));
        }
      }
    }
  };

  const addCarrinho = async () => {
    setLoading(true);
    await adicionarCarrinho(itemselec, 1);
    setLoading(false);
    addToast('Produto adicionado com SUCESSO !', {
      placement: 'bottom-rigth',
      appearance: 'success',
      autoDismiss: true
    });
    window.dispatchEvent(new Event('carrinhoAtualizado'));
  };

  return (
    <div>
      <Card style={{ borderRadius: '12px' }}>
        <Card.Header>
          <Card.Title as="h5">Meus Produtos Comprados</Card.Title>
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
              <Col lg={3}>
                <Dropdown
                  label="Filtro por Marca:"
                  style={{ marginTop: '1px', width: '230px' }}
                  options={marcas}
                  onChange={(e) => handleMarca(e)}
                />
              </Col>
              <Col lg={5}>
                <label className="form-label">Filtro por Nome:</label>
                <input type="text" className="form-control" style={{ width: '460px' }} onChange={(e) => setNome(e.target.value)} />
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
          <Col lg={8}>
            <AGGrid
              width="100%"
              height="510px"
              rows={rows}
              columns={columns}
              loading={loading}
              item={itemselec}
              setItem={setItemselec}
              focus
              totalizadores={totais}
              counttotal={3}
            />
          </Col>
          <Col lg={4}>
            <Card style={{ borderRadius: '12px' }}>
              <Card.Header>
                <Card.Title as="h5">Foto do Produto</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  {itemselec && (
                    <div
                      style={{
                        width: '100%',
                        height: '230px',
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '8px',
                        padding: '5px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      {itemselec.picture !== 'MHg=' ? (
                        <ReactImageMagnify
                          {...{
                            smallImage: {
                              alt: itemselec.produto,
                              isFluidWidth: false,
                              width: 250,
                              height: 250,
                              src: `data:image/jpeg;base64,${foto}`
                            },
                            largeImage: {
                              src: `data:image/jpeg;base64,${foto}`,
                              width: 700,
                              height: 700
                            },
                            enlargedImageContainerStyle: {
                              zIndex: 450,
                              background: '#fff',
                              border: '1px solid #ccc'
                            },
                            enlargedImagePosition: 'over'
                          }}
                        />
                      ) : (
                        <ReactImageMagnify
                          {...{
                            smallImage: {
                              alt: itemselec.codigo,
                              isFluidWidth: false,
                              width: 250,
                              height: 250,
                              src: semfoto
                            },
                            largeImage: {
                              src: semfoto,
                              width: 700,
                              height: 700
                            },
                            enlargedImageContainerStyle: {
                              zIndex: 450,
                              background: '#fff',
                              border: '1px solid #ccc'
                            },
                            enlargedImagePosition: 'over'
                          }}
                        />
                      )}
                    </div>
                  )}
                </Row>
                {itemselec && (
                  <Row style={{ marginTop: '60px' }}>
                    <Button className="color-button-primary w-100 mb-2" onClick={() => addCarrinho()} disabled={itemselec.web === 'N'}>
                      <i className="feather icon-shopping-cart" /> Adicionar ao Carrinho
                    </Button>
                    <Button className="color-button-primary w-100 mb-2" onClick={() => addFavorito()} disabled={itemselec.web === 'N'}>
                      <i className="feather icon-heart" /> Adicionar aos Favoritos
                    </Button>
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Col>
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

export default LoginProduto;
