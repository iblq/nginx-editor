import { observer, inject } from 'mobx-react'
import storeList from '../inject/index'

// 所有 store 和 actions
let stores = Object.keys(storeList)

/**
 * 代替 Mobx 相关 3 个装饰器使用，一次性完成 @withRouter @inject @observer 操作
 * 默认 inject 所有 store (读取 inject/index.js 配置)
 * 使用
 * import superInject from '@/util/superInject'
 *
 * @superInject() // 注入所有 store
 * class A ...{
 * }
 * 或
 *
 * @superInject('userStore', 'userActions', 'globalStore') // 只注入参数 store
 * class A ...{
 * }
 *
 * 函数组件或 hooks 组件
 *
 * const Test = () => {
 *    return <div></div>
 * }
 *
 * export default superInject('userStore', 'userActions')(Test)
 *
 * @returns
 */
const superInject = function() {
  const args = [...arguments]
  // 如果手动传入 store 参数，则使用参数数据
  if (args.length > 0) {
    stores = args
  }

  return (component) => inject.apply(null, stores)(observer(component))
}

export default superInject
