import { action } from 'mobx'
import { get } from 'util/request'
import store from '../store'

class Actions {
  constructor(store) {
    this.store = store
  }

  @action.bound
  merge(obj = {}) {
    Object.assign(this.store, obj)
  }
  @action.bound
  reset() {
    this.merge(this.store.defaultSetting)
  }
}

export default new Actions(store)
