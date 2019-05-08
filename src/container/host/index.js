import { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Input, Icon, message } from 'antd'
const fs = window.require('fs')
const path = window.require('path')
const { exec, execSync } = window.require('child_process')
var sudo = window.require('sudo-prompt')
var options = {
  name: 'Electron'
}

import './style.less'
import io from '../../util/io'
import SudoModal from './SudoForm'
const { TextArea } = Input

const filePath = '/etc/hosts'
const home_path = '/Users/baolq/'

function needPswd(str) {
  str = str.toLowerCase()

  console.log('---')
  console.log(str)
  let keys = [
    'Permission denied',
    'incorrect password',
    'Password:Sorry, try again.'
  ]
  return !!keys.find(k => str.includes(k.toLowerCase()))
}

@withRouter
class Host extends Component {
  state = {
    content: '',
    path: '/etc/hosts',
    info: '',
    type: 'edit',
    sudo_pswd: localStorage.getItem('sudo_pswd') || '',
    isShowModal: false,
    status: 'success'
  };

  componentDidMount() {
    this.readFile()
  }

  closeModal = () => this.setState({ isShowModal: false });

  showModal = () => this.setState({ isShowModal: true });

  savePwd = v => {
    this.setState({ sudo_pswd: v, isShowModal: false })
    localStorage.setItem('sudo_pswd', v)
  };

  readFile = async () => {
    io.pReadFile(filePath).then(data => {
      this.setState({ content: data, type: 'edit' })
    })
  };

  onChange = e => {
    this.setState({ content: e.target.value })
  };

  updateInfo = err => {
    this.setState({ type: 'info', info: this.state.info + err + '\r\n' })
  };

  onSaveFile = () => {
    const { content, sudo_pswd } = this.state
    let tmp_fn = path.join(home_path, 'tmp.txt')
    this.setState({ status: '' })
    if (typeof content !== 'string') {
      message.error('')
      return;
    }

    const _this = this

    io.pWriteFile(tmp_fn, content)
      .then(() => {
        let cmd

        if (!sudo_pswd) {
          cmd = [`cat "${tmp_fn}" > ${filePath}`, `rm -rf ${tmp_fn}`].join(
            ' && '
          )
        } else {
          cmd = [
            `echo '${sudo_pswd}' | sudo -S chmod 777 ${filePath}`,
            `cat "${tmp_fn}" > ${filePath}`,
            `echo '${sudo_pswd}' | sudo -S chmod 644 ${filePath}`
            // , 'rm -rf ' + tmp_fn
          ].join(' && ')
        }

        return cmd
      })
      .then(cmd => {
        exec(cmd, function(error, stdout, stderr) {
          if (!error) {
            message.success('文件保存成功')
            _this.setState({ status: 'success' })
            return;
          }
          if (!sudo_pswd || needPswd(stdout + stderr)) {
            _this.showModal()
          } else {
            message.error(error)
          }
        })
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
    })
  };

  render() {
    const { content, type, info, isShowModal, status } = this.state
    const colorCfg = {
      success: '#52c41a',
      error: '#f5222d'
    }

    return (
      <div styleName="wrap">
        <div style={{ marginBottom: 12 }}>
          <Button size="small" onClick={this.readFile}>
            编辑
          </Button>
          <Button
            type="primary"
            size="small"
            style={{ marginLeft: 12 }}
            onClick={this.onSaveFile}
          >
            保存
          </Button>
          <div
            style={{ color: colorCfg[status], fontSize: '16px', height: 32 }}
            className="g-fr"
          >
            {status === 'success' && <Icon type="check-circle" />}
            {status === 'error' && <Icon type="close-circle" />}
          </div>
        </div>
        {type === 'edit' ? (
          <TextArea
            styleName="textarea"
            onChange={this.onChange}
            value={content}
            onBlur={this.onBlur}
          />
        ) : (
          <TextArea styleName="textarea" value={info} />
        )}

        {isShowModal && (
          <SudoModal saveData={this.savePwd} onCancel={this.closeModal} />
        )}
      </div>
    )
  }
}

export default Host
