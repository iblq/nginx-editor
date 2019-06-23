import { Button, Col, Row, message } from 'antd'
import React from 'react'
import superInject from 'superInject'
import './style.less'
const { exec } = window.require('child_process')
const cmdPath = { cwd: '/' }

const Project = ({ globalActions, globalStore }) => {
  const { docs } = globalStore

  const onOpen = (path, type) => {
    try {
      exec(
        `/usr/bin/open ${path}${type === 'finder' ? '' : '/index.html'}`,
        cmdPath,
        (err, stdout, stderr) => {
          console.log(err || stdout || stderr || 'open success')
          if (err) {
            console.log(err)
          }
        },
      )
    } catch (err) {
      message.error(err)
    }
  }

  const renderList = (list) => {
    return list.map(({ name, path }) => (
      <p styleName="item" onClick={() => onOpen(path)} key={path}>
        <a href="javascript:;" onClick={() => onOpen(path)}>
          {name}
        </a>
        <a
          styleName="finder"
          style={{ float: 'right' }}
          href="javascript:;"
          onClick={(e) => {
            e.stopPropagation()
            onOpen(path, 'finder')
          }}
        >
          finder
        </a>
      </p>
    ))
  }

  return (
    <>
      <Row style={{ marginBottom: 12 }}>
        <Col span={12}>
          <Button size="small" onClick={globalActions.readLocalList}>
            刷新
          </Button>
        </Col>
        <Col span={12} />
      </Row>

      {Object.keys(docs).map((key) => {
        return (
          <div key={key}>
            <h3 styleName="h3">{key}</h3>
            <div>{renderList(docs[key])}</div>
          </div>
        )
      })}
      <div className="g-sm-info">
        点击文件夹名称可直接在 Chrome 中打开，点击 finder 查看文件目录
      </div>
    </>
  )
}

export default superInject()(Project)
