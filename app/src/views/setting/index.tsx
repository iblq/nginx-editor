import { Button, message } from 'antd'
import React, { useRef } from 'react'
import Form from './Form'
import db from '@/src/util/db'
import { Content, Head } from '@/src/components'

const Setting = (props: any) => {
  const formRef: any = useRef(null)

  const onSave = () => {
    formRef.current.validateFieldsAndScroll((err: string | object, values: object) => {
      if (!err) {
        console.log('Received values of form: ', values)
        db.set('config', values)
        message.success('保存成功')
      }
    })
  }

  const reset = () => {
    db.setDefault()
    setTimeout(() => {
      formRef.current.resetFields()
      message.success('重置成功')
    }, 300)
  }

  return (
    <>
      <Head />
      <Content>
        <Form ref={formRef} {...props} />
        <div className="g-ta-r">
          <Button type="primary" size="small" onClick={onSave}>
            保存
          </Button>
          <Button className="g-ml-12" size="small" type="primary" onClick={reset}>
            重置
          </Button>
        </div>
      </Content>
    </>
  )
}

export default Setting
