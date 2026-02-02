import React, { useState } from 'react'
import { Badge, Button, Drawer, List, Typography, Avatar, Tag } from 'antd'
import {
  MessageOutlined,
  UserAddOutlined,
  BellOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import { useRouter } from 'next/navigation'

interface Notification {
  id: string
  title: React.ReactNode
  time: string
  type: 'message' | 'user' | 'alert' | 'success'
  read: boolean
}

interface NotificationDrawerProps {
  open: boolean
  onClose: () => void
}

// Generate 20 mock notifications
const initialNotifications: Array<Notification> = Array.from({ length: 20 }).map((_, i) => ({
  id: i.toString(),
  title: (
    <span>
      {i % 4 === 0 ? 'New user registration:' :
        i % 4 === 1 ? 'System update completed:' :
          i % 4 === 2 ? 'New message from' : 'Security alert:'}
      {' '}
      <span className="font-bold">
        {i % 4 === 0 ? 'John Doe' :
          i % 4 === 1 ? 'v2.4.0' :
            i % 4 === 2 ? 'Support Team' : 'Login attempt'}
      </span>
    </span>
  ),
  time: `${i + 1} hrs ago`,
  type: i % 4 === 0 ? 'user' : i % 4 === 1 ? 'success' : i % 4 === 2 ? 'message' : 'alert',
  read: i > 5 // First 6 unread
}))

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  open,
  onClose,
}) => {
  const [notifications, setNotifications] =
    useState<Array<Notification>>(initialNotifications)
  const router = useRouter()

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    )
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageOutlined className="text-gray-600 text-lg" />
      case 'user':
        return <UserAddOutlined className="text-gray-600 text-lg" />
      case 'success':
        return <CheckCircleOutlined className="text-gray-600 text-lg" />
      default:
        return <BellOutlined className="text-gray-600 text-lg" />
    }
  }

  return (
    <Drawer
      title={null}
      closeIcon={null}
      placement="right"
      onClose={onClose}
      open={open}
      width={400}
      mask={true}
      maskClosable={true}
      maskStyle={{ backgroundColor: 'transparent', backdropFilter: 'none' }}
      // Clean styling with shadow override
      contentWrapperStyle={{ boxShadow: '-4px 0 8px rgba(0, 0, 0, 0.05)' }}
      bodyStyle={{ padding: 0 }}
    >
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dashed border-gray-200">
          <span className="font-bold text-gray-900 text-[18px]">
            Notifications
          </span>
          <Tag className="m-0 border-0 bg-gray-100 text-gray-600 font-semibold px-3 py-1 text-sm rounded-full">
            {unreadCount} Unread
          </Tag>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            split={false}
            renderItem={(item) => (
              <List.Item
                className={`transition-colors cursor-pointer py-5 border-b border-dashed border-gray-200 ${item.read ? 'bg-gray-50' : 'hover:bg-gray-50 bg-white'
                  }`}
                style={{ paddingLeft: '16px', paddingRight: '24px' }}
                onClick={() => handleMarkAsRead(item.id)}
              >
                <div className="flex items-start gap-4 w-full">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${item.read ? 'bg-gray-200 opacity-50' : 'bg-gray-100'}`}>
                    {getIcon(item.type)}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 pt-1 ${item.read ? 'opacity-50' : ''}`}>
                    <div className={`text-[15px] leading-relaxed mb-1 ${item.read ? 'text-gray-500' : 'text-gray-800'}`}>
                      {item.title}
                    </div>
                    <div className="text-gray-400 text-xs font-medium">
                      {item.time}
                    </div>
                  </div>

                  {/* Dot */}
                  {!item.read && (
                    <div className="mt-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-900"></div>
                    </div>
                  )}
                </div>
              </List.Item>
            )}
          />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-dashed border-gray-200 text-center">
          <Button
            type="link"
            className="text-gray-600 font-semibold text-sm hover:text-gray-900"
            onClick={() => {
              onClose();
              router.push('/notifications');
            }}
          >
            See All Notifications
          </Button>
        </div>
      </div>
    </Drawer>
  )
}

export default NotificationDrawer
