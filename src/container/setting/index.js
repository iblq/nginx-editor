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
    this.form.setFieldsValue(this.props.globalStore.defaultSetting)
  };

  render() {
    return (
      <div>
        <Form ref={el => (this.form = el)} {...this.props} />
        <Row className="g-ta-r">
          <Button type="primary" onClick={this.onSave}>
            保存
          </Button>
          <Button className="g-ml-12" type="primary" onClick={this.reset}>
            重置
          </Button>
        </Row>
      </div>
    )
  }
}

export default Setting
