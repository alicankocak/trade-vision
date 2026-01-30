import React, { useState } from 'react'
import { Layout, Menu, theme } from 'antd'
import {
  AppstoreOutlined,
  FileTextOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const { Sider, Content } = Layout

interface MainLayoutProps {
  children?: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()
  const { isAdmin } = useAuth() // Added isAdmin
  const { isDarkMode } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      key: '/dashboard',
      icon: <AppstoreOutlined />, // Changed icon
      label: 'Dashboard',
    },
    {
      key: '/declarations',
      icon: <FileTextOutlined />,
      label: 'Beyanname Listesi',
    },
    // Only show Users if Admin
    ...(isAdmin
      ? [
        {
          key: '/users',
          icon: <TeamOutlined />,
          label: 'Kullanıcı Listesi',
        },
      ]
      : []),
  ]

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme={isDarkMode ? 'dark' : 'light'}
        className={
          isDarkMode ? 'border-r border-[#303030]' : 'border-r border-gray-100'
        }
        width={250}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed', // Changed to fixed to ensure it stays on side
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100, // Ensure above other elements if needed
          backgroundColor: isDarkMode ? '#000000' : '#ffffff', // Explicit background
        }}
      >
        {/* Logo Section */}
        <div
          className={`h-16 flex items-center justify-center border-b ${isDarkMode ? 'border-[#303030]' : 'border-gray-100'}`}
        >
          <div className="flex items-center gap-2 overflow-hidden px-4">
            <div
              className={`min-w-8 w-8 h-8 rounded flex items-center justify-center font-bold flex-shrink-0 ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}
            >
              TV
            </div>
            {!collapsed && (
              <span
                className={`text-xl font-bold tracking-tight whitespace-nowrap transition-opacity duration-200 ${isDarkMode ? 'text-white' : 'text-black'}`}
              >
                TradeVision
              </span>
            )}
          </div>
        </div>

        <Menu
          theme={isDarkMode ? 'dark' : 'light'}
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          items={menuItems}
          className="h-full border-r-0"
          style={{ paddingTop: '1rem', background: 'transparent' }} // Let Sider bg control it
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout
        style={{ marginLeft: collapsed ? 80 : 250, transition: 'all 0.2s' }}
      >
        <Header
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'initial',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout