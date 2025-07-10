import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';
import { useNavigate } from 'react-router-dom';
import user from '../../../../assets/images/user/user.png';
import { apiFind, apiUpdate } from 'datareact/src/api/crudapi';
import { LoadingOverlay } from '../../../../utils/databit/screenprocess';

const NewPass = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const { addToast } = useToasts();
  const [loading, setLoading] = React.useState(false);
  const [password, setPassword] = useState();
  const [password2, setPassword2] = useState();

  const updatePass = async () => {
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
    if (!password2) {
      addToast('Confirmação de senha é de preenchimento obrigatório !', {
        placement: 'bottom-rigth',
        appearance: 'success',
        autoDismiss: true
      });
      return;
    }
    if (password !== password2) {
      addToast('As senhas não conferem !', {
        placement: 'bottom-rigth',
        appearance: 'success',
        autoDismiss: true
      });
      return;
    }

    const filter =
      "TB01066_EMAIL = '" +
      email +
      "' and exists (SELECT TB01008_CODIGO FROM TB01008 WHERE TB01008_SITUACAO = 'A' AND TB01008_CODIGO = TB01066_CODCLI AND TB01008_REVENDAAUTORIZADA = 'S') ";
    setLoading(true);
    const response = await apiFind('ClienteUser', '*', '', filter);
    const user = response.data;

    if (!user) {
      setLoading(false);
      addToast('Email não encontrado !', {
        placement: 'bottom-rigth',
        appearance: 'success',
        autoDismiss: true
      });
      return;
    } else {
      const item = {
        email: email,
        senha: password,
        codcli: user.codcli,
        coduser: user.coduser
      };
      const responseupdate = await apiUpdate('ClienteUser', item);
      if (responseupdate.status === 200) {
        setLoading(false);
        addToast('Operação realizada com Sucesso !', {
          placement: 'bottom-rigth',
          appearance: 'success',
          autoDismiss: true
        });
        navigate('/login');
      }
    }
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
                <img src={user} alt="user images" className="img-fluid" />
              </div>
              <div className="col-md-8 col-lg-6">
                <div className="card-body text-center">
                  <div className="row justify-content-center">
                    <div className="col-sm-10">
                      <h4 className="mb-4">Nova senha</h4>
                      <div className="input-group mb-4">
                        <input type="email" className="form-control" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                      </div>
                      <div className="input-group mb-4">
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Digite a nova senha"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <div className="input-group mb-4">
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Confirmar nova senha"
                          onChange={(e) => setPassword2(e.target.value)}
                        />
                      </div>
                      <Button className="color-button-primary shadow-2 mb-4" onClick={(e) => updatePass()}>
                        <i className={'feather icon-save'} />
                        Alterar Senha
                      </Button>
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

export default NewPass;
