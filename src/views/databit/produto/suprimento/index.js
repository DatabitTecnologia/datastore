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
  const [rowscomp, setRowscomp] = useState([]);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

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

    let web = 'S';
    if (tiposup !== 9 && tiposup !== 11) {
      web = 'N';
    }

    const tempOptions = [];

    if (tiposup !== 9 && tiposup !== 11) {
      const responsecomp = await apiGetPicturelist(
        `FT02021('${enterprise}','${operation}','${payment}','${client}','${consumption}','${tableprice}','N',null,'${produto}',1000,'S')`,
        'codigo',
        'foto',
        filter,
        'codigo,referencia,codbarras,codauxiliar,nome,venda,grupo,subgrupo,marca,nomegrupo,nomesubgrupo,nomemarca,obs,obsint,obsfull,avaliacao,web',
        '',
        'S'
      );

      if (responsecomp.status === 200) {
        setRowscomp(responsecomp.data);
        tempOptions.push({
          rows: responsecomp.data,
          title: 'Produtos Relacionados'
        });
      }
    }

    const response = await apiGetPicturelist(
      `FT02021('${enterprise}','${operation}','${payment}','${client}','${consumption}','${tableprice}','N',null,'${produto}',${tiposup},'${web}')`,
      'codigo',
      'foto',
      filter,
      'codigo,referencia,codbarras,codauxiliar,nome,venda,grupo,subgrupo,marca,nomegrupo,nomesubgrupo,nomemarca,obs,obsint,obsfull,avaliacao,web',
      '',
      'S'
    );

    if (response.status === 200) {
      setRows(response.data);
      tempOptions.push({
        rows: response.data,
        title: tiposup !== 9 && tiposup !== 11 ? 'Equipamentos que aceitam este Suprimento' : 'Suprimentos aptos para este Equipamento'
      });
    }

    setOptions(tempOptions);
    setLoading(false);
  };

  return (
    <div>
      {options.map((option, index) => (
        <ScreenComp key={index} rows={option.rows} title={option.title} />
      ))}
      {loading && <LoadingOverlay />}
    </div>
  );
};

export default ProdutoSuprimento;

// COMPONENTE CORRETO
const ScreenComp = ({ rows, title }) => {
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <Card className="Recent-Users" id="frmcompativel" name="frmcompativel" style={{ marginTop: '20px', borderRadius: '12px' }}>
        <Card.Header>
          <Card.Title>{title}</Card.Title>
        </Card.Header>

        <Row style={{ marginLeft: '3px', padding: '3px', marginBottom: '10px' }}>
          {rows.map((item) => (
            <Col lg={2} key={item.id}>
              <Row
                style={{
                  height: '270px',
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
                  cursor: 'pointer',
                  marginBottom: '10px'
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
    </React.Fragment>
  );
};
