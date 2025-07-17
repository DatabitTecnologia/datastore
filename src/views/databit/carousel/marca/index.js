import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { apiGetPicturelist } from 'datareact/src/api/crudapi';
import { useNavigate } from 'react-router-dom';
import { Row } from 'react-bootstrap';
import { capitalizeText } from 'datareact/src/utils/capitalize';

const CarouselMarca = () => {
  const navigate = useNavigate();
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 4
    },
    desktop: {
      breakpoint: { max: 1024, min: 768 },
      items: 4
    },
    tablet: {
      breakpoint: { max: 768, min: 464 },
      items: 3
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2
    }
  };

  // Setas personalizadas
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

  const [rows, setRows] = React.useState([]);

  useEffect(() => {
    apiGetPicturelist('VW01149', 'codigo', 'foto', ' 0 = 0 order by nome', 'codigo,nome', '').then((response) => {
      if (response.status === 200) {
        setRows(response.data);
      }
    });
  }, []);

  return (
    <React.Fragment>
      {rows !== undefined && rows.length > 0 ? (
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={false}
          autoPlaySpeed={3000}
          keyBoardControl={true}
          arrows={true}
          customLeftArrow={<CustomLeftArrow />}
          customRightArrow={<CustomRightArrow />}
          containerClass="carousel-inner-wrapper"
          showDots={false}
        >
          {rows.map((item) => (
            <div
              key={item.id}
              style={{
                height: '200px',
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                borderRadius: '12px',
                color: '#000',
                fontSize: '1.25rem',
                marginBottom: '30px',
                marginLeft: '4px'
              }}
            >
              <Row
                style={{ marginTop: '45px', marginLeft: '40px', marginRight: '40px', cursor: 'pointer' }}
                onClick={() => navigate('/filter/?type=4&term=' + item.codigo + '&name=' + capitalizeText(item.nome))}
              >
                <img src={`data:image/jpeg;base64,${item.picture}`} alt={item.codigo} width="100%" height="70%" />
                <a className="label-destaque-16" style={{ textAlign: 'center' }}>
                  {capitalizeText(item.nome)}
                </a>
              </Row>
            </div>
          ))}
        </Carousel>
      ) : (
        <></>
      )}
    </React.Fragment>
  );
};

export default CarouselMarca;
