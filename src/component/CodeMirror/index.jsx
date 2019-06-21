import React from 'react'
import CodeMirror from 'codemirror'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/shell/shell'
import 'codemirror/mode/markdown/markdown'

import styles from './style.less'

const MyCm = ({ onChange, value, options }) => {
  return (
    <div className={styles.textarea}>
      <textarea ref={(c) => (this.txt = c)} onChange={() => {}} />
    </div>
  )
}

MyCm.propTypes = {}

export default MyCm
