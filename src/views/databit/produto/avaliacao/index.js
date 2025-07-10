import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Card, Modal, ModalBody } from 'react-bootstrap';
import { FaThumbsUp, FaThumbsDown, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { apiList, apiUpdate } from 'datareact/src/api/crudapi';
import { StarRatingView } from '../../../../components/StarRatingView';
import { LoadingOverlay } from '../../../../utils/databit/screenprocess';
import user from '../../../../assets/images/databit/user.png';
import ProdutoAvaliacaoModal from './modal';

const ProdutoAvaliacao = (props) => {
  const { produto } = props;
  const [rows, setRows] = useState([]);
  const [resumo, setResumo] = useState([]);
  const [recomendacoes, setRecomendacoes] = useState([]);
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [showavalia, setShowavalia] = React.useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!showavalia) {
      Filtrar();
    }
  }, [produto, showavalia]);

  const Filtrar = async () => {
    setLoading(true);
    const response = await apiList('ProdutoAvaliacao', '*', '', `TB01163_PRODUTO = '${produto}' ORDER BY TB01163_DATA DESC`);

    if (response.status === 200) {
      setRows(response.data);

      const totaisPorNota = {};
      const totalAvaliacoes = response.data.length;

      response.data.forEach((avaliacao) => {
        const nota = avaliacao.nota;
        totaisPorNota[nota] = (totaisPorNota[nota] || 0) + 1;
      });

      const resultado = Object.entries(totaisPorNota).map(([nota, qtd]) => {
        const percentual = ((qtd / totalAvaliacoes) * 100).toFixed(2);
        return {
          nota: parseInt(nota),
          quantidade: qtd,
          percentual: `${percentual}%`
        };
      });

      const resultadoOrdenado = resultado.sort((a, b) => b.nota - a.nota);
      setResumo(resultadoOrdenado);

      const totalS = response.data.filter((a) => a.recomenda === 'S').length;
      const totalN = response.data.filter((a) => a.recomenda === 'N').length;
      const total = totalS + totalN;

      const resumoRec = [
        {
          tipo: 'S',
          quantidade: totalS,
          percentual: total ? ((totalS / total) * 100).toFixed(2) + '%' : '0%'
        },
        {
          tipo: 'N',
          quantidade: totalN,
          percentual: total ? ((totalN / total) * 100).toFixed(2) + '%' : '0%'
        }
      ];

      setRecomendacoes(resumoRec);
    }

    setLoading(false);
  };

  const avaliacoesExibidas = mostrarTodos ? rows : rows.slice(0, 10);

  const Curtir = async (index) => {
    rows[index].gostei += 1;
    setRows([...rows]);
    const selec = {
      iditem: rows[index].iditem,
      gostei: rows[index].gostei
    };
    await apiUpdate('ProdutoAvaliacao', selec);
  };

  const naoCurtir = async (index) => {
    rows[index].naogostei += 1;
    setRows([...rows]);
    const selec = {
      iditem: rows[index].iditem,
      naogostei: rows[index].naogostei
    };
    await apiUpdate('ProdutoAvaliacao', selec);
  };

  const handleCloseShowavalia = () => {
    setShowavalia(false);
  };

  return (
    <React.Fragment>
      <div>
        <Row style={{ marginTop: '20px' }}>
          <Col md={8}>
            <Card style={{ borderRadius: '12px' }}>
              <Card.Header>
                <Card.Title as="h5">Avaliações Recentes</Card.Title>
              </Card.Header>
              <Card.Body>
                {avaliacoesExibidas.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      borderBottom: '1px solid #eee',
                      paddingBottom: '12px',
                      marginBottom: '15px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '15px'
                    }}
                  >
                    <img
                      src={user}
                      alt="avatar"
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginTop: '4px',
                        marginRight: '4px'
                      }}
                    />

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', color: '#888' }}>{item.data}</div>
                      <div style={{ fontWeight: 'bold' }}>{item.nome}</div>
                      <div style={{ fontSize: '0.85rem', marginBottom: '10px', color: '#555' }}>{item.email}</div>

                      <StarRatingView rating={item.nota ?? 0} size={20} />

                      <div style={{ marginTop: '6px', marginBottom: '6px' }}>{item.obs}</div>

                      <div style={{ marginTop: '10px', display: 'flex', gap: '15px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#198754' }}>
                          <FaThumbsUp style={{ cursor: 'pointer' }} onClick={() => Curtir(index)} /> {item.gostei}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#dc3545' }}>
                          <FaThumbsDown style={{ cursor: 'pointer' }} onClick={() => naoCurtir(index)} /> {item.naogostei}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <div style={{ textAlign: 'center' }}>
                  <Button className="color-button-primary mb-2" onClick={() => setMostrarTodos(!mostrarTodos)}>
                    {!mostrarTodos ? <i className={'feather icon-eye'} /> : <i className={'feather icon-eye-off'} />}
                    {!mostrarTodos ? 'Mostrar mais avaliações' : 'Ocultar avaliações'}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Button className="color-button-primary w-100 mb-3" onClick={() => setShowavalia(true)}>
              <i className="feather icon-star" /> Avalie este Produto
            </Button>
            <Card className="Recent-Users" id="frmavaliacao" name="frmavaliacao" style={{ borderRadius: '12px' }}>
              <Card.Header>
                <Card.Title as="h5">Resumo das Avaliações</Card.Title>
              </Card.Header>
              <Card.Body>
                {resumo.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 0',
                      borderBottom: '1px solid #eee'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <StarRatingView rating={item.nota ?? 0} size={20} />
                      <span style={{ marginLeft: '10px' }}>
                        {item.nota} {item.nota > 1 ? 'estrelas' : 'estrela'}
                      </span>
                    </div>
                    <div>
                      <span>
                        {item.quantidade} ({item.percentual})
                      </span>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>

            <Card style={{ marginTop: '20px', borderRadius: '12px' }}>
              <Card.Header>
                <Card.Title as="h5">Recomendações</Card.Title>
              </Card.Header>
              <Card.Body>
                {recomendacoes.map((rec, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {rec.tipo === 'S' ? <FaCheckCircle size={20} color="#28a745" /> : <FaTimesCircle size={20} color="#dc3545" />}
                      <span>{rec.tipo === 'S' ? 'Recomendaria' : 'Não recomendaria'}</span>
                    </div>
                    <div>
                      <span>
                        {rec.quantidade} ({rec.percentual})
                      </span>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Modal size="lg" show={showavalia} centered={true} onHide={handleCloseShowavalia}>
          <ModalBody>
            <ProdutoAvaliacaoModal
              produto={produto}
              showavalia={showavalia}
              setShowavalia={(data) => setShowavalia(data)}
            ></ProdutoAvaliacaoModal>
          </ModalBody>
        </Modal>
      </div>
      {loading && <LoadingOverlay />}
    </React.Fragment>
  );
};

export default ProdutoAvaliacao;
