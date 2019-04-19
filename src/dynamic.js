import React, { Component } from 'react'
import { Route } from 'react-router-dom'

class Loader extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      mod: null
    }
  }

  componentDidMount() {
    this.bundle()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.bundle !== this.props.bundle) {
      this.bundle()
    }
  }

  bundle() {
    this.setState({
      mod: null
    })

    this.props.bundle(mod => {
      this.setState({
        mod: mod.default || mod
      })
    })
  }

  render() {
    return this.state.mod ? this.props.render(this.state.mod) : null
  }
}

class Dynamic extends Component {
  render() {
    return (
      <Route
        {...this.props}
        render={props => {
          return (
            <Loader
              bundle={this.props.bundle}
              render={Component => <Component {...props} />}
            />
          )
        }}
      />
    )
  }
}

export default Dynamic
