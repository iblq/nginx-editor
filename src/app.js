import { Component } from 'react'
import { HashRouter as Router, Switch } from 'react-router-dom'
import { hot } from 'react-hot-loader'

import './less/antd.less'
import './less/app.less'

import Menu from 'component/Menu'
import Dynamic from './dynamic'

import routerCfg from './router'
import superInject from 'util/superInject'

@superInject()
class App extends Component {
  componentDidMount() {
    setTimeout(() => {
      this.props.globalActions.readLocalList()
    }, 1000)
  }

  render() {
    return (
      <Router>
        <div className="app-root">
          <div className="app-wrapper">
            <div className="app-menu">
              <Menu />
            </div>
            <div className="app-content">
              <Switch>
                {routerCfg.map((item, i) => {
                  const { link, path } = item
                  return (
                    <Dynamic
                      key={i}
                      exact
                      path={link}
                      bundle={require('bundle-loader?lazy!./container/' + path)}
                    />
                  )
                })}
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    )
  }
}

export default hot(module)(App)
