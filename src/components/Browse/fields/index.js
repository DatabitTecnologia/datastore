import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import { LinearProgress } from '@mui/material';
import { apiBrowse } from '../../../api/crudapi';
import AGGrid from '../../AGGrid';

const BrowseFields = (props) => {
  const { object } = props;
  const { showfields, setShowfields } = props;
  const { namefields, setNamefields } = props;
  const [rowsfields, setRowsfields] = React.useState([]);
  const [colfields, setColfields] = React.useState([]);
  const [rowsselect, setRowsselect] = React.useState([]);
  const [carregando, setCarregando] = React.useState(false);

  useEffect(() => {
    setCarregando(true);
    setColfields([
      { headerClassName: 'header-list', field: 'namefield', headerName: 'Campo', width: 170 },
      { headerClassName: 'header-list', field: 'headerName', headerName: 'Descrição Campo', width: 630 },
      { headerClassName: 'header-list', field: 'type', headerName: 'Tipo', width: 150 },
      { headerClassName: 'header-list', field: 'size', headerName: 'Tamanho', width: 100, type: 'number' }
    ]);
    apiBrowse(object, namefields, 'N').then((response) => {
      if (response.status === 200) {
        setRowsfields(response.data);
        setCarregando(false);
      }
    });
  }, []);

  const aplicarField = () => {
    if (rowsselect.length > 0) {
      let sfields = namefields;
      rowsselect.forEach((field) => {
        sfields = sfields + ',' + field.namefield;
      });
      setNamefields(sfields);
    }
    setShowfields(false);
  };

  return (
    <React.Fragment>
      <div id="linear-progress">{carregando && <LinearProgress color="primary" />}</div>
      <Row style={{ marginBottom: '5px', marginLeft: '1px' }}>
        <AGGrid
          width="100%"
          height="460px"
          rows={rowsfields}
          columns={colfields}
          loading={carregando}
          multselec={true}
          onMultselec={setRowsselect}
        ></AGGrid>
      </Row>
      <hr></hr>
      <Row style={{ textAlign: 'rigth' }}>
        <Col>
          <Button id="btnAplicar" className="btn btn-success shadow-2 mb-2" onClick={() => aplicarField()}>
            <i className={'feather icon-check'} /> Aplicar
          </Button>
          <Button id="btnCancelar" className="btn btn-warning shadow-2 mb-2" onClick={() => setShowfields(false)}>
            <i className={'feather icon-x'} />
            Cancelar
          </Button>
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default BrowseFields;
