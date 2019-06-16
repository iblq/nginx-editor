import { action } from 'mobx'
import { get } from 'util/request'
import store from '../store'
const fs = window.require('fs')
const remote = window.require('electron').remote

const homePath = remote.app.getPath('home')
import { formatList, readFile } from 'util/readFile'

const readList = ['mine', 'work', 'test', 'Downloads', 'Desktop']

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

  @action
  readLocalList = () => {
    const projects = []
    const docs = []

    for (let p of readList) {
      readFile(homePath + '/' + p, projects, docs)
    }

    this.merge({ projects: formatList(projects), docs: formatList(docs) })
  }
}

export default new Actions(store)
