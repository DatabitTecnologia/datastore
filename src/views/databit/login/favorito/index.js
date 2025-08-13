import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useNavigate } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import favorito from '../../../../assets/images/databit/favorito.png';
import { StarRatingView } from '../../../../components/StarRatingView';
import { capitalizeText } from 'datareact/src/utils/capitalize';
import { ShoppingCart, Trash2, MinusCircle, Check, X } from 'react-feather';
import { apiExec } from 'datareact/src/api/crudapi';
import { LoadingOverlay } from '../../../../utils/databit/screenprocess';
import { Decode64 } from 'datareact/src/utils/crypto';
import semfoto from '../../../../assets/images/databit/semfoto.png';
import { SelectorNumber } from '../../../../components/SelectorNumber';
import { adicionarCarrinho } from '../../../../utils/databit/carrinho';

const LoginFavorito = ({ openDropdownFn, closeDropdown, listFavoritos }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [qtde, setQtde] = useState(1);
  const [confirm, setConfirm] = useState(false);
  const { addToast } = useToasts();

  const handleAddToCart = async (item) => {
    setLoading(true);
    await adicionarCarrinho(item, qtde);
    window.dispatchEvent(new Event('carrinhoAtualizado'));
    addToast('Item adicionado com SUCESSO !', {
      placement: 'bottom-rigth',
      appearance: 'success',
      autoDismiss: true
    });
    setLoading(false);
    setConfirm(false);
  };

  const handleRemoveFavorite = async (item) => {
    if (window.confirm('Deseja excluir este item?')) {
      setLoading(true);
      await apiExec(
        `DELETE FROM TB01164 WHERE TB01164_CODCLI = '${Decode64(sessionStorage.getItem('client'))}' AND TB01164_PRODUTO = '${item.codigo}'`,
        'N'
      );
      window.dispatchEvent(new Event('favoritosAtualizado'));
      setLoading(false);
    }
  };

  const handleClearFavorites = async () => {
    if (window.confirm('Deseja limpar a lista de Favoritos ?')) {
      setLoading(true);
      await apiExec(`DELETE FROM TB01164 WHERE TB01164_CODCLI = '${Decode64(sessionStorage.getItem('client'))}'`, 'N');
      window.dispatchEvent(new Event('favoritosAtualizado'));
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
    if (listFavoritos.length >= 3) return '620px';
    if (listFavoritos.length === 2) return '440px';
    if (listFavoritos.length === 1) return '230px';
    return '70px';
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
            marginRight: '10px',
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
              src={favorito}
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
            <span className="label-destaque-16">Produtos Favoritos</span>
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
                {listFavoritos.length === 0 ? (
                  <span className="label-destaque-16" style={{ padding: '10px', display: 'block', textAlign: 'center' }}>
                    Sua lista de favoritos está vazia.
                  </span>
                ) : (
                  listFavoritos.map((item) => (
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
                          <span className="label-destaque-16">{capitalizeText(item.nome)}</span>
                          <StarRatingView rating={item.avaliacao ?? 0} size={20} showrating={true} />
                        </Col>

                        <Col lg={2} style={{ textAlign: 'right', marginTop: '60px' }}>
                          <span
                            className="label-destaque-18"
                            style={{
                              color: sessionStorage.getItem('colorPrice')
                            }}
                          >
                            {item.venda.toLocaleString('pt-BR', {
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
                        {confirm ? (
                          <>
                            <div>
                              <SelectorNumber fontSize="15px" value={qtde} setValue={setQtde} />
                            </div>

                            {renderActionButton({
                              icon: <Check size={18} />,
                              label: 'Confirmar',
                              onClick: () => handleAddToCart(item)
                            })}

                            {renderActionButton({
                              icon: <X size={18} />,
                              label: 'Cancelar',
                              onClick: () => setConfirm(false)
                            })}
                          </>
                        ) : (
                          <>
                            {renderActionButton({
                              icon: <ShoppingCart size={18} />,
                              label: 'Adicionar ao Carrinho',
                              onClick: () => setConfirm(true)
                            })}

                            {renderActionButton({
                              icon: <Trash2 size={18} />,
                              label: 'Remover dos Favoritos',
                              onClick: () => handleRemoveFavorite(item)
                            })}
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </PerfectScrollbar>
          </div>

          {/* Ação global */}
          {listFavoritos.length > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'right',
                gap: '10px',
                marginTop: '5px'
              }}
            >
              {renderActionButton({
                icon: <MinusCircle size={18} />,
                label: 'Limpar Favoritos',
                onClick: handleClearFavorites
              })}
            </div>
          )}
        </Row>
      </div>
      {loading && <LoadingOverlay />}
    </React.Fragment>
  );
};

export default LoginFavorito;
