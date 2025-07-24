import React, { useEffect, useState } from 'react';
import { Card, ListGroup, Row } from 'react-bootstrap';
import { apiList, apiGetPicturelist } from 'datareact/src/api/crudapi';
import { capitalizeText } from 'datareact/src/utils/capitalize';
import { useNavigate } from 'react-router-dom';
import semfoto from '../../../assets/images/databit/semfoto.png';

const ViewGrupo = () => {
  const [rows, setRows] = useState([]);
  const [rowssub, setRowssub] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    apiGetPicturelist('VW01148', 'codigo', 'foto', ' 0 = 0 order by nome ', 'codigo,nome', '').then((response) => {
      if (response.status === 200) {
        setRows(response.data);
        apiList(
          'Subgrupo',
          'TB01018_CODIGO,TB01018_NOME,TB01018_GRUPO',
          '',
          "TB01018_WEB = 'S' AND TB01018_SITUACAO = 'A' order by tb01018_NOME"
        ).then((response) => {
          if (response.status === 200) {
            setRowssub(response.data);
          }
        });
      }
    });
  }, []);

  return (
    <div
      style={{
        columnCount: 3,
        columnGap: '16px',
        padding: '16px'
      }}
    >
      {rows.map((grupo, index) => {
        const subgruposDoGrupo = rowssub.filter((sub) => sub.grupo === grupo.codigo);

        return (
          <div
            key={index}
            style={{
              breakInside: 'avoid',
              marginBottom: '16px'
            }}
          >
            <Card className="Recent-Users" style={{ borderRadius: '12px' }}>
              <Card.Header style={{ marginBottom: '-20px' }}>
                <Card.Title as="h5">{capitalizeText(grupo.nome)}</Card.Title>
              </Card.Header>
              <Card.Body style={{ marginTop: '-10px' }}>
                <Row
                  onClick={() => navigate('/filter/?type=2&term=' + grupo.codigo + '&name=' + capitalizeText(grupo.nome))}
                  style={{ textAlign: 'center' }}
                >
                  {grupo.picture !== 'MHg=' ? (
                    <img
                      src={`data:image/jpeg;base64,${grupo.picture}`}
                      alt={grupo.codigo}
                      style={{ width: '250px', height: '250px', objectFit: 'contain', display: 'block', margin: '0 auto' }}
                    />
                  ) : (
                    <img
                      src={semfoto}
                      alt={grupo.codigo}
                      style={{ width: '250px', height: '250px', objectFit: 'contain', display: 'block', margin: '0 auto' }}
                    />
                  )}
                </Row>
                {subgruposDoGrupo.length > 0 ? (
                  <ListGroup
                    variant="flush"
                    className="p-0"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '0.5rem 1rem'
                    }}
                  >
                    {subgruposDoGrupo.map((sub, idx) => (
                      <ListGroup.Item
                        key={idx}
                        className="border-0 px-2 py-1 label-destaque-14"
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate('/filter/?type=3&term=' + sub.codigo + '&name=' + capitalizeText(sub.nome))}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center' // Alinha verticalmente os itens no centro
                          }}
                        >
                          <div
                            style={{
                              width: '8px',
                              height: '8px',
                              backgroundColor: '#000',
                              borderRadius: '50%',
                              marginTop: '0', // Pode tirar margem superior para alinhar certinho
                              marginRight: '10px',
                              flexShrink: 0
                            }}
                          ></div>
                          <span>{capitalizeText(sub.nome)}</span>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p className="text-muted mt-2">Nenhuma SubCategoria.</p>
                )}
              </Card.Body>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default ViewGrupo;
