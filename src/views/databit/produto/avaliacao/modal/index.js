import React, { useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { apiInsert } from 'datareact/src/api/crudapi';
import { LoadingOverlay } from '../../../../../utils/databit/screenprocess';
import { StarRatingInput } from '../../../../../components/StarRatingInput';

const ProdutoAvaliacaoModal = (props) => {
  const { produto, showavalia, setShowavalia } = props;
  const [form, setForm] = useState({ nota: 5, recomenda: 'S', obs: '', nome: '', email: '' });
  const [loading, setLoading] = React.useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const Salvar = async () => {
    // Verificações simples de campos obrigatórios
    if (!form.obs.trim()) {
      alert('Por favor, preencha o comentário sobre o produto.');
      return;
    }

    if (!form.nome.trim()) {
      alert('Por favor, informe seu nome.');
      return;
    }

    if (!form.email.trim()) {
      alert('Por favor, informe seu email.');
      return;
    }

    setLoading(true);
    const item = {
      produto: produto,
      nota: form.nota,
      recomenda: form.recomenda,
      obs: form.obs,
      nome: form.nome,
      email: form.email
    };
    const response = await apiInsert('ProdutoAvaliacao', item);
    if (response.status === 200) {
      setLoading(false);
      setShowavalia(false);
    }
  };

  return (
    <React.Fragment>
      <div>
        <Form>
          <Form.Group className="mb-3" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <StarRatingInput size={50} rating={form.nota} onChange={(value) => setForm((prev) => ({ ...prev, nota: value }))} />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Recomenda este Produto ?</Form.Label>
            <div className="custom-radio-group">
              <label className="custom-radio">
                <input type="radio" name="recomenda" value="S" checked={form.recomenda === 'S'} onChange={handleChange} />
                <span>Sim</span>
              </label>

              <label className="custom-radio">
                <input type="radio" name="recomenda" value="N" checked={form.recomenda === 'N'} onChange={handleChange} />
                <span>Não</span>
              </label>
            </div>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Comente sobre o Produto:</Form.Label>
            <Form.Control as="textarea" rows={7} name="obs" value={form.obs} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nome:</Form.Label>
            <Form.Control type="text" name="nome" value={form.nome} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email:</Form.Label>
            <Form.Control type="email" name="email" value={form.email} onChange={handleChange} />
          </Form.Group>
          <hr></hr>
          <Row style={{ textAlign: 'right' }}>
            <Col>
              <Button className="color-button-primary mb-2" onClick={(e) => Salvar()}>
                <i className="feather icon-save" /> Salvar avaliação
              </Button>
            </Col>
          </Row>
        </Form>
        {loading && <LoadingOverlay />}
      </div>
    </React.Fragment>
  );
};

export default ProdutoAvaliacaoModal;
