import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Menu as AntdMenu, Icon } from 'antd'

import './less/styles.less'

const { Item } = AntdMenu

const menuCfg = [
  {
    title: '首页',
    link: '/',
    icon: 'home'
  }
]

class Menu extends Component {
  handleClick(e) {
    const router = this.context.router
    const pathname = router.route.location.pathname
    const target = e.item.props.pathname

    if (pathname !== target) {
      router.history.push(target)
    }
  }

  render() {
    const router = this.context.router
    const pathname = router.route.location.pathname
    const currentMenu =
      menuCfg.find(item => item.link === pathname) || menuCfg[0]

    return (
      <div>
        <AntdMenu
          mode="inline"
          theme="dark"
          defaultSelectedKeys={currentMenu ? [currentMenu.title] : []}
          onClick={this.handleClick.bind(this)}
        >
          {menuCfg.map(item => {
            return (
              <Item key={item.title} pathname={item.link}>
                {item.icon ? <Icon type={item.icon} /> : null}
                <span>{item.title}</span>
              </Item>
            )
          })}
        </AntdMenu>
      </div>
    )
  }
}

Menu.contextTypes = {
  router: PropTypes.object
}

export default Menu
