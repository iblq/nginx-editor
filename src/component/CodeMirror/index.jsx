import CodeMirror from 'codemirror'
import 'codemirror/keymap/sublime'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/shell/shell'
import 'codemirror/mode/nginx/nginx'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './style.less'

class MyCm extends React.Component {
  initCm = () => {
    const { value, options, onSave } = this.props
    this.cm = CodeMirror.fromTextArea(this.textRef, {
      lineNumbers: true,
      matchBrackets: true,
      keyMap: 'sublime',
      mode: 'nginx',
      ...(options || {}),
    })

    this.cm.setOption('extraKeys', {
      'Cmd-S': () => {
        onSave && onSave()
      },
    })

    this.cm.on('change', () => this._onChange())
    this.cm.getDoc().setValue(value || '')
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
  onSave: PropTypes.func,
  options: PropTypes.object,
  value: PropTypes.string,
}

export default MyCm
