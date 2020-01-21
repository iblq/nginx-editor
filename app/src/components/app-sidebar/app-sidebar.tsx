import React from 'react'
import { Icon, Tooltip } from 'antd'
import { withStore } from '@/src/components'

import AppSideMenus from './side-menus.json'
import './app-sidebar.less'

type SideMenuItem = typeof AppSideMenus[0]

export class AppSidebar extends React.Component {
  state = {
    currentPath: '#/',
  }

  onMenuSelect = (path: string) => {
    console.log(path)
    this.setState({ currentPath: path })
  }

  render() {
    return (
      <div className="app-sidebar">
        <div className="mt-24 flex center app-sidebar-header">
          <img width="40" src={$tools.APP_ICON} />
        </div>

        <div className="flex column side-menu">{AppSideMenus.map(this.renderMenuItem)}</div>
      </div>
    )
  }

  renderMenuItem = ({ icon, path, title }: SideMenuItem) => {
    const { currentPath } = this.state
    return (
      // <Tooltip key={path} overlayClassName="side-menu-item-tooltip" placement="right" title={title}>
      <a
        key={path}
        className={`side-menu-item ${path === currentPath ? 'active' : ''}`}
        href={path}
        onClick={() => this.onMenuSelect(path)}
      >
        <Icon className="side-menu-icon" type={icon} />
        <span className="side-menu-title">{title}</span>
      </a>
      // </Tooltip>
    )
  }
} // class AppSidebar end
