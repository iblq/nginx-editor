import path from 'path'
const fs = require('fs-extra')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const STORE_PATH = $tools.APP_DATA_PATH // 获取electron应用的用户目录

// 生产环境需要手动创建路径
if (process.type !== 'renderer') {
  if (!fs.pathExistsSync(STORE_PATH)) {
    fs.mkdirpSync(STORE_PATH)
  }
}

const adapter = new FileSync(path.join(STORE_PATH, '/.wf_data.json'))

console.log(path.join(STORE_PATH, '/.wf_data.json'))

const db = low(adapter)

const initConfig = {
  nginxPath: '/usr/local/etc/nginx/nginx.conf',
  nginxCmdPath: '/usr/local/bin/nginx',
  hostPath: '/etc/hosts',
  readDirList: ['mine', 'work', 'test', 'Downloads', 'Desktop', 'doc'].join(','),
  sudoPswd: '',
  isFirst: 'true',
}

db.defaults({ config: initConfig, projects: {}, docs: {} }).write()

export default {
  set: (key: string, value: any) => db.set(key, value).write(),
  update: (key: string, value: any) =>
    db
      .get(key)
      .assign(value)
      .write(),
  get: (key: string) => db.get(key).value(),
  getAll: () => db.get().value(),
  setDefault() {
    this.set('config', { ...initConfig, isFirst: 'false' })
  },
}
