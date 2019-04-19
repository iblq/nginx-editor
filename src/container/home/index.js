import { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import { Button } from 'antd'
var fs = window.require('fs')


@inject('homeStore', 'homeActions')
@withRouter
@observer
class Home extends Component {
  state = {
    content: ''
  }
  componentDidMount() {
    this.props.homeActions.getMsg()
  }

  onEdit = () => {

    fs.readFile('/usr/local/etc/nginx/nginx.conf', 'utf8',  (err, data) => {
      console.log(data)
      this.setState({ content: data })
    })
  }

  render() {
    return (
      <div>
        <Button size="small" onClick={this.onEdit}>编辑</Button>
      </div>
    )
  }
}

export default Home
