import React, { useContext, useState } from 'react';
import { ListGroup, Dropdown, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useWindowSize from '../../../../hooks/useWindowSize';
import { ConfigContext } from '../../../../contexts/ConfigContext';

const NavLeft = () => {
  const windowSize = useWindowSize();
  const navigate = useNavigate();

  const configContext = useContext(ConfigContext);
  const { rtlLayout } = configContext.state;
  const [option, setOption] = useState(0);
  const [nameoption, setNameoption] = useState('Todos');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filter, setFilter] = useState('');

  let dropdownAlign = 'start';
  if (rtlLayout) {
    dropdownAlign = 'end';
  }

  let navItemClass = ['nav-item'];
  if (windowSize.width <= 575) {
    navItemClass = [...navItemClass, 'd-none'];
  }

  const handleOption = (param) => {
    setOption(param);
    setShowDropdown(false); // ⬅️ Fecha o dropdown
    switch (param) {
      case 0: {
        setNameoption('Todos');
        break;
      }
      case 1: {
        setNameoption('Produtos');
        break;
      }
      case 2: {
        setNameoption('Categorias');
        break;
      }
      case 3: {
        setNameoption('Sub-Categorias');
        break;
      }
      case 4: {
        setNameoption('Marcas');
        break;
      }
      case 5: {
        setNameoption('Modelos');
        break;
      }
    }
  };

  const handleChangefilter = (e) => {
    setFilter(e.target.value);
  };

  const Filtrar = () => {
    switch (option) {
      case 0: {
        navigate('/filter/?type=0&term=' + filter + '&name=' + filter);
        break;
      }
      case 1: {
        navigate('/filter/?type=1&term=' + filter + '&name=' + filter);
        break;
      }
      case 2: {
        navigate('/filter/?type=6&term=' + filter + '&name=' + filter);
        break;
      }
      case 3: {
        navigate('/filter/?type=7&term=' + filter + '&name=' + filter);
        break;
      }
      case 4: {
        navigate('/filter/?type=8&term=' + filter + '&name=' + filter);
        break;
      }
      case 5: {
        navigate('/filter/?type=9&term=' + filter + '&name=' + filter);
        break;
      }
    }
  };

  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav mr-auto">
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align={dropdownAlign} className="dropdown-databit" show={showDropdown} onToggle={(isOpen) => setShowDropdown(isOpen)}>
            <Dropdown.Toggle variant={'link'} id="dropdown-basic" className="dropdown-databit">
              {nameoption}
            </Dropdown.Toggle>
            <ul>
              <Dropdown.Menu>
                <li>
                  <Link onClick={() => handleOption(0)} className="dropdown-item">
                    Todos
                  </Link>
                </li>
                <li>
                  <Link onClick={() => handleOption(1)} className="dropdown-item">
                    Produtos
                  </Link>
                </li>
                <li>
                  <Link onClick={() => handleOption(2)} className="dropdown-item">
                    Categorias
                  </Link>
                </li>
                <li>
                  <Link onClick={() => handleOption(3)} className="dropdown-item">
                    Sub-Categorias
                  </Link>
                </li>
                <li>
                  <Link onClick={() => handleOption(4)} className="dropdown-item">
                    Marcas
                  </Link>
                </li>
                <li>
                  <Link onClick={() => handleOption(5)} className="dropdown-item">
                    Modelos
                  </Link>
                </li>
              </Dropdown.Menu>
            </ul>
          </Dropdown>
        </ListGroup.Item>
        <ListGroup.Item as="li" bsPrefix=" ">
          <input
            id="edtprocurar"
            style={{ width: '610px' }}
            onChange={(e) => handleChangefilter(e)}
            className="form-control"
            placeholder="Opção à procurar"
          />
        </ListGroup.Item>
        <ListGroup.Item as="li" bsPrefix=" ">
          <Button
            id="btnSearch"
            className="btn-icon color-button-primary"
            style={{ color: '#fff', textAlign: 'center', marginLeft: '-15px' }}
            onClick={() => Filtrar()}
          >
            <div role="status">
              <i className={'feather icon-search'} />
            </div>
          </Button>
        </ListGroup.Item>
      </ListGroup>
    </React.Fragment>
  );
};

export default NavLeft;
