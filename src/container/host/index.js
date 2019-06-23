import { Button, Icon, Input, message } from 'antd'
import { Component } from 'react'
import superInject from 'util/superInject'
import io from '../../util/io'
import SudoModal from './SudoForm'
import CodeMirror from 'component/CodeMirror'
import { colorCfg } from '@/constant'

const fs = window.require('fs')
const path = window.require('path')
const { exec } = window.require('child_process')
const remote = window.require('electron').remote

function needPswd(str) {
  str = str.toLowerCase()

  let keys = [
    'Permission denied',
    'incorrect password',
    'Password:Sorry, try again.',
  ]
  return !!keys.find((k) => str.includes(k.toLowerCase()))
}

@superInject()
class Host extends Component {
  constructor(p) {
    super(p)
    this.state = {
      content: '',
      sudo_pswd: localStorage.getItem('sudo_pswd') || '',
      isShowModal: false,
      status: 'success',
    }

    this.store = p.globalStore

    let localData = localStorage.getItem('setting')
    localData = localData ? JSON.parse(localData) : {}

    const { hostPath } = localData

    this.userPath = remote.app.getPath('home')
    this.hostPath =
      '/etc/hosts' || hostPath || this.store.defaultSetting.hostPath
  }

  componentDidMount() {
    this.testSetting()
    this.readFile()
  }

  testSetting = () => {
    if (!this.userPath) {
      message.info('请先配置您的个人用户目录路径')
      setTimeout(() => {
        this.props.history.push('/setting')
      }, 1000)
    }
  }

  closeModal = () => this.setState({ isShowModal: false })

  showModal = () => this.setState({ isShowModal: true })

  savePwd = (v) => {
    this.setState({ sudo_pswd: v, isShowModal: false })
    localStorage.setItem('sudo_pswd', v)
  }

  readFile = async () => {
    io.pReadFile(this.store.hostPath).then((data) => {
      this.setState({ content: data, type: 'edit' })
    })
  }

  onChange = (v) => {
    this.setState({ content: v })
  }

  updateInfo = (err) => {
    this.setState({ type: 'info', info: this.state.info + err + '\r\n' })
  }

  onSaveFile = () => {
    const { content, sudo_pswd } = this.state

    let tmp_fn = path.join(this.userPath, 'tmp.txt')
    this.setState({ status: '' })
    if (typeof content !== 'string') {
      message.error('')
      return
    }

    const _this = this
    const { hostPath } = this

    io.pWriteFile(tmp_fn, content)
      .then(() => {
        let cmd

        if (!sudo_pswd) {
          cmd = [`cat "${tmp_fn}" > ${hostPath}`, `rm -rf ${tmp_fn}`].join(
            ' && ',
          )
        } else {
          cmd = [
            `echo '${sudo_pswd}' | sudo -S chmod 777 ${hostPath}`,
            `cat "${tmp_fn}" > ${hostPath}`,
            `echo '${sudo_pswd}' | sudo -S chmod 644 ${hostPath}`,
          ].join(' && ')
        }

        return cmd
      })
      .then((cmd) => {
        exec(cmd, function(error, stdout, stderr) {
          if (!error) {
            message.success('文件保存成功')
            _this.setState({ status: 'success' })
            return
          }
          if (!sudo_pswd || needPswd(stdout + stderr)) {
            _this.showModal()
          } else {
            message.error(error)
          }
        })
      })
      .catch((err) => {
        this.updateInfo(err.toString())
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
  }

  render() {
    const { content, isShowModal, status } = this.state

    return (
      <>
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
          <div className="g-sm-info">
            如有错误请检查 setting 页面命令配置是否正确
          </div>
          <div
            style={{
              color: colorCfg[status],
              fontSize: '16px',
              height: 32,
            }}
            className="g-fr"
          >
            {status === 'success' && <Icon type="check-circle" />}
            {status === 'error' && <Icon type="close-circle" />}
          </div>
        </div>
        <div className="g-content">
          <CodeMirror
            value={content}
            options={{
              lineNumbers: true,
              mode: 'shell',
            }}
            onChange={this.onChange}
          />

          {isShowModal && (
            <SudoModal saveData={this.savePwd} onCancel={this.closeModal} />
          )}
        </div>
      </>
    )
  }
}

export default Host
