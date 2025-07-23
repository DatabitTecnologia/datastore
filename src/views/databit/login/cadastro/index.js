import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import InputMask from 'react-input-mask';
import { Decode64 } from 'datareact/src/utils/crypto';
import { LoadingOverlay } from '../../../../utils/databit/screenprocess';
import { apiFind } from 'datareact/src/api/crudapi';

export const RevendedorCadastro = () => {
  const [loading, setLoading] = useState(false);
  const [revendedor, setRevendedor] = useState(undefined);

  useEffect(() => {
    setLoading(true);
    apiFind('RevendedorCadastroVW', '*', '', "codigo = '" + Decode64(sessionStorage.getItem('client')) + "' ").then((response) => {
      if (response.status === 200) {
        setLoading(false);
        setRevendedor(response.data);
      }
    });
  }, []);

  const formatCurrency = (value) =>
    value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

  return (
    <div>
      {revendedor && (
        <Card style={{ borderRadius: '12px' }}>
          <Card.Header>
            <Card.Title as="h5">Dados Cadastrais</Card.Title>
          </Card.Header>
          <Card.Body>
            <Form>
              <Row className="g-3">
                <Col md={5}>
                  <Form.Label>Razão Social:</Form.Label>
                  <Form.Control name="razaoSocial" maxLength={60} value={revendedor.nome} disabled />
                </Col>

                <Col md={3}>
                  <Form.Label>Nome Fantasia:</Form.Label>
                  <Form.Control name="nomeFantasia" maxLength={40} value={revendedor.fantasia} disabled />
                </Col>

                <Col md={2}>
                  <Form.Label>CNPJ:</Form.Label>
                  <InputMask mask="99.999.999/9999-99" className={`form-control`} name="cnpj" value={revendedor.cnpj} disabled />
                </Col>

                <Col md={2}>
                  <Form.Label>Inscrição Estadual:</Form.Label>
                  <Form.Control name="ie" maxLength={20} value={revendedor.inscest} disabled />
                </Col>

                <Col md={2}>
                  <Form.Label>CEP:</Form.Label>
                  <InputMask mask="99999-999" className={`form-control`} name="cep" value={revendedor.cep} disabled />
                </Col>

                <Col md={7}>
                  <Form.Label>Logradouro:</Form.Label>
                  <Form.Control name="rua" maxLength={60} value={revendedor.logradouro} disabled />
                </Col>

                <Col md={1}>
                  <Form.Label>Número:</Form.Label>
                  <Form.Control name="numero" type="number" value={revendedor.num} disabled />
                </Col>

                <Col md={2}>
                  <Form.Label>Complemento:</Form.Label>
                  <Form.Control name="complemento" maxLength={30} value={revendedor.comp} disabled />
                </Col>

                <Col md={4}>
                  <Form.Label>Bairro:</Form.Label>
                  <Form.Control name="bairro" maxLength={30} value={revendedor.bairro} disabled />
                </Col>

                <Col md={3}>
                  <Form.Label>Cidade:</Form.Label>
                  <Form.Control name="cidade" maxLength={30} value={revendedor.cidade} disabled />
                </Col>

                <Col md={1}>
                  <Form.Label>UF:</Form.Label>
                  <Form.Control name="estado" maxLength={30} value={revendedor.estado} disabled />
                </Col>

                <Col md={2}>
                  <Form.Label>Telefone Fixo:</Form.Label>
                  <InputMask mask="(99) 9999-9999" className={`form-control`} name="telefoneFixo" value={revendedor.fone} disabled />
                </Col>

                <Col md={2}>
                  <Form.Label>Telefone Celular:</Form.Label>
                  <InputMask mask="(99) 99999-9999" className="form-control" name="celular" value={revendedor.celular} disabled />
                </Col>

                <Col md={4}>
                  <Form.Label>E-mail:</Form.Label>
                  <Form.Control name="email" type="email" maxLength={100} value={revendedor.email} disabled />
                </Col>

                <Col md={4}>
                  <Form.Label>Site:</Form.Label>
                  <Form.Control name="site" maxLength={100} value={revendedor.site} disabled />
                </Col>
                <Col md={4}>
                  <Form.Label>Vendedor:</Form.Label>
                  <Form.Control name="vendedor" maxLength={100} value={revendedor.vendedor} disabled />
                </Col>
                <Col md={4}>
                  <Form.Label>Vendedor 2:</Form.Label>
                  <Form.Control name="vendedor 2" maxLength={100} value={revendedor.vendedor2} disabled />
                </Col>
                <Col md={2}>
                  <Form.Label>Limite de Crédito:</Form.Label>
                  <InputMask className={`form-control`} name="telefoneFixo" value={formatCurrency(revendedor.limite)} disabled />
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      )}
      {loading && <LoadingOverlay />}
    </div>
  );
};

export default RevendedorCadastro;
