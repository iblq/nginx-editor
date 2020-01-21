import { Button, Row, message } from 'antd'
import React, { useRef, useState } from 'react'
import Form from './Form'
import db from '@/src/util/db'

const Setting = (props: any) => {
  const [count, setCount] = useState(0)

  const formRef: any = useRef(null)

  const onSave = () => {
    formRef.validateFieldsAndScroll((err: string | object, values: object) => {
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
      setCount(count + 1)
    }, 500)
  }

  return (
    <div>
      <Form ref={formRef} {...props} />
      <Row className="g-ta-r">
        <Button type="primary" onClick={onSave}>
          保存
        </Button>
        <Button className="g-ml-12" type="primary" onClick={reset}>
          重置
        </Button>
      </Row>
    </div>
  )
}

export default Setting
