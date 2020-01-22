/* eslint-disable @typescript-eslint/camelcase */
import { Button, Col, Row } from 'antd'
import { openInCode } from '@/src/util/cmd'
import React, { useEffect, useState } from 'react'
import db from '@/src/util/db'
import { readLocalList } from '@/src/util/readFile'

import './style.less'

const Project = () => {
  const [_projects, set_projects] = useState({})

  useEffect(() => {
    const projects = db.get('projects')
    set_projects(projects)
  }, [])

  const renderList = (list: any[]) => {
    return list.map(({ name, path }) => (
      <Button onClick={() => openInCode(path)} className="projcet-item" key={path}>
        {name}
      </Button>
    ))
  }

  const refresh = () => {
    const { projects } = readLocalList()
    set_projects(projects)
  }

  return (
    <div className="projcet-wrap">
      <Row className="g-header" style={{ marginBottom: 12 }}>
        <Col span={12}>
          <Button size="small" onClick={refresh}>
            刷新
          </Button>
        </Col>
        <Col span={12} />
      </Row>
      <div className="g-content">
        {Object.keys(_projects).map(key => {
          return (
            <div key={key}>
              <h3 className="projcet-h3">{key}</h3>
              <div>{renderList(_projects[key])}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Project
