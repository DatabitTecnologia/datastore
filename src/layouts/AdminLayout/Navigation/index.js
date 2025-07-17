import React, { useContext, useEffect, useState } from 'react';
import { ConfigContext } from '../../../contexts/ConfigContext';
import { Row, Col } from 'react-bootstrap';
import useWindowSize from '../../../hooks/useWindowSize';

import NavLogo from './NavLogo';
import NavContent from './NavContent';
import { gerarMenu, gerarMenurevenda } from '../../../utils/databit/menu';
import { DATABIT } from '../../../config/constant';
import PainelFinanceiro from '../../../views/databit/carousel/financeiro';

const Navigation = () => {
  const configContext = useContext(ConfigContext);
  const [menu, setMenu] = useState({ items: [] });
  const [menurevenda, setMenurevenda] = useState({ items: [] });

  const windowSize = useWindowSize();

  useEffect(() => {
    console.log(DATABIT.islogged);
    const handleCarregarMenu = async () => {
      const menufim = await gerarMenu();
      setMenu(menufim);
      const menurevfim = await gerarMenurevenda();
      console.log(menurevfim);
      setMenurevenda(menurevfim);
    };
    handleCarregarMenu();
  }, []);

  const {
    layout,
    layoutType,
    navFixedLayout,
    collapseMenu,
    rtlLayout,
    boxLayout,
    subLayout,
    navBackColor,
    navDropdownIcon,
    navBrandColor,
    navListIcon,
    navActiveListColor,
    navListTitleColor,
    navBackImage,
    navIconColor,
    navListTitleHide,
    layout6Background,
    layout6BackSize
  } = configContext.state;

  let navClass = ['pcoded-navbar'];

  if (subLayout && !['layout-6', 'layout-8', 'horizontal-2'].includes(subLayout)) {
    navClass.push(subLayout);
  } else {
    navClass.push(
      layoutType,
      navBackColor,
      navBrandColor,
      'drp-icon-' + navDropdownIcon,
      'menu-item-icon-' + navListIcon,
      navActiveListColor,
      navListTitleColor
    );

    if (navBackImage) navClass.push(navBackImage);
    if (navIconColor) navClass.push('icon-colored');
    if (!navFixedLayout && layout !== 'horizontal') navClass.push('menupos-static');
    if (navListTitleHide) navClass.push('caption-hide');
  }

  if (layout === 'horizontal') navClass.push('theme-horizontal');
  if (windowSize.width < 992 && collapseMenu) navClass.push('mob-open');
  else if (collapseMenu) navClass.push('navbar-collapsed');

  if (subLayout === 'layout-6') {
    document.body.classList.add('layout-6');
    document.body.style.backgroundImage = layout6Background;
    document.body.style.backgroundSize = layout6BackSize;
  }

  if (subLayout === 'layout-8') {
    document.body.classList.add('layout-8');
  }

  if (layoutType === 'dark') document.body.classList.add('datta-dark');
  else document.body.classList.remove('datta-dark');

  if (rtlLayout) document.body.classList.add('datta-rtl');
  else document.body.classList.remove('datta-rtl');

  if (boxLayout) {
    document.body.classList.add('container', 'box-layout');
  } else {
    document.body.classList.remove('container', 'box-layout');
  }

  const navBarClass = ['navbar-wrapper'];
  if (layout === 'horizontal' && subLayout === 'horizontal-2') {
    navBarClass.push('container');
  }

  const navContent = (
    <div className={navBarClass.join(' ')}>
      <NavLogo />
      <div
        style={{
          marginTop: '12px',
          maxWidth: '1320px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        {!DATABIT.islogged ? (
          <NavContent navigation={menu.items || []} navigationright={menurevenda.items || []} />
        ) : (
          <NavContent navigation={menu.items || []} navigationright={[]} />
        )}
        {DATABIT.islogged && <PainelFinanceiro></PainelFinanceiro>}
      </div>
    </div>
  );

  return (
    <React.Fragment>
      <nav className={navClass.join(' ')}>{navContent}</nav>
    </React.Fragment>
  );
};

export default Navigation;
