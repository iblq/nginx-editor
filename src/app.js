import { Component } from 'react'
import {
  // BrowserRouter as Router
  HashRouter as Router,
  Switch
} from 'react-router-dom'
import { hot } from 'react-hot-loader'

import './less/antd.less'
import './less/app.less'

import Menu from 'component/Menu'
import Dynamic from './dynamic'

class App extends Component {
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
                <Dynamic
                  exact
                  path="/"
                  bundle={require('bundle-loader?lazy!./container/nginx')}
                />
                <Dynamic
                  exact
                  path="/host"
                  bundle={require('bundle-loader?lazy!./container/host')}
                />
                <Dynamic
                  exact
                  path="/setting"
                  bundle={require('bundle-loader?lazy!./container/setting')}
                />
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    )
  }
}

export default hot(module)(App)
