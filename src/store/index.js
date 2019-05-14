import { observable } from 'mobx'

class Store {
  @observable msg = '';

  @observable
  defaultSetting = {
    nginxPath: '/usr/local/etc/nginx/nginx.conf',
    nginxCmdPath: '/usr/local/bin/nginx',
    hostPath: '/etc/hosts',
    userPath: '/Users/${your name}'
  };

  @observable
  nginxPath = '/usr/local/etc/nginx/nginx.conf';
  @observable
  nginxCmdPath = '/usr/local/bin/nginx';

  @observable
  hostPath = '';
  @observable
  userPath = '';
}

export default new Store()
