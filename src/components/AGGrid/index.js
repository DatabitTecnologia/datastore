import React, { useRef, useState, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from 'ag-grid-community';
import { AllCommunityModule } from 'ag-grid-community';
import { Button, Modal, ModalBody, Row, Col } from 'react-bootstrap';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Box } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import SettingsIcon from '@mui/icons-material/Settings';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FunctionsIcon from '@mui/icons-material/Functions';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ReportOptions from '../Report/options';
import PaletteIcon from '@mui/icons-material/Palette';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { AG_GRID_LOCALE_BR } from './locale';
import { exportToExcelFull } from 'datareact/src/utils/excel';
import { shallowEqual } from 'datareact/src/utils/shallowEqual';

ModuleRegistry.registerModules([AllCommunityModule]);

const AGGrid = (props) => {
  const {
    id,
    key,
    width,
    height,
    rows,
    columns,
    loading,
    onKeyDown,
    onCelClick,
    onDoubleClick,
    multselec,
    selection,
    onMultselec,
    validations,
    setItem,
    rowHeight,
    disabled,
    modulo = 'Relatório',
    grouped = false,
    permexport = true,
    permprint = true,
    focus = false,
    forcefocus = false,
    tools = true,
    totalizadores,
    counttotal = 5
  } = props;

  const gridRef = useRef();
  const [corselec1, setCorselec1] = React.useState('#ccdef7');
  const [corselec2, setCorselec2] = React.useState('#ccdef7');
  const [corselec3, setCorselec3] = React.useState('#ccdef7');
  const [corselec4, setCorselec4] = React.useState('#ccdef7');
  const [corselec5, setCorselec5] = React.useState('#ccdef7');
  const [corselec6, setCorselec6] = React.useState('#ccdef7');
  const [corselec7, setCorselec7] = React.useState('#ccdef7');
  const [corselec8, setCorselec8] = React.useState('#ccdef7');
  const [corselec9, setCorselec9] = React.useState('#ccdef7');

  const [corline1, setCorline1] = React.useState('#000');
  const [corline2, setCorline2] = React.useState('#000');
  const [corline3, setCorline3] = React.useState('#000');
  const [corline4, setCorline4] = React.useState('#000');
  const [corline5, setCorline5] = React.useState('#000');
  const [corline6, setCorline6] = React.useState('#000');
  const [corline7, setCorline7] = React.useState('#000');
  const [corline8, setCorline8] = React.useState('#000');
  const [corline9, setCorline9] = React.useState('#000');
  const [gridApi, setGridApi] = useState(null);
  const [rowID, setRowID] = useState(0);

  const [columnDefs, setColumnDefs] = useState([]);
  const [columnnumber, setColumnnumber] = useState([]);
  const [itemselec, setItemselec] = useState([]);
  const [filters, setFilters] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [showcolumns, setShowcolumns] = useState(false);
  const [showtotal, setShowtotal] = useState(false);
  const [totais, setTotais] = useState({});
  const [titletotal, setTitletotal] = useState('');
  const [icontotal, setIcontotal] = useState('fas fa-calculator');
  const [showprint, setShowprint] = useState(false);
  const handleCloseprint = () => setShowprint(false);
  const [showgroup, setShowgroup] = useState(false);
  const handleClosegroup = () => setShowgroup(false);
  const [mostrarpaleta, setMostrarpaleta] = useState(true);
  const [checked, setChecked] = useState(multselec ?? false);
  const [rowsselec, setRowsselec] = useState([]);
  const [filtered, setFiltered] = useState(false);
  const [isnumber, setIsnumber] = useState(false);
  const [istext, setIstext] = useState(false);
  const [updatecolumns, setUpdatecolumns] = useState(false);

  const [defaultColDef] = useState({
    resizable: true,
    sortable: true,
    filter: filters
  });

  useEffect(() => {
    if (columns) {
      const visibility = {};
      columns.forEach((col) => {
        visibility[col.field] = col.visible !== false; // true por padrão
      });
      setColumnVisibility(visibility);

      const cols = columns.map((col) => {
        const isNumeric = col.type === 'number' || col.type === 'numericColumn';
        const isDate = col.type === 'date';
        const isText = col.type === 'text';
        if (col.type === 'number' || col.type === 'numericColumn') {
          setIsnumber(true);
        }
        if (col.type === 'text') {
          setIstext(true);
        }

        return {
          field: col.field,
          headerName: col.headerName,
          width: col.width,
          hide: col.visible === false,
          headerClass: col.headerClassName,
          sortable: true,
          floatingFilter: filters,
          filter: filters ? 'agTextColumnFilter' : false,
          type: isNumeric ? 'numericColumn' : undefined,
          decimal: col.decimal ?? 0,

          valueFormatter: isNumeric
            ? (params) => {
                if (typeof params.value === 'number') {
                  return params.value.toLocaleString('pt-BR', {
                    minimumFractionDigits: col.decimal ?? 0,
                    maximumFractionDigits: col.decimal ?? 0
                  });
                }
                return params.value;
              }
            : undefined,

          comparator: isDate
            ? (date1, date2) => {
                const parseDate = (value) => {
                  if (!value) return null;
                  if (!value.includes(':')) {
                    const [day, month, year] = value.split('/');
                    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                  } else {
                    const [dataPart, horaPart] = value.split(' ');
                    const [day, month, year] = dataPart.split('/');
                    const [hour, minute, second] = horaPart.split(':');
                    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second));
                  }
                };
                const d1 = parseDate(date1);
                const d2 = parseDate(date2);
                return d1 - d2;
              }
            : undefined,

          cellStyle: isNumeric ? { textAlign: 'right' } : {},
          cellRenderer: col.renderCell ? col.renderCell : undefined,
          cellClass: isText ? 'cell-wrap-text' : undefined
        };
      });

      setColumnDefs(cols);
    }
  }, [columns, filters]);

  useEffect(() => {
    if (updatecolumns) {
      if (columnVisibility) {
        const columnsTmp = columnDefs;
        Object.entries(columnVisibility).forEach(([chave, valor], index) => {
          columnsTmp[index].hide = !valor;
        });
        setColumnDefs([...columnsTmp]);
      }
      setUpdatecolumns(false);
    }
  }, [updatecolumns]);

  const handleClosecolumns = () => {
    setUpdatecolumns(true);
    setShowcolumns(false);
  };

  useEffect(() => {
    if (!gridApi) return;

    if (loading) {
      gridApi.showLoadingOverlay();
    } else {
      gridApi.hideOverlay();
    }
  }, [loading, gridApi]);

  useEffect(() => {
    if (setItem !== undefined) {
      setItem(itemselec);
    }
  }, [itemselec]);

  useEffect(() => {
    if (Object.keys(totais).length !== 0) {
      setShowtotal(true);
    }
  }, [totais]);

  useEffect(() => {
    setColumnnumber(columnDefs.filter((item) => item.type === 'numericColumn'));
  }, [columnDefs]);

  const onCellKeyDown = (event) => {
    if (onKeyDown !== undefined) {
      onKeyDown(event.data, event.event);
    }
  };

  const onCellClicked = (event) => {
    if (onCelClick !== undefined) {
      onCelClick(event.data, event.event);
    }
  };

  const onRowDoubleClicked = (event) => {
    if (onDoubleClick !== undefined) {
      onDoubleClick(event.data);
    }
  };

  const onSelectionChanged = () => {
    const rowsselec = gridRef.current.api.getSelectedRows();
    setRowsselec(rowsselec);
    if (onMultselec !== undefined) {
      onMultselec(rowsselec);
    }
  };

  const corSelecSetters = [
    setCorselec1,
    setCorselec2,
    setCorselec3,
    setCorselec4,
    setCorselec5,
    setCorselec6,
    setCorselec7,
    setCorselec8,
    setCorselec9
  ];

  const corLineSetters = [
    setCorline1,
    setCorline2,
    setCorline3,
    setCorline4,
    setCorline5,
    setCorline6,
    setCorline7,
    setCorline8,
    setCorline9
  ];

  const setColor = (index, color) => {
    if (corSelecSetters[index]) {
      corSelecSetters[index](color);
    }
    return index + 1;
  };

  const setColorline = (index, color) => {
    if (corLineSetters[index]) {
      corLineSetters[index](color);
    }
    return index + 1;
  };

  const operators = {
    1: (a, b) => a == b,
    2: (a, b) => a != b,
    3: (a, b) => a > b,
    4: (a, b) => a < b,
    5: (a, b) => a >= b,
    6: (a, b) => a <= b,
    7: (a, b) => a.includes(b),
    8: (a, b) => !a.includes(b)
  };

  const validColor = (value, valueref, sinal, color) => {
    const isValid = operators[sinal]?.(value, valueref);
    return isValid ? color : undefined;
  };

  const getRowStyle = (params) => {
    const isSelected = params.data === itemselec;
    let colorStyle = {};

    if (validations !== undefined && mostrarpaleta && params.data) {
      let valida = false;
      let valueref = '';
      let value = '';
      let posindex = 1;
      validations.forEach((object, index) => {
        if (!valida) {
          value = params.data[object.campo];

          if (object.tipotab !== 'G') {
            if (object.tipotab === 'V') {
              valueref = object.valorval;
            } else {
              valueref = params.data[object.camval1];
            }
            let colorfim = validColor(value, valueref, object.sinal, object.cor);
            if (colorfim !== undefined) {
              posindex = setColor(index, colorfim);
              valida = true;
            }
            colorStyle = { backgroundColor: colorfim, color: '#000' };
          } else {
            for (var i = 0; i < object.total; i++) {
              let value = params.data[object.campo[i]];
              let valoritem = object.valorval[i];
              let sinalitem = object.sinal[i];
              let coritem = object.cor[i];
              let colorfim = validColor(value, valoritem, sinalitem, coritem);

              if (colorfim !== undefined) {
                posindex = setColor(i, colorfim);
                valida = true;
                try {
                  let corline = object.corline[i];
                  setColorline(i, corline);
                  colorStyle = { backgroundColor: colorfim, color: corline };
                } catch (error) {
                  colorStyle = { backgroundColor: colorfim, color: '#000' };
                }
              }
            }
          }
        }
      });
      if (!isSelected) {
        if (valida) {
          return colorStyle;
        } else {
          if (mostrarpaleta) {
            return params.node.rowIndex % 2 !== 0 ? { backgroundColor: sessionStorage.getItem('colorGrid') } : {};
          }
        }
      } else {
        return { backgroundColor: sessionStorage.getItem('colorMenuselec'), color: '#fff' };
      }
    } else {
      if (!isSelected) {
        if (mostrarpaleta) {
          return params.node.rowIndex % 2 !== 0 ? { backgroundColor: sessionStorage.getItem('colorGrid') } : {};
        }
      } else {
        return { backgroundColor: sessionStorage.getItem('colorMenuselec'), color: '#fff' };
      }
    }
  };

  const onCellFocused = useCallback((event) => {
    const focusedCell = event.api.getFocusedCell();
    if (focusedCell) {
      const rowIndex = focusedCell.rowIndex;
      setRowID(focusedCell.rowIndex);
      const node = event.api.getDisplayedRowAtIndex(rowIndex);
      const rowData = node?.data;
      setItemselec(rowData);
    }
  });

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const loadingOverlayComponent = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column', // coloca em coluna (um em cima do outro)
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
      }}
    >
      <div
        className="spinner-border text-primary-spinner"
        role="status"
        style={{ width: '3rem', height: '3rem' }} // aumenta o tamanho
      />
      <div style={{ marginTop: '1rem', fontSize: '15px', fontWeight: 'bold' }}>Carregando...</div>
    </div>
  );

  const Filters = () => {
    setFilters(!filters);
  };

  const handleCheckboxChange = (field, checked) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [field]: checked
    }));
  };

  const calcularTotais = (operacao) => {
    const colunasNumericas = columns.filter((col) => col.type === 'number' || col.type === 'numericColumn');
    const novoTotal = {};
    const tmprows = !checked && !filtered ? rows : rowsselec;

    colunasNumericas.forEach((col) => {
      const valores = tmprows.map((row) => Number(row[col.field]) || 0);

      switch (operacao) {
        case 'sum':
          setTitletotal('Soma de Valores');
          setIcontotal('fas fa-calculator');
          novoTotal[col.headerName] = valores.reduce((a, b) => a + b, 0);
          break;
        case 'avg':
          setTitletotal('Média de Valores');
          setIcontotal('fas fa-chart-line');
          novoTotal[col.headerName] = valores.length ? valores.reduce((a, b) => a + b, 0) / valores.length : 0;
          break;
        case 'max':
          setTitletotal('Valor Máximo');
          setIcontotal('fas fa-arrow-up');
          novoTotal[col.headerName] = Math.max(...valores);
          break;
        case 'min':
          setTitletotal('Valor Mínimo');
          setIcontotal('fas fa-arrow-down');
          novoTotal[col.headerName] = Math.min(...valores);
          break;
        default:
          break;
      }
    });
    setTotais(novoTotal);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const onFilterChanged = () => {
    if (!gridApi) return;
    if (gridApi.isAnyFilterPresent()) {
      const dadosFiltrados = [];
      gridApi.forEachNodeAfterFilter((node) => dadosFiltrados.push(node.data));
      setFiltered(true);
      setRowsselec(dadosFiltrados);
    } else {
      setFiltered(false);
    }
  };

  const onFirstDataRendered = () => {
    if (columns !== undefined && columns.length > 0 && focus) {
      try {
        gridApi.forEachNode((node) => {
          if (multselec) {
            if (selection !== undefined && selection.length > 0) {
              selection.forEach((itemselec) => {
                if (shallowEqual(itemselec, node.data)) {
                  node.setSelected(true);
                }
              });
            }
          }
        });
      } catch (error) {
        console.log(error);
      }

      try {
        gridApi.ensureIndexVisible(!forcefocus ? rowID : 0);
        gridApi.setFocusedCell(!forcefocus ? rowID : 0, columns[0].field);
      } catch (error) {
        setGridApi(gridRef.api);
      }
    }
  };

  const moeda = (v) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(v);

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: counttotal },
    desktop: { breakpoint: { max: 1024, min: 768 }, items: counttotal - 1 },
    tablet: { breakpoint: { max: 768, min: 464 }, items: counttotal - 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: counttotal - 3 }
  };

  return (
    <Box
      sx={{
        height: height,
        width: width,
        fontFamily: 'Roboto, sans-serif', // Substitua com a fonte desejada
        fontSize: '8px' // Tamanho da fonte (opcional)
      }}
    >
      <div
        style={{
          fontFamily: 'Roboto, sans-serif',
          fontSize: '10px',
          height: height,
          width: '100%',
          pointerEvents: disabled ? 'none' : 'auto',
          opacity: disabled ? 0.5 : 1
        }}
      >
        <div
          style={{
            fontFamily: 'Roboto, sans-serif',
            height: tools ? '90%' : '100%',
            width: '100%',
            pointerEvents: disabled ? 'none' : 'auto',
            opacity: disabled ? 0.5 : 1
          }}
        >
          <div style={{ height: totalizadores ? '82%' : '100%' }}>
            <AgGridReact
              id={id}
              key={key}
              ref={gridRef}
              rowData={rows}
              columnDefs={columnDefs}
              localeText={AG_GRID_LOCALE_BR}
              rowSelection={{ mode: checked || multselec ? 'multiRow' : 'single' }}
              defaultColDef={defaultColDef}
              onCellFocused={onCellFocused}
              rowHeight={rowHeight !== undefined ? rowHeight : 27}
              onGridReady={onGridReady}
              loadingOverlayComponent={loadingOverlayComponent}
              getRowStyle={getRowStyle}
              onCellKeyDown={onCellKeyDown}
              onCellClicked={onCellClicked}
              onRowDoubleClicked={onRowDoubleClicked}
              onSelectionChanged={onSelectionChanged}
              onFirstDataRendered={onFirstDataRendered}
              onFilterChanged={onFilterChanged}
              groupIncludeFooter={grouped}
              groupIncludeTotalFooter={grouped}
              onModelUpdated={(params) => {
                if (columns && columns.length > 0 && focus) {
                  params.api.ensureIndexVisible(!forcefocus ? rowID : 0);
                  params.api.setFocusedCell(!forcefocus ? rowID : 0, columns[0].field);
                }
              }}
            />
          </div>
          {totalizadores && (
            <div style={{ height: '18%', display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ maxWidth: '1260px', width: '100%' }}>
                <Carousel responsive={responsive} infinite autoPlay autoPlaySpeed={3000} keyBoardControl arrows={false} showDots={false}>
                  {totalizadores.map((item, index) => (
                    <Item
                      key={index}
                      icon={item.icon}
                      title={item.data.title}
                      value={item.data.decimal === 0 ? item.data.value : moeda(item.data.value)}
                      color={item.color}
                    />
                  ))}
                </Carousel>
              </div>
            </div>
          )}
        </div>

        {tools && (
          <div
            style={{
              fontFamily: 'Roboto, sans-serif',
              fontSize: '8px',
              height: '10%',
              width: '100%',
              pointerEvents: disabled ? 'none' : 'auto',
              opacity: disabled ? 0.5 : 1,
              backgroundColor: '#fafafb',
              marginTop: '2px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 8px'
            }}
          >
            <Box display="flex" marginTop={'5px'} justifyContent="flex-end" gap={1} mb={1}>
              <Tooltip title={!filters ? 'Exibir filtros' : 'Ocultar Filtros'} arrow>
                <IconButton onClick={Filters} size="small">
                  {!filters ? <FilterListIcon fontSize="small" /> : <FilterListOffIcon fontSize="small" />}
                </IconButton>
              </Tooltip>

              <Tooltip title="Configurar colunas" arrow>
                <IconButton onClick={() => setShowcolumns(true)} size="small">
                  <SettingsIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              {isnumber && !totalizadores ? (
                <Tooltip title="Somar" arrow>
                  <IconButton size="small" onClick={() => calcularTotais('sum')}>
                    <FunctionsIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <></>
              )}

              {isnumber ? (
                <Tooltip title="Média" arrow>
                  <IconButton size="small" onClick={() => calcularTotais('avg')}>
                    <TrendingUpIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <></>
              )}

              {isnumber ? (
                <Tooltip title="Máximo" arrow>
                  <IconButton size="small" onClick={() => calcularTotais('max')}>
                    <ArrowUpwardIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <></>
              )}

              {isnumber ? (
                <Tooltip title="Mínimo" arrow>
                  <IconButton size="small" onClick={() => calcularTotais('min')}>
                    <ArrowDownwardIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <></>
              )}

              <Tooltip title="Mostrar / Ocultar Cores" arrow>
                <IconButton onClick={() => setMostrarpaleta(!mostrarpaleta)}>
                  {mostrarpaleta ? <VisibilityOffIcon /> : <PaletteIcon />}
                </IconButton>
              </Tooltip>

              {permexport ? (
                <Tooltip title="Exportar" arrow>
                  <IconButton
                    size="small"
                    onClick={() => exportToExcelFull(!checked && !filtered ? rows : rowsselec, columns, 'databit.xlsx')}
                  >
                    <FileUploadIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <></>
              )}

              {/*{permprint ? (
              <Tooltip title="Relatório" arrow>
                <IconButton size="small" onClick={() => setShowprint(true)}>
                  <PrintIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <></>
            )} */}
            </Box>

            <span style={{ fontSize: '13px', color: '#333' }}>
              Total de linhas: {!checked && !filtered ? rows.length : rowsselec.length}
            </span>
          </div>
        )}
      </div>
      <Modal backdrop="static" size="lg" show={showcolumns} centered={true} onHide={handleClosecolumns}>
        <Modal.Header className="h5" closeButton>
          <i className={'feather icon-settings'} />
          &nbsp;Exibir / Ocultar Colunas
        </Modal.Header>
        <Modal.Body>
          <Row>
            {columnDefs.map((col) => (
              <Col key={col.field} xs={12} md={4}>
                <label className="checkbox-modern">
                  <input
                    type="checkbox"
                    checked={columnVisibility[col.field] !== false}
                    onChange={(e) => handleCheckboxChange(col.field, e.target.checked)}
                    style={{ marginRight: '5px' }}
                  />
                  <span className="checkmark"></span>
                  {col.headerName}
                </label>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button id="btnFechar" className={'color-button-primary shadow-2 mb-3'} onClick={(e) => handleClosecolumns()}>
            <i className={'feather icon-log-out'} /> Fechar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal backdrop="static" show={showtotal} onHide={() => setShowtotal(false)}>
        <Modal.Header className="h5" closeButton>
          <i className={icontotal}></i>
          &nbsp;{titletotal}
        </Modal.Header>
        <Modal.Body>
          {Object.entries(totais).map(([chave, valor], index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h5 style={{ flex: 1 }}>{chave}:</h5>
              <h5
                style={{
                  flex: 1,
                  textAlign: 'right',
                  color: sessionStorage.getItem('colorMenuselec'),
                  fontWeight: 'bold'
                }}
              >
                {formatNumber(parseFloat(valor))}
              </h5>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button id="btnFechar" className={'color-button-primary shadow-2 mb-3'} onClick={(e) => setShowtotal(false)}>
            <i className={'feather icon-log-out'} /> Fechar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal backdrop="static" size="lg" show={showprint} centered={true} onHide={handleCloseprint}>
        <Modal.Header className="h5" closeButton>
          <i className={'feather icon-printer h1'} />
          &nbsp;Relatório
        </Modal.Header>
        <ModalBody>
          <ReportOptions
            title={modulo}
            columns={columnDefs.filter((col) => !col.hide)}
            data={!checked && !filtered ? rows : rowsselec}
            orientation="landscape"
            showprint={showprint}
            setShowprint={(data) => setShowprint(data)}
            columnnumber={columnnumber}
            setColumnnumber={(data) => setColumnnumber(data)}
          ></ReportOptions>
        </ModalBody>
      </Modal>
    </Box>
  );
};

export default AGGrid;

const Item = ({ title, icon, value = 0, color = '#333' }) => (
  <div
    className="rounded-2xl shadow-md p-1 bg-white border"
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      fontFamily: `'Segoe UI', sans-serif`,
      borderRadius: '12px',
      marginTop: '3px',
      marginRight: '10px',
      height: '88%'
    }}
  >
    <div className="flex items-center gap-1 text-sm font-medium text-gray-200">
      <span style={{ color, marginLeft: '10px' }}>{React.cloneElement(icon, { size: 25 })}</span>
      <span style={{ marginLeft: '15px' }} className="label-destaque-14">
        {title}
      </span>
      <div
        className="label-destaque-16"
        style={{
          color: '#333',
          textAlign: 'right',
          marginRight: '10px',
          fontWeight: 'bold'
        }}
      >
        {value}
      </div>
    </div>
  </div>
);
