import React, { useState } from 'react'
import { Modal, Input } from 'antd'

const SudoForm = ({ saveData, onCancel }) => {
  const [sudo_pswd, setSudo_pswd] = useState('')

  const onChange = (e) => {
    setSudo_pswd(e.target.value)
  }

  const onEnter = () => {
    saveData(sudo_pswd)
  }

  return (
    <Modal
      title="请输入管理员密码"
      visible={true}
      width={300}
      onOk={() => {
        saveData(sudo_pswd)
      }}
      onCancel={onCancel}
    >
      <Input
        type="password"
        style={{ width: '100%' }}
        onPressEnter={onEnter}
        onChange={onChange}
      />
    </Modal>
  )
}

export default SudoForm
