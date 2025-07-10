import React, { useState } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import InputMask from 'react-input-mask';
import { useToasts } from 'react-toast-notifications';
import { apiSendEmail } from 'datareact/src/api/apiemail';
import { getCEP } from 'datareact/src/api/correios';
import { Decode64 } from 'datareact/src/utils/crypto';
import { LoadingOverlay } from '../../../utils/databit/screenprocess';

export const Revendedor = () => {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToasts();

  const [form, setForm] = useState({
    nome: '',
    cargo: '',
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    ie: '',
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    telefoneFixo: '',
    celular: '',
    email: '',
    site: '',
    obs: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const unmasked = ['cnpj', 'cep'].includes(name) ? value.replace(/\D/g, '') : value;
    setForm({ ...form, [name]: unmasked });
    setErrors({ ...errors, [name]: '' });
    if (name === 'cep' && unmasked.length === 8) {
      setLoading(true);
      getCEP(unmasked).then((response) => {
        if (response.status === 200) {
          try {
            const data = response.data;
            setForm((prev) => ({
              ...prev,
              rua: data.logradouro?.substring(0, 60) || '',
              bairro: data.bairro?.substring(0, 30) || '',
              cidade: data.localidade?.substring(0, 30) || '',
              estado: data.uf?.toUpperCase() || ''
            }));
          } catch (error) {
            addToast('Endereço não encontrado!', {
              placement: 'bottom-right',
              appearance: 'warning',
              autoDismiss: true
            });
          }
          setLoading(false);
        }
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nome) newErrors.nome = 'Informe o nome completo';
    if (!form.cargo) newErrors.cargo = 'Informe o cargo';
    if (!form.razaoSocial) newErrors.razaoSocial = 'Informe a razão social';
    if (!form.nomeFantasia) newErrors.nomeFantasia = 'Informe o nome fantasia';
    if (!form.cnpj || form.cnpj.length !== 14) newErrors.cnpj = 'CNPJ inválido';
    if (!form.cep || form.cep.length !== 8) newErrors.cep = 'CEP inválido';
    if (!form.estado) newErrors.estado = 'Selecione o estado';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'E-mail inválido';
    if (!form.telefoneFixo && !form.celular) newErrors.telefoneFixo = 'Informe ao menos um telefone';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      const resumoCampos = `
* * * Segue os dados do Solicitante * * *
Nome completo: ${form.nome}
Cargo: ${form.cargo}
Razão Social: ${form.razaoSocial}
Nome Fantasia: ${form.nomeFantasia}
CNPJ: ${form.cnpj}
Inscrição Estadual: ${form.ie}
CEP: ${form.cep}
Rua: ${form.rua}
Número: ${form.numero}
Complemento: ${form.complemento}
Bairro: ${form.bairro}
Cidade: ${form.cidade}
Estado: ${form.estado}
Telefone fixo: ${form.telefoneFixo}
Telefone celular: ${form.celular}
E-mail: ${form.email}
Site: ${form.site}
Observação: ${form.obs}
`;
      setLoading(true);
      apiSendEmail(
        null,
        Decode64(sessionStorage.getItem('fromseller')),
        'Solicitação pra ser Revendedor: ' + form.nomeFantasia ?? form.razaoSocial,
        resumoCampos,
        undefined
      ).then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          setLoading(false);
          addToast('Formulário enviado com SUCESSO !', {
            placement: 'bottom-rigth',
            appearance: 'success',
            autoDismiss: true
          });
        }
      });
    }
  };

  return (
    <div className="container my-1" style={{ maxWidth: '1300px' }}>
      <Card style={{ borderRadius: '12px' }}>
        <Card.Header>
          <Card.Title as="h5">Formulário de Revendedor</Card.Title>
        </Card.Header>
        <Card.Body>
          <Form noValidate onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={5}>
                <Form.Label>Nome completo:</Form.Label>
                <Form.Control name="nome" maxLength={60} isInvalid={!!errors.nome} onChange={handleChange} />
                <Form.Control.Feedback type="invalid">{errors.nome}</Form.Control.Feedback>
              </Col>
              <Col md={2}>
                <Form.Label>Cargo:</Form.Label>
                <Form.Control name="cargo" maxLength={30} isInvalid={!!errors.cargo} onChange={handleChange} />
                <Form.Control.Feedback type="invalid">{errors.cargo}</Form.Control.Feedback>
              </Col>

              <Col md={5}>
                <Form.Label>Razão Social:</Form.Label>
                <Form.Control name="razaoSocial" maxLength={60} isInvalid={!!errors.razaoSocial} onChange={handleChange} />
                <Form.Control.Feedback type="invalid">{errors.razaoSocial}</Form.Control.Feedback>
              </Col>

              <Col md={6}>
                <Form.Label>Nome Fantasia:</Form.Label>
                <Form.Control name="nomeFantasia" maxLength={40} isInvalid={!!errors.nomeFantasia} onChange={handleChange} />
                <Form.Control.Feedback type="invalid">{errors.nomeFantasia}</Form.Control.Feedback>
              </Col>

              <Col md={2}>
                <Form.Label>CNPJ:</Form.Label>
                <InputMask
                  mask="99.999.999/9999-99"
                  className={`form-control ${errors.cnpj ? 'is-invalid' : ''}`}
                  name="cnpj"
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.cnpj}</div>
              </Col>

              <Col md={2}>
                <Form.Label>Inscrição Estadual:</Form.Label>
                <Form.Control name="ie" maxLength={20} onChange={handleChange} />
              </Col>

              <Col md={2}>
                <Form.Label>CEP:</Form.Label>
                <InputMask
                  mask="99999-999"
                  className={`form-control ${errors.cep ? 'is-invalid' : ''}`}
                  name="cep"
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.cep}</div>
              </Col>

              <Col md={7}>
                <Form.Label>Logradouro:</Form.Label>
                <Form.Control name="rua" maxLength={60} value={form.rua} onChange={handleChange} />
              </Col>

              <Col md={1}>
                <Form.Label>Número:</Form.Label>
                <Form.Control name="numero" type="number" onChange={handleChange} />
              </Col>

              <Col md={2}>
                <Form.Label>Complemento:</Form.Label>
                <Form.Control name="complemento" maxLength={30} onChange={handleChange} />
              </Col>

              <Col md={2}>
                <Form.Label>Bairro:</Form.Label>
                <Form.Control name="bairro" maxLength={30} value={form.bairro} onChange={handleChange} />
              </Col>

              <Col md={3}>
                <Form.Label>Cidade:</Form.Label>
                <Form.Control name="cidade" maxLength={30} value={form.cidade} onChange={handleChange} />
              </Col>

              <Col md={1}>
                <Form.Label>UF:</Form.Label>
                <Form.Control as="select" name="estado" isInvalid={!!errors.estado} value={form.estado} onChange={handleChange}>
                  <option value="">Selecione</option>
                  {[
                    'AC',
                    'AL',
                    'AP',
                    'AM',
                    'BA',
                    'CE',
                    'DF',
                    'ES',
                    'GO',
                    'MA',
                    'MT',
                    'MS',
                    'MG',
                    'PA',
                    'PB',
                    'PR',
                    'PE',
                    'PI',
                    'RJ',
                    'RN',
                    'RS',
                    'RO',
                    'RR',
                    'SC',
                    'SP',
                    'SE',
                    'TO'
                  ].map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </Form.Control>
              </Col>

              <Col md={2}>
                <Form.Label>Telefone Fixo:</Form.Label>
                <InputMask
                  mask="(99) 9999-9999"
                  className={`form-control ${errors.telefoneFixo ? 'is-invalid' : ''}`}
                  name="telefoneFixo"
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.telefoneFixo}</div>
              </Col>

              <Col md={2}>
                <Form.Label>Telefone Celular:</Form.Label>
                <InputMask mask="(99) 99999-9999" className="form-control" name="celular" onChange={handleChange} />
              </Col>

              <Col md={4}>
                <Form.Label>E-mail:</Form.Label>
                <Form.Control name="email" type="email" maxLength={100} isInvalid={!!errors.email} onChange={handleChange} />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Col>

              <Col md={6}>
                <Form.Label>Site:</Form.Label>
                <Form.Control name="site" maxLength={100} onChange={handleChange} />
              </Col>

              <Col md={12}>
                <Form.Label>Obs.: Descreva seu interesse em ser revendedor autorizado.</Form.Label>
                <Form.Control as="textarea" name="obs" rows={6} onChange={handleChange} />
              </Col>
            </Row>
            <hr></hr>
            <div className="d-flex justify-content-end mt-4">
              <Button className="color-button-primary mb-2" type="submit">
                <i className={'feather icon-mail'} />
                Enviar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      {loading && <LoadingOverlay />}
    </div>
  );
};

export default Revendedor;
