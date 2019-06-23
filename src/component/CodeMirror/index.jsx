import CodeMirror from 'codemirror'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/shell/shell'
import React from 'react'
import styles from './style.less'

import PropTypes from 'prop-types'

class MyCm extends React.Component {
  initCm = () => {
    const { value, options } = this.props
    this.cm = CodeMirror.fromTextArea(this.textRef, options)

    this.cm.on('change', () => this._onChange())
    this.cm.getDoc().setValue(value || '')
    // this.cm.setSize('100%', '100%')
  }
  componentDidMount() {
    this.initCm()
  }

  componentDidUpdate(prevProps) {
    if (this.props.value && !prevProps.value) {
      this.cm.getDoc().setValue(this.props.value || '')
    }
  }

  _onChange = () => {
    let v = this.cm.getDoc().getValue()
    this.props.onChange(v)
  }

  render() {
    return (
      <div className={styles.textarea}>
        <textarea ref={(el) => (this.textRef = el)} onChange={() => {}} />
      </div>
    )
  }
}

MyCm.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
  value: PropTypes.string,
}

export default MyCm
