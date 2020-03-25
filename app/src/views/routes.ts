const routes: RouteConfig[] = [
  {
    key: 'Home',
    path: '/',
    windowOptions: {
      title: 'NginxEditor',
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
