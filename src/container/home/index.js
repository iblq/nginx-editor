import { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { observer, inject } from 'mobx-react'

@inject('homeStore', 'homeActions')
@withRouter
@observer
class Home extends Component {
  componentDidMount() {
    this.props.homeActions.getMsg()
  }

  render() {
    return <div>{this.props.homeStore.msg}</div>
  }
}

export default Home
