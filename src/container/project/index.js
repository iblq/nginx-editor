import { Button, Col, Row } from 'antd'
import './style.less'
const { exec } = window.require('child_process')
const cmdPath = { cwd: '/' }
import { useEffect, useState } from 'react'
import db from 'mydb'
import { readLocalList } from '@/util/readFile'

const Project = () => {
  const [_projects, set_projects] = useState({})

  useEffect(() => {
    const projects = db.get('projects')
    set_projects(projects)
  }, [])

  const onOpenInCode = (path) => {
    exec(`/usr/local/bin/code ${path}`, cmdPath, (err, stdout, stderr) => {
      console.log(err || stdout || stderr || 'restart success')
      if (err) {
        console.log(err)
      }
    })
  }

  const renderList = (list) => {
    return list.map(({ name, path }, i) => (
      <Button onClick={() => onOpenInCode(path)} styleName="item" key={path}>
        {name}
      </Button>
    ))
  }

  const refresh = () => {
    let { projects } = readLocalList()
    set_projects(projects)
  }

  return (
    <div styleName="wrap">
      <Row style={{ marginBottom: 12 }}>
        <Col span={12}>
          <Button size="small" onClick={refresh}>
            刷新
          </Button>
        </Col>
        <Col span={12} />
      </Row>

      {Object.keys(_projects).map((key) => {
        return (
          <div key={key}>
            <h3 styleName="h3">{key}</h3>
            <div>{renderList(_projects[key])}</div>
          </div>
        )
      })}

      <div className="g-sm-info">点击文件夹名称可直接在 vscode 中打开</div>
    </div>
  )
}

export default Project
