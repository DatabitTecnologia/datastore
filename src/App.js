import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api';
import { Decode64 } from 'datareact/src/utils/crypto';

// auth provider
import { JWTProvider as AuthProvider } from './contexts/JWTContext';

import routes, { renderRoutes } from './routes';

const App = () => {
  return (
    <LoadScript googleMapsApiKey={Decode64(localStorage.getItem('apikey_maps'))} libraries={['places']}>
      <React.Fragment>
        <BrowserRouter basename={process.env.REACT_APP_BASE_NAME}>
          <AuthProvider>{renderRoutes(routes)}</AuthProvider>
        </BrowserRouter>
      </React.Fragment>
    </LoadScript>
  );
};

export default App;
