const fs = require('fs')
const ignoreList = ['node_modules']
import db from './db'

const homePath = $tools.USER_HOME_PATH

export const formatList = (projects: object[]) => {
  /****
   * /User/baolq/mine/admin
   * {
   *  name: 'admin',
   *  path: '/User/baolq/mine/admin',
   *  userPath: '/mine
   * }
   */
  const list = projects.map((item: any) => {
    const arr = item.split('/')

    let name = '',
      userPath: [] = []

    name = arr[arr.length - 1]

    userPath = arr.slice(3, arr.length - 1)
    const userPathStr = userPath.join('/')
    return {
      name,
      userPath: userPathStr,
      path: item,
    }
  })

  const objData = {}
  for (const i of list) {
    const { userPath } = i
    objData[userPath] = objData[userPath] ? objData[userPath] : []
    objData[userPath].push(i)
  }
  return objData
}

/**
 *
 * @param path {string} file url
 * @param projects {array} project arr
 * @param docs {array} doc arr
 */
export const readFile = (path: string, projects: any[], docs: any[]) => {
  try {
    if (!fs.existsSync(path)) return

    const info = fs.statSync(path)

    // 文件夹
    if (!info.isDirectory()) return

    const files: any[] = fs.readdirSync(path) //同步读取文件夹

    // 判断是否是 node 应用
    if (files.includes('package.json')) {
      projects.push(path)
      return
    }

    // 判断是否是设计文档
    if (
      files.includes('index.html') &&
      (files.includes('assets') ||
        files.includes('images') ||
        files.includes('files') ||
        files.includes('links'))
    ) {
      docs.push(path)
      return
    }

    // 不是的话递归查看子文件夹
    const list = files.filter(item => item.substr(0, 1) !== '.' && !ignoreList.includes(item))
    for (const i of list) {
      readFile(path + '/' + i, projects, docs)
    }
  } catch (err) {
    return false
  }
}

export const readLocalList = () => {
  const { readDirList } = db.get('config')
  const projects: AnyObj[] = []
  const docs: AnyObj[] = []

  const rootDirs: any[] = readDirList.split(/,|，/).filter((item: any) => item && item.length > 1)

  for (const dir of rootDirs) {
    readFile(homePath + '/' + dir, projects, docs)
  }

  const projectsObj = formatList(projects)
  const docsObj = formatList(docs)

  db.set('projects', projectsObj)
  db.set('docs', docsObj)
  return { projects: projectsObj, docs: docsObj }
}
