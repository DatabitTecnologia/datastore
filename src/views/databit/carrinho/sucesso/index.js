import React, { useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';
import successAnimation from './success.json'; // arquivo Lottie baixado

const Success = () => {
  const [orcamento, setOrcamento] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setOrcamento(params.get('orcamento'));
    window.dispatchEvent(new Event('carrinhoAtualizado'));
  }, [location.search]);

  return (
    <React.Fragment>
      <Container
        fluid
        style={{
          height: '70vh',
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
            <Lottie animationData={successAnimation} loop={true} />
          </div>

          <h2 style={{ color: sessionStorage.getItem('colorMenuSelec'), fontWeight: 'bold', marginTop: '15px' }}>
            Compra efeutada com Sucesso !
          </h2>

          <p style={{ fontSize: '1.1rem', marginTop: '10px' }}>Número do orçamento:</p>
          <h3 style={{ fontWeight: 'bold', color: sessionStorage.getItem('colorMenu') }}>{orcamento}</h3>

          <Button className="color-button-primary shadow-2 mb-4" size="lg" style={{ marginTop: '20px' }} onClick={() => navigate('/index')}>
            <i className={'feather icon-shopping-cart'} />
            Comprar mais produtos
          </Button>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default Success;
