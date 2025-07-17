import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row } from 'react-bootstrap';

import NavLeft from './NavLeft';
import NavRight from './NavRight';

import { ConfigContext } from '../../../contexts/ConfigContext';
import * as actionType from '../../../store/actions';
import { Decode64 } from 'datareact/src/utils/crypto';
import PainelFinanceiro from '../../../views/databit/carousel/financeiro';

const NavBar = () => {
  const [moreToggle, setMoreToggle] = useState(false);
  const configContext = useContext(ConfigContext);
  const { collapseMenu, headerBackColor, headerFixedLayout, layout, subLayout } = configContext.state;
  const { dispatch } = configContext;

  let headerClass = ['navbar', 'pcoded-header', 'navbar-expand-lg', headerBackColor];
  if (headerFixedLayout && layout === 'vertical') {
    headerClass = [...headerClass, 'headerpos-fixed'];
  }

  let toggleClass = ['mobile-menu'];
  if (collapseMenu) {
    toggleClass = [...toggleClass, 'on'];
  }

  const navToggleHandler = () => {
    dispatch({ type: actionType.COLLAPSE_MENU });
  };

  let moreClass = ['mob-toggler'];
  if (layout === 'horizontal') {
    moreClass = [...moreClass, ''];
  }
  let collapseClass = ['collapse navbar-collapse'];
  if (moreToggle) {
    moreClass = [...moreClass, 'on'];
    collapseClass = [...collapseClass, 'show'];
  }

  let navBar = (
    <React.Fragment>
      <div
        style={{
          justifyContent: 'space-between',
          backgroundColor: sessionStorage.getItem('colorMenu')
        }}
        className={collapseClass.join(' ')}
      >
        <div className="max-w-[1280px] mx-auto px-5" style={{ justifyContent: 'space-between', padding: '2px' }}>
          <img style={{ marginTop: '-20px' }} src={`data:image/png;base64,${sessionStorage.getItem('logo')}`} alt="Imagem" />
          <Link to="#" className={moreClass.join(' ')} onClick={() => setMoreToggle(!moreToggle)}>
            <i className="feather icon-more-vertical" />
          </Link>
          <NavLeft />
          <NavRight />
        </div>
      </div>
    </React.Fragment>
  );

  if (layout === 'horizontal' && subLayout === 'horizontal-2') {
    navBar = <div style={{ backgroundColor: sessionStorage.getItem('colorMenu') }}>{navBar}</div>;
  }

  return (
    <React.Fragment>
      <header className={headerClass.join(' ')}>{navBar}</header>
    </React.Fragment>
  );
};

export default NavBar;
