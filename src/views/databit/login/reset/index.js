import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';
import { useNavigate } from 'react-router-dom';
import lock from '../../../../assets/images/user/lock.png';
import { apiFind } from 'datareact/src/api/crudapi';
import { LoadingOverlay } from '../../../../utils/databit/screenprocess';
import { apiSendEmail } from 'datareact/src/api/apiemail';

const LoginReset = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const { addToast } = useToasts();
  const [loading, setLoading] = React.useState(false);

  const onReset = async () => {
    if (!email) {
      addToast('Email é de preenchimento obrigatório !', {
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
      const baseUrl = window.location.origin + '/newpass';
      const texto = `Prezado Revendedor !

      Segue o link ${baseUrl} para criar uma nova senha !

      * * * NÃO HÁ NECESSIDADE DE RESPONDER ESTE EMAIL * * *`;

      apiSendEmail(null, email, 'Recuperação de Senha', texto, undefined).then((response) => {
        if (response.status === 200) {
          setLoading(false);
          addToast('Senha resetada com sucesso, favor verificar na sua caixa de Email, o link para criação de uma nova senha !', {
            placement: 'bottom-rigth',
            appearance: 'success',
            autoDismiss: true
          });
        }
      });
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
                <img src={lock} alt="lock images" className="img-fluid" />
              </div>
              <div className="col-md-8 col-lg-6">
                <div className="card-body text-center">
                  <div className="row justify-content-center">
                    <div className="col-sm-10">
                      <h4 className="mb-4">Resetar senha</h4>
                      <div className="input-group mb-4">
                        <input type="email" className="form-control" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                      </div>
                      <Button className="color-button-primary shadow-2 mb-4" onClick={(e) => onReset()}>
                        <i className={'feather icon-mail'} />
                        Resetar Senha
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

export default LoginReset;
