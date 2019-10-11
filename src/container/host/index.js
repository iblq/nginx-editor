import { colorCfg } from '@/constant'
import { Button, Icon, message } from 'antd'
import CodeMirror from 'component/CodeMirror'
import db from 'mydb'
import { useEffect, useState, useRef } from 'react'
import { pReadFile, pWriteFile } from 'util/io'
import SudoModal from './SudoForm'
import { exec } from 'util/cmd'
import { isNeedPswd } from 'util'

const path = window.require('path')
const remote = window.require('electron').remote

const userPath = remote.app.getPath('home')

const Host = () => {
  const { hostPath, sudo_pswd } = db.get('config')

  const [content, setContent] = useState('')
  const [isShowModal, setIsShowModal] = useState(false)
  const [status, setStatus] = useState('success')
  const [_sudo_pswd, setPwd] = useState(sudo_pswd)

  const contentRef = useRef('')
  contentRef.current = content

  useEffect(() => {
    readFile()
  }, [])

  const closeModal = () => setIsShowModal(false)

  const showModal = () => setIsShowModal(true)

  const savePwd = (v) => {
    db.set('config', { sudo_pswd: v })
    setPwd(v)
    closeModal()
  }

  const readFile = async () => {
    let [data] = await pReadFile(hostPath)
    setContent(data || '')
  }

  const onChange = (v) => setContent(v)

  const onSaveFile = async () => {
    let tempFilePath = path.join(userPath, '.wf_temp.txt')
    setStatus('')
    if (typeof contentRef.current !== 'string') {
      message.error('保存出错')
      return
    }

    const [err] = await pWriteFile(tempFilePath, contentRef.current)
    if (err) return

    let cmd
    if (!_sudo_pswd) {
      cmd = [
        `cat "${tempFilePath}" > ${hostPath}`,
        `rm -rf ${tempFilePath}`,
      ].join(' && ')
    } else {
      cmd = [
        `echo '${_sudo_pswd}' | sudo -S chmod 777 ${hostPath}`,
        `cat "${tempFilePath}" > ${hostPath}`,
        `echo '${_sudo_pswd}' | sudo -S chmod 644 ${hostPath}`,
      ].join(' && ')
    }

    const [stdout, error] = await exec(cmd)
    if (!error) {
      message.success('保存成功')
      setStatus('success')
      return
    }

    if (!_sudo_pswd || isNeedPswd(stdout + error)) {
      showModal()
    } else {
      message.error(error)
    }
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
          onSave={onSaveFile}
        />

        {isShowModal && <SudoModal saveData={savePwd} onCancel={closeModal} />}
      </div>
    </>
  )
}

export default Host
