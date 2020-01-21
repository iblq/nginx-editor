/* eslint-disable @typescript-eslint/camelcase */
import { Button, Col, Row, message } from 'antd'
import { openFile } from '@/src/util/cmd'
import { readLocalList } from '@/src/util/readFile'
import db from '@/src/util/db'
import React, { useEffect, useState } from 'react'

import './style.less'

interface ListItem {
  name: string
  path: string
}

const Project = () => {
  const [_docs, set_docs] = useState({})

  useEffect(() => {
    const docs = db.get('docs')
    set_docs(docs)
  }, [])

  const onOpen = async (path: string, type?: string) => {
    try {
      const _path = `${path}${type === 'finder' ? '' : '/index.html'}`
      await openFile(_path)
    } catch (err) {
      message.error(err)
    }
  }

  const renderList = (list: any[]) => {
    return list.map(({ name, path }) => (
      <p className="doc-item" onClick={() => onOpen(path)} key={path}>
        <a href="javascript:;" onClick={() => onOpen(path)}>
          {name}
        </a>
        <a
          className="doc-finder"
          style={{ float: 'right' }}
          href="javascript:;"
          onClick={e => {
            e.stopPropagation()
            onOpen(path, 'finder')
          }}
        >
          finder
        </a>
      </p>
    ))
  }

  const refresh = () => {
    const { docs } = readLocalList()
    set_docs(docs)
  }

  return (
    <>
      <Row style={{ marginBottom: 12 }}>
        <Col span={12}>
          <Button size="small" onClick={refresh}>
            刷新
          </Button>
        </Col>
        <Col span={12} />
      </Row>

      {Object.keys(_docs).map(key => {
        return (
          <div key={key}>
            <h3 className="doc-h3">{key}</h3>
            <div>{renderList(_docs[key])}</div>
          </div>
        )
      })}
      <div className="doc-g-sm-info">点击文件夹名称可直接在 Chrome 中打开，点击 finder 查看文件目录</div>
    </>
  )
}

export default Project
