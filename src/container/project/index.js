import { Button, Col, Row } from 'antd'
import React from 'react'
import superInject from 'superInject'
import './style.less'
const { exec } = window.require('child_process')
const cmdPath = { cwd: '/' }

const Project = ({ globalActions, globalStore }) => {
  const { projects } = globalStore

  const onOpenInCode = path => {
    exec(`/usr/local/bin/code ${path}`, cmdPath, (err, stdout, stderr) => {
      console.log(err || stdout || stderr || 'restart success')
      if (err) {
        console.log(err)
      }
    })
  }

  const renderList = list => {
    return list.map(({ name, path }, i) => (
      <Button onClick={() => onOpenInCode(path)} styleName="item" key={path}>
        {name}
      </Button>
    ))
  }

  return (
    <div styleName="wrap">
      <Row style={{ marginBottom: 12 }}>
        <Col span={12}>
          <Button size="small" onClick={globalActions.readLocalList}>
            刷新
          </Button>
        </Col>
        <Col span={12} />
      </Row>

      {Object.keys(projects).map(key => {
        return (
          <div key={key}>
            <h3 styleName="h3">{key}</h3>
            <div>{renderList(projects[key])}</div>
          </div>
        )
      })}
    </div>
  )
}

export default superInject()(Project)
