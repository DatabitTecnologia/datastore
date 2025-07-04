const menuItems = {
  items: [
    {
      id: 'grupo',
      title: 'Pages',
      type: 'group',
      icon: 'icon-pages',
      children: [
        {
          id: 'grupomenu',
          title: 'Categorias',
          type: 'collapse',
          icon: 'feather icon-lock',
          children: [
            {
              id: '0012',
              title: 'Acessórios',
              type: 'item',
              target: true,
              url: '/grupo0012',
              breadcrumbs: false
            },
            {
              id: '0000',
              title: 'Equipamentos',
              type: 'item',
              target: true,
              url: '/grupo0000',
              breadcrumbs: false
            },
            {
              id: '0001',
              title: 'Peças',
              type: 'item',
              target: true,
              url: '/grupo0001',
              breadcrumbs: false
            },
            {
              id: '0002',
              title: 'Suprimentos',
              type: 'item',
              target: true,
              url: '/grupo0002',
              breadcrumbs: false
            }
          ]
        }
      ]
    }
  ]
};
