import React from 'react';
import { Container, Button } from 'react-bootstrap';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';
import emptyAnimmation from './empty.json'; // arquivo Lottie baixado

const Empty = () => {
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <Container
        fluid
        style={{
          height: '60vh',
          display: 'flex',

          justifyContent: 'center',
          padding: '10px'
        }}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: '15px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            padding: '30px',
            textAlign: 'center',
            maxWidth: '500px',
            width: '100%'
          }}
        >
          <div style={{ maxWidth: '250px', margin: '0 auto' }}>
            <Lottie animationData={emptyAnimmation} loop={true} />
          </div>

          <h2 style={{ color: sessionStorage.getItem('colorMenuSelec'), fontWeight: 'bold', marginTop: '15px' }}>O Carrinho está vazio!</h2>

          <Button className="color-button-primary shadow-2 mb-4" size="lg" style={{ marginTop: '20px' }} onClick={() => navigate('/index')}>
            <i className={'feather icon-shopping-cart'} />
            Comprar produtos
          </Button>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default Empty;
