import React, { useContext, useState } from 'react';
import { ConfigContext } from '../../../../contexts/ConfigContext';
import useAuth from '../../../../hooks/useAuth';
import { ListGroup, Row, Col, Button } from 'react-bootstrap';

const NavRight = () => {
  const configContext = useContext(ConfigContext);
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(4); // Exemplo: 3 itens no carrinho
  const [openDropdown, setOpenDropdown] = useState(false);

  const toggleDropdown = () => setOpenDropdown(!openDropdown);
  const closeDropdown = () => setOpenDropdown(false);
  const openDropdownFn = () => setOpenDropdown(true);

  return (
    <div onMouseEnter={openDropdownFn} onMouseLeave={closeDropdown} style={{ position: 'relative', display: 'inline-block' }}>
      <ListGroup horizontal className="align-items-center" style={{ color: '#fff' }}>
        <ListGroup.Item
          action
          title="Favoritos"
          style={{ cursor: 'pointer', background: 'transparent', border: 'none', padding: '0 1rem' }}
        >
          <i className="feather icon-heart" style={{ fontSize: '1.7rem', color: '#fff' }} />
        </ListGroup.Item>

        <ListGroup.Item
          action
          title="Carrinho"
          style={{ cursor: 'pointer', background: 'transparent', border: 'none', padding: '0 1rem', position: 'relative' }}
          onClick={toggleDropdown}
        >
          <i className="feather icon-shopping-cart" style={{ fontSize: '1.7rem', color: '#fff' }} />
          {cartCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-5px',
                right: '10px',
                background: sessionStorage.getItem('colorMenuselec') || 'red',
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
              {cartCount}
            </span>
          )}
        </ListGroup.Item>

        <ListGroup.Item
          action
          title="Login"
          style={{ cursor: 'pointer', background: 'transparent', border: 'none', padding: '0 1rem' }}
          className="d-flex align-items-center"
        >
          <i className="feather icon-user" style={{ fontSize: '1.7rem', marginRight: '8px', color: '#fff' }} />
          <span style={{ fontSize: '1rem', color: '#fff' }}>{user ? user.nome : 'Fazer Login'}</span>
        </ListGroup.Item>
      </ListGroup>
      {openDropdown && (
        <Row
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            padding: '5px',
            borderRadius: '4px',
            marginTop: '5px',
            minWidth: '400px',
            zIndex: 999,
            backgroundColor: '#ffff',
            color: '#000',
            marginRight: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
          }}
          onMouseEnter={openDropdownFn}
          onMouseLeave={closeDropdown}
        >
          {/* Conteúdo do dropdown */}
          <div style={{ backgroundColor: sessionStorage.getItem('colorMenuselec'), color: '#fff' }}>
            <span>Carrinho de Compras</span>
          </div>
          <hr></hr>
          <Row style={{ textAlign: 'center' }}>
            <Col>
              <Button
                className="color-button-primary"
                style={{ padding: '6px 12px', cursor: 'pointer', marginTop: '10px', color: '#ffff' }}
              >
                Ir para Login
              </Button>
            </Col>
          </Row>
        </Row>
      )}
    </div>
  );
};

export default NavRight;
