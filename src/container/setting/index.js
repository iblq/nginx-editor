import { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import { Button, Input, Row, message } from 'antd'
const fs = window.require('fs')

import Form from './components/Form'

@inject('globalStore', 'globalActions')
@observer
class Setting extends Component {
  componentDidMount() {}

  onSave = () => {
    this.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        localStorage.setItem('setting', JSON.stringify(values))
        this.props.globalActions.merge(values)
      }
    })
  };

  reset = () => {
    this.props.globalActions.reset()
    localStorage.clear('setting')
  };

  render() {
    return (
      <div>
        <Form ref={el => (this.form = el)} {...this.props} />
        <Button type="primary" onClick={this.onSave}>
          保存
        </Button>
        <Button type="primary" onClick={this.reset}>
          重置
        </Button>
      </div>
    )
  }
}

export default Setting
