import { observable } from 'mobx'

class Store {
  @observable msg = ''
}

export default new Store()
