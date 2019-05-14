import { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Button, Input, Row, Col, message, Icon, Spin } from 'antd'
import moment from 'moment'
// import CodeMirror from 'react-codemirror';
// import 'codemirror/mode/shell/shell';
const fs = window.require('fs')
const path = window.require('path')
const { exec } = window.require('child_process')
import './style.less'
const { TextArea } = Input
const cmdPath = { cwd: '/' }

@inject('globalStore')
@observer
class Nginx extends Component {
  constructor(p) {
    super(p)

    this.store = p.globalStore
    let localData = localStorage.getItem('setting')
    localData = localData ? JSON.parse(localData) : {}

    const { nginxPath, nginxCmdPath } = localData
    this.nginxPath = nginxPath || this.store.defaultSetting.nginxPath
    this.nginxCmdPath = nginxCmdPath || this.store.defaultSetting.nginxCmdPath
  }
  state = {
    content: '',
    info: '',
    type: 'edit',
    status: 'success',
    loading: false
  };

  componentDidMount() {
    this.readFile()
  }

  readFile = () => {
    fs.readFile(this.nginxPath, 'utf8', (err, data) => {
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

  onRestart = () => {
    const { content } = this.state
    const { nginxPath, nginxCmdPath } = this

    fs.writeFile(nginxPath, content, 'utf8', err => {
      if (err) {
        this.updateInfo(err)
        message.error('文件保存错误')
        return;
      }

      exec(`${nginxCmdPath} -t`, cmdPath, (err, stdout, stderr) => {
        this.updateInfo(err || stdout || stderr)
        if (err) {
          message.error('命令执行错误，请查看日志或检查命令配置是否正确')
          this.setState({ status: 'error' })
          return false
        }

        this.setState({ loading: true })

        exec(`${nginxCmdPath} -s reload`, cmdPath, (err, stdout, stderr) => {
          this.updateInfo(err || stdout || stderr || 'restart success')
          if (err) {
            return false
          }
          this.setState({ status: 'success', loading: false })
          message.success('重启成功')
        })
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
          <div className="g-sm-info">
            如有错误请检查 setting 页面命令配置是否正确
          </div>
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
