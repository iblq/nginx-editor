const fs = window.require('fs')
import { tryCatch } from './index'

export const isFile = (p) => {
  try {
    if (fs.statSync(p).isFile()) {
      return true
    }
  } catch (e) {}
  return false
}

export const isDirectory = (p) => {
  try {
    if (fs.statSync(p).isDirectory()) {
      return true
    }
  } catch (e) {}
  return false
}

export const writeFile = (fn, data, callback) => {
  // if (isFile(fn)) {
  //   callback()
  // } else {
  fs.writeFile(fn, data, 'utf-8', callback)
  // }
}

export const pWriteFile = (fn, data) => {
  return tryCatch(
    new Promise((resolve, reject) => {
      writeFile(fn, data, (e, v) => (e ? reject(e) : resolve(v)))
    }),
  )
}

export const readFile = (fn, callback) => {
  if (!isFile(fn)) {
    callback(null, '')
  } else {
    fs.readFile(fn, 'utf-8', callback)
  }
}

export const pReadFile = (fn) => {
  return tryCatch(
    new Promise((resolve, reject) => {
      readFile(fn, (e, v) => (e ? reject(e) : resolve(v)))
    }),
  )
}
