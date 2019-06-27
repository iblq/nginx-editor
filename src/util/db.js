const low = window.require('lowdb')
const FileSync = window.require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
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
  get: (key) => db.get(key).value(),
  getAll: () => db.get().value(),
  setDefault: () =>
    db
      .get('config')
      .assign(initConfig)
      .write(),
}
