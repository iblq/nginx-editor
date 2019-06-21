import { observable } from 'mobx'

class Store {
  @observable msg = ''

  @observable
  defaultSetting = {
    nginxPath: '/usr/local/etc/nginx/nginx.conf',
    nginxCmdPath: '/usr/local/bin/nginx',
    hostPath: '/etc/hosts',
  }

  @observable
  nginxPath = '/usr/local/etc/nginx/nginx.conf'
  @observable
  nginxCmdPath = '/usr/local/bin/nginx'

  @observable
  hostPath = '/etc/hosts'
  @observable
  userPath = ''

  // node 项目列表
  @observable
  projects = {}
  // 设计、文档列表
  @observable
  docs = {}
}

export default new Store()
