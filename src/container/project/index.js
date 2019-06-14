import { Button, Col, Row } from 'antd'
import React from 'react'
import superInject from 'superInject'
import './style.less'
const fs = window.require('fs')
const { exec } = window.require('child_process')
const cmdPath = { cwd: '/' }
const remote = window.require('electron').remote

const homePath = remote.app.getPath('home')

const readList = ['mine', 'work', 'test', 'Downloads', 'Desktop']
const ignoreList = ['node_modules']

class Project extends React.Component {
  state = {
    data: {}
  }

  componentDidMount() {
    this.start()
  }

  formatList = projects => {
    /****
     * /User/baolq/mine/admin
     * {
     *  name: 'admin',
     *  path: '/User/baolq/mine/admin',
     *  userPath: '/mine
     * }
     */
    const list = projects.map(item => {
      const arr = item.split('/')

      let name = '',
        userPath = ''

      name = arr[arr.length - 1]

      userPath = arr.slice(3, arr.length - 1)
      userPath = userPath.join('/')
      return {
        name,
        userPath,
        path: item
      }
    })

    let objData = {}
    for (let i of list) {
      let { userPath } = i
      objData[userPath] = objData[userPath] ? objData[userPath] : []
      objData[userPath].push(i)
    }
    return objData
  }

  readFile = (path = homePath, arr) => {
    if (!fs.existsSync(path)) return

    let info = fs.statSync(path)

    // 文件夹
    if (!info.isDirectory()) return

    const files = fs.readdirSync(path) //同步读取

    if (files.includes('package.json')) {
      arr.push(path)
    } else {
      const list = files.filter(
        item => item.substr(0, 1) !== '.' && !ignoreList.includes(item)
      )
      for (let i of list) {
        this.readFile(path + '/' + i, arr)
      }
    }
  }

  start = () => {
    const projects = []

    for (let p of readList) {
      this.readFile(homePath + '/' + p, projects)
    }

    console.log(projects)
    this.setState({ data: this.formatList(projects) })
  }

  onOpenInCode = path => {
    console.log(path)
    exec(`/usr/local/bin/code ${path}`, cmdPath, (err, stdout, stderr) => {
      console.log(err || stdout || stderr || 'restart success')
      if (err) {
        console.log(err)
      }
    })
  }

  renderList = list => {
    return list.map(({ name, path }, i) => (
      <Button
        onClick={() => this.onOpenInCode(path)}
        styleName="item"
        key={path}
      >
        {name}
      </Button>
    ))
  }

  render() {
    const { data } = this.state
    return (
      <div styleName="wrap">
        <Row style={{ marginBottom: 12 }}>
          <Col span={12}>
            <Button size="small" onClick={this.start}>
              刷新
            </Button>
          </Col>
          <Col span={12} />
        </Row>

        {Object.keys(data).map(key => {
          return (
            <div key={key}>
              <h3 styleName="h3">{key}</h3>
              <div>{this.renderList(data[key])}</div>
            </div>
          )
        })}
      </div>
    )
  }
}

export default superInject()(Project)
