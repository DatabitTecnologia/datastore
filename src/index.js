// src/index.js
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ConfigProvider } from './contexts/ConfigContext';
import { ToastProvider } from 'react-toast-notifications';
import CustomToast from './components/CustomToast';

import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store';
import { DATABIT } from './config/constant';
import { Encode64, Decode64 } from 'datareact/src/utils/crypto';
import { checkFileExists } from 'datareact/src/utils/file';
import { getBrowserId } from 'datareact/src/utils/browser';
import { apiFind } from 'datareact/src/api/crudapi';

const configUrl = `${process.env.PUBLIC_URL}/config.json`;

(async () => {
  const exists = await checkFileExists(configUrl);

  if (!exists) {
    console.error('Arquivo de configuração não encontrado:', configUrl);
    return;
  }

  try {
    const response = await fetch(configUrl);
    const data = await response.json();

    localStorage.setItem('apikey_maps', Encode64(data.apikey_maps));
    localStorage.setItem('client_token_whats', Encode64(data.client_token_whats));
    localStorage.setItem('licensedatagrid', Encode64(data.licensedatagrid));
    localStorage.setItem('cnpj', data.cnpj);
    sessionStorage.setItem('system', Encode64(data.system.toString()));
    sessionStorage.setItem('ambiente', Encode64(data.ambiente.toString()));
    sessionStorage.setItem('urlconnect', Encode64(data.urlconnect));
    sessionStorage.setItem('version', Encode64(data.version));
    sessionStorage.setItem('dateversion', Encode64(data.dateversion));
    sessionStorage.setItem('cdu', Encode64(data.cdu));
    sessionStorage.setItem('logo', data.logo);
    sessionStorage.setItem('colorMenu', data.colorMenu);
    sessionStorage.setItem('colorMenuselec', data.colorMenuselec);
    sessionStorage.setItem('colorButtonprimary', data.colorButtonprimary);
    sessionStorage.setItem('colorButtonprimaryhover', data.colorButtonprimaryhover);
    sessionStorage.setItem('colorPrice', data.colorPrice);
    sessionStorage.setItem('colorFooter', data.colorFooter);
    sessionStorage.setItem('colorSection', data.colorSection);
    sessionStorage.setItem('colorSocial', data.colorSocial);
    sessionStorage.setItem('colorButtonfooter', data.colorButtonfooter);
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('enterprise', Encode64(data.enterprise));
    sessionStorage.setItem('nameenterprise', Encode64(data.nameenterprise));
    sessionStorage.setItem('coddatabit', Encode64(data.coddatabit));
    sessionStorage.setItem('url', Encode64(data.url));
    sessionStorage.setItem('parceiro', Encode64(data.parceiro));
    sessionStorage.setItem('operation', Encode64(data.operation));
    sessionStorage.setItem('payment', Encode64(data.payment));
    sessionStorage.setItem('client', Encode64(data.client));
    sessionStorage.setItem('nameclient', Encode64('DEFAULT'));
    sessionStorage.setItem('consumption', Encode64(data.consumption));
    sessionStorage.setItem('tableprice', Encode64(data.tableprice));
    sessionStorage.setItem('typeobs', Encode64(data.typeobs.toString()));
    sessionStorage.setItem('pricelogin', Encode64(data.pricelogin.toString()));
    sessionStorage.setItem('user', Encode64('DATASTORE'));
    sessionStorage.setItem('from', Encode64(data.email));
    sessionStorage.setItem('fromname', Encode64(data.emailName));
    sessionStorage.setItem('username', Encode64(data.emailUser));
    sessionStorage.setItem('smtp', Encode64(data.emailSmtp));
    sessionStorage.setItem('ssm', Encode64(data.emailPass));
    sessionStorage.setItem('port', data.emailPort);
    sessionStorage.setItem('tls', Encode64(data.emailTls.toString()));
    sessionStorage.setItem('fromseller', Encode64(data.emailRevenda));
    sessionStorage.setItem('signature', data.emailSignature);
    sessionStorage.setItem('seller', Encode64(data.seller));

    document.title = data.title;
    DATABIT.islogged = false;

    if (localStorage.getItem('client')) {
      const codcli = Decode64(localStorage.getItem('client'));
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
      if (cliente.condpag) sessionStorage.setItem('payment', Encode64(cliente.condpag));
      if (cliente.tipdesc) sessionStorage.setItem('operation', Encode64(cliente.tipdesc));
      sessionStorage.setItem('consumption', Encode64(naocontribuinte ? 'S' : 'N'));
      if (cliente.conceito) sessionStorage.setItem('tableprice', Encode64(cliente.conceito));
      if (cliente.vendedor) sessionStorage.setItem('seller', Encode64(cliente.vendedor));

      DATABIT.islogged = true;
    }

    // Aplicar estilos das cores
    const applyColor = (variable, value) => {
      if (value) {
        document.documentElement.style.setProperty(variable, value);
      }
    };

    applyColor('--colorMenu', sessionStorage.getItem('colorMenu'));
    applyColor('--colorMenuselec', sessionStorage.getItem('colorMenuselec'));
    applyColor('--colorButtonprimary', sessionStorage.getItem('colorButtonprimary'));
    applyColor('--colorButtonprimaryhover', sessionStorage.getItem('colorButtonprimaryhover'));
    applyColor('--colorPrice', sessionStorage.getItem('colorPrice'));
    applyColor('--colorFooter', sessionStorage.getItem('colorFooter'));
    applyColor('--colorSection', sessionStorage.getItem('colorSection'));
    applyColor('--colorSocial', sessionStorage.getItem('colorSocial'));
    applyColor('--colorButtonfooter', sessionStorage.getItem('colorButtonfooter'));

    // ID do navegador
    const browserResponse = await getBrowserId();
    if (!localStorage.getItem('idbrowser')) {
      localStorage.setItem('idbrowser', Encode64(browserResponse.visitorId));
    }

    // Renderização
    const container = document.getElementById('root');
    const root = createRoot(container);
    root.render(
      <Provider store={store}>
        <ConfigProvider>
          <ToastProvider placement="bottom-right" autoDismiss autoDismissTimeout={3000} components={{ Toast: CustomToast }}>
            <App />
          </ToastProvider>
        </ConfigProvider>
      </Provider>
    );

    reportWebVitals();
  } catch (error) {
    console.error('Erro ao carregar e processar o arquivo JSON:', error);
  }
})();
