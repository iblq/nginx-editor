import { action } from 'mobx'
import { get } from 'util/request'
import store from '../store'
import * as constants from '../constant'

class Actions {
  constructor(store) {
    this.store = store
  }

  getMsg() {
    get(constants.API_HOME).then(data => {
      this.merge({
        msg: data.helloMsg
      })
    })
  }

  @action.bound
  merge(obj = {}) {
    Object.assign(this.store, obj)
  }
}

export default new Actions(store)
