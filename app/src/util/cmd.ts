import process from 'child_process'
import { tryCatch } from './index'
import db from './db'
const { nginxCmdPath } = db.get('config')

const cmdPath = { cwd: '/' }
const execPre = '/usr/local/bin/'

export const exec = (cmd: string) => {
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

export const openInCode = (dirPath: string) => {
  exec(`${execPre}code ${dirPath}`)
}

export const openFile = (filePath: string) => {
  exec(`${execPre}open ${filePath}`)
}
export const startNginx = () => {
  exec(`${nginxCmdPath}`)
}
export const reloadNginx = async () => {
  return await exec(`${nginxCmdPath} -s reload`)
}
