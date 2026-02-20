'use client';

import Image from 'next/image';

import React, { useState } from 'react'
import { Layout, Menu, ConfigProvider } from 'antd'
import type { MenuProps } from 'antd'
import {
  FileTextOutlined,
  TeamOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { usePathname, useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'

const { Sider, Content } = Layout

interface MainLayoutProps {
  children?: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const { isDarkMode } = useTheme()
  const { isAdmin, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // If login page, don't show layout
  if (pathname === '/login' || pathname.startsWith('/auth')) {
    return <>{children}</>;
  }

  // Sider Width
  const siderWidth = 260;

  // Menu Items
  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      label: 'Dashboard',
      icon: <AppstoreOutlined />,
    },
    {
      key: '/declarations',
      label: 'Beyanname Listesi',
      icon: <FileTextOutlined />,
    },
  ]

  // Add Users menu only if Admin or Manager
  if (isAdmin || user?.role === 'Manager') {
    menuItems.push({
      key: '/settings/users',
      label: 'Kullanıcılar',
      icon: <TeamOutlined />,
    });
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={siderWidth}
        theme={isDarkMode ? 'dark' : 'light'}
        style={{
          overflow: 'hidden', // Prevent outer scroll, we handle inner
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1001, // High z-index to stay above
          backgroundColor: isDarkMode ? '#141414' : '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          borderRight: isDarkMode ? 'none' : '1px solid #E3E3E7',
        }}
      >
        {/* Fixed Logo Section */}
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 24,
          paddingRight: 24,
          flexShrink: 0 // Prevents shrinking
        }}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div
              className={`min-w-8 w-8 h-8 flex items-center justify-center flex-shrink-0`}
            >
              <Image src="/customs-loupe-logo.png" alt="Customs Loupe" width={32} height={32} className="object-contain" />
            </div>
            {!collapsed && (
              <span
                className={`text-base font-bold tracking-tight whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-black'}`}
              >
                Customs Loupe
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Menu Section */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden'
        }} className="custom-scrollbar">
          <ConfigProvider
            theme={{
              components: {
                Menu: {
                  itemBorderRadius: 8, // Standard small radius
                  itemSelectedBg: isDarkMode ? '#1f1f1f' : '#f3f4f6',
                  itemSelectedColor: isDarkMode ? '#ffffff' : '#111827',
                  itemColor: isDarkMode ? '#a1a1a1' : '#4b5563',
                  itemHoverBg: isDarkMode ? '#2a2a2a' : '#f9fafb',
                  itemMarginInline: 16,
                  itemHeight: 40,
                }
              }
            }}
          >
            <Menu
              theme={isDarkMode ? 'dark' : 'light'}
              mode="inline"
              defaultSelectedKeys={[pathname]}
              items={menuItems}
              style={{ borderRight: 0, background: 'transparent' }} // Standard: no border
              onClick={({ key }) => router.push(key)}
            />
          </ConfigProvider>
        </div>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : siderWidth, transition: 'all 0.2s', background: isDarkMode ? '#000' : '#fcfcfc' }}>
        <Header
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
        <Content
          style={{
            margin: 0,
            padding: 0,
            overflow: 'initial', // Let page scroll
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout