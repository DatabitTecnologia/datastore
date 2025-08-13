import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Gift, Trash2, Check, Box } from 'react-feather';
import { LoadingOverlay } from '../../../utils/databit/screenprocess';
import { Decode64 } from 'datareact/src/utils/crypto';
import { apiGetPicturelist, apiFind, apiList, apiUpdate, apiExec, apiDelete } from 'datareact/src/api/crudapi';
import { StarRatingView } from '../../../components/StarRatingView';
import { capitalizeText } from 'datareact/src/utils/capitalize';
import { SelectorNumber } from '../../../components/SelectorNumber';
import semfoto from '../../../assets/images/databit/semfoto.png';
import { atualizaPreco, adicionarCarrinho } from '../../../utils/databit/carrinho';
import Empty from './vazio';

const FecharCarrinho = (props) => {
  const [loading, setLoading] = useState(false);
  const [carrinho, setCarrinho] = useState([]);
  const [qtdeitens, setQtdeitens] = useState(0);
  const [vlrbruto, setVlrbruto] = useState(0);
  const [vlrdesconto, setVlrdesconto] = useState(0);
  const [vlrfrete, setVlrfrete] = useState(0);
  const [vlrimpostos, setVlrimpostos] = useState(0);
  const [vlrnota, setVlrnota] = useState(0);
  const [pgto, setPgto] = useState([]);
  const [condpag, setCondpag] = useState(undefined);
  const [update, setUpdate] = useState(false);
  const [cabecalho, setCabecalho] = useState(undefined);
  const [processapreco, setProcessapreco] = useState(false);
  const [itematual, setItematual] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    listarCarrinho();
  }, []);

  const atualizaCondicao = async (condpag) => {
    setLoading(true);
    const responsecab = await apiFind('Carrinho', 'TB02310_CODIGO,TB02310_CONDPAG', '', "TB02310_CODIGO = '" + get('store') + "'");
    if (responsecab.status === 200) {
      const venda = responsecab.data;
      venda.condpag = condpag;
      cabecalho.condpag = condpag;
      const responseupdate = await apiUpdate('Carrinho', venda);
      if (responseupdate.status === 200) {
        console.log(responseupdate.data);
        setLoading(false);
        const responseitens = await apiExec("exec SP02302 'TB02311', '" + get('store') + "' ", 'S');
        const itens = responseitens.data;
        setCondpag(condpag);
        setProcessapreco(true);
        await atualizaPreco('TB02310', cabecalho, 'CarrinhoItem', 'codcli', 'TB01008', 'S', 0, 'C', itens, setItematual);
        setProcessapreco(false);
        listarCarrinho();
      }
    }
  };

  const get = (key) => Decode64(sessionStorage.getItem(key));

  const listarCarrinho = async () => {
    setLoading(true);
    const response = await apiGetPicturelist(
      `FT02024('${get('client')}')`,
      'codigo',
      'foto',
      '0=0',
      'codigo,referencia,codbarras,codauxiliar,nome,venda,grupo,subgrupo,marca,nomegrupo,nomesubgrupo,nomemarca,obs,obsint,obsfull,avaliacao,qtprod,totvalor,vlripi,vlrst,vlrfrete,vlroutdesp,vlrfcptotst,vlrfinal',
      '',
      'S'
    );

    if (response.status === 200) {
      setCarrinho(response.data);
      const responsecab = await apiFind('Carrinho', '*', '', "TB02310_CODIGO = '" + get('store') + "'");
      if (responsecab.status === 200) {
        setCabecalho(responsecab.data);
        setQtdeitens(responsecab.data.qtde);
        setVlrbruto(responsecab.data.vlrbruto);
        setVlrdesconto(responsecab.data.vlrdesconto);
        setVlrfrete(responsecab.data.vlrfrete + responsecab.data.vlroutdesp);
        setVlrimpostos(responsecab.data.vlripi + responsecab.data.vlricmssub + responsecab.data.vlrfcptotst);
        setVlrnota(responsecab.data.vlrnota);
        if (condpag === undefined) {
          setCondpag(responsecab.data.condpag);
        }
        const responsepgto = await apiList(
          'Condicaorec',
          'TB01014_CODIGO,TB01014_NOME',
          '',
          "TB01014_WEB = 'S' AND TB01014_SITUACAO = 'A' order by TB01014_NOME"
        );
        if (responsecab.status === 200) {
          setPgto(responsepgto.data);
          window.dispatchEvent(new Event('carrinhoAtualizado'));
          setLoading(false);
        }
      }
    }
  };

  const updateQtde = async (produto, qtde) => {
    setCarrinho((prev) => prev.map((p) => (p.codigo === produto.codigo ? { ...p, qtprod: qtde } : p)));
    setLoading(true);
    await adicionarCarrinho(produto, qtde, true);
    listarCarrinho();
  };

  const deleteProduto = async (produto) => {
    console.log(produto);
    setLoading(true);
    const response = await apiFind(
      'CarrinhoItem',
      '*',
      '',
      "TB02311_CODIGO = '" + get('store') + "' and TB02311_PRODUTO = '" + produto.codigo + "' "
    );
    if (response.status === 200) {
      console.log(response.data);
      const item = response.data;
      const responsedel = await apiDelete('CarrinhoItem', item);
      if (responsedel.status === 200) {
        console.log(response.data);
        listarCarrinho();
      }
    }
  };

  const finalizarCompra = async () => {
    setLoading(true);
    const responseorcamento = await apiExec("EXEC SP02313 '" + get('store') + "','" + get('statusven') + "' ", 'S');
    if (responseorcamento.status === 200) {
      const resultorcamento = responseorcamento.data[0];
      console.log(responseorcamento);
      if (resultorcamento.STATUS === 1) {
        const orcamento = resultorcamento.SITUACAO;
        setLoading(false);
        navigate('/sucesso/?orcamento=' + orcamento);
      }
    }
  };

  return (
    <React.Fragment>
      <div>
        {carrinho.length > 0 ? (
          <Row>
            <Col lg={8}>
              <Card style={{ borderRadius: '12px' }}>
                <Card.Header>
                  <Card.Title as="h5">Meu carrinho de compra</Card.Title>
                </Card.Header>

                {carrinho.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      position: 'relative', // para posicionar o botão da lixeira
                      borderRadius: '12px',
                      color: '#000',
                      fontSize: '1.25rem',
                      alignItems: 'center',
                      marginLeft: '5px',
                      marginRight: '5px',
                      marginTop: '5px',
                      marginBottom: '5px',
                      border: '1px solid #e3e6e6',
                      padding: '10px'
                    }}
                  >
                    {/* Botão de Lixeira */}
                    <button
                      onClick={() => deleteProduto(item)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={18} color={sessionStorage.getItem('colorMenu') || '#ff0000'} />
                    </button>
                    <Row>
                      {/* Foto */}
                      <Col lg={2} style={{ textAlign: 'left', marginRight: '15px' }}>
                        {item.picture !== 'MHg=' ? (
                          <img
                            src={`data:image/jpeg;base64,${item.picture}`}
                            alt={item.codigo}
                            style={{ width: '130px', height: '130px', objectFit: 'contain' }}
                          />
                        ) : (
                          <img src={semfoto} alt={item.codigo} style={{ width: '90px', height: '90px', objectFit: 'contain' }} />
                        )}
                      </Col>

                      {/* Nome + Avaliação + Quantidade */}
                      <Col lg={7}>
                        <span className="label-destaque-16">{capitalizeText(item.nome)}</span>

                        <StarRatingView rating={item.avaliacao ?? 0} size={20} showrating={true} />

                        <div>
                          <label
                            style={{
                              display: 'block'
                            }}
                            className="label-destaque-14"
                          >
                            Quantidade
                          </label>
                          <div>
                            <SelectorNumber fontSize="14px" value={item.qtprod} setValue={(novoValor) => updateQtde(item, novoValor)} />
                          </div>
                        </div>
                      </Col>

                      {/* Valor Total */}
                      <Col
                        lg={2}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end', // alinha à direita
                          marginTop: '90px',
                          marginRight: '2px' // pequena margem à direita
                        }}
                      >
                        <span className="label-destaque-14">Valor Total</span>
                        <span
                          className="label-destaque-18"
                          style={{
                            color: sessionStorage.getItem('colorPrice')
                          }}
                        >
                          R${' '}
                          {item.vlrfinal.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </span>
                      </Col>
                    </Row>
                  </div>
                ))}
              </Card>
            </Col>

            {/* Totalizadores */}

            <Col lg={4}>
              <Card style={{ borderRadius: '12px' }}>
                <Card.Header>
                  <Card.Title as="h5">Totalizadores</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Button className="color-button-primary w-100 mb-2" style={{ fontSize: '16px' }} onClick={(e) => navigate('/index')}>
                    <Box size={23}></Box> Adicionar mais Produtos
                  </Button>
                  <Button className="color-button-primary w-100 mb-2" style={{ fontSize: '16px' }}>
                    <Gift size={23}></Gift> Meus Benefícios
                  </Button>

                  <hr />

                  <Row className="mb-2">
                    <Col className="label-destaque-16" xs={7}>
                      Quantidade de Itens
                    </Col>
                    <Col
                      xs={5}
                      className="label-destaque-16"
                      style={{ textAlign: 'right', color: sessionStorage.getItem('colorMenuselec') }}
                    >
                      {qtdeitens.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                    </Col>
                  </Row>

                  <Row className="mb-2">
                    <Col className="label-destaque-16" xs={7}>
                      Valor Bruto (+)
                    </Col>
                    <Col
                      xs={5}
                      className="label-destaque-16"
                      style={{ textAlign: 'right', color: sessionStorage.getItem('colorMenuselec') }}
                    >
                      R$ {vlrbruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Col>
                  </Row>

                  <Row className="mb-2">
                    <Col className="label-destaque-16" xs={7}>
                      Total Desconto (-)
                    </Col>
                    <Col
                      xs={5}
                      className="label-destaque-16"
                      style={{ textAlign: 'right', color: sessionStorage.getItem('colorMenuselec') }}
                    >
                      R$ {vlrdesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Col>
                  </Row>

                  <Row className="mb-2">
                    <Col className="label-destaque-16" xs={7}>
                      Total Frete
                    </Col>
                    <Col
                      xs={5}
                      className="label-destaque-16"
                      style={{ textAlign: 'right', color: sessionStorage.getItem('colorMenuselec') }}
                    >
                      R$ {vlrfrete.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col className="label-destaque-16" xs={7}>
                      Total Impostos
                    </Col>
                    <Col
                      xs={5}
                      className="label-destaque-16"
                      style={{ textAlign: 'right', color: sessionStorage.getItem('colorMenuselec') }}
                    >
                      R$ {vlrimpostos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Col>
                  </Row>

                  <hr />

                  <Row style={{ marginBottom: '15px' }}>
                    <Col xs={7} className="label-destaque-18">
                      Valor da Compra
                    </Col>
                    <Col
                      xs={5}
                      className="label-destaque-18"
                      style={{ textAlign: 'right', color: sessionStorage.getItem('colorMenuselec') }}
                    >
                      R$ {vlrnota.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card style={{ borderRadius: '12px' }}>
                <Card.Header>
                  <Card.Title as="h5">Condições de Pagamento</Card.Title>
                </Card.Header>

                <Row style={{ padding: '10px' }}>
                  <Col>
                    <ListGroup>
                      {pgto.map((item) => (
                        <ListGroup.Item
                          key={item.id}
                          className={condpag === item.codigo ? 'custom-active' : ''}
                          active={condpag === item.codigo}
                          action
                          onClick={() => atualizaCondicao(item.codigo)}
                          style={{ cursor: 'pointer' }}
                        >
                          {item.nome}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Col>
                </Row>
                <hr />
                <Row style={{ padding: '10px' }}>
                  <Col>
                    <Button className="color-button-primary w-100 mb-2" style={{ fontSize: '20px' }} onClick={(e) => finalizarCompra()}>
                      <Check size={23}></Check> Finalizar Compra
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        ) : (
          <Empty></Empty>
        )}
      </div>
      {itematual && (
        <div
          className={`modal fade ${processapreco ? 'show d-block' : ''}`}
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content text-center p-4">
              <div className="modal-body">
                <div className="spinner-border custom" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
                <h5 className="modal-title mb-2">Processando item...</h5>
                <p>
                  <strong>
                    {itematual.produto} - {itematual.nomeprod} Aguarde...
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && <LoadingOverlay />}
    </React.Fragment>
  );
};

export default FecharCarrinho;
