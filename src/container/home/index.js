import { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import { Button, Input, Row, message } from 'antd'
const fs = window.require('fs')
const path = window.require('path')
const { exec, execSync } = window.require('child_process')
import './style.less';
const { TextArea } = Input;
const cmdPath = {cwd: '/'}

@inject('homeStore', 'homeActions')
@withRouter
@observer
class Home extends Component {
  state = {
    content: '',
    path: '/usr/local/etc/nginx/nginx.conf',
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

      exec('/usr/local/bin/nginx -t', cmdPath, (err, stdout, stderr) => {
        this.updateInfo(err || stdout || stderr)
        if (err) {
          message.error('配置文件编辑错误，请修改后再试')
          return false
        }
        message.success('编辑成功，正在重启')

        exec('/usr/local/bin/brew services restart nginx', cmdPath, (err, stdout, stderr) => {
          this.updateInfo(err || stdout || stderr)
          if (err) {
            return false
          }
          message.success('重启成功')
        })
      })

    })
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
            style={{ marginLeft: 12 }} onClick={this.onRestart}>重启
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

export default Home
