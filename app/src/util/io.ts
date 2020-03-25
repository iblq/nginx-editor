const fs = require('fs')
import { tryCatch } from './index'

export const isFile = (p: any) => {
  try {
    if (fs.statSync(p).isFile()) {
      return true
    }
  } catch (e) {}
  return false
}

export const isDirectory = (p: any) => {
  try {
    if (fs.statSync(p).isDirectory()) {
      return true
    }
  } catch (e) {}
  return false
}

export const writeFile = (fn: any, data: string, callback: any) => {
  fs.writeFile(fn, data, 'utf-8', callback)
}

export const pWriteFile = (fn: any, data: string) => {
  return tryCatch(
    new Promise((resolve, reject) => {
      writeFile(fn, data, (e: any, v: any) => (e ? reject(e) : resolve(v)))
    })
  )
}

export const readFile = (fn: any, callback: any) => {
  if (!isFile(fn)) {
    callback('文件不存在', null)
  } else {
    fs.readFile(fn, 'utf-8', callback)
  }
}

export const pReadFile = (fn: any) => {
  return tryCatch(
    new Promise((resolve, reject) => {
      readFile(fn, (e: any, v: any) => (e ? reject(e) : resolve(v)))
    })
  )
}
