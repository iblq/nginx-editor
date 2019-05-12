import { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import { Button, Input, Row, Col, message, Icon, Spin } from 'antd'
import moment from 'moment'
const fs = window.require('fs')
const path = window.require('path')
const { exec, execSync } = window.require('child_process')
import './style.less'
const { TextArea } = Input
const cmdPath = { cwd: '/' }

// @inject('homeStore', 'homeActions')
// @withRouter
// @observer
class Home extends Component {
  state = {
    content: '',
    path: '/usr/local/etc/nginx/nginx.conf',
    info: '',
    type: 'edit',
    status: 'success',
    loading: false
  };

  componentDidMount() {
    this.readFile()
  }

  readFile = () => {
    fs.readFile(this.state.path, 'utf8', (err, data) => {
      this.setState({ content: data, type: 'edit' })
    })
  };

  onChange = e => {
    this.setState({ content: e.target.value })
  };

  updateInfo = err => {
    let info = `${this.state.info} ${moment(new Date()).format(
      'h:mm:ss'
    )}>  ${err}`
    this.setState({ type: 'info', info })
  };

  onSaveFile = () => {
    const { path, content } = this.state
    fs.writeFile(path, content, 'utf8', err => {
      if (err) {
        this.updateInfo(err)
        message.error('文件保存错误')
        return;
      }
    })
  };

  onRestart = () => {
    const { path, content } = this.state
    fs.writeFile(path, content, 'utf8', err => {
      if (err) {
        this.updateInfo(err)
        message.error('文件保存错误')
        return;
      }

      exec('/usr/local/bin/nginx -t', cmdPath, (err, stdout, stderr) => {
        this.updateInfo(err || stdout || stderr)
        if (err) {
          message.error('配置文件编辑错误，请修改后再试')
          this.setState({ status: 'error' })
          return false
        }

        this.setState({ loading: true })

        exec(
          '/usr/local/bin/nginx -s reload',
          cmdPath,
          (err, stdout, stderr) => {
            console.log(new Date().getDate())
            this.updateInfo(err || stdout || stderr || 'restart success')
            if (err) {
              return false
            }
            this.setState({ status: 'success', loading: false })
            message.success('重启成功')
          }
        )
      })
    })
  };

  render() {
    return (
      <div styleName="wrap">
        <Row style={{ marginBottom: 12 }}>
          <Col span={12}>
            <Button
              size="small"
              type={this.state.type === 'edit' ? 'primary' : 'default'}
              onClick={this.readFile}
            >
              刷新
            </Button>
          </Col>
          <Col span={12} />
        </Row>
      </div>
    )
  }
}

export default Home
