const routes: RouteConfig[] = [
  {
    key: 'Home',
    path: '/',
    windowOptions: {
      title: 'nginx editor',
    },
    createConfig: {
      showSidebar: true,
      saveWindowBounds: true,
      openDevTools: true,
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
