const menuItems = {
  items: [
    {
      id: 'pages',
      title: 'Pages',
      type: 'group',
      icon: 'icon-pages',
      children: [
        {
          id: 'auth',
          title: 'Authentication',
          type: 'collapse',
          icon: 'feather icon-lock',
          children: [
            {
              id: 'signup-1',
              title: 'Sign up',
              type: 'item',
              url: '/auth/signup-1',
              target: true,
              breadcrumbs: false
            },
            {
              id: 'signin-1',
              title: 'Sign in',
              type: 'item',
              url: '/auth/signin-1',
              target: true,
              breadcrumbs: false
            },
            {
              id: 'reset-password-1',
              title: 'Reset Password',
              type: 'item',
              url: '/auth/reset-password-1',
              target: true,
              breadcrumbs: false
            },
            {
              id: 'change-password',
              title: 'Change Password',
              type: 'item',
              url: '/auth/change-password',
              target: true,
              breadcrumbs: false
            },
            {
              id: 'profile-settings',
              title: 'Profile Settings',
              type: 'item',
              url: '/auth/profile-settings',
              target: true,
              breadcrumbs: false
            }
          ]
        },
        {
          id: 'maintenance',
          title: 'Maintenance',
          type: 'collapse',
          icon: 'feather icon-sliders',
          children: [
            {
              id: 'error',
              title: 'Error',
              type: 'item',
              url: '/maintenance/error',
              target: true,
              breadcrumbs: false
            },
            {
              id: 'coming-soon',
              title: 'Coming Soon',
              type: 'item',
              url: '/maintenance/coming-soon',
              target: true,
              breadcrumbs: false
            },
            {
              id: 'offline-ui',
              title: 'Offline UI',
              type: 'item',
              url: '/maintenance/offline-ui',
              target: true,
              breadcrumbs: false
            }
          ]
        }
      ]
    },
    {
      id: 'support',
      title: 'Support',
      type: 'group',
      icon: 'icon-support',
      children: [
        {
          id: 'sample-page',
          title: 'Sample Page',
          type: 'item',
          url: '/sample-page',
          classes: 'nav-item',
          icon: 'feather icon-sidebar'
        },
        {
          id: 'documentation',
          title: 'Documentation',
          type: 'item',
          icon: 'feather icon-book',
          classes: 'nav-item',
          url: 'https://codedthemes.gitbook.io/datta/',
          target: true,
          external: true
        }
      ]
    }
  ]
};

export default menuItems;
