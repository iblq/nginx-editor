import { colorCfg } from '@/constant'
import { Button, Icon, Input, message, Row } from 'antd'
import CodeMirror from 'component/CodeMirror'
import db from 'mydb'
import { useEffect, useState } from 'react'
import './style.less'
const fs = window.require('fs')
const { exec } = window.require('child_process')
const { TextArea } = Input
const cmdPath = { cwd: '/' }

const Nginx = () => {
  const { nginxPath, nginxCmdPath } = db.get('config')

  const [content, setContent] = useState('')
  const [info, setInfo] = useState('')
  const [type, setType] = useState('edit')
  const [status, setStatus] = useState('success')

  const readFile = () => {
    fs.readFile(nginxPath, 'utf8', (err, data) => {
      setContent(data)
      setType('edit')
    })
  }

  useEffect(() => {
    readFile()
  }, [])

  const onChange = (v) => setContent(v)

  const updateInfo = (err) => {
    let info = `${info} ${new Date()
      .toLocaleTimeString()
      .substr(0, 9)}>  ${err}`
    setType('info')
    setInfo(info)
  }

  const onRestart = () => {
    fs.writeFile(nginxPath, content, 'utf8', (err) => {
      if (err) {
        updateInfo(err)
        message.error('文件保存错误')
        return
      }

      exec(`${nginxCmdPath} -t`, cmdPath, (err, stdout, stderr) => {
        updateInfo(err || stdout || stderr)
        if (err) {
          message.error('命令执行错误，请查看日志或检查命令配置是否正确')
          setStatus('error')
          return false
        }

        exec(`${nginxCmdPath} -s reload`, cmdPath, (err, stdout, stderr) => {
          updateInfo(err || stdout || stderr || 'restart success')
          if (err) {
            return false
          }
          setStatus('success')
          message.success('重启成功')
        })
      })
    })
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
          size="small"
          type={type === 'info' ? 'primary' : 'default'}
          style={{ marginLeft: 12 }}
          onClick={() => setType('info')}
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
          onClick={onRestart}
        >
          重启
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
