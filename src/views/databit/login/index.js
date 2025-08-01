import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';
import { useNavigate } from 'react-router-dom';
import lock from '../../../assets/images/user/lock.png';
import { apiFind } from 'datareact/src/api/crudapi';
import { LoadingOverlay } from '../../../utils/databit/screenprocess';
import { Encode64 } from 'datareact/src/utils/crypto';
import { DATABIT } from '../../../config/constant';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { addToast } = useToasts();
  const [loading, setLoading] = React.useState(false);
  const [salvarCredenciais, setSalvarCredenciais] = useState(false);

  const onLogin = async () => {
    if (!email) {
      addToast('Email é de preenchimento obrigatório !', {
        placement: 'bottom-rigth',
        appearance: 'success',
        autoDismiss: true
      });
      return;
    }
    if (!password) {
      addToast('Senha é de preenchimento obrigatório !', {
        placement: 'bottom-rigth',
        appearance: 'success',
        autoDismiss: true
      });
      return;
    }
    const filter =
      "TB01066_EMAIL = '" +
      email +
      "' and TB01066_SENHA = '" +
      password +
      "' and exists (SELECT TB01008_CODIGO FROM TB01008 WHERE TB01008_SITUACAO = 'A' AND TB01008_CODIGO = TB01066_CODCLI) ";
    setLoading(true);
    const response = await apiFind('ClienteUser', '*', '', filter);
    const user = response.data;

    if (!user) {
      setLoading(false);
      addToast('Usuário ou senha inválidos !', {
        placement: 'bottom-rigth',
        appearance: 'success',
        autoDismiss: true
      });
      return;
    } else {
      const codcli = user.codcli;
      const responsecli = await apiFind(
        'Cliente',
        'TB01008_NOME,TB01008_CONCEITO,TB01008_CONDPAG,TB01008_TIPDESC,TB01008_INSCEST,TB01008_NAOCONTRIBUINTE,TB01008_VENDEDOR',
        '',
        "TB01008_CODIGO = '" + codcli + "' "
      );
      const cliente = responsecli.data;
      const naocontribuinte =
        cliente.inscest === null || cliente.inscest === '' || cliente.inscest === 'ISENTO' || cliente.naocontribuinte === 'S';
      sessionStorage.setItem('client', Encode64(codcli));
      sessionStorage.setItem('nameclient', Encode64(cliente.nome));
      if (cliente.condpag) {
        sessionStorage.setItem('payment', Encode64(cliente.condpag));
      }
      if (cliente.tipdesc) {
        sessionStorage.setItem('operation', Encode64(cliente.tipdesc));
      }
      if (naocontribuinte) {
        sessionStorage.setItem('consumption', Encode64('S'));
      } else {
        sessionStorage.setItem('consumption', Encode64('N'));
      }
      if (cliente.conceito) {
        sessionStorage.setItem('tableprice', Encode64(cliente.conceito));
      }
      if (cliente.vendedor) {
        sessionStorage.setItem('seller', Encode64(cliente.vendedor));
      }
      if (salvarCredenciais) {
        localStorage.setItem('client', Encode64(codcli));
      }
      DATABIT.islogged = true;
      navigate('/index');
      setLoading(false);
    }
  };

  const handleCheckboxChange = (e) => {
    setSalvarCredenciais(e.target.checked);
  };

  return (
    <React.Fragment>
      <div style={{ marginTop: '10px' }}>
        <div
          className="auth-content subscribe"
          style={{
            maxWidth: '800px',
            margin: '0 auto' // centraliza horizontalmente
          }}
        >
          <div className="card" style={{ borderRadius: '12px' }}>
            <div className="row no-gutters">
              <div
                className="col-md-4 col-lg-6 d-none d-md-flex d-lg-flex theme-bg align-items-center justify-content-center"
                style={{ borderRadius: '12px' }}
              >
                <img src={lock} alt="lock images" className="img-fluid" />
              </div>
              <div className="col-md-8 col-lg-6">
                <div className="card-body text-center">
                  <div className="row justify-content-center">
                    <div className="col-sm-10">
                      <h4 className="mb-5">Acesso Revendedor</h4>
                      <div className="input-group mb-3">
                        <input type="email" className="form-control" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                      </div>
                      <div className="input-group mb-4">
                        <input type="password" className="form-control" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} />
                      </div>
                      <div className="form-group text-start pb-3" style={{ textAlign: 'center' }}>
                        <label className="checkbox-modern" style={{ marginBottom: '10px', display: 'block' }}>
                          <input type="checkbox" checked={salvarCredenciais} onChange={handleCheckboxChange} />
                          <span className="checkmark"></span>
                          Salvar credenciais
                        </label>
                      </div>
                      <Button className="color-button-primary shadow-2 mb-4" onClick={(e) => onLogin()}>
                        <i className={'feather icon-log-in'} />
                        Login
                      </Button>
                      <p className="mb-2 text-muted">
                        Esqueceu a senha ? <NavLink to="/loginreset">Acesse aqui</NavLink>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading && <LoadingOverlay />}
    </React.Fragment>
  );
};

export default Login;
