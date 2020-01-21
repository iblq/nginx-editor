const routes: RouteConfig[] = [
  {
    key: 'Home',
    path: '/',
    windowOptions: {
      title: 'Nginx editor',
      width: 800,
      height: 600,
    },
    createConfig: {
      showSidebar: true,
      saveWindowBounds: true,
      openDevTools: false,
    },
  },
  {
    key: 'Doc',
    path: '/doc',
  },
  {
    key: 'Host',
    path: '/host',
  },
  {
    key: 'Nginx',
    path: '/',
  },
  {
    key: 'Setting',
    path: '/setting',
  },
  {
    key: 'Project',
    path: '/project',
  },
]

export default routes
