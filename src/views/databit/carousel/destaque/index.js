import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { apiGetPicturelist } from 'datareact/src/api/crudapi';
import { capitalizeText } from 'datareact/src/utils/capitalize';
import { Decode64 } from 'datareact/src/utils/crypto';
import { LoadingOverlay } from '../../../../utils/databit/screenprocess';

const CarouselDestaque = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [autoPlay, setAutoPlay] = useState(true); // controla o modo
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const enterprise = Decode64(sessionStorage.getItem('enterprise'));
    const operation = Decode64(sessionStorage.getItem('operation'));
    const payment = Decode64(sessionStorage.getItem('payment'));
    const client = Decode64(sessionStorage.getItem('client'));
    const consumption = Decode64(sessionStorage.getItem('consumption'));
    const tablePrice = Decode64(sessionStorage.getItem('tablePrice'));

    apiGetPicturelist(
      "FT02021('" +
        enterprise +
        "','" +
        operation +
        "','" +
        payment +
        "','" +
        client +
        "','" +
        consumption +
        "','" +
        tablePrice +
        "','S',null,'S')",
      'codigo',
      'foto',
      ' 0 = 0 order by nome ',
      'codigo,referencia,codbarras,codauxiliar,nome,venda',
      '',
      'S'
    ).then((response) => {
      if (response.status === 200) {
        console.log(response.data);
        setRows(response.data);
        setLoading(false);
      }
    });
  }, []);

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 4 },
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

  return (
    <>
      <label className="checkbox-modern" style={{ marginBottom: '10px', display: 'block' }}>
        <input type="checkbox" checked={autoPlay} onChange={() => setAutoPlay(!autoPlay)} style={{ marginRight: '5px' }} />
        <span className="checkmark"></span>
        Rolagem Automática
      </label>
      {rows.length > 0 && (
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={autoPlay}
          autoPlaySpeed={3000}
          keyBoardControl={true}
          containerClass="carousel-container"
          arrows={!autoPlay} // mostra setas só se for manual (autoPlay=false)
          showDots={autoPlay} // mostra dots só se for automático
          customLeftArrow={!autoPlay ? <CustomLeftArrow /> : undefined}
          customRightArrow={!autoPlay ? <CustomRightArrow /> : undefined}
          style={{ textAlign: 'center' }}
        >
          {rows.map((item) => (
            <div
              key={item.id}
              style={{
                height: '450px',
                display: 'flex',
                justifyContent: 'center',
                borderRadius: '12px',
                color: '#000',
                fontSize: '1.25rem',
                marginBottom: '30px',
                marginLeft: '5px',
                border: '0.5px solid #e3e6e6'
              }}
            >
              <Row
                style={{ marginTop: '5px', marginLeft: '2px', marginRight: '5px', cursor: 'pointer' }}
                onClick={() => navigate('/produto/?produto=' + item.codigo)}
              >
                <img src={`data:image/jpeg;base64,${item.picture}`} alt={item.codigo} width="100%" height="70%" />
                <span className="label-destaque-16" style={{ textAlign: 'center' }}>
                  {capitalizeText(item.nome)}
                </span>
                <span className="color-price" style={{ textAlign: 'right', fontSize: '25px', marginRight: '100px' }}>
                  R${' '}
                  {item.venda.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </Row>
            </div>
          ))}
        </Carousel>
      )}
      {loading && <LoadingOverlay />}
    </>
  );
};

export default CarouselDestaque;
