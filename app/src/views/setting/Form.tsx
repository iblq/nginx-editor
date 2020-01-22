import React from 'react'
import { Form, Input } from 'antd'
import db from '@/src/util/db'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
}

const SettingForm = ({ form }: any) => {
  const { getFieldDecorator } = form

  const { nginxPath, nginxCmdPath, readDirList } = db.get('config')

  return (
    <Form {...formItemLayout}>
      <h3>Nginx</h3>
      <Form.Item label="配置文件路径">
        {getFieldDecorator('nginxPath', {
          rules: [
            {
              required: true,
              message: 'Please input your nginxPath!',
            },
          ],
          initialValue: nginxPath,
        })(<Input />)}
      </Form.Item>
      <Form.Item label="命令路径">
        {getFieldDecorator('nginxCmdPath', {
          rules: [
            {
              required: true,
              message: 'Please input your nginxCmdPath!',
            },
          ],
          initialValue: nginxCmdPath,
        })(<Input />)}
      </Form.Item>
      <h3>文档、项目相关</h3>
      <Form.Item label="搜索文件夹">
        {getFieldDecorator('readDirList', {
          rules: [
            {
              required: true,
              message: 'Please input your readDirList!',
            },
          ],
          initialValue: readDirList,
        })(<Input.TextArea style={{ width: '100%' }} />)}
      </Form.Item>
    </Form>
  )
}

export default Form.create()(SettingForm)
