import React, { useState, useEffect, useRef } from 'react'
import { Modal, Input } from 'antd'

interface SudoFormProps {
  saveData: any
  onCancel: any
}

const SudoForm = ({ saveData, onCancel }: SudoFormProps) => {
  const [sudoPswd, setSudoPswd] = useState('')

  const eleRef: any = useRef(null)

  useEffect(() => {
    setTimeout(() => {
      eleRef.current && eleRef.current.focus()
    }, 0)
  }, [])

  const onChange = (e: any) => {
    setSudoPswd(e.target.value)
  }

  const onEnter = () => {
    saveData(sudoPswd)
  }

  return (
    <Modal
      title="请输入管理员密码"
      visible={true}
      width={300}
      onOk={() => {
        saveData(sudoPswd)
      }}
      onCancel={onCancel}
    >
      <Input
        ref={eleRef}
        id="input"
        type="password"
        style={{ width: '100%' }}
        onPressEnter={onEnter}
        onChange={onChange}
      />
    </Modal>
  )
}

export default SudoForm
