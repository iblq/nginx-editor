import shell from 'shelljs'
import process from 'child_process'

import { tryCatch } from './index'

const codeCmd = shell.which('code').toString()

export const exec = (cmd: string) => {
  return tryCatch(
    new Promise((resolve, reject) => {
      shell.exec(cmd, (code: number, stdout: string, stderr: string) => {
        console.log({ code }, { stderr }, { stdout })
        if (code !== 0) {
          reject(stderr)
        } else {
          resolve(stdout)
        }
      })
    })
  )
}

/** 在 vscode 中打开项目 */
export const openInCode = (dirPath: string) => {
  process.exec(`${codeCmd} ${dirPath}`)
}

/** 在 finder 中打开项目 */
export const openFile = (filePath: string) => {
  process.exec(`open ${filePath}`)
}

/** 在 finder 中打开项目 */
export const startNginx = () => {
  shell.exec('nginx')
}
