import process from 'child_process'
import { tryCatch } from './index'
import db from './db'
const { nginxCmdPath } = db.get('config')

const cmdPath = { cwd: '/' }

export const exec = cmd => {
  return tryCatch(
    new Promise((resolve, reject) => {
      process.exec(cmd, cmdPath, (err, stdout, stderr) => {
        if (err) {
          reject(stderr || err)
        } else {
          resolve(stdout)
        }
      })
    })
  )
}

export const openInCode = dirPath => {
  exec(`/usr/local/bin/code ${dirPath}`)
}

export const openFile = filePath => {
  exec(`/usr/bin/open ${filePath}`, cmdPath)
}
export const startNginx = () => {
  exec(`${nginxCmdPath}`, cmdPath)
}
