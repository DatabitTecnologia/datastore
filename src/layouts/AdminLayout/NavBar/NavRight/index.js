import React, { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { DATABIT } from '../../../../config/constant';
import LoginOptions from '../../../../views/databit/login/options';
import LoginFavorito from '../../../../views/databit/login/favorito';
import LoginCarrinho from '../../../../views/databit/login/carrinho';
import { apiGetPicturelist } from 'datareact/src/api/crudapi';
import { Decode64 } from 'datareact/src/utils/crypto';

const NavRight = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [favcount, setFavcount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const colorBadge = sessionStorage.getItem('colorMenuselec') || 'blue';

  const openDropdownFn = (type) => setActiveDropdown(type);
  const closeDropdown = () => setActiveDropdown(null);

  const get = (key) => Decode64(sessionStorage.getItem(key));

  const listarFavoritos = async () => {
    const response = await apiGetPicturelist(
      `FT02023('${get('enterprise')}','${get('operation')}','${get('payment')}','${get('client')}','${get('consumption')}','${get(
        'tableprice'
      )}')`,
      'codigo',
      'foto',
      '0=0',
      'codigo,referencia,codbarras,codauxiliar,nome,venda,grupo,subgrupo,marca,nomegrupo,nomesubgrupo,nomemarca,obs,obsint,obsfull,avaliacao',
      '',
      'S'
    );

    if (response.status === 200) {
      setFavoritos(response.data);
      setFavcount(response.data.length);
    }
  };

  const listarCarrinho = async () => {
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
      setCartCount(response.data.length);
    }
  };

  useEffect(() => {
    if (!DATABIT.islogged) return;

    listarFavoritos();

    const handleFavorito = () => listarFavoritos();
    window.addEventListener('favoritosAtualizado', handleFavorito);

    return () => window.removeEventListener('favoritosAtualizado', handleFavorito);
  }, []);

  useEffect(() => {
    if (!DATABIT.islogged) return;

    listarCarrinho();

    const handleCarrinho = () => listarCarrinho();
    window.addEventListener('carrinhoAtualizado', handleCarrinho);

    return () => window.removeEventListener('carrinhoAtualizado', handleCarrinho);
  }, []);

  const renderBadge = (count) =>
    count > 0 && (
      <span
        style={{
          position: 'absolute',
          top: '-5px',
          right: '10px',
          background: colorBadge,
          color: 'white',
          borderRadius: '50%',
          padding: '2px 6px',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          lineHeight: 1,
          minWidth: '20px',
          textAlign: 'center'
        }}
      >
        {count}
      </span>
    );

  const NavItem = ({ title, icon, count, dropdown, onClick, onMouseEnter }) => (
    <ListGroup.Item
      action
      title={title}
      onMouseEnter={onMouseEnter}
      onMouseLeave={closeDropdown}
      onClick={onClick}
      style={{
        cursor: 'pointer',
        background: 'transparent',
        border: 'none',
        padding: '0 1rem',
        position: 'relative'
      }}
      className="d-flex align-items-center"
    >
      <i className={`feather ${icon}`} style={{ fontSize: '1.7rem', color: '#fff', marginRight: title === 'Login' ? '8px' : '0' }} />
      {title === 'Login' && !DATABIT.islogged && <span style={{ fontSize: '1rem', color: '#fff' }}>{user?.nome || 'Fazer Login'}</span>}
      {renderBadge(count)}
      {dropdown}
    </ListGroup.Item>
  );

  return (
    <div style={{ position: 'relative', display: 'inline-block', padding: '5px' }}>
      <ListGroup horizontal className="align-items-center" style={{ color: '#fff' }}>
        {/* FAVORITOS */}
        {DATABIT.islogged && (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <NavItem
              title="Favoritos"
              icon="icon-heart"
              count={favcount}
              onMouseEnter={() => openDropdownFn('favorito')}
              dropdown={
                activeDropdown === 'favorito' && (
                  <LoginFavorito
                    listFavoritos={favoritos}
                    openDropdownFn={() => openDropdownFn('favorito')}
                    closeDropdown={closeDropdown}
                  />
                )
              }
            />
          </div>
        )}

        {/* CARRINHO */}
        {DATABIT.islogged && (
          <NavItem
            title="Carrinho"
            icon="icon-shopping-cart"
            count={cartCount}
            onMouseEnter={() => openDropdownFn('carrinho')}
            dropdown={
              activeDropdown === 'carrinho' && (
                <LoginCarrinho listCarrinho={carrinho} openDropdownFn={() => openDropdownFn('carrinho')} closeDropdown={closeDropdown} />
              )
            }
          />
        )}

        {/* LOGIN */}
        <NavItem
          title="Login"
          icon="icon-user"
          onMouseEnter={() => openDropdownFn('login')}
          onClick={() => (!DATABIT.islogged ? navigate('/login') : setActiveDropdown('login'))}
          dropdown={
            activeDropdown === 'login' &&
            DATABIT.islogged && <LoginOptions openDropdownFn={() => openDropdownFn('login')} closeDropdown={closeDropdown} />
          }
        />
      </ListGroup>
    </div>
  );
};

export default NavRight;
