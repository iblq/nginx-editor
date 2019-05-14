import { observable } from 'mobx'

class Store {
  @observable msg = '';

  @observable
  defaultSetting = {
    nginxPath: '/usr/local/etc/nginx/nginx.conf',
    nginxCmdPath: '/usr/local/bin/nginx'
  };

  @observable
  nginxPath = '/usr/local/etc/nginx/nginx.conf';
  @observable
  nginxCmdPath = '/usr/local/bin/nginx';

  // @observable
  // nginxPath = '/usr/local/etc/nginx/nginx.conf';
  // @observable
  // nginxCmdPath = '/usr/local/bin/nginx';
}

export default new Store()
