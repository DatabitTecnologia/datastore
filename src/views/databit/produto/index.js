import React, { useEffect, useState, useRef } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import ReactImageMagnify from 'react-image-magnify';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { apiGetPicturelist } from 'datareact/src/api/crudapi';
import { LoadingOverlay } from '../../../utils/databit/screenprocess';
import { Decode64 } from 'datareact/src/utils/crypto';
import { capitalizeText } from 'datareact/src/utils/capitalize';
import { StarRatingView } from '../../../components/StarRatingView';
import { SelectorNumber } from '../../../components/SelectorNumber';
import ProdutoSuprimento from './suprimento';
import { CompartilharProduto } from './compartilhar';

const Produto = (props) => {
  const location = useLocation();
  const [itemselec, setItemselec] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [foto, setFoto] = React.useState();
  const [listafotos, setListafotos] = React.useState([]);
  const [quantidade, setQuantidade] = useState(1);
  const [compartilharAberto, setCompartilharAberto] = useState(false);
  const compartilharRef = useRef(null);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 6
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (compartilharRef.current && !compartilharRef.current.contains(event.target)) {
        setCompartilharAberto(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    pesquisaProduto(params.get('produto'));
  }, [location.search]);

  useEffect(() => {
    setFoto(itemselec.picture);
    listarFotos(itemselec.codigo);
  }, [itemselec]);

  const pesquisaProduto = async (produto) => {
    setLoading(true);

    const enterprise = Decode64(sessionStorage.getItem('enterprise'));
    const operation = Decode64(sessionStorage.getItem('operation'));
    const payment = Decode64(sessionStorage.getItem('payment'));
    const client = Decode64(sessionStorage.getItem('client'));
    const consumption = Decode64(sessionStorage.getItem('consumption'));
    const tablePrice = Decode64(sessionStorage.getItem('tablePrice'));

    const response = await apiGetPicturelist(
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
        "','N', '" +
        produto +
        "','S')",
      'codigo',
      'foto',
      "codigo = '" + produto + "' ",
      'codigo,referencia,codbarras,codauxiliar,nome,venda,grupo,subgrupo,marca,nomegrupo,nomesubgrupo,nomemarca,obs,obsint,obsfull,avaliacao,tiposup',
      '',
      'S'
    );
    if (response.status === 200) {
      console.log(response.data);
      setItemselec(response.data[0]);
    }
    setLoading(false);
  };

  const listarFotos = async (produto) => {
    setLoading(true);
    const response = await apiGetPicturelist("FT02022('" + produto + "')", 'codigo', 'foto', ' 0 = 0 ', 'codigo,nome', '', 'S');
    if (response.status === 200) {
      console.log(response.data);
      setListafotos(response.data);
    }
    setLoading(false);
  };

  const typeObs = (item) => {
    switch (parseInt(Decode64(sessionStorage.getItem('typeObs')))) {
      case 1: {
        return item.obs;
      }
      case 2: {
        return item.obsint;
      }
      case 3: {
        return item.obsfull;
      }
    }
  };

  const fotoProduto = (
    <Col lg={4}>
      <div
        style={{
          width: '100%',
          height: '350px',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '8px'
        }}
      >
        {itemselec.picture && (
          <ReactImageMagnify
            {...{
              smallImage: {
                alt: itemselec.codigo,
                isFluidWidth: false,
                width: 350,
                height: 350,
                src: `data:image/jpeg;base64,${foto}`
              },
              largeImage: {
                src: `data:image/jpeg;base64,${foto}`,
                width: 1200,
                height: 1200
              },
              enlargedImageContainerStyle: {
                zIndex: 999,
                background: '#fff',
                border: '1px solid #ccc'
              },
              enlargedImagePosition: 'over'
            }}
          />
        )}
      </div>
    </Col>
  );

  const descricaoProduto = (
    <Col lg={5}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>{capitalizeText(itemselec.nome || 'Nome do Produto')}</h2>
      <StarRatingView rating={itemselec.avaliacao ?? 0} size={25} showrating={true} />
      <PerfectScrollbar
        options={{ suppressScrollX: true, suppressScrollY: false }}
        style={{ width: '100%', height: '340px', marginTop: '10px' }}
      >
        <p style={{ fontSize: '0.9rem', marginLeft: '2px', marginRight: '2px' }}>{typeObs(itemselec)}</p>
      </PerfectScrollbar>
    </Col>
  );

  const precoProduto = (
    <Col lg={3}>
      <Row style={{ marginTop: '170px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <span
            style={{
              fontSize: '3rem',
              color: sessionStorage.getItem('colorPrice'),
              fontWeight: '700'
            }}
          >
            R${' '}
            {(itemselec.venda ?? 0).toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </span>
        </div>

        <div style={{ textAlign: 'center' }}>
          <label style={{ fontWeight: 'bold', display: 'block' }}>Quantidade</label>
          <div style={{ marginLeft: '70px' }}>
            <SelectorNumber value={quantidade} setValue={setQuantidade} />
          </div>
        </div>
      </Row>
    </Col>
  );

  const carrouselProduto = (
    <Col lg={7}>
      <Row>
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={false}
          autoPlaySpeed={3000}
          keyBoardControl={true}
          arrows={true}
          customLeftArrow={<CustomLeftArrow />}
          customRightArrow={<CustomRightArrow />}
          showDots={false}
        >
          {listafotos.map((item, index) => (
            <Row
              key={index}
              onClick={() => setFoto(item.picture)}
              style={{
                height: '110px',
                width: '110px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '12px',
                marginRight: '20px',
                border: '2px solid #e3e6e6',
                padding: '5px',
                background: '#fff',
                cursor: 'pointer'
              }}
            >
              <img
                src={`data:image/jpeg;base64,${item.picture}`}
                alt={index}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </Row>
          ))}
        </Carousel>
      </Row>
    </Col>
  );

  const botoesProduto = (
    <Col lg={3}>
      {/* Preço e Quantidade no topo */}
      <Button className="color-button-primary w-100 mb-2">
        <i className="feather icon-shopping-cart" /> Adicionar ao Carrinho
      </Button>
      <Button className="color-button-primary w-100 mb-2">
        <i className="feather icon-heart" /> Adicionar aos Favoritos
      </Button>
      <Button className="color-button-primary w-100 mb-2" onClick={() => setCompartilharAberto(!compartilharAberto)}>
        <i className="feather icon-share-2" /> Compartilhar
      </Button>

      <Button className="color-button-primary w-100 mb-2">
        <i className="feather icon-star" /> Avalie este Produto
      </Button>
    </Col>
  );

  const shareProduto = (
    <Col lg={2}>
      <div style={{ position: 'relative', textAlign: 'right' }} ref={compartilharRef}>
        {compartilharAberto && <CompartilharProduto itemselec={itemselec} ref={compartilharRef} />}
      </div>
    </Col>
  );

  return (
    <React.Fragment>
      <div id="frmproduto" name="frmproduto" style={{ padding: '20px', background: '#fff', borderRadius: '12px' }}>
        {/* PRIMEIRA PARTE - 3 colunas */}
        <Row className="mb-4">
          {/* Coluna A - Foto */}
          {fotoProduto}
          {/* Coluna B - Descrição + Observações */}
          {descricaoProduto}
          {/* Coluna C - Preço + Quantidade */}
          {precoProduto}
        </Row>
        {/* SEGUNDA PARTE - 3 colunas */}
        <Row style={{ marginLeft: '10px' }}>
          {/* Coluna A - Carrossel */}
          {carrouselProduto}
          {/* Coluna B - Compartilhar */}
          {shareProduto}
          {/* Coluna C - Botões */}
          {botoesProduto}
        </Row>
      </div>

      <ProdutoSuprimento produto={itemselec.codigo} tiposup={itemselec.tiposup}></ProdutoSuprimento>

      {loading && <LoadingOverlay />}
    </React.Fragment>
  );
};

export default Produto;
