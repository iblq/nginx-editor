import { colorCfg } from '@/constant'
import { Button, Icon, message } from 'antd'
import CodeMirror from 'component/CodeMirror'
import db from 'mydb'
import { useEffect, useState } from 'react'
import io from '../../util/io'
import SudoModal from './SudoForm'

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

const userPath = remote.app.getPath('home')

const Host = () => {
  const { hostPath, sudo_pswd } = db.get('config')

  const [content, setContent] = useState('')
  const [isShowModal, setIsShowModal] = useState(false)
  const [status, setStatus] = useState('success')
  const [_sudo_pswd, setPwd] = useState(sudo_pswd)

  useEffect(() => {
    readFile()
  }, [])

  const closeModal = () => setIsShowModal(false)

  const showModal = () => setIsShowModal(true)

  const savePwd = (v) => {
    db.set({ sudo_pswd: v })
    setPwd(v)
    closeModal()
  }

  const readFile = async () => {
    io.pReadFile(hostPath).then((data) => {
      setContent(data)
    })
  }

  const onChange = (v) => setContent(v)

  const onSaveFile = () => {
    let tmp_fn = path.join(userPath, 'tmp.txt')
    setStatus('')
    if (typeof content !== 'string') {
      message.error('')
      return
    }

    io.pWriteFile(tmp_fn, content)
      .then(() => {
        let cmd

        if (!_sudo_pswd) {
          cmd = [`cat "${tmp_fn}" > ${hostPath}`, `rm -rf ${tmp_fn}`].join(
            ' && ',
          )
        } else {
          cmd = [
            `echo '${_sudo_pswd}' | sudo -S chmod 777 ${hostPath}`,
            `cat "${tmp_fn}" > ${hostPath}`,
            `echo '${_sudo_pswd}' | sudo -S chmod 644 ${hostPath}`,
          ].join(' && ')
        }

        return cmd
      })
      .then((cmd) => {
        exec(cmd, function(error, stdout, stderr) {
          if (!error) {
            message.success('文件保存成功')
            setStatus('success')
            return
          }
          if (!_sudo_pswd || needPswd(stdout + stderr)) {
            showModal()
          } else {
            message.error(error)
          }
        })
      })
      .catch((err) => {
        message.error(err.toString())
      })
  }

  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <Button size="small" onClick={readFile}>
          编辑
        </Button>
        <Button
          type="primary"
          size="small"
          style={{ marginLeft: 12 }}
          onClick={onSaveFile}
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
            mode: 'shell',
          }}
          onChange={onChange}
        />

        {isShowModal && <SudoModal saveData={savePwd} onCancel={closeModal} />}
      </div>
    </>
  )
}

export default Host
