import { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import { Button, Input, Row, message } from 'antd'
const fs = window.require('fs')
const path = window.require('path')
const { exec, execSync } = window.require('child_process')

import './style.less'

const { TextArea } = Input

@withRouter
class Host extends Component {
  state = {
    content: '',
    path: '/etc/hosts',
    info: '',
    type: 'edit'
  }

  componentDidMount() {
    this.readFile()
  }

  readFile = () => {
    fs.readFile(this.state.path, 'utf8', (err, data) => {
      this.setState({ content: data, type: 'edit' })
    })
  }

  onChange = (e) => {
    this.setState({ content: e.target.value })
  }

  updateInfo = (err) => {
    this.setState({ type: 'info', info: this.state.info + err + '\r\n' })
  }

  onSaveFile = () => {
    const { path, content } = this.state
    fs.writeFile(path, content, 'utf8', (err) => {
      if (err) {
        this.updateInfo(err)
        message.error('文件保存错误')
        return
      }
    })
  }

  onRestart = () => {
    const { path, content } = this.state
    fs.writeFile(path, content, 'utf8', (err) => {
      if (err) {
        this.updateInfo(err)
        message.error('文件保存错误')
        return
      }
    })
    message.success('保存成功')
  }

  render() {
    const { content, type, info } = this.state
    return (
      <div styleName="wrap">
        <div style={{ marginBottom: 12 }}>
          <Button size="small" onClick={this.readFile}>编辑</Button>
          <Button
            type="primary"
            size="small"
            style={{ marginLeft: 12 }} onClick={this.onRestart}>保存
          </Button>
        </div>
        {
          type === 'edit' ?
            <TextArea
              styleName="textarea"
              onChange={this.onChange}
              value={content}
              onBlur={this.onBlur}
            /> :
            <TextArea
              styleName="textarea"
              value={info}
            />
        }
      </div>
    )
  }
}

export default Host
