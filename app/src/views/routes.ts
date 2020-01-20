const routes: RouteConfig[] = [
  {
    key: 'nginx',
    path: '/',
    // redirect: { to: '/demo?form=home' },
    windowOptions: {
      title: 'App Home',
      width: 1200,
      height: 800,
    },
    createConfig: {
      showSidebar: true,
      saveWindowBounds: true,
      openDevTools: true,
    },
  },
]

export default routes
