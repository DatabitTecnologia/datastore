import { apiList } from 'datareact/src/api/crudapi';
import { capitalizeText } from 'datareact/src/utils/capitalize';
import { Decode64 } from 'datareact/src/utils/crypto';

export const gerarMenu = async () => {
  const menuHome = {
    id: 'home',
    title: 'Página Inicial',
    type: 'group',
    icon: 'icon-home',
    children: [
      {
        id: 'home',
        title: 'Página Inicial',
        type: 'item',
        icon: 'feather icon-home',
        classes: 'nav-item',
        url: '/index',
        target: false
      }
    ]
  };

  const menuGrupo = {
    id: 'grupo',
    title: 'Categorias',
    type: 'group',
    icon: 'icon-list',
    children: [
      {
        id: 'grupomenu',
        title: 'Categorias',
        type: 'collapse',
        icon: 'feather icon-list',
        children: []
      }
    ]
  };

  const menuMarca = {
    id: 'marca',
    title: 'Marcas',
    type: 'group',
    icon: 'icon-tag',
    children: [
      {
        id: 'grupomarca',
        title: 'Marcas',
        type: 'collapse',
        icon: 'feather icon-tag',
        children: []
      }
    ]
  };

  const menuModelo = {
    id: 'modelo',
    title: 'Meu Modelo',
    type: 'group',
    icon: 'icon-slack',
    children: [
      {
        id: 'grupomodelo',
        title: 'Modelo',
        type: 'collapse',
        icon: 'feather icon-cast',
        children: []
      }
    ]
  };

  const menuFilter = {
    id: 'filter',
    title: 'Filtros',
    type: 'group',
    icon: 'filter',
    children: [
      {
        id: 'filtro',
        title: 'Filtros',
        type: 'item',
        icon: 'feather icon-filter',
        classes: 'nav-item',
        url: '/filter',
        target: false
      }
    ]
  };

  const responsegrupo = await apiList(
    'Grupo',
    'TB01002_CODIGO,TB01002_NOME',
    '',
    " TB01002_SITUACAO = 'A' AND TB01002_WEB = 'S' ORDER BY TB01002_NOME "
  );

  if (responsegrupo.status === 200) {
    const resultgrupo = responsegrupo.data;
    for (const grupo of resultgrupo) {
      const grupoItem = {
        id: 'g' + grupo.codigo,
        title: capitalizeText(grupo.nome),
        type: 'collapse',
        target: true,
        breadcrumbs: false,
        children: []
      };
      const responsesubgrupo = await apiList(
        'Subgrupo',
        'TB01018_CODIGO,TB01018_NOME',
        '',
        " TB01018_SITUACAO = 'A' AND TB01018_WEB = 'S' AND TB01018_GRUPO = '" + grupo.codigo + "' ORDER BY TB01018_NOME "
      );
      const resultsubgrupo = responsesubgrupo.data;
      for (const subgrupo of resultsubgrupo) {
        const subGrupoItem = {
          id: 's' + subgrupo.codigo,
          title: capitalizeText(subgrupo.nome),
          type: 'item',
          target: false,
          breadcrumbs: false,
          url: '/filter/?type=3&term=' + subgrupo.codigo + '&name=' + capitalizeText(subgrupo.nome)
        };
        grupoItem.children.push(subGrupoItem);
      }
      menuGrupo.children[0].children.push(grupoItem);
    }
  }

  const responsemarca = await apiList(
    'Marca',
    'TB01047_CODIGO,TB01047_NOME',
    '',
    " TB01047_SITUACAO = 'A' AND TB01047_WEB = 'S' ORDER BY TB01047_NOME "
  );
  if (responsemarca.status === 200) {
    const resultmarca = responsemarca.data;
    for (const marca of resultmarca) {
      const marcaItem = {
        id: 'm' + marca.codigo,
        title: capitalizeText(marca.nome),
        type: 'item',
        url: '/filter/?type=4&term=' + marca.codigo + '&name=' + capitalizeText(marca.nome)
      };
      menuMarca.children[0].children.push(marcaItem);
    }
  }

  const responsemodelo = await apiList('MarcaCompatibilidadeVW', '*', '', ' 0 = 0 order by nomemarca,nomequip');
  console.log(responsemodelo.data);

  if (responsemodelo.status === 200) {
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

    for (const marca of marcasUnicas) {
      const equipamentos = resultmodelo.filter((x) => x.codigomarca === marca.codigomarca);

      let marcaItem = {
        id: 'c' + marca.codigomarca,
        title: capitalizeText(marca.nomemarca),
        type: 'collapse',
        target: true,
        breadcrumbs: false,
        children: []
      };

      if (equipamentos.length <= 10) {
        // Comportamento atual
        for (const equipamento of equipamentos) {
          marcaItem.children.push({
            id: 'e' + equipamento.codequip,
            title: capitalizeText(equipamento.nomequip),
            type: 'item',
            target: false,
            breadcrumbs: false,
            url: '/filter/?type=5&term=' + equipamento.codequip + '&name=' + capitalizeText(equipamento.nomequip)
          });
        }
      } else {
        // Novo comportamento com faixas
        const chunkSize = 10;
        for (let i = 0; i < equipamentos.length; i += chunkSize) {
          const faixa = equipamentos.slice(i, i + chunkSize);
          const faixaLabel = `${i + 1} a ${i + faixa.length}`;

          const faixaItem = {
            id: `faixa_${marca.codigomarca}_${i}`,
            title: faixaLabel,
            type: 'collapse',
            children: []
          };

          for (const equipamento of faixa) {
            faixaItem.children.push({
              id: 'e' + equipamento.codequip,
              title: capitalizeText(equipamento.nomequip),
              type: 'item',
              target: false,
              breadcrumbs: false,
              url: '/filter/?type=5&term=' + equipamento.codequip + '&name=' + capitalizeText(equipamento.nomequip)
            });
          }

          marcaItem.children.push(faixaItem);
        }
      }

      menuModelo.children[0].children.push(marcaItem);
    }
  }

  const menuItens = { items: [menuHome, menuModelo, menuGrupo, menuMarca, menuFilter] };
  console.log(menuItens);
  return menuItens;
};

export const gerarMenurevenda = async () => {
  const menuNovo = {
    id: 'filter',
    title: 'Filtros',
    type: 'group',
    icon: 'shopping-cart',
    children: [
      {
        id: 'filtro',
        title: 'Seja uma Revenda',
        type: 'item',
        icon: 'feather icon-shopping-cart',
        classes: 'nav-item',
        url: '/revendedor',
        target: false
      }
    ]
  };
  const menuRevenda = {
    id: 'filter',
    title: 'Filtros',
    type: 'group',
    icon: 'shopping-cart',
    children: [
      {
        id: 'filtro',
        title: Decode64(sessionStorage.getItem('titlerev')),
        type: 'item',
        icon: 'feather icon-map',
        classes: 'nav-item',
        url: '/localizacao',
        target: false
      }
    ]
  };

  const menuItens = { items: [menuNovo, menuRevenda] };

  return menuItens;
};
