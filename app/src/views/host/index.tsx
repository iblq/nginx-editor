import { Button, Icon, message } from 'antd'
import React, { useEffect, useState, useRef, Fragment } from 'react'

import SudoModal from './SudoForm'

import { CodeMirror } from '@/src/components'
import { exec } from '@/src/util/cmd'
import db from '@/src/util/db'
import { pReadFile, pWriteFile } from '@/src/util/io'
import { isNeedPswd } from '@/src/util'
import { colorCfg } from '@/src/constant'

const userPath = $tools.APP_DATA_PATH

const Host = () => {
  const { hostPath, sudoPswd } = db.get('config')

  const [content, setContent] = useState('')
  const [isShowModal, setIsShowModal] = useState(false)
  const [status, setStatus] = useState('success')
  const [_sudoPswd, setPwd] = useState(sudoPswd)

  const contentRef = useRef('')
  contentRef.current = content

  useEffect(() => {
    readFile()
  }, [])

  const closeModal = () => setIsShowModal(false)

  const showModal = () => setIsShowModal(true)

  const savePwd = (v: string) => {
    db.set('config', { sudoPswd: v })
    setPwd(v)
    closeModal()
  }

  const readFile = async () => {
    const [data] = await pReadFile(hostPath)
    setContent(data || '')
  }

  const onChange = (v: string) => setContent(v)

  const onSaveFile = async () => {
    const tempFilePath = path.join(userPath, '.wf_temp.txt')
    setStatus('')
    if (typeof contentRef.current !== 'string') {
      message.error('保存出错')
      return
    }

    const [err] = await pWriteFile(tempFilePath, contentRef.current)
    if (err) return

    let cmd
    if (!_sudoPswd) {
      cmd = [`cat "${tempFilePath}" > ${hostPath}`, `rm -rf ${tempFilePath}`].join(' && ')
    } else {
      cmd = [
        `echo '${_sudoPswd}' | sudo -S chmod 777 ${hostPath}`,
        `cat "${tempFilePath}" > ${hostPath}`,
        `echo '${_sudoPswd}' | sudo -S chmod 644 ${hostPath}`,
      ].join(' && ')
    }

    const [stdout, error] = await exec(cmd)
    if (!error) {
      message.success('保存成功')
      setStatus('success')
      return
    }

    if (!_sudoPswd || isNeedPswd(stdout + error)) {
      showModal()
    } else {
      message.error(error)
    }
  }

  return (
    <Fragment>
      <div style={{ marginBottom: 12 }}>
        <Button type="primary" size="small" style={{ marginLeft: 12 }} onClick={onSaveFile}>
          保存
        </Button>
        <div className="g-sm-info">如有错误请检查 setting 页面命令配置是否正确</div>
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
    </Fragment>
  )
}

export default Host
