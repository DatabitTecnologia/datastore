import React, { useState, useEffect } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { DollarSign, CheckCircle, XCircle, Calendar, Gift, ShoppingCart } from 'react-feather';
import { apiExec } from 'datareact/src/api/crudapi';
import { LoadingOverlay } from '../../../../utils/databit/screenprocess';
import { Decode64 } from 'datareact/src/utils/crypto';

const PainelFinanceiro = (props) => {
  const { codcli } = props;
  const [beneficios, setBeneficios] = React.useState(0);
  const [limitecredito, setLimitecredito] = React.useState(0);
  const [creditodisponivel, setCreditodisponival] = React.useState(0);
  const [totalcompras, setTotalcompras] = React.useState(0);
  const [mediacompras, setMediacompras] = React.useState(0);
  const [comprasmes, setComprasmes] = React.useState(0);
  const [valorpago, setValorpago] = React.useState(0);
  const [valorvencido, setValorvencido] = React.useState(0);
  const [valorvencer, setValorvencer] = React.useState(0);
  const [pagosdia, setPagosdia] = React.useState(0);
  const [pagosatraso, setPagosatraso] = React.useState(0);
  const [diasatraso, setDiasatraso] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (loading) {
      apiExec("select * from ft02025('" + codcli + "'," + Decode64(sessionStorage.getItem('monthstore')) + ')', 'S').then((response) => {
        setBeneficios(response.data[0].beneficios);
        setLimitecredito(response.data[0].limitecredito);
        setCreditodisponival(response.data[0].creditodisponivel);
        setTotalcompras(response.data[0].totalcompras);
        setMediacompras(response.data[0].mediacompras);
        setComprasmes(response.data[0].comprasmes);
        setValorpago(response.data[0].valorpago);
        setValorvencido(response.data[0].valorvencido);
        setValorvencer(response.data[0].valorvencer);
        setPagosdia(response.data[0].pagosdia);
        setPagosatraso(response.data[0].pagosatraso);
        setDiasatraso(response.data[0].diasatraso);
        setLoading(false);
      });
    }
  });

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
    { title: 'Limite de Crédito', icon: <Gift />, value: moeda(limitecredito), color: '#cccc00' },
    { title: 'Crédito Disponível', icon: <Gift />, value: moeda(creditodisponivel), color: '#00cc00' },
    { title: 'Total de Compras', icon: <ShoppingCart />, value: moeda(totalcompras), color: '#0099ff' },
    { title: 'Média de Compras', icon: <ShoppingCart />, value: moeda(mediacompras), color: '#cccc00' },
    { title: 'Compras no Mês', icon: <ShoppingCart />, value: moeda(comprasmes), color: '#00cc00' },
    { title: 'Valor Pago', icon: <DollarSign />, value: moeda(valorpago), color: '#0099ff' },
    { title: 'Valor Vencido', icon: <DollarSign />, value: moeda(valorvencido), color: '#ff3300' },
    { title: 'Valor à Vencer', icon: <DollarSign />, value: moeda(valorvencer), color: '#00cc00' },
    { title: 'Docs. pagos em dia', icon: <CheckCircle />, value: pagosdia, color: '#0099ff' },
    { title: 'Docs. pagos em atraso', icon: <XCircle />, value: pagosatraso, color: '#ff3300' },
    { title: 'Máx. dias em atraso', icon: <Calendar />, value: `${diasatraso} dias`, color: '#ff3300' }
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
      {loading && <LoadingOverlay />}
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
