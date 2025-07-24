import React, { useEffect, useState, useRef } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import ReactImageMagnify from 'react-image-magnify';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useToasts } from 'react-toast-notifications';
import { apiGetPicturelist, apiFind, apiInsert } from 'datareact/src/api/crudapi';
import { LoadingOverlay } from '../../../utils/databit/screenprocess';
import { Decode64 } from 'datareact/src/utils/crypto';
import { capitalizeText } from 'datareact/src/utils/capitalize';
import { StarRatingView } from '../../../components/StarRatingView';
import { SelectorNumber } from '../../../components/SelectorNumber';
import ProdutoSuprimento from './suprimento';
import { CompartilharProduto } from './compartilhar';
import ProdutoAvaliacao from './avaliacao';
import { DATABIT } from '../../../config/constant';
import { adicionarCarrinho } from '../../../utils/databit/carrinho';
import semfoto from '../../../assets/images/databit/semfoto.png';

const Produto = (props) => {
  const location = useLocation();
  const { addToast } = useToasts();
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
    const tableprice = Decode64(sessionStorage.getItem('tableprice'));

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
        tableprice +
        "','N', '" +
        produto +
        "',null,0,'S')",
      'codigo',
      'foto',
      "codigo = '" + produto + "' ",
      'codigo,referencia,codbarras,codauxiliar,nome,venda,grupo,subgrupo,marca,nomegrupo,nomesubgrupo,nomemarca,obs,obsint,obsfull,avaliacao,tiposup',
      '',
      'S'
    );
    if (response.status === 200) {
      setItemselec(response.data[0]);
      console.log(response.data[0]);
    }
    setLoading(false);
  };

  const listarFotos = async (produto) => {
    setLoading(true);
    const response = await apiGetPicturelist("FT02022('" + produto + "')", 'codigo', 'foto', ' 0 = 0 ', 'codigo,nome', '', 'S');
    if (response.status === 200) {
      setListafotos(response.data);
    }
    setLoading(false);
  };

  const typeobs = (item) => {
    const tipo = parseInt(Decode64(sessionStorage.getItem('typeobs')));

    switch (tipo) {
      case 1:
        return item.obs;
      case 2:
        return item.obsint;
      case 3:
        return `${item.obsint || ''}\n${item.obs || ''}`; // quebra de linha entre os dois
      default:
        return '';
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
        {itemselec.picture !== 'MHg=' ? (
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
        ) : (
          <ReactImageMagnify
            {...{
              smallImage: {
                alt: itemselec.codigo,
                isFluidWidth: false,
                width: 350,
                height: 350,
                src: semfoto
              },
              largeImage: {
                src: semfoto,
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
        <p style={{ fontSize: '0.9rem', marginLeft: '2px', marginRight: '2px', whiteSpace: 'pre-wrap' }}>{typeobs(itemselec)}</p>
      </PerfectScrollbar>
    </Col>
  );

  const precoProduto = (
    <Col lg={3}>
      <Row style={{ marginTop: '170px' }}>
        {DATABIT.islogged && (
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
        )}
        {DATABIT.islogged && (
          <div style={{ textAlign: 'center' }}>
            <label style={{ fontWeight: 'bold', display: 'block' }}>Quantidade</label>
            <div style={{ marginLeft: '70px' }}>
              <SelectorNumber value={quantidade} setValue={setQuantidade} />
            </div>
          </div>
        )}
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
              {item.picture !== 'MHg=' ? (
                <img
                  src={`data:image/jpeg;base64,${item.picture}`}
                  alt={index}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              ) : (
                <img
                  src={semfoto}
                  alt={index}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              )}
            </Row>
          ))}
        </Carousel>
      </Row>
    </Col>
  );

  const botoesProduto = (
    <Col lg={3}>
      {/* Preço e Quantidade no topo */}
      {DATABIT.islogged && (
        <Button className="color-button-primary w-100 mb-2" onClick={() => addCarrinho()}>
          <i className="feather icon-shopping-cart" /> Adicionar ao Carrinho
        </Button>
      )}
      {DATABIT.islogged && (
        <Button className="color-button-primary w-100 mb-2" onClick={() => addFavorito()}>
          <i className="feather icon-heart" /> Adicionar aos Favoritos
        </Button>
      )}
      <Button className="color-button-primary w-100 mb-2" onClick={() => setCompartilharAberto(!compartilharAberto)}>
        <i className="feather icon-share-2" /> Compartilhar
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

  const addFavorito = async () => {
    const client = Decode64(sessionStorage.getItem('client'));
    setLoading(true);
    const responsefind = await apiFind(
      'ProdutoFavorito',
      '*',
      '',
      "TB01164_PRODUTO = '" + itemselec.codigo + "' and TB01164_CODCLI = '" + client + "' "
    );
    if (responsefind.status === 200) {
      if (responsefind.data) {
        setLoading(false);
        addToast('Produto já adiciondo anteriormente !', {
          placement: 'bottom-rigth',
          appearance: 'success',
          autoDismiss: true
        });
      } else {
        const item = {
          produto: itemselec.codigo,
          codcli: client
        };
        const responseinsert = await apiInsert('ProdutoFavorito', item);
        if (responseinsert.status === 200) {
          setLoading(false);
          addToast('Produto adicionado com SUCESSO !', {
            placement: 'bottom-rigth',
            appearance: 'success',
            autoDismiss: true
          });
          window.dispatchEvent(new Event('favoritosAtualizado'));
        }
      }
    }
  };

  const addCarrinho = async () => {
    setLoading(true);
    await adicionarCarrinho(itemselec, quantidade);
    setLoading(false);
    addToast('Produto adicionado com SUCESSO !', {
      placement: 'bottom-rigth',
      appearance: 'success',
      autoDismiss: true
    });
    window.dispatchEvent(new Event('carrinhoAtualizado'));
  };

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
      <ProdutoAvaliacao produto={itemselec.codigo}></ProdutoAvaliacao>

      {loading && <LoadingOverlay />}
    </React.Fragment>
  );
};

export default Produto;
