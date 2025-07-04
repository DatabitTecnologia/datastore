// src/index.js
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ConfigProvider } from './contexts/ConfigContext';

import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store';
import { DATABIT } from './config/constant';
import { Encode64 } from 'datareact/src/utils/crypto';
import { checkFileExists } from 'datareact/src/utils/file';
import { getBrowserId } from 'datareact/src/utils/browser';

const configUrl = `${process.env.PUBLIC_URL}/config.json`;

checkFileExists(configUrl).then((exists) => {
  if (exists) {
    fetch(configUrl)
      .then((response) => response.json())
      .then((data) => {
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
        sessionStorage.setItem('parceiro', data.parceiro);
        sessionStorage.setItem('operation', Encode64(data.operation));
        sessionStorage.setItem('payment', Encode64(data.payment));
        sessionStorage.setItem('client', Encode64(data.client));
        sessionStorage.setItem('consumption', Encode64(data.consumption));
        sessionStorage.setItem('tablePrice', Encode64(data.tablePrice));
        sessionStorage.setItem('typeObs', Encode64(data.typeObs.toString()));
        sessionStorage.setItem('priceLogin', Encode64(data.priceLogin.toString()));

        document.title = data.title;
        DATABIT.islogged = false;
        // Definição de Cores
        const colorMenu = sessionStorage.getItem('colorMenu');
        const colorMenuselec = sessionStorage.getItem('colorMenuselec');
        const colorButtonprimary = sessionStorage.getItem('colorButtonprimary');
        const colorButtonprimaryhover = sessionStorage.getItem('colorButtonprimaryhover');
        const colorPrice = sessionStorage.getItem('colorPrice');
        const colorFooter = sessionStorage.getItem('colorFooter');
        const colorSection = sessionStorage.getItem('colorSection');
        const colorSocial = sessionStorage.getItem('colorSocial');
        const colorButtonfooter = sessionStorage.getItem('colorButtonfooter');

        if (colorMenu) {
          document.documentElement.style.setProperty('--colorMenu', colorMenu);
        }
        if (colorMenuselec) {
          document.documentElement.style.setProperty('--colorMenuselec', colorMenuselec);
        }
        if (colorButtonprimary) {
          document.documentElement.style.setProperty('--colorButtonprimary', colorButtonprimary);
        }
        if (colorButtonprimaryhover) {
          document.documentElement.style.setProperty('--colorButtonprimaryhover', colorButtonprimaryhover);
        }
        if (colorPrice) {
          document.documentElement.style.setProperty('--colorPrice', colorPrice);
        }
        if (colorFooter) {
          document.documentElement.style.setProperty('--colorFooter', colorFooter);
        }
        if (colorSection) {
          document.documentElement.style.setProperty('--colorSection', colorSection);
        }
        if (colorSocial) {
          document.documentElement.style.setProperty('--colorSocial', colorSocial);
        }
        if (colorButtonfooter) {
          document.documentElement.style.setProperty('--colorButtonfooter', colorButtonfooter);
        }

        getBrowserId().then((response) => {
          let id = localStorage.getItem('idbrowser');
          if (!id) {
            localStorage.setItem('idbrowser', Encode64(response.visitorId));
          }
        });
        // ✅ Só renderiza agora
        const container = document.getElementById('root');
        const root = createRoot(container);
        root.render(
          <Provider store={store}>
            <ConfigProvider>
              <App />
            </ConfigProvider>
          </Provider>
        );

        reportWebVitals();
      })
      .catch((error) => {
        console.error('Erro ao carregar o arquivo JSON:', error);
      });
  } else {
    console.error('Arquivo de configuração não encontrado:', configUrl);
  }
});
