import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useNavigate } from 'react-router-dom';
import carrinho from '../../../../assets/images/databit/carrinho.png';
import { StarRatingView } from '../../../../components/StarRatingView';
import { capitalizeText } from 'datareact/src/utils/capitalize';
import { Check, Trash2, MinusCircle } from 'react-feather';
import { apiExec } from 'datareact/src/api/crudapi';
import { LoadingOverlay } from '../../../../utils/databit/screenprocess';
import { Decode64 } from 'datareact/src/utils/crypto';
import semfoto from '../../../../assets/images/databit/semfoto.png';

const LoginCarrinho = ({ openDropdownFn, closeDropdown, listCarrinho }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRemoveCart = async (item) => {
    if (window.confirm('Deseja excluir este item?')) {
      setLoading(true);
      await apiExec(
        `DELETE FROM TB02311 WHERE TB02311_CODIGO = '${Decode64(sessionStorage.getItem('store'))}' AND TB02311_PRODUTO = '${item.codigo}'`,
        'N'
      );
      window.dispatchEvent(new Event('carrinhoAtualizado'));
      setLoading(false);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Deseja limpar o Carrinho de Compras ?')) {
      setLoading(true);
      await apiExec(`DELETE FROM TB02311 WHERE TB02311_CODIGO = '${Decode64(sessionStorage.getItem('store'))}'`, 'N');
      await apiExec(`DELETE FROM TB02310 WHERE TB02310_CODIGO = '${Decode64(sessionStorage.getItem('store'))}'`, 'N');
      window.dispatchEvent(new Event('carrinhoAtualizado'));
      setLoading(false);
    }
  };

  const renderActionButton = ({ icon, label, onClick }) => (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        color: '#fff',
        padding: '6px 10px',
        borderRadius: '6px',
        transition: 'background 0.2s ease',
        height: '40px',
        background: sessionStorage.getItem('colorMenu')
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = sessionStorage.getItem('colorMenuselec');
        e.currentTarget.style.color = '#fff';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = sessionStorage.getItem('colorMenu');
        e.currentTarget.style.color = '#fff';
      }}
    >
      {icon}
      <span style={{ marginLeft: '10px', fontSize: '14px' }}>{label}</span>
    </a>
  );

  // Altura dinâmica conforme número de itens
  const calcularAltura = () => {
    if (listCarrinho.length >= 3) return '620px';
    if (listCarrinho.length === 2) return '440px';
    if (listCarrinho.length === 1) return '230px';
    return '150px';
  };

  return (
    <React.Fragment>
      <div>
        <Row
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            padding: '7px',
            borderRadius: '8px',
            minWidth: '650px',
            zIndex: 999,
            backgroundColor: '#fff',
            color: '#000',
            marginRight: '5px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
            flexDirection: 'column'
          }}
          onMouseEnter={openDropdownFn}
          onMouseLeave={closeDropdown}
        >
          {/* Cabeçalho */}
          <div
            className="title-client"
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px',
              borderRadius: '12px',
              height: '80px'
            }}
          >
            <img
              src={carrinho}
              alt="avatar"
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginRight: '10px',
                marginLeft: '2px'
              }}
            />
            <span className="label-destaque-16">Carrinho de Compras</span>
          </div>

          {/* Lista com scroll */}
          <div
            style={{
              height: calcularAltura(),
              overflowY: 'auto',
              overflowX: 'hidden',
              boxSizing: 'border-box',
              paddingRight: '5px'
            }}
          >
            <PerfectScrollbar>
              <div style={{ paddingRight: '15px', paddingBottom: '10px' }}>
                {listCarrinho.length === 0 ? (
                  <span className="label-destaque-16" style={{ padding: '10px', display: 'block', textAlign: 'center' }}>
                    Seu Carrinho de Compra está vazio.
                  </span>
                ) : (
                  listCarrinho.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        borderRadius: '12px',
                        color: '#000',
                        fontSize: '1.25rem',
                        alignItems: 'center',
                        marginLeft: '5px',
                        marginBottom: '10px',
                        border: '2px solid #e3e6e6',
                        padding: '10px'
                      }}
                    >
                      <Row style={{ cursor: 'pointer' }} onClick={() => navigate(`/produto/?produto=${item.codigo}`)}>
                        <Col lg={3} style={{ textAlign: 'left' }}>
                          {item.picture !== 'MHg=' ? (
                            <img
                              src={`data:image/jpeg;base64,${item.picture}`}
                              alt={item.codigo}
                              style={{ width: '130px', height: '130px', objectFit: 'contain' }}
                            />
                          ) : (
                            <img src={semfoto} alt={item.codigo} style={{ width: '130px', height: '130px', objectFit: 'contain' }} />
                          )}
                        </Col>

                        <Col lg={7}>
                          <span className="label-destaque-16">{capitalizeText(item.nome.substring(0, 60))}</span>

                          <StarRatingView rating={item.avaliacao ?? 0} size={20} showrating={true} />

                          <span className="label-destaque-14">Quantidade: {item.qtprod}</span>
                        </Col>

                        <Col lg={2} style={{ textAlign: 'right', marginTop: '60px' }}>
                          <span
                            className="label-destaque-18"
                            style={{
                              color: sessionStorage.getItem('colorPrice')
                            }}
                          >
                            {item.vlrfinal.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </span>
                        </Col>
                      </Row>

                      {/* Ações por item */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          gap: '10px',
                          marginTop: '5px'
                        }}
                      >
                        {renderActionButton({
                          icon: <Trash2 size={18} />,
                          label: 'Remover do Carrinho',
                          onClick: () => handleRemoveCart(item)
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </PerfectScrollbar>
          </div>

          {/* Ação global */}
          {listCarrinho.length > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                marginTop: '5px'
              }}
            >
              {renderActionButton({
                icon: <MinusCircle size={18} />,
                label: 'Limpar Carrinho',
                onClick: handleClearCart
              })}
              {renderActionButton({
                icon: <Check size={18} />,
                label: 'Finalizar Carrinho'
              })}
            </div>
          )}
        </Row>
      </div>
      {loading && <LoadingOverlay />}
    </React.Fragment>
  );
};

export default LoginCarrinho;
