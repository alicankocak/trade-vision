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
  BookOutlined,
  BankOutlined,
} from '@ant-design/icons'
import { usePathname, useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import { useAuthStore } from '@/store/useAuthStore'
import { CustomsLoupeLogo } from '@/components/common/CustomsLoupeLogo';
import { useTheme } from '@/context/ThemeContext';

const { Sider, Content } = Layout

interface MainLayoutProps {
  children?: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const { isDarkMode } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  
  // Auth State
  const { currentUser, login, activeCompanyContext } = useAuthStore()

  // Sider Width
  const siderWidth = 260;

  // Mock Login for Demonstration (If none exists)
  React.useEffect(() => {
      if (!currentUser) {
          login('user_musavir_01'); // Default fallback to Müşavir
      }
  }, [currentUser, login]);

  // If login page, don't show layout
  if (pathname === '/login' || pathname.startsWith('/auth')) {
    return <>{children}</>;
  }

  // Role Based Menu Filters
  const isSuperAdmin = currentUser?.role === 'ADMIN' && currentUser?.primaryCompanyId === 'comp_atez';

  const menuItems: MenuProps['items'] = [];

  const mainGroupItems: any[] = [
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
    {
      key: '/risk-kutuphanesi',
      label: 'Risk Kütüphanesi',
      icon: <BookOutlined />,
    },
  ];

  if (!isSuperAdmin && (currentUser?.role === 'ADMIN' || (currentUser?.role === 'MUSAVIR' && activeCompanyContext?.type === 'GUMRUK'))) {
    mainGroupItems.push({
      key: '/settings/users',
      label: 'Kullanıcılar',
      icon: <TeamOutlined />,
    });
  } else if (isSuperAdmin) {
    mainGroupItems.push({
      key: '/settings/users_local',
      label: 'Kullanıcılar',
      icon: <TeamOutlined />,
    });
  }

  // Group 1: The current company Context Menu
  menuItems.push({
    type: 'group',
    label: activeCompanyContext?.name || 'Firma Menüsü',
    children: mainGroupItems,
  });

  // Group 2: The Super Admin Menu
  if (isSuperAdmin) {
    menuItems.push({
      type: 'group',
      label: 'Super Admin',
      children: [
        {
          key: '/settings/companies',
          label: 'Firmalar',
          icon: <BankOutlined />,
        },
        {
          key: '/settings/users',
          label: 'Kullanıcılar',
          icon: <TeamOutlined />,
        }
      ]
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
          flexShrink: 0
        }}>
          {collapsed ? (
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg text-white ml-2 mt-1`}>
              <CustomsLoupeLogo size={28} />
            </div>
          ) : (
             <div className="flex items-center ml-2 mt-1">
                <CustomsLoupeLogo size={32} className="mr-2 drop-shadow-sm" />
                <span className={`text-xl font-bold tracking-tight mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Customs Loupe</span>
             </div>
          )}
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
              onClick={({ key }: { key: string }) => {
                if (key === '/settings/users_local') {
                  router.push('/settings/users');
                } else {
                  router.push(key);
                }
              }}
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