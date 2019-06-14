import React, { Component } from 'react'
import { Form, Input, Row, Col } from 'antd'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  }
}

@Form.create()
export default class SettingForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form

    const localValue = localStorage.getItem('setting')
    const initValue = localValue
      ? JSON.parse(localValue)
      : this.props.globalStore.defaultSetting

    const { nginxPath, nginxCmdPath } = initValue

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <h3>Nginx</h3>
        <Form.Item label="配置文件路径">
          {getFieldDecorator('nginxPath', {
            rules: [
              {
                required: true,
                message: 'Please input your nginxPath!'
              }
            ],
            initialValue: nginxPath
          })(<Input />)}
        </Form.Item>
        <Form.Item label="命令路径">
          {getFieldDecorator('nginxCmdPath', {
            rules: [
              {
                required: true,
                message: 'Please input your nginxCmdPath!'
              }
            ],
            initialValue: nginxCmdPath
          })(<Input />)}
        </Form.Item>
      </Form>
    )
  }
}
