import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';

import GuestGuard from './components/Auth/GuestGuard';
import AuthGuard from './components/Auth/AuthGuard';

import { BASE_URL } from './config/constant';

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

const routes = [
  {
    layout: AdminLayout,
    exact: 'true',
    path: '/filter',
    element: lazy(() => import('./views/databit/filter'))
  },
  {
    layout: AdminLayout,
    exact: 'true',
    path: '/produto',
    element: lazy(() => import('./views/databit/produto'))
  },
  {
    layout: AdminLayout,
    exact: 'true',
    path: '/revendedor',
    element: lazy(() => import('./views/databit/revendedor'))
  },
  {
    layout: AdminLayout,
    exact: 'true',
    path: '/localizacao',
    element: lazy(() => import('./views/databit/revendedor/localizacao'))
  },
  {
    layout: AdminLayout,
    exact: 'true',
    path: '/login',
    element: lazy(() => import('./views/databit/login'))
  },
  {
    layout: AdminLayout,
    exact: 'true',
    path: '/loginreset',
    element: lazy(() => import('./views/databit/login/reset'))
  },
  {
    layout: AdminLayout,
    exact: 'true',
    path: '/newpass',
    element: lazy(() => import('./views/databit/login/newpass'))
  },
  {
    layout: AdminLayout,
    exact: 'true',
    path: '/logincadastro',
    element: lazy(() => import('./views/databit/login/cadastro'))
  },
  {
    layout: AdminLayout,
    exact: 'true',
    path: '/logincompra',
    element: lazy(() => import('./views/databit/login/compra'))
  },
  {
    layout: AdminLayout,
    exact: 'true',
    path: '/loginproduto',
    element: lazy(() => import('./views/databit/login/produto'))
  },
  {
    layout: AdminLayout,
    exact: 'true',
    path: '/loginbeneficio',
    element: lazy(() => import('./views/databit/login/beneficio'))
  },
  {
    layout: AdminLayout,
    exact: 'true',
    path: '/loginfinanceiro',
    element: lazy(() => import('./views/databit/login/financeiro'))
  },
  {
    layout: AdminLayout,
    exact: 'true',
    path: '/logincredito',
    element: lazy(() => import('./views/databit/login/credito'))
  },
  {
    layout: AdminLayout,
    exact: 'true',
    path: '/carrinho',
    element: lazy(() => import('./views/databit/carrinho'))
  },
  {
    layout: AdminLayout,
    exact: 'true',
    path: '/sucesso',
    element: lazy(() => import('./views/databit/carrinho/sucesso'))
  },
  {
    exact: 'true',
    path: '/404',
    element: lazy(() => import('./views/errors/NotFound404'))
  },
  {
    exact: 'true',
    path: '/maintenance/coming-soon',
    element: lazy(() => import('./views/maintenance/ComingSoon'))
  },
  {
    exact: 'true',
    path: '/maintenance/error',
    element: lazy(() => import('./views/maintenance/Error'))
  },
  {
    exact: 'true',
    path: '/maintenance/offline-ui',
    element: lazy(() => import('./views/maintenance/OfflineUI'))
  },
  {
    layout: AdminLayout,
    exact: 'true',
    path: '/auth/signin-1',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    layout: AdminLayout,
    exact: 'true',
    path: '/auth/signup-1',
    element: lazy(() => import('./views/auth/signup/SignUp1'))
  },
  {
    exact: 'true',
    path: '/auth/reset-password-1',
    element: lazy(() => import('./views/auth/reset-password/ResetPassword1'))
  },
  {
    exact: 'true',
    path: '/auth/change-password',
    element: lazy(() => import('./views/auth/ChangePassword'))
  },
  {
    exact: 'true',
    path: '/auth/profile-settings',
    element: lazy(() => import('./views/auth/ProfileSettings'))
  },

  {
    path: '*',
    layout: AdminLayout,
    guard: AuthGuard,
    routes: [
      {
        exact: 'true',
        path: '/index',
        element: lazy(() => import('./views/databit/principal'))
      },

      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      }
    ]
  }
];

export default routes;
