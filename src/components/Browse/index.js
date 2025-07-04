import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalBody } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import { LinearProgress } from '@mui/material';
import { apiBrowse, apiList } from '../../api/crudapi';
import { calcObject } from '../../utils/calcObject';
import { CreateObject } from '../CreateObject';
import { Decode64 } from '../../utils/crypto';
import AGGrid from '../AGGrid';
import BrowseFields from './fields';

const Browse = (props) => {
  const [fields, setFields] = React.useState([]);
  const [carregando, setCarregando] = React.useState(false);
  const [valuesfield, setValuesfield] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [rowsfields, setRowsfields] = React.useState([]);
  const [colfields, setColfields] = React.useState([]);
  const [rowsselect, setRowsselect] = React.useState([]);
  const [selecao, setSelecao] = React.useState([]);
  const [namefields, setNamefields] = React.useState(props.fields);

  const [showfields, setShowfields] = useState(false);

  const { showbrowse, setShowbrowse } = props;
  const { itemselec, setItemselec } = props;
  const { codigos, setCodigos } = props;
  const { nomes, setNomes } = props;

  const Processar = () => {
    apiBrowse(props.object, namefields, 'S').then((response) => {
      if (response.status === 200) {
        setFields(response.data);
        setCarregando(false);
      }
    });
  };

  useEffect(() => {
    setNamefields(props.fields);
    Processar();
  }, []);

  const handleClosefields = () => {
    setShowfields(false);
    Processar();
  };

  useEffect(() => {
    Processar();
  }, [namefields]);

  useEffect(() => {
    calcObject(fields, 70);
    Filtrar();
    try {
      document.getElementById('nome').focus();
    } catch (error) {
      ////console.log(error);
    }
  }, [fields]);

  const Filtrar = () => {
    let filter = '(' + props.table + "_SITUACAO = 'A') ";
    if (Decode64(sessionStorage.getItem('manager')) === 'N' && Decode64(sessionStorage.getItem('seller')) !== 'ZZZZ') {
      if (props.table === 'TB01008' || props.table === 'TB01127') {
        if (!filter.includes('VENDEDOR')) {
          filter = filter + ' and (' + props.table + "_VENDEDOR = '" + Decode64(sessionStorage.getItem('seller')) + "') ";
        }
      }
      if (props.table === 'TB02255' || props.table === 'TB02264') {
        if (!filter.includes('CODVEN')) {
          filter = filter + ' and (' + props.table + "_CODVEN = '" + Decode64(sessionStorage.getItem('seller')) + "') ";
        }
      }
    }

    let filteraux = props.filteraux;
    if (filteraux !== undefined && filteraux !== '' && filteraux !== null) {
      filter = filter + filteraux;
    }
    if (props.table === 'TB02176' && parseInt(sessionStorage.getItem('perfil')) === 1 && parseInt(sessionStorage.getItem('system')) === 3) {
      filter = filter + " and TB02176_CODIGO = '" + Decode64(sessionStorage.getItem('temple')) + "' ";
    }
    if (props.table === 'TB01008' && parseInt(sessionStorage.getItem('perfil')) === 2 && parseInt(sessionStorage.getItem('system')) === 3) {
      filter = filter + " and TB01008_CODIGO = '" + Decode64(sessionStorage.getItem('partner')) + "' ";
    }

    fields.forEach((field, index) => {
      if (valuesfield[index] !== '' && valuesfield[index] !== undefined) {
        filter = filter + ' and (' + field.namefield;
        if (field.pk === true) {
          filter = filter + " = '" + valuesfield[index] + "' ";
        } else {
          filter = filter + " like '" + valuesfield[index] + "%' ";
        }
        filter = filter + ')';
      }
    });
    setCarregando(true);
    apiList(props.classobject, props.fields, '', filter).then((response) => {
      if (response.status === 200) {
        setRows(response.data);
        setCarregando(false);
      }
    });
  };

  const limpar = () => {
    fields.forEach((field, index) => {
      valuesfield[index] = '';
    });
    setRows([]);
  };

  const addSelection = () => {
    if (selecao.length > 0) {
      let scodigos = '';
      let snomes = '';
      selecao.forEach((index) => {
        const item = rows[index - 1];
        scodigos = scodigos + "'" + item.codigo + "'" + ',';
        snomes = snomes + "'" + item.nome + "'" + ',';
      });
      setCodigos('(' + scodigos.substring(0, scodigos.length - 1) + ')');
      setNomes('(' + snomes.substring(0, snomes.length - 1) + ')');
    } else {
      setCodigos('');
      setNomes('');
    }
    setShowbrowse(false);
  };

  const clickGrid = (newSelection) => {
    if (props.tipo === '1') {
      setItemselec(newSelection);
    }
  };

  const keyGrid = (newSelection, event) => {
    if (props.tipo === '1') {
      setItemselec(newSelection);
      if (event.key === 'Enter') {
        setShowbrowse(true);
      }
    }
  };

  const dblClickGrid = (newSelection) => {
    if (props.tipo === '1') {
      setItemselec(newSelection);
      setShowbrowse(false);
    }
  };
  return (
    <React.Fragment>
      <div id="linear-progress">{carregando && <LinearProgress color="primary" />}</div>
      <Row style={{ marginBottom: '5px', marginLeft: '1px' }}>
        {fields.map((field, index) => (
          <CreateObject
            key={index}
            field={field}
            index={index}
            valuesfield={valuesfield}
            setValuesfield={(data) => setValuesfield(data)}
            fields={fields}
            invisible={false}
          ></CreateObject>
        ))}
      </Row>
      <AGGrid
        width="100%"
        height="460px"
        rows={rows}
        columns={fields}
        loading={carregando}
        onKeyDown={keyGrid}
        onDoubleClick={dblClickGrid}
        onCelClick={clickGrid}
        multselec={props.tipo === '2'}
        onMultselec={setSelecao}
        item={itemselec}
        setItem={(data) => setItemselec(data)}
      ></AGGrid>
      <Row style={{ textAlign: 'right', marginTop: '5px' }}>
        <Col>
          <Button id="btnFiltrar" onClick={Filtrar} className="btn btn-success shadow-2 mb-3">
            <i className={'feather icon-filter'} /> Fitrar
          </Button>
          <Button id="btnlimpar" onClick={limpar} className="btn btn-warning shadow-2 mb-3">
            <i className={'feather icon-refresh-cw'} /> Limpar
          </Button>
          <Button id="btnAdd" className="btn btn-primary shadow-2 mb-3" onClick={() => setShowfields(true)}>
            <i className={'feather icon-star'} /> Add. Campos
          </Button>
          {props.tipo === '2' ? (
            <Button id="btnAplicarselec" className="btn btn-primary shadow-2 mb-3" onClick={() => addSelection()}>
              <i className={'feather icon-check-square'} /> Aplicar seleção
            </Button>
          ) : (
            <div></div>
          )}
        </Col>
      </Row>
      <Modal backdrop="static" size="xl" show={showfields} centered={true} onHide={handleClosefields}>
        <Modal.Header className="h5" closeButton>
          <i className={'feather icon-star h1'} />
          &nbsp;Novo campo
        </Modal.Header>
        <ModalBody>
          <BrowseFields
            object={props.object}
            showfields={showfields}
            setShowfields={(data) => setShowfields(data)}
            namefields={namefields}
            setNamefields={(data) => setNamefields(data)}
          ></BrowseFields>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default Browse;
