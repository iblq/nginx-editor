import CM from 'codemirror'
import 'codemirror/keymap/sublime'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/shell/shell'
import 'codemirror/mode/nginx/nginx'
import 'codemirror/addon/comment/comment'
import React from 'react'
import './style.less'

interface CmProps {
  value: string
  options: object
  onSave: any
  onChange: any
}

interface PrevProps {
  value: string
}

interface CmInstance {
  setOption: any
  on: any
  getDoc: any
}

class CodeMirror extends React.Component<CmProps> {
  cm: CmInstance = {
    setOption: null,
    on: null,
    getDoc: null,
  }

  textRef: any = null

  initCm = () => {
    const { value, options, onSave } = this.props
    this.cm =
      CM.fromTextArea(this.textRef, {
        lineNumbers: true,
        matchBrackets: true,
        keyMap: 'sublime',
        mode: 'nginx',
        ...(options || {}),
      }) || {}

    this.cm.setOption('extraKeys', {
      'Cmd-S': () => {
        onSave && onSave()
      },
    })

    this.cm.on('change', () => this._onChange())
    // this.cm.on('blur', () => onSave && onSave())
    this.cm.getDoc().setValue(value || '')
  }
  componentDidMount() {
    this.initCm()
  }

  componentDidUpdate(prevProps: PrevProps) {
    if (this.props.value && !prevProps.value) {
      this.cm.getDoc().setValue(this.props.value || '')
    }
  }

  _onChange = () => {
    const v = this.cm.getDoc().getValue()
    this.props.onChange(v)
  }

  render() {
    return (
      <div className="code-textarea">
        <textarea ref={el => (this.textRef = el)} />
      </div>
    )
  }
}

export default CodeMirror
