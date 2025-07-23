import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { getImageUrl } from 'datareact/src/utils/crypto';
import { Decode64 } from 'datareact/src/utils/crypto';

export const generatePDF = (title, columns, data, orientation, fieldGroup = null, order = 0, titleOrder = null, total) => {
  const pdfWidths = columns.map((col) => col.width / 2.2);

  const visibleColumns = Object.entries(total)
    .filter(([_, isVisible]) => isVisible)
    .map(([field]) => field);

  if (fieldGroup && order !== 0) {
    data = [...data].sort((a, b) => {
      const valA = a[fieldGroup];
      const valB = b[fieldGroup];

      // Se ambos forem números, ordena como número
      if (typeof valA === 'number' && typeof valB === 'number') {
        return valA - valB;
      }

      // Se forem datas (valores Date ou string ISO), converte e ordena
      if (Date.parse(valA) && Date.parse(valB)) {
        return new Date(valA) - new Date(valB);
      }

      // Ordena como string (com suporte a acentos)
      return String(valA ?? '').localeCompare(String(valB ?? ''), 'pt-BR', {
        sensitivity: 'base'
      });
    });
  }

  // Cabeçalho
  const headerRow = columns.map((col) => ({
    text: col.headerName,
    style: 'tableHeader'
  }));

  // Função para gerar linha de dados
  const gerarLinhaDados = (row) =>
    columns.map((col) => {
      const valor = row[col.field];
      const isNumber = col.type === 'number' || col.type === 'numericColumn';
      return {
        text:
          isNumber && !isNaN(valor)
            ? Number(valor).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            : valor ?? '',
        style: 'tableData',
        alignment: isNumber ? 'right' : 'left'
      };
    });

  // Função para calcular totais por grupo
  const calcularTotaisGrupo = (grupo) =>
    columns.map((col, i) => {
      if (visibleColumns.length > 0) {
        if (i === 0) {
          return {
            text: '',
            style: 'tableHeader',
            alignment: 'left'
          };
        }
        if (col.type === 'number' || col.type === 'numericColumn') {
          if (visibleColumns.includes(col.field)) {
            const total = grupo.reduce((acc, row) => {
              const valor = parseFloat(row[col.field]);
              return !isNaN(valor) ? acc + valor : acc;
            }, 0);
            return {
              text: Number(total).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }),
              style: 'tableHeader',
              alignment: 'right'
            };
          } else {
            return {
              text: '',
              style: 'tableHeader'
            };
          }
        }
        return {
          text: '',
          style: 'tableHeader',
          alignment: 'right'
        };
      } else {
        return {
          text: '',
          style: 'tableHeader'
        };
      }
    });

  // Monta as linhas do corpo da tabela
  const body = [headerRow];
  if (fieldGroup && order === 2) {
    let grupoAtual = null;
    let grupoData = [];

    data.forEach((row, index) => {
      const valorGrupo = row[fieldGroup];

      if (grupoAtual !== valorGrupo) {
        if (grupoData.length > 0) {
          body.push(calcularTotaisGrupo(grupoData));
          grupoData = [];
        }

        // Linha de quebra
        body.push(
          columns.map((col, i) => ({
            text: i === 0 ? `${titleOrder}: ${valorGrupo}` : '',
            style: 'groupBreak',
            colSpan: columns.length,
            alignment: 'left',
            fillColor: '#eeeeee',
            margin: [0, 5, 0, 5]
          }))
        );

        grupoAtual = valorGrupo;
      }

      body.push(gerarLinhaDados(row));
      grupoData.push(row);

      // Último grupo, fecha total
      if (index === data.length - 1 && grupoData.length > 0) {
        body.push(calcularTotaisGrupo(grupoData));
      }
    });
  } else {
    data.forEach((row) => body.push(gerarLinhaDados(row)));
  }

  // Totais finais (geral)
  const totaisFinais = columns.map((col, i) => {
    if (visibleColumns.length > 0) {
      if (i === 0) {
        return {
          text: 'TOTAL',
          style: 'tableHeader',
          alignment: 'left'
        };
      }

      if (col.type === 'number' || col.type === 'numericColumn') {
        if (visibleColumns.includes(col.field)) {
          const total = data.reduce((acc, row) => {
            const valor = parseFloat(row[col.field]);
            return !isNaN(valor) ? acc + valor : acc;
          }, 0);
          return {
            text: Number(total).toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }),
            style: 'tableHeader',
            alignment: 'right'
          };
        } else {
          return {
            text: '',
            style: 'tableHeader'
          };
        }
      }

      return {
        text: '',
        style: 'tableHeader'
      };
    } else {
      return {
        text: '',
        style: 'tableHeader'
      };
    }
  });

  body.push(totaisFinais);

  // Monta o PDF
  getImageUrl('data:image/png;base64,' + sessionStorage.getItem('logoempresa')).then((url) => {
    const docDefinition = {
      pageOrientation: orientation,
      content: [
        {
          columns: [
            {
              image: url,
              width: 100,
              height: 100,
              alignment: 'left'
            },
            {
              stack: [
                { text: Decode64(sessionStorage.getItem('nameenterprise')), style: 'headerSubtitle' },
                { text: title, style: 'headerSubtitle' }
              ],
              alignment: 'left',
              margin: [10, 30, 0, 0]
            }
          ],
          columnGap: 10,
          margin: [0, 0, 0, 10]
        },
        {
          table: {
            headerRows: 1,
            widths: pdfWidths,
            body: body
          },
          layout: 'lightHorizontalLines'
        }
      ],
      footer: (currentPage, pageCount) => [
        {
          text: `Página ${currentPage} de ${pageCount}`,
          alignment: 'right',
          fontSize: 9,
          margin: [0, 0, 20, 0]
        },
        {
          text: 'Copyright © 2024 by DataBit Tecnologia e Sistemas LTDA. All rights reserved',
          alignment: 'center',
          margin: [0, 10, 0, 0],
          fontSize: 9
        }
      ],
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          alignment: 'center',
          margin: [10, 0, 0, 10]
        },
        headerTitle: {
          fontSize: 14,
          bold: true,
          alignment: 'center'
        },
        tableHeader: {
          fontSize: 8,
          bold: true,
          padding: 5
        },
        headerSubtitle: {
          fontSize: 14,
          margin: [0, 0, 0, 2]
        },
        tableData: {
          fontSize: 8,
          color: '#000',
          alignment: 'left',
          padding: 5
        },
        groupBreak: {
          fontSize: 8,
          bold: true,
          color: '#000',
          fillColor: '#eeeeee'
        }
      }
    };

    pdfMake.createPdf(docDefinition).open();
  });
};
