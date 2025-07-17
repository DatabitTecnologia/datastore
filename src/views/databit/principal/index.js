import React, { useEffect } from 'react';
import { Card } from 'react-bootstrap';
import CarouselDestaque from '../carousel/destaque';
import CarouselMarca from '../carousel/marca';
import ViewGrupo from '../grupo';
const Principal = () => {
  return (
    <React.Fragment>
      <Card className="Recent-Users" style={{ marginBottom: '5px', marginTop: '-15px', borderRadius: '12px' }}>
        <Card.Header style={{ marginBottom: '-10px' }}>
          <Card.Title as="h5">Produtos em Destaque</Card.Title>
        </Card.Header>
        <Card.Body style={{ marginTop: '-10px', marginLeft: '-10px' }}>
          <CarouselDestaque></CarouselDestaque>
        </Card.Body>
      </Card>
      <div style={{ marginTop: '5px' }}>
        <CarouselMarca></CarouselMarca>
      </div>
      <div style={{ marginBottom: '5px', marginTop: '-15px' }}>
        <ViewGrupo></ViewGrupo>
      </div>
    </React.Fragment>
  );
};

export default Principal;
