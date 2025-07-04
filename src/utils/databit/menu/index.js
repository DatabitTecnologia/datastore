import { apiList } from 'datareact/src/api/crudapi';
import { capitalizeText } from 'datareact/src/utils/capitalize';

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
        title: 'Meu Modelo',
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
      const marcaItem = {
        id: 'c' + marca.codigomarca,
        title: capitalizeText(marca.nomemarca),
        type: 'collapse',
        target: true,
        breadcrumbs: false,
        children: []
      };
      const equipamentos = resultmodelo.filter((x) => x.codigomarca === marca.codigomarca);
      for (const equipamento of equipamentos) {
        const equipItem = {
          id: 'e' + equipamento.codequip,
          title: capitalizeText(equipamento.nomequip),
          type: 'item',
          target: false,
          breadcrumbs: false,
          url: '/filter/?type=5&term=' + equipamento.codequip + '&name=' + capitalizeText(equipamento.nomequip)
        };
        marcaItem.children.push(equipItem);
      }
      menuModelo.children[0].children.push(marcaItem);
    }
  }

  const menuItens = { items: [menuHome, menuModelo, menuGrupo, menuMarca, menuFilter] };

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
        title: 'Seja um Revendedor',
        type: 'item',
        icon: 'feather icon-shopping-cart',
        classes: 'nav-item',
        url: '/filter',
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
        title: 'Nossas Revendas',
        type: 'item',
        icon: 'feather icon-map',
        classes: 'nav-item',
        url: '/filter',
        target: false
      }
    ]
  };

  const menuItens = { items: [menuNovo, menuRevenda] };

  return menuItens;
};
