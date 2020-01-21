const fs = require('fs-extra')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
import path from 'path'
const { app, remote } = require('electron')

const APP = app || remote.app // dev || prod env
const STORE_PATH = APP.getPath('userData') // 获取electron应用的用户目录

// 生产环境需要手动创建路径
if (process.type !== 'renderer') {
  if (!fs.pathExistsSync(STORE_PATH)) {
    fs.mkdirpSync(STORE_PATH)
  }
}

const adapter = new FileSync(path.join(STORE_PATH, '/.wf_data.json'))
const db = low(adapter)

const initConfig = {
  nginxPath: '/usr/local/etc/nginx/nginx.conf',
  nginxCmdPath: '/usr/local/bin/nginx',
  hostPath: '/etc/hosts',
  readDirList: ['mine', 'work', 'test', 'Downloads', 'Desktop'].join(','),
  sudo_pswd: '',
}

db.defaults({ config: initConfig, projects: {}, docs: {} }).write()

export default {
  set: (key, value) =>
    db
      .get(key)
      .assign(value)
      .write(),
  get: key => db.get(key).value(),
  getAll: () => db.get().value(),
  setDefault() {
    this.set('config', initConfig)
    this.set('projects', {})
    this.set('docs', {})
  },
}
