/* eslint-disable @typescript-eslint/camelcase */
import { Button, Col, Row } from 'antd'
import { openInCode } from '@/src/util/cmd'
import React, { useEffect, useState } from 'react'
import db from '@/src/util/db'
import { readLocalList } from '@/src/util/readFile'
import { Content, Head } from '@/src/components'

import './style.less'

const Project = () => {
  const [_projects, set_projects] = useState({})

  useEffect(() => {
    const projects = db.get('projects')
    set_projects(projects)
  }, [])

  const renderList = (list: any[]) => {
    return list.map(({ name, path }) => (
      <Col className="project-wrap-item" xs={12} sm={12} md={8} lg={8} key={path}>
        <Button onClick={() => openInCode(path)} className="projcet-item">
          {name}
        </Button>
      </Col>
    ))
  }

  const refresh = () => {
    const { projects } = readLocalList()
    set_projects(projects)
  }

  return (
    <div>
      <Head>
        <Button size="small" type="primary" onClick={refresh}>
          刷新
        </Button>
      </Head>
      <Content>
        {Object.keys(_projects).map(key => {
          return (
            <div key={key}>
              <h3 className="projcet-h3">{key}</h3>
              <Row>
                <div>{renderList(_projects[key])}</div>
              </Row>
            </div>
          )
        })}
      </Content>
    </div>
  )
}

export default Project
