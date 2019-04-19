import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './less/styles.less'

class Header extends Component {
  render() {
    return (
      <div styleName="header">
        <Link to="/" styleName="logo">
          顶象技术
        </Link>
      </div>
    )
  }
}

export default Header
