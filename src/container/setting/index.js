import { Button, Row, message } from 'antd'
import { Component } from 'react'
import Form from './Form'
import db from 'mydb'

class Setting extends Component {
  componentDidMount() {}

  onSave = () => {
    this.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        db.set('config', values)
        message.success('保存成功')
      }
    })
  }

  reset = () => {
    db.setDefault()
    setTimeout(() => {
      this.forceUpdate()
    }, 500)
  }

  render() {
    return (
      <div>
        <Form ref={(el) => (this.form = el)} {...this.props} />
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
