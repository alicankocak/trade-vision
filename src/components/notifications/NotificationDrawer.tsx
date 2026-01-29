import React, { useState } from 'react'
import { Badge, Button, Drawer, List, Typography } from 'antd'
import { BellOutlined, CheckCircleOutlined } from '@ant-design/icons'

interface Notification {
  id: string
  title: string
  description: string
  read: boolean
  date: string
}

interface NotificationDrawerProps {
  open: boolean
  onClose: () => void
}

const initialNotifications: Array<Notification> = [
  {
    id: '1',
    title: 'Yeni Beyanname Onayı',
    description: 'TR-34-2024-001 nolu beyannameniz onaylandı.',
    read: false,
    date: '10 dk önce',
  },
  {
    id: '2',
    title: 'Sistem Bakım Çalışması',
    description: 'Bu gece 02:00 - 04:00 arası bakım yapılacaktır.',
    read: false,
    date: '1 saat önce',
  },
  {
    id: '3',
    title: 'Üyelik Güncellemesi',
    description: 'Hesap bilgileriniz başarıyla güncellendi.',
    read: true,
    date: 'Dün',
  },
]

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  open,
  onClose,
}) => {
  const [notifications, setNotifications] =
    useState<Array<Notification>>(initialNotifications)

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    )
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <BellOutlined />
          <span>Bildirimler</span>
          {unreadCount > 0 && <Badge count={unreadCount} />}
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={400}
    >
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            className={`transition-all duration-300 ${
              item.read ? 'opacity-50 grayscale' : 'opacity-100 bg-white'
            }`}
            actions={[
              !item.read && (
                <Button
                  type="text"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleMarkAsRead(item.id)}
                  title="Okundu olarak işaretle"
                />
              ),
            ]}
          >
            <List.Item.Meta
              title={
                <Typography.Text strong={!item.read}>
                  {item.title}
                </Typography.Text>
              }
              description={
                <div className="flex flex-col gap-1">
                  <span className={!item.read ? 'text-black' : ''}>
                    {item.description}
                  </span>
                  <span className="text-xs text-gray-400">{item.date}</span>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Drawer>
  )
}

export default NotificationDrawer
