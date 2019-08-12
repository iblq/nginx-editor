import { colorCfg } from '@/constant'
import { Button, Icon, Input, message, Row } from 'antd'
import CodeMirror from 'component/CodeMirror'
import db from 'mydb'
import { exec } from 'util/cmd'
import { useEffect, useState } from 'react'
import { pReadFile, pWriteFile } from 'util/io'
import './style.less'

const { TextArea } = Input

const Nginx = () => {
  const { nginxPath, nginxCmdPath } = db.get('config')

  const [content, setContent] = useState('')
  const [info, setInfo] = useState('')
  const [type, setType] = useState('edit')
  const [status, setStatus] = useState('success')

  const readFile = async () => {
    const [data, err] = await pReadFile(nginxPath)
    if (err) return
    setContent(data)
    setType('edit')
  }

  useEffect(() => {
    readFile()
    exec(`${nginxCmdPath}`)
  }, [])

  const onChange = (v) => setContent(v)

  const updateInfo = (err) => {
    let info = `${info} ${new Date()
      .toLocaleTimeString()
      .substr(0, 9)}>  ${err}`
    setInfo(info)
  }

  const onRestart = async () => {
    // write file
    const [writeRes, writeErr] = await pWriteFile(nginxPath, content)
    if (writeErr) {
      updateInfo(err)
      message.error('文件保存错误')
      return
    }
    // test conf
    const [res, err] = await exec(`${nginxCmdPath} -t`)

    if (err) {
      updateInfo(err)
      message.error('重启失败，请查看日志或检查命令配置是否正确')
      setStatus('error')
      return false
    }
    // reload config
    const [startRes, startErr] = await exec(`${nginxCmdPath} -s reload`)

    if (startErr) {
      updateInfo(startErr)
      return false
    }
    setStatus('success')
    message.success('重启成功')
  }

  return (
    <>
      <Row style={{ marginBottom: 12 }}>
        <Button
          size="small"
          type={type === 'edit' ? 'primary' : 'default'}
          onClick={readFile}
        >
          编辑
        </Button>
        <Button
          type="primary"
          size="small"
          style={{ marginLeft: 12 }}
          onClick={onRestart}
        >
          重启
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
          size="small"
          className="g-fr"
          type={type === 'info' ? 'primary' : 'default'}
          style={{ marginRight: 12 }}
          onClick={() => setType('info')}
        >
          日志
        </Button>
      </Row>

      <div className="g-content">
        {type === 'edit' ? (
          <CodeMirror value={content} onChange={onChange} />
        ) : (
          <TextArea
            styleName="log"
            value={info}
            options={{
              mode: 'shell',
            }}
          />
        )}
      </div>
    </>
  )
}

export default Nginx
