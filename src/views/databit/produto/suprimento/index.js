import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { apiGetPicturelist } from 'datareact/src/api/crudapi';
import { capitalizeText } from 'datareact/src/utils/capitalize';
import { Decode64 } from 'datareact/src/utils/crypto';
import { StarRatingView } from '../../../../components/StarRatingView';
import { LoadingOverlay } from '../../../../utils/databit/screenprocess';
import { DATABIT } from '../../../../config/constant';
import semfoto from '../../../../assets/images/databit/semfoto.png';

const ProdutoSuprimento = (props) => {
  const navigate = useNavigate();
  const { produto, tiposup } = props;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (produto) {
      Filtrar();
    }
  }, [produto]);

  const Filtrar = async () => {
    setLoading(true);
    const enterprise = Decode64(sessionStorage.getItem('enterprise'));
    const operation = Decode64(sessionStorage.getItem('operation'));
    const payment = Decode64(sessionStorage.getItem('payment'));
    const client = Decode64(sessionStorage.getItem('client'));
    const consumption = Decode64(sessionStorage.getItem('consumption'));
    const tableprice = Decode64(sessionStorage.getItem('tableprice'));
    const filter = ' 0 = 0 order by nome ';
    /*if (tiposup === 9 || tiposup === 11) {
      filter =
        "  exists (select tb01031_codigoproduto from tb01031 where codigo = tb01031_codigo and tb01031_codigoproduto = '" +
        produto +
        "') order by nome";
    } else {
      filter =
        "  exists (select tb01031_codigo from tb01031 where codigo = tb01031_codigoproduto and tb01031_codigo = '" +
        produto +
        "') order by nome";
    }*/

    let web = 'S';
    if (tiposup !== 9 && tiposup !== 11) {
      web = 'N';
    }

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
        "','N',null,'" +
        produto +
        "'," +
        tiposup +
        ",'" +
        web +
        "')",
      'codigo',
      'foto',
      filter,
      'codigo,referencia,codbarras,codauxiliar,nome,venda,grupo,subgrupo,marca,nomegrupo,nomesubgrupo,nomemarca,obs,obsint,obsfull,avaliacao,web',
      '',
      'S'
    );

    if (response.status === 200) {
      setRows(response.data);
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Card className="Recent-Users" id="frmcompativel" name="frmcompativel" style={{ marginTop: '20px', borderRadius: '12px' }}>
        <Card.Header>
          {tiposup === 9 || tiposup === 11 ? (
            <Card.Title as="h5">Suprimentos aptos para este Equipamento</Card.Title>
          ) : (
            <Card.Title as="h5">Equipamentos que aceitam Suprimento</Card.Title>
          )}
        </Card.Header>

        <Row style={{ marginLeft: '3px', padding: '3px', marginBottom: '10px' }}>
          {rows.map((item) => (
            <Col lg={2} key={item.id}>
              <Row
                style={{
                  height: '270px', // não trava tamanho fixo
                  width: '100%',
                  borderRadius: '12px',
                  border: '0.5px solid #e3e6e6',
                  padding: '3px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textAlign: 'center',
                  color: '#000',
                  cursor: 'pointer'
                }}
                onClick={() => item.web === 'S' && navigate('/produto/?produto=' + item.codigo)}
              >
                {item.picture !== 'MHg=' ? (
                  <img
                    src={`data:image/jpeg;base64,${item.picture}`}
                    alt={item.codigo}
                    style={{ width: '130px', height: '130px', marginBottom: '10px', objectFit: 'contain' }}
                  />
                ) : (
                  <img
                    src={semfoto}
                    alt={item.codigo}
                    style={{ width: '130px', height: '130px', marginBottom: '10px', objectFit: 'contain' }}
                  />
                )}
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{capitalizeText(item.nome.substring(0, 50))}</span>
                {DATABIT.islogged ||
                  (parseInt(Decode64(sessionStorage.getItem('pricelogin'))) === 1 && (
                    <div style={{ textAlign: 'right' }}>
                      <span className="color-price" style={{ fontSize: '1.5rem', marginTop: '5px', textAlign: 'right' }}>
                        R$ {item.venda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}

                <StarRatingView rating={item.avaliacao ?? 0} size={12} />
              </Row>
            </Col>
          ))}
        </Row>
      </Card>

      {loading && <LoadingOverlay />}
    </React.Fragment>
  );
};

export default ProdutoSuprimento;
