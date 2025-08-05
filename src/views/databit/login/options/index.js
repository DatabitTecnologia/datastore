import React, { useState, useEffect } from 'react';
import { Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Decode64 } from 'datareact/src/utils/crypto';
import user from '../../../../assets/images/databit/user.png';

import { User, ShoppingCart, Package, Gift, BarChart2, LogOut, CreditCard } from 'react-feather';

const logoffOption = (navigate) => ({
  icon: <LogOut size={18} />,
  label: 'Log-off',
  onClick: () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      localStorage.removeItem('client');
      window.location.href = '/index';
    }
  }
});

const LoginOptions = ({ openDropdownFn, closeDropdown }) => {
  const navigate = useNavigate();

  const colorMenu = sessionStorage.getItem('colorMenu') || '#007bff';
  const colorMenuSelec = sessionStorage.getItem('colorMenuselec') || '#0056b3';
  const nameClient = Decode64(sessionStorage.getItem('nameclient') || '').substring(0, 30);

  const [beneficiosDisponiveis, setBeneficiosDisponiveis] = useState(0.0);
  const [limiteCredito, setLimiteCredito] = useState(0.0);
  const [limiteDisponivel, setLimiteDisponivel] = useState(0.0);

  useEffect(() => {
    // Simulação: pegue de sessionStorage ou API real
    const beneficios = parseFloat(sessionStorage.getItem('beneficios') || '0');
    const credito = parseFloat(sessionStorage.getItem('limiteCredito') || '0');
    const disponivel = parseFloat(sessionStorage.getItem('limiteDisponivel') || '0');

    setBeneficiosDisponiveis(beneficios);
    setLimiteCredito(credito);
    setLimiteDisponivel(disponivel);
  }, []);

  const formatCurrency = (value) =>
    value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

  const options = [
    { icon: <User size={18} />, label: 'Dados Cadastrais', link: '/logincadastro' },
    { icon: <ShoppingCart size={18} />, label: 'Minhas Últimas Compras', link: '/logincompra' },
    { icon: <Package size={18} />, label: 'Meus Produtos Comprados', link: '/loginproduto' },
    { icon: <Gift size={18} />, label: 'Meus Benefícios', link: '/loginbeneficio' },
    { icon: <BarChart2 size={18} />, label: 'Minha Posição Financeira', link: '/loginfinanceiro' },
    { icon: <CreditCard size={18} />, label: 'Meus Créditos Disponíveis', link: '/logincredito' },
    logoffOption(navigate)
  ];

  const infoLines = [
    { label: 'Benefícios Disponíveis:', value: beneficiosDisponiveis },
    { label: 'Limite de Crédito:', value: limiteCredito },
    { label: 'Limite Disponível:', value: limiteDisponivel }
  ];

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
            minWidth: '350px',
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
          {/* Avatar e nome */}
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
              src={user}
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
            <span className="label-destaque-16">{nameClient}</span>
          </div>

          {/* Informações financeiras 
          <hr />
          {infoLines.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="label-destaque-16">{item.label}</span>
              <span className="label-destaque-16" style={{ color: colorMenu }}>
                {formatCurrency(item.value)}
              </span>
            </div>
          ))}
             <hr />
            */}

          {/* Opções */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
            {options.map((opt, index) => {
              const handleClick = (e) => {
                if (opt.onClick) {
                  e.preventDefault();
                  opt.onClick();
                }
              };

              return (
                <a
                  key={index}
                  href={opt.link || '#'}
                  onClick={handleClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: '#fff',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    transition: 'background 0.2s ease',
                    height: '40px',
                    background: colorMenu
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = colorMenu;
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = colorMenuSelec;
                    e.currentTarget.style.color = '#fff';
                  }}
                >
                  {opt.icon}
                  <span style={{ marginLeft: '10px', fontSize: '14px' }}>{opt.label}</span>
                </a>
              );
            })}
          </div>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default LoginOptions;
