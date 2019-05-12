import { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Button, Input, Row, Col, message, Icon, Spin } from 'antd'
import moment from 'moment'
const fs = window.require('fs')
const path = window.require('path')
const { exec } = window.require('child_process')
import './style.less'
const { TextArea } = Input
const cmdPath = { cwd: '/' }

// @inject('homeStore', 'homeActions')
// @withRouter
// @observer
class Nginx extends Component {
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
    const { content, type, info, status } = this.state
    const colorCfg = {
      success: '#52c41a',
      error: '#f5222d'
    }
    return (
      <div styleName="wrap">
        <Row style={{ marginBottom: 12 }}>
          <Col span={12}>
            <Button
              size="small"
              type={type === 'edit' ? 'primary' : 'default'}
              onClick={this.readFile}
            >
              编辑
            </Button>
            <Button
              size="small"
              type={type === 'info' ? 'primary' : 'default'}
              style={{ marginLeft: 12 }}
              onClick={() => this.setState({ type: 'info' })}
            >
              日志
            </Button>
          </Col>
          <Col span={12}>
            <div
              style={{ color: colorCfg[status], fontSize: '16px' }}
              className="g-fr"
            >
              {status === 'success' && <Icon type="check-circle" />}
              {status === 'error' && <Icon type="close-circle" />}
            </div>
            <Button
              type="primary"
              size="small"
              className="g-fr"
              style={{ marginRight: 12 }}
              onClick={this.onRestart}
            >
              重启
            </Button>
          </Col>
        </Row>

        <Spin spinning={this.state.loading} tip="Loading...">
          {type === 'edit' ? (
            <TextArea
              styleName="textarea"
              onChange={this.onChange}
              value={content}
              onBlur={this.onBlur}
            />
          ) : (
            <TextArea styleName="log" value={info} />
          )}
        </Spin>
      </div>
    )
  }
}

export default Nginx
