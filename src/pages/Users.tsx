import React, { useState } from 'react'
import {
  Button,
  Dropdown,
  Input,
  Modal,
  Table,
  Tag,
  Typography,
  message,
} from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  SearchOutlined,
  StopOutlined,
  UserAddOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { ColumnsType } from 'antd/es/table'

const { Title } = Typography

// Mock User Data
interface UserData {
  key: string
  name: string
  email: string
  role: 'Admin' | 'Manager' | 'User'
  status: 'Active' | 'Passive'
}

const initialUsers: Array<UserData> = [
  {
    key: '1',
    name: 'Alican Admin',
    email: 'alican@tradevision.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    key: '2',
    name: 'Mehmet Yönetici',
    email: 'mehmet@tradevision.com',
    role: 'Manager',
    status: 'Active',
  },
  {
    key: '3',
    name: 'Ayşe Üye',
    email: 'ayse@musteri.com',
    role: 'User',
    status: 'Active',
  },
  {
    key: '4',
    name: 'Fatma Pasif',
    email: 'fatma@eskimusteri.com',
    role: 'User',
    status: 'Passive',
  },
  {
    key: '5',
    name: 'Ahmet Lojistik',
    email: 'ahmet@lojistik.com',
    role: 'User',
    status: 'Active',
  },
]

const Users: React.FC = () => {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState<Array<UserData>>(initialUsers)
  const [searchText, setSearchText] = useState('')

  // RBAC Check (Client-side protection)
  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/unauthorized')
    }
  }, [isAdmin, navigate])

  if (!isAdmin) return null

  const handleDelete = (key: string) => {
    Modal.confirm({
      title: 'Kullanıcıyı Sil',
      content: 'Bu kullanıcıyı silmek istediğinize emin misiniz?',
      okText: 'Evet, Sil',
      cancelText: 'İptal',
      okType: 'danger',
      onOk: () => {
        setUsers((prev) => prev.filter((u) => u.key !== key))
        message.success('Kullanıcı silindi.')
      },
    })
  }

  const handleStatusChange = (key: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Passive' : 'Active'
    setUsers((prev) =>
      prev.map((u) => (u.key === key ? { ...u, status: newStatus } : u)),
    )
    message.success(
      `Kullanıcı durumu ${newStatus === 'Active' ? 'Aktif' : 'Pasif'} yapıldı.`,
    )
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()),
  )

  const columns: ColumnsType<UserData> = [
    {
      title: 'Ad Soyad',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'E-posta',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        let color = 'blue'
        if (role === 'Admin') color = 'red'
        if (role === 'Manager') color = 'gold'
        return <Tag color={color}>{role.toUpperCase()}</Tag>
      },
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'success' : 'default'}>
          {status === 'Active' ? 'Aktif' : 'Pasif'}
        </Tag>
      ),
    },
    {
      title: 'Aksiyon',
      key: 'action',
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              { key: '1', label: 'Düzenle', icon: <EditOutlined /> },
              {
                key: '2',
                label: record.status === 'Active' ? 'Pasife Al' : 'Aktifleştir',
                icon: <StopOutlined />,
                onClick: () => handleStatusChange(record.key, record.status),
              },
              {
                type: 'divider',
              },
              {
                key: '3',
                label: 'Sil',
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => handleDelete(record.key),
              },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text" shape="circle" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-1">
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Kullanıcı Listesi
          </Title>
          <span className="text-gray-500">
            Sistemdeki kullanıcıları yönetin.
          </span>
        </div>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          className="bg-black hover:bg-gray-800"
        >
          Yeni Kullanıcı
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <Input
          placeholder="Kullanıcı Ara..."
          prefix={<SearchOutlined className="text-gray-400" />}
          className="w-full md:w-80 mb-4"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Table
          columns={columns}
          dataSource={filteredUsers}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  )
}

export default Users
