import React, { useState } from 'react'
import { Button, Space, notification } from 'antd'
import { NotificationPlacement } from 'antd/es/notification/interface'

type INotificationOkCancelProps = {
  message: string
  description: string
  onOk: () => void
  duration?: number
  placement?: NotificationPlacement
  onCancel?: () => void
  cancelText?: string
  okText?: string
}

export const useNotificationOkCancel = ({
  message,
  description,
  placement,
  onOk,
  onCancel,
  duration,
  cancelText = 'Cancel',
  okText = 'OK',
}: INotificationOkCancelProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [instance, contextHolder] = notification.useNotification()

  const onCloseNotification = () => {
    instance.destroy()
    setIsOpen(false)
    if (onCancel) {
      onCancel()
    }
  }

  const onOkClick = () => {
    onOk()
    setIsOpen(false)
    instance.destroy()
  }
  const key = `open${Date.now()}`

  const btn = (
    <Space>
      <Button type='link' size='small' onClick={onOkClick}>
        {okText}
      </Button>
      <Button type='primary' size='small' onClick={onCloseNotification}>
        {cancelText}
      </Button>
    </Space>
  )

  const newContextHolder = [
    contextHolder,
    <div
      key={`notification-ok-cancel-holder-${key}`}
      className={isOpen ? 'notification-mask' : undefined}
      onClick={isOpen ? onCloseNotification : undefined}
    ></div>,
  ]

  const openNotification = () => {
    if (!isOpen) {
      setIsOpen(true)
      instance.open({
        message,
        description,
        btn,
        key,
        onClose: onCloseNotification,
        duration: duration || 0,
        placement: placement || 'top',
      })
    }
  }

  return {
    openNotification,
    contextHolder: newContextHolder,
    isOpen,
    contextHolderWithoutMask: contextHolder,
  }
}
