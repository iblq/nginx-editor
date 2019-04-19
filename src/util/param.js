const toString = Object.prototype.toString
const isArray =
  Array.isArray ||
  function(val) {
    return toString.call(val) === '[object Array]'
  }

const isValidParamValue = val => {
  const t = typeof val
  // If the type of val is null, undefined, number, string, boolean, return TRUE.
  return val === null || (t !== 'object' && t !== 'function')
}
const endsWith = (str, suffix) => {
  const index = str.length - suffix.length
  return index >= 0 && str.indexOf(suffix, index) === index
}

const encode = encodeURIComponent

const decode = function(s) {
  try {
    return decodeURIComponent(s.replace(/\+/g, ' '))
  } catch (err) {
    return s
  }
}

export const param = function(o, sep, eq, serializeArray) {
  sep = sep || '&'
  eq = eq || '='
  if (serializeArray === undefined) {
    serializeArray = true
  }

  const buf = []

  for (let key in o) {
    const val = o[key]
    key = encode(key)

    // val is valid non-array value
    if (isValidParamValue(val)) {
      buf.push(key)
      if (val !== undefined) {
        buf.push(eq, encode(val + ''))
      }
      buf.push(sep)
    }

    // val is not empty array
    else if (isArray(val) && val.length) {
      for (let i = 0; i < val.length; ++i) {
        const v = val[i]
        if (isValidParamValue(v)) {
          // ?aParam[]=value1&aParam[]=value2&aParam[]=value3
          buf.push(key, serializeArray ? encode('[]') : '')
          if (v !== undefined) {
            buf.push(eq, encode(v + ''))
          }
          buf.push(sep)
        }
      }
    }
    // ignore other cases, including empty array, Function, RegExp, Date etc.
  }

  buf.pop()
  return buf.join('')
}

/**
 * query字符串转为对象
 */
export const unparam = function(str, sep, eq) {
  str = str + ''
  sep = sep || '&'
  eq = eq || '='

  const ret = {}
  const pairs = str.split(sep)
  const length = pairs.length
  let key, val

  if (!str) {
    return ret
  }

  for (let i = 0; i < length; ++i) {
    const eqIndex = pairs[i].indexOf(eq)
    if (eqIndex === -1) {
      // 没有=
      key = decode(pairs[i])
      val = undefined
    } else {
      // remember to decode key!
      key = decode(pairs[i].substring(0, eqIndex))
      val = decode(pairs[i].substring(eqIndex + 1))

      if (endsWith(key, '[]')) {
        key = key.substring(0, key.length - 2)
      }
    }
    if (key in ret) {
      if (isArray(ret[key])) {
        ret[key].push(val)
      } else {
        ret[key] = [ret[key], val]
      }
    } else {
      ret[key] = val
    }
  }
  return ret
}
