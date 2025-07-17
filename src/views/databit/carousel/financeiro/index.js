import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { DollarSign, CheckCircle, XCircle, Calendar, Gift, ShoppingCart } from 'react-feather';

const PainelFinanceiro = ({
  beneficios = 150,
  limiteCredito = 450,
  creditoDisponivel = 250,
  totalCompras = 12250.77,
  mediaCompras = 1180,
  comprasMes = 400,
  valorPago = 400,
  valorVencido = 400,
  valorAVencer = 400,
  docsPagosEmDia = 12,
  docsAtrasados = 2,
  maxDiasAtraso = 37
}) => {
  const moeda = (v) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(v);

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 4 },
    desktop: { breakpoint: { max: 1024, min: 768 }, items: 4 },
    tablet: { breakpoint: { max: 768, min: 464 }, items: 3 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 2 }
  };

  const itens = [
    { title: 'Benefícios Disponíveis', icon: <Gift />, value: moeda(beneficios), color: '#0099ff' },
    { title: 'Limite de Crédito', icon: <Gift />, value: moeda(limiteCredito), color: '#cccc00' },
    { title: 'Crédito Disponível', icon: <Gift />, value: moeda(creditoDisponivel), color: '#00cc00' },
    { title: 'Total de Compras', icon: <ShoppingCart />, value: moeda(totalCompras), color: '#0099ff' },
    { title: 'Média de Compras', icon: <ShoppingCart />, value: moeda(mediaCompras), color: '#cccc00' },
    { title: 'Compras no Mês', icon: <ShoppingCart />, value: moeda(comprasMes), color: '#00cc00' },
    { title: 'Valor Pago', icon: <DollarSign />, value: moeda(valorPago), color: '#0099ff' },
    { title: 'Valor Vencido', icon: <DollarSign />, value: moeda(valorVencido), color: '#ff3300' },
    { title: 'Valor à Vencer', icon: <DollarSign />, value: moeda(valorAVencer), color: '#00cc00' },
    { title: 'Docs. pagos em dia', icon: <CheckCircle />, value: docsPagosEmDia, color: '#0099ff' },
    { title: 'Docs. pagos em atraso', icon: <XCircle />, value: docsAtrasados, color: '#ff3300' },
    { title: 'Máx. dias em atraso', icon: <Calendar />, value: `${maxDiasAtraso} dias`, color: '#ff3300' }
  ];

  return (
    <div
      style={{
        margin: '12px auto',
        maxWidth: '1260px',
        padding: '0 20px',
        backgroundColor: '#f5f5f5'
      }}
    >
      <Carousel responsive={responsive} infinite autoPlay autoPlaySpeed={3000} keyBoardControl arrows={false} showDots={false}>
        {itens.map((item, index) => (
          <Item key={index} {...item} />
        ))}
      </Carousel>
    </div>
  );
};

const Item = ({ title, icon, value = 0, color = '#333' }) => (
  <div
    className="rounded-2xl shadow-md p-2 m-2 bg-white border"
    style={{
      height: '90px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      fontFamily: `'Segoe UI', sans-serif`,
      borderRadius: '12px'
    }}
  >
    <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
      <span style={{ color, marginLeft: '10px' }}>{React.cloneElement(icon, { size: 30 })}</span>
      <span style={{ marginLeft: '15px' }} className="label-destaque-16">
        {title}
      </span>
    </div>

    <div
      className="label-destaque-22"
      style={{
        color: '#333',
        textAlign: 'right',
        marginRight: '10px',
        fontSize: '1.3rem',
        fontWeight: 'bold'
      }}
    >
      {value}
    </div>
  </div>
);

export default PainelFinanceiro;
