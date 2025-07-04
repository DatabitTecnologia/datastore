import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import Slider from '@mui/material/Slider';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useLocation } from 'react-router-dom';
import { List, Grid3X3, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiList, apiGetPicturelist } from 'datareact/src/api/crudapi';
import { capitalizeText } from 'datareact/src/utils/capitalize';
import Dropdown from '../../../components/Dropdown';
import { LoadingOverlay } from '../../../utils/databit/screenprocess';
import { Decode64 } from 'datareact/src/utils/crypto';
import { StarRatingView } from '../../../components/StarRatingView';

const FilterProd = (props) => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [grupos, setGrupos] = React.useState([]);
  const [subgrupos, setSubrupos] = React.useState([]);
  const [marcas, setMarcas] = React.useState([]);
  const [modelo, setmodelo] = React.useState([]);
  const [marcascomp, setMarcascomp] = React.useState([]);
  const [valuemax, setValuemax] = React.useState(0);
  const [price, setPrice] = React.useState([0, 10000]);
  const [view, setView] = React.useState('list'); // 'grid' ou 'list'
  const [loading, setLoading] = React.useState(false);
  const location = useLocation();
  const [namefilter, setNamefilter] = React.useState('');
  const [grupofilter, setGrupofilter] = React.useState('');
  const [subgrupofilter, setSubgrupofilter] = React.useState('');
  const [marcafilter, setMarcafilter] = React.useState('');
  const [modelofilter, setModelofilter] = React.useState('');
  const [grupofiltername, setGrupofiltername] = React.useState('');
  const [subgrupofiltername, setSubgrupofiltername] = React.useState('');
  const [marcafiltername, setMarcafiltername] = React.useState('');
  const [modelofiltername, setModelofiltername] = React.useState('');
  const [order, setOrder] = React.useState(1);
  const [typefilter, setTypefilter] = React.useState(-1);

  useEffect(() => {
    window.scrollTo(0, 0); // scrolla para o topo
  }, [location]); // executa toda vez que a URL mudar

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    listFilter();
    Filtrar(parseInt(params.get('type')), params.get('term'), params.get('name'));
    if (params.get('type')) {
      setTypefilter(parseInt(params.get('type')));
    } else {
      setTypefilter(-1);
    }
  }, [location.search]);

  const listFilter = async () => {
    setLoading(true);
    const responsegrupo = await apiList('GrupoWebVW', '*', '', ' 0 = 0 order by nome');
    setGrupos(responsegrupo.data);
    const responsesubgrupo = await apiList('SubgrupoWebVW', '*', '', ' 0 = 0 order by nome');
    setSubrupos(responsesubgrupo.data);
    const responsemarca = await apiList('MarcaWebVW', '*', '', ' 0 = 0 order by nome');
    setMarcas(responsemarca.data);
    const responsemodelo = await apiList('MarcaCompatibilidadeVW', '*', '', ' 0 = 0 order by nomemarca,nomequip');
    setmodelo(responsemodelo.data);
    const resultmodelo = responsemodelo.data;
    const marcasUnicas = [];
    const marcaSet = new Set();

    resultmodelo.forEach((item) => {
      const chave = `${item.codigomarca}|${item.nomemarca}`;
      if (!marcaSet.has(chave)) {
        marcaSet.add(chave);
        marcasUnicas.push({
          codigomarca: item.codigomarca,
          nomemarca: item.nomemarca
        });
      }
    });
    setMarcascomp(marcasUnicas);
    setLoading(false);
  };

  const handlePrice = (event, newValue) => {
    setPrice(newValue);
  };

  const toggleView = () => {
    setView((prev) => (prev === 'grid' ? 'list' : 'grid'));
  };

  const isGrid = view === 'grid';

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(value);
  };

  const Filtrar = async (type = -1, term = null, name = null) => {
    setLoading(true);
    setNamefilter('');
    let filter = ' 0 = 0 ';
    let tmpfilter = '';
    if (type !== -1) {
      switch (type) {
        case 0: {
          // Pesquisa aproximada (Geral)
          tmpfilter += 'Geral => ' + name;
          filter += ' and (';
          filter += "(nome like '%" + term + "%') or ";
          filter += "(nomegrupo like '%" + term + "%') or ";
          filter += "(nomesubgrupo like '%" + term + "%') or ";
          filter += "(nomemarca like '%" + term + "%')";
          filter += ' )';
          break;
        }
        case 1: {
          // Pesquisa aproximada (Produto)
          tmpfilter += 'Produto => ' + name;
          filter += ' and (';
          filter += "(nome like '%" + term + "%') ";
          filter += ' )';
          break;
        }
        case 2: {
          // Pesquisa exata (Grupo)
          tmpfilter += 'Categoria => ' + name;
          filter += " and ((grupo = '" + term + "') ";
          filter += " or (exists(select tb01058_produto from tb01058 where tb01058_produto = codigo and tb01058_grupo = '" + term + "'))) ";
          break;
        }
        case 3: {
          // Pesquisa exata (Sub-Grupo)
          tmpfilter += 'Sub-Categoria => ' + name;
          filter += " and ((subgrupo = '" + term + "') ";
          filter +=
            " or (exists(select tb01058_produto from tb01058 where tb01058_produto = codigo and tb01058_subgrupo = '" + term + "'))) ";
          break;
        }
        case 4: {
          // Pesquisa exata (Marca)
          tmpfilter += 'Marca => ' + name;
          filter += " and ((marca = '" + term + "') ";
          filter += " or (exists(select tb01058_produto from tb01058 where tb01058_produto = codigo and tb01058_marca = '" + term + "'))) ";
          break;
        }
        case 5: {
          // Pesquisa exata (modelo)
          tmpfilter += 'Modelo => ' + name;
          filter +=
            " and exists (select tb01031_codigoproduto from tb01031 where codigo = tb01031_codigo and tb01031_codigoproduto = '" +
            term +
            "')";
          break;
        }
        case 6: {
          // Pesquisa aproximada (Grupo)
          tmpfilter += 'Categoria => ' + name;
          filter += " and ((nomegrupo like '%" + term + "%') ";
          filter +=
            " or (exists(select tb01058_produto from vw01037 where tb01058_produto = codigo and tb01002_nome like '" + term + "%'))) ";
          break;
        }
        case 7: {
          // Pesquisa aproximada (SubGrupo)
          tmpfilter += 'Sub-Categoria => ' + name;
          filter += " and ((nomesubgrupo like '%" + term + "%')";
          filter +=
            " or (exists(select tb01058_produto from vw01037 where tb01058_produto = codigo and tb01018_nome like '" + term + "%'))) ";
          break;
        }
        case 8: {
          // Pesquisa aproximada (Marca)
          tmpfilter += 'Marca => ' + name;
          filter += " and ((nomemarca like '%" + term + "%') ";
          filter +=
            " or (exists(select tb01058_produto from vw01037 where tb01058_produto = codigo and tb01047_nome like '%" + term + "%'))) ";
          break;
        }
        case 9: {
          // Pesquisa aproximada (modelo)
          tmpfilter += 'Modelo => ' + name;
          filter += " and exists (select tb01031_codigo from vw01102 where codigo = tb01031_codigo and tb01010_nome like '%" + term + "%')";
          break;
        }
      }
      setNamefilter(tmpfilter);
    } else {
      if (grupofilter !== '') {
        tmpfilter += ' Categoria => ' + grupofiltername;
        filter += " and ((charindex(grupo,'" + grupofilter + "') > 0) ";
        filter +=
          " or (exists(select tb01058_produto from tb01058 where tb01058_produto = codigo and charindex(grupo,'" +
          grupofilter +
          "') > 0))) ";
      }
      if (subgrupofilter !== '') {
        tmpfilter += ' SubCategoria => ' + subgrupofiltername;
        filter += " and ((charindex(subgrupo,'" + subgrupofilter + "') > 0) ";
        filter +=
          " or (exists(select tb01058_produto from tb01058 where tb01058_produto = codigo and charindex(subgrupo,'" +
          subgrupofilter +
          "') > 0))) ";
      }
      if (marcafilter !== '') {
        tmpfilter += ' Marca => ' + marcafiltername;
        filter += " and ((charindex(marca,'" + marcafilter + "') > 0) ";
        filter +=
          " or (exists(select tb01058_produto from tb01058 where tb01058_produto = codigo and charindex(marca,'" +
          marcafilter +
          "') > 0))) ";
      }
      if (modelofilter !== '') {
        tmpfilter += ' Modelo => ' + modelofiltername;
        filter += " and ((charindex(codigo,'" + modelofilter + "') > 0) ";
        filter +=
          " or exists (select tb01031_codigoproduto from tb01031 where codigo = tb01031_codigo and charindex(tb01031_codigoproduto,'" +
          modelofilter +
          "') > 0)) ";
      }
      if (price[0] !== 0 || price[1] !== valuemax) {
        tmpfilter += ' Faixa => ' + formatCurrency(price[0]) + ' até ' + formatCurrency(price[1]);
        filter += ' and venda between ' + price[0].toString() + ' and ' + price[1].toString();
      }
      setNamefilter(tmpfilter);
    }

    switch (parseInt(order)) {
      case 1: {
        filter += ' order by nome';
        break;
      }
      case 2: {
        filter += ' order by nome desc';
        break;
      }
      case 3: {
        filter += ' order by venda';
        break;
      }
      case 4: {
        filter += ' order by venda desc';
        break;
      }
    }

    const enterprise = Decode64(sessionStorage.getItem('enterprise'));
    const operation = Decode64(sessionStorage.getItem('operation'));
    const payment = Decode64(sessionStorage.getItem('payment'));
    const client = Decode64(sessionStorage.getItem('client'));
    const consumption = Decode64(sessionStorage.getItem('consumption'));
    const tablePrice = Decode64(sessionStorage.getItem('tablePrice'));

    const response = await apiGetPicturelist(
      "FT02021('" +
        enterprise +
        "','" +
        operation +
        "','" +
        payment +
        "','" +
        client +
        "','" +
        consumption +
        "','" +
        tablePrice +
        "','N',null,'S')",
      'codigo',
      'foto',
      filter,
      'codigo,referencia,codbarras,codauxiliar,nome,venda,grupo,subgrupo,marca,nomegrupo,nomesubgrupo,nomemarca,obs,obsint,obsfull,avaliacao',
      '',
      'S'
    );
    if (response.status === 200) {
      setRows(response.data);
      const itens = response.data;
      const maiorValor = itens.length > 0 ? Math.max(...itens.map((item) => item.venda)) : 0;
      if (maiorValor > valuemax) {
        setValuemax(maiorValor);
        setPrice([0, maiorValor]);
      }
      setLoading(false);
    }
  };

  const typeObs = (item) => {
    switch (parseInt(Decode64(sessionStorage.getItem('typeObs')))) {
      case 1: {
        return item.obs;
      }
      case 2: {
        return item.obsint;
      }
      case 3: {
        return item.obsfull;
      }
    }
  };

  const handleGrupo = (e, codigo, nome) => {
    let tmpgrupo = grupofilter;
    let tmpgruponame = grupofiltername;
    if (e.target.checked) {
      tmpgrupo += codigo + ',';
      tmpgruponame += nome + ',';
    } else {
      tmpgrupo = tmpgrupo.replace(codigo + ',', '');
      tmpgruponame = tmpgruponame.replace(nome + ',', '');
    }
    setGrupofilter(tmpgrupo);
    setGrupofiltername(tmpgruponame);
  };

  const handleSubgrupo = (e, codigo, nome) => {
    let tmpsubgrupo = subgrupofilter;
    let tmpsubgruponame = subgrupofiltername;
    if (e.target.checked) {
      tmpsubgrupo += codigo + ',';
      tmpsubgruponame += nome + ',';
    } else {
      tmpsubgrupo = tmpsubgrupo.replace(codigo + ',', '');
      tmpsubgruponame = tmpsubgruponame.replace(nome + ',', '');
    }
    setSubgrupofilter(tmpsubgrupo);
    setSubgrupofiltername(tmpsubgruponame);
  };

  const handleMarca = (e, codigo, nome) => {
    let tmpmarca = marcafilter;
    let tmpmarcaname = marcafiltername;
    if (e.target.checked) {
      tmpmarca += codigo + ',';
      tmpmarcaname += nome + ',';
    } else {
      tmpmarca = tmpmarca.replace(codigo + ',', '');
      tmpmarcaname = tmpmarcaname.replace(nome + ',', '');
    }
    setMarcafilter(tmpmarca);
    setMarcafiltername(tmpmarcaname);
  };

  const handleModelo = (e, codigo, nome) => {
    let tmpmodelo = modelofilter;
    let tmpmodeloname = modelofiltername;
    if (e.target.checked) {
      tmpmodelo += codigo + ',';
      tmpmodeloname += nome + ',';
    } else {
      tmpmodelo = tmpmodelo.replace(codigo + ',', '');
      tmpmodeloname = tmpmodeloname.replace(nome + ',', '');
    }
    setModelofilter(tmpmodelo);
    setModelofiltername(tmpmodeloname);
  };

  const handleOrder = (value) => {
    setOrder(parseInt(value));

    // Cria uma cópia do array original
    let tmprows = [...rows];

    switch (parseInt(value)) {
      case 1: // ordem alfabética crescente
        tmprows.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      case 2: // ordem alfabética decrescente
        tmprows.sort((a, b) => b.nome.localeCompare(a.nome));
        break;
      case 3: // preço unitário crescente
        tmprows.sort((a, b) => a.venda - b.venda);
        break;
      case 4: // preço unitário decrescente
        tmprows.sort((a, b) => b.venda - a.venda);
        break;
      default:
        break;
    }
    setRows(tmprows);
  };

  return (
    <React.Fragment>
      <div id="frmfilter" name="frmfilter">
        <Row>
          <Col lg={10}>
            <p className="label-result" style={{ textAlign: 'left', marginBottom: '10px' }}>
              Resultados para : {namefilter}
            </p>
          </Col>
          <Col lg={2}>
            <p className="label-result" style={{ textAlign: 'right', marginBottom: '10px' }}>
              Total de Produtos: {rows.length ?? 0}
            </p>
          </Col>
        </Row>

        <Row>
          {typefilter === -1 && (
            <Col lg={4}>
              <Card className="Recent-Users" style={{ marginBottom: '10px', borderRadius: '12px' }}>
                <Card.Header>
                  <Card.Title as="h5">Categorias</Card.Title>
                </Card.Header>
                <Row style={{ marginLeft: '5px', marginTop: '10px' }}>
                  {grupos.map((grupo) => {
                    return (
                      <Col key={grupo.codigo} md={6}>
                        <label className="checkbox-modern">
                          <input type="checkbox" onClick={(e) => handleGrupo(e, grupo.codigo, grupo.nome)} />
                          <span className="checkmark"></span>
                          {capitalizeText(grupo.nome + '  (' + grupo.qtde + ')')}
                        </label>
                      </Col>
                    );
                  })}
                </Row>
              </Card>
              <Card className="Recent-Users" style={{ marginBottom: '10px', borderRadius: '12px' }}>
                <Card.Header>
                  <Card.Title as="h5">Sub-Categorias</Card.Title>
                </Card.Header>
                <Row style={{ marginLeft: '5px', marginTop: '10px' }}>
                  {subgrupos.map((subgrupo) => {
                    const habilitado = grupofilter.includes(subgrupo.grupo);
                    let checked = subgrupofilter.includes(subgrupo.codigo);
                    if (!habilitado && checked) {
                      let tmpsubgrupo = subgrupofilter;
                      let tmpsubgruponame = subgrupofiltername;
                      tmpsubgrupo = tmpsubgrupo.replace(subgrupo.codigo + ',', '');
                      tmpsubgruponame = tmpsubgruponame.replace(subgrupo.nome + ',', '');
                      setSubgrupofilter(tmpsubgrupo);
                      setSubgrupofiltername(tmpsubgruponame);
                      checked = false;
                    }
                    return (
                      <Col key={subgrupo.codigo} md={6}>
                        <label className="checkbox-modern" style={{ opacity: habilitado ? 1 : 0.5 }}>
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={!habilitado}
                            onClick={(e) => handleSubgrupo(e, subgrupo.codigo, subgrupo.nome)}
                          />
                          <span className="checkmark"></span>
                          {capitalizeText(subgrupo.nome + '  (' + subgrupo.qtde + ')')}
                        </label>
                      </Col>
                    );
                  })}
                </Row>
              </Card>
              <Card className="Recent-Users" style={{ marginBottom: '10px', borderRadius: '12px' }}>
                <Card.Header>
                  <Card.Title as="h5">Marcas</Card.Title>
                </Card.Header>
                <Row style={{ marginLeft: '5px', marginTop: '10px' }}>
                  {marcas.map((marca) => {
                    return (
                      <Col key={marca.codigo} md={6}>
                        <label className="checkbox-modern">
                          <input type="checkbox" onClick={(e) => handleMarca(e, marca.codigo, marca.nome)} />
                          <span className="checkmark"></span>
                          {capitalizeText(marca.nome + '  (' + marca.qtde + ')')}
                        </label>
                      </Col>
                    );
                  })}
                </Row>
              </Card>
              <Card className="Recent-Users" style={{ marginBottom: '10px', borderRadius: '12px' }}>
                <Card.Header>
                  <Card.Title as="h5">Meus Modelos</Card.Title>
                </Card.Header>
                <Row style={{ marginLeft: '5px' }}>
                  {marcascomp.map((marca, index) => (
                    <Row key={{ index }}>
                      <span key={{ index }} style={{ marginTop: '10px', marginBottom: '10px' }} className="label-destaque-16">
                        {capitalizeText(marca.nomemarca)}
                      </span>
                      {modelo
                        .filter((x) => x.codigomarca === marca.codigomarca)
                        .map((equip, index2) => {
                          return (
                            <Row key={index2}>
                              <label key={index2} className="checkbox-modern">
                                <input type="checkbox" onClick={(e) => handleModelo(e, equip.codequip, equip.nomeequip)} />
                                <span className="checkmark"></span>
                                {capitalizeText(equip.nomequip)}
                              </label>
                            </Row>
                          );
                        })}
                    </Row>
                  ))}
                </Row>
              </Card>
              <Card className="Recent-Users" style={{ marginBottom: '10px', borderRadius: '12px' }}>
                <Card.Header>
                  <Card.Title as="h5">Faixa de Preços</Card.Title>
                </Card.Header>
                <Row style={{ marginLeft: '20px', marginRight: '20px', padding: '10px' }}>
                  <label style={{ textAlign: 'center' }} className="label-default">
                    Faixa: {formatCurrency(price[0])} - {formatCurrency(price[1])}
                  </label>
                  <Slider className="meu-slider" value={price} onChange={handlePrice} valueLabelDisplay="auto" min={0} max={valuemax} />
                </Row>
              </Card>
            </Col>
          )}
          <Col lg={typefilter === -1 ? 8 : 12}>
            <Card className="Recent-Users" style={{ marginBottom: '2px', borderRadius: '12px' }}>
              <Card.Header>
                <Card.Title as="h5">Produtos Encontrados</Card.Title>
              </Card.Header>
              <Row style={{ marginLeft: '5px' }}>
                <Col>
                  <Row>
                    <Col>
                      <Dropdown
                        label="Deseja ordenar por:"
                        options={[
                          { value: 1, label: 'ordem alfabética crescente' },
                          { value: 2, label: 'ordem alfabética decrescente' },
                          { value: 3, label: 'preço unitário crescente' },
                          { value: 4, label: 'preço unitário decrescente' }
                        ]}
                        onChange={(e) => handleOrder(e)}
                      />
                    </Col>
                    <Col style={{ marginLeft: typefilter === -1 ? '240px' : '740px', marginTop: '35px' }}>
                      {typefilter === -1 && (
                        <Button onClick={(e) => Filtrar(-1, null, null)} className={`color-button-primary`}>
                          <Filter size={20} /> Filtrar
                        </Button>
                      )}
                      <Button onClick={(e) => toggleView()} className={`color-button-primary`}>
                        {isGrid ? <Grid3X3 size={20} /> : <List size={20} />}
                        {isGrid ? '  Grade' : '  Lista'}
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {rows !== undefined && rows !== null && rows.length > 0 && (
                <Row>
                  {!isGrid ? (
                    <Row style={{ marginLeft: '3px', padding: '5px,5px,5px,5px,5px' }}>
                      {rows.map((item) => (
                        <Col sm={typefilter === -1 ? 4 : 3} key={item.id}>
                          <div
                            key={item.id}
                            style={{
                              height: '270px',
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                              borderRadius: '12px',
                              color: '#000',
                              fontSize: '1.25rem',
                              marginBottom: '10px',
                              marginRight: '2px',
                              border: '2px solid #e3e6e6'
                            }}
                          >
                            <Row
                              style={{
                                marginTop: '15px',
                                marginLeft: '10px',
                                marginRight: '10px',
                                marginBottom: '10px',
                                cursor: 'pointer'
                              }}
                              onClick={() => navigate('/produto/?produto=' + item.codigo)}
                            >
                              <img src={`data:image/jpeg;base64,${item.picture}`} alt={item.codigo} width="50%" height="50%" />
                              <span className="label-destaque-14">{capitalizeText(item.nome.substring(0, 50))}</span>
                              <span className="color-price" style={{ textAlign: 'right', fontSize: '20px', marginRight: '100px' }}>
                                R${' '}
                                {item.venda.toLocaleString('pt-BR', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                })}
                              </span>
                              <StarRatingView rating={item.avaliacao ?? 0} size={15} />
                            </Row>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <Row>
                      {rows.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            height: '250px',
                            width: '99%',
                            borderRadius: '12px',
                            color: '#000',
                            fontSize: '1.25rem',
                            marginBottom: '10px',
                            marginLeft: '17px',
                            border: '2px solid #e3e6e6'
                          }}
                        >
                          <Row
                            style={{ marginTop: '15px', marginRight: '10px', cursor: 'pointer' }}
                            onClick={() => navigate('/produto/?produto=' + item.codigo)}
                          >
                            <Col lg={typefilter === -1 ? 4 : 3} style={{ textAlign: 'left' }}>
                              <img src={`data:image/jpeg;base64,${item.picture}`} alt={item.codigo} width="220px" height="220px" />
                            </Col>
                            <Col lg={typefilter === -1 ? 5 : 6}>
                              <Row>
                                <span className="label-destaque-16">{capitalizeText(item.nome.substring(0, 50))}</span>
                                <StarRatingView rating={item.avaliacao ?? 0} size={20} showrating={true} />
                                <PerfectScrollbar style={{ width: '100%', height: '100px', marginTop: '2px' }}>
                                  <p style={{ fontSize: '13px', marginLeft: '2px', marginRight: '2px' }}>{typeObs(item)}</p>
                                </PerfectScrollbar>
                              </Row>
                            </Col>
                            <Col lg={typefilter === -1 ? 3 : 3} style={{ textAlign: 'right', marginTop: '130px' }}>
                              <span
                                style={{
                                  fontSize: '2rem',
                                  color: sessionStorage.getItem('colorPrice'),
                                  fontWeight: '700'
                                }}
                              >
                                R${' '}
                                {item.venda.toLocaleString('pt-BR', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                })}
                              </span>
                            </Col>
                          </Row>
                        </div>
                      ))}
                    </Row>
                  )}
                </Row>
              )}
            </Card>
          </Col>
        </Row>
        {loading && <LoadingOverlay />}
      </div>
    </React.Fragment>
  );
};

export default FilterProd;
