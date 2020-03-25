/* eslint-disable @typescript-eslint/camelcase */
import { Button, message, Icon } from 'antd'
import { openFile } from '@/src/util/cmd'
import { readLocalList } from '@/src/util/readFile'
import db from '@/src/util/db'
import React, { useEffect, useState } from 'react'
import { Content, Head } from '@/src/components'

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
          <Icon type="folder-open" />
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
      <Head>
        <Button size="small" type="primary" onClick={refresh}>
          刷新
        </Button>
      </Head>
      <Content>
        {Object.keys(_docs).map(key => {
          return (
            <div key={key}>
              <h3 className="doc-h3">{key}</h3>
              <div>{renderList(_docs[key])}</div>
            </div>
          )
        })}
      </Content>
    </>
  )
}

export default Project
