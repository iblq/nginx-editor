import { Button, Row, message } from 'antd'
import React, { useRef } from 'react'
import Form from './Form'
import db from '@/src/util/db'
import { Content, Head } from '@com/layout'

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
    }, 500)
  }

  return (
    <>
      <Head />
      <Content>
        <Form ref={formRef} {...props} />
        <div className="g-ta-r">
          <Button type="primary" onClick={onSave}>
            保存
          </Button>
          <Button className="g-ml-12" type="primary" onClick={reset}>
            重置
          </Button>
        </div>
      </Content>
    </>
  )
}

export default Setting
