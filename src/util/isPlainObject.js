const toString = Object.prototype.toString
const isType = type => {
  return obj => {
    return toString.call(obj) == '[object ' + type + ']'
  }
}
const isObject = isType('Object')

// IE10及以上的写法
const isPlainObject = obj =>
  isObject(obj) && Object.getPrototypeOf(obj) === Object.prototype

export default isPlainObject
