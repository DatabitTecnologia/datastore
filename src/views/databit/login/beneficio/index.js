import React, { useState, useEffect, useMemo } from 'react';
import { Card, Row } from 'react-bootstrap';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import { apiList } from 'datareact/src/api/crudapi';
import { Decode64 } from 'datareact/src/utils/crypto';

import AGGrid from '../../../../components/AGGrid';
import Pie from '../../../../components/Pie';
import { LoadingOverlay } from '../../../../utils/databit/screenprocess';

// === Utilitários externos ===

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 3 },
  desktop: { breakpoint: { max: 1024, min: 768 }, items: 3 },
  tablet: { breakpoint: { max: 768, min: 464 }, items: 2 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
};

const CustomLeftArrow = ({ onClick }) => (
  <button className="custom-arrow left-arrow" onClick={onClick}>
    ⬅
  </button>
);

const CustomRightArrow = ({ onClick }) => (
  <button className="custom-arrow right-arrow" onClick={onClick}>
    ➡
  </button>
);

function agruparESomar(dados, campo) {
  const agrupado = dados.reduce((acc, item) => {
    const chave = item[campo];
    if (!acc[chave]) acc[chave] = { qtde: 0, valor: 0 };
    acc[chave].qtde += 1;
    if (campo !== 'situacao') {
      acc[chave].valor += item.vlrrestante;
    } else {
      switch (item.possituacao) {
        case 1: {
          acc[chave].valor += item.vlrrestante;
          break;
        }
        case 2: {
          acc[chave].valor += item.vlrutilizado;
          break;
        }
        case 3: {
          acc[chave].valor += item.vlrexpirado;
          break;
        }
        case 4: {
          acc[chave].valor += item.vlraguardando;
          break;
        }
      }
    }

    return acc;
  }, {});
  return Object.entries(agrupado)
    .sort((a, b) => b[1].valor - a[1].valor)
    .map(([nome, valores], index) => ({
      id: index + 1,
      nome,
      qtde: valores.qtde,
      valor: valores.valor
    }));
}

// === Componentes auxiliares ===

const Item = ({ title, data, loading, columns2 }) => (
  <div style={{ padding: '5px' }}>
    <Card style={{ borderRadius: '12px' }}>
      <Card.Header>
        <Card.Title as="h5">{title}</Card.Title>
      </Card.Header>
      <Row style={{ padding: '10px' }}>
        <Pie height={'300px'} width={'100%'} data={data} showLabels={false} />
      </Row>
      <Row style={{ padding: '10px' }}>
        <AGGrid width="100%" height="293px" rows={data} columns={columns2} loading={loading} tools={false} />
      </Row>
    </Card>
  </div>
);

// === Componente principal ===

const LoginBeneficio = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemselec, setItemselec] = useState([]);
  const [itens, setItens] = useState([]);

  const columns = useMemo(
    () => [
      { headerClassName: 'header-list', field: 'codigo', headerName: 'Código', width: 90 },
      { headerClassName: 'header-list', field: 'data', headerName: 'Data', width: 108, type: 'date' },
      { headerClassName: 'header-list', field: 'situacao', headerName: 'Situação', width: 125 },
      { headerClassName: 'header-list', field: 'tipo', headerName: 'Tipo', width: 125 },
      { headerClassName: 'header-list', field: 'mes', headerName: 'Mês', width: 90 },
      { headerClassName: 'header-list', field: 'validade', headerName: 'Validade', width: 108, type: 'date' },
      { headerClassName: 'header-list', field: 'vlrdisponibilizado', headerName: 'R$ Disponível', width: 103, type: 'number', decimal: 2 },
      { headerClassName: 'header-list', field: 'vlrexpirado', headerName: 'R$ Expirado', width: 103, type: 'number', decimal: 2 },
      { headerClassName: 'header-list', field: 'vlraguardando', headerName: 'R$ Aguardando', width: 103, type: 'number', decimal: 2 },
      { headerClassName: 'header-list', field: 'vlrutilizado', headerName: 'R$ Utilizado', width: 103, type: 'number', decimal: 2 },
      { headerClassName: 'header-list', field: 'vlrrestante', headerName: 'R$ Restante', width: 103, type: 'number', decimal: 2 }
    ],
    []
  );

  const columns2 = useMemo(
    () => [
      { headerClassName: 'header-list', field: 'nome', headerName: 'Descrição', width: 170 },
      { headerClassName: 'header-list', field: 'qtde', headerName: 'Qtde.', width: 70, type: 'number' },
      { headerClassName: 'header-list', field: 'valor', headerName: 'R$ Total', width: 110, type: 'number', decimal: 2 }
    ],
    []
  );

  useEffect(() => {
    setLoading(true);
    const codcli = Decode64(sessionStorage.getItem('client'));
    apiList('RevendedorBeneficioVW', '*', '', `codcli = '${codcli}'`).then((response) => {
      if (response.status === 200) {
        setRows(response.data);
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!rows.length) return;

    const tmpitens = [
      { title: 'Ranking por Situação', data: agruparESomar(rows, 'situacao') },
      { title: 'Ranking por Tipo', data: agruparESomar(rows, 'tipo') },
      { title: 'Ranking por Mes', data: agruparESomar(rows, 'mes') }
    ];

    setItens(tmpitens);
  }, [rows]);

  return (
    <div>
      <Card style={{ borderRadius: '12px' }}>
        <Card.Header>
          <Card.Title as="h5">Meus Benefícios</Card.Title>
        </Card.Header>
        <Row style={{ padding: '10px' }}>
          <AGGrid
            width="100%"
            height="540px"
            rows={rows}
            columns={columns}
            loading={loading}
            item={itemselec}
            setItem={setItemselec}
            focus
          />
        </Row>
      </Card>

      <Carousel
        responsive={responsive}
        infinite
        autoPlay={false}
        customLeftArrow={<CustomLeftArrow />}
        customRightArrow={<CustomRightArrow />}
        autoPlaySpeed={3000}
        keyBoardControl
        arrows={false}
        showDots={false}
        containerClass="carousel-inner-wrapper"
      >
        {itens.map((item, index) => (
          <Item key={index} {...item} loading={loading} columns2={columns2} />
        ))}
      </Carousel>

      {loading && <LoadingOverlay />}
    </div>
  );
};

export default LoginBeneficio;
