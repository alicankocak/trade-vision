import React from 'react';
import { Button, Avatar, Dropdown, Layout, Badge, message } from 'antd';
import type { MenuProps } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    BellOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    SunOutlined,
    MoonOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext'; // Import context
import NotificationDrawer from '../notifications/NotificationDrawer';

const { Header: AntHeader } = Layout;

interface HeaderProps {
    collapsed: boolean;
    onToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ collapsed, onToggle }) => {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const { isDarkMode, toggleTheme } = useTheme(); // Use context
    const router = useRouter();
    const { user, logout, login } = useAuth(); // Exposed login for debugging if needed

    // Profile Dropdown Menu
    const userMenu: MenuProps['items'] = [
        {
            key: '0',
            label: (
                <div className="flex flex-col px-2">
                    <span className="font-semibold">{user?.name}</span>
                    <span className="text-xs text-gray-500">{user?.role}</span>
                </div>
            ),
            disabled: true,
        },
        {
            type: 'divider',
        },
        {
            key: '1',
            icon: <UserOutlined />,
            label: 'Profilim',
            onClick: () => router.push('/profile'),
        },
        {
            key: '2',
            icon: <SettingOutlined />,
            label: 'Ayarlar',
        },
        // DEBUG: Switch Roles
        {
            type: 'divider',
        },
        {
            key: 'role-admin',
            label: 'Rol: Admin (Test)',
            onClick: () => login('Admin'),
        },
        {
            key: 'role-user',
            label: 'Rol: User (Test)',
            onClick: () => login('User'),
        },
        {
            type: 'divider',
        },
        {
            key: '3',
            icon: <LogoutOutlined />,
            label: 'Çıkış Yap',
            danger: true,
            onClick: () => {
                logout();
                message.info('Çıkış yapıldı (Mock)');
                router.push('/login');
            }
        },
    ];

    return (
        <>
            <AntHeader
                style={{
                    padding: '0 24px',
                    background: isDarkMode ? '#141414' : '#fff', // Header bg dynamic
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: isDarkMode ? '1px solid #303030' : '1px solid #e2e2e4',
                    zIndex: 10,
                }}
            >
                {/* Left Section: Toggle Only */}
                <div className="flex items-center">
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={onToggle}
                        style={{ fontSize: '16px', width: 64, height: 64 }}
                        className={isDarkMode ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'}
                    />
                </div>

                {/* Right Section: Actions */}
                <div className="flex items-center gap-4">
                    {/* Theme Toggle */}
                    {/* Theme Toggle Icon (Update 20.0) */}
                    <Button
                        type="text"
                        icon={isDarkMode ? <MoonOutlined /> : <SunOutlined />}
                        onClick={toggleTheme}
                        style={{ fontSize: '20px', color: isDarkMode ? '#ffffff' : '#000000' }}
                        className="flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 rounded-full w-10 h-10 transition-all"
                    />

                    {/* Notification Bell */}
                    <Badge count={2} size="small" offset={[-2, 2]}>
                        <Button
                            type="text"
                            icon={<BellOutlined style={{ fontSize: '20px' }} />}
                            onClick={() => setDrawerOpen(true)}
                            className={`flex items-center justify-center ${isDarkMode ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'}`}
                        />
                    </Badge>

                    {/* Profile Dropdown */}
                    <Dropdown menu={{ items: userMenu }} placement="bottomRight" arrow>
                        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors">
                            <Avatar icon={<UserOutlined />} className="bg-black" />
                            <div className="flex flex-col text-right leading-tight hidden md:flex">
                                <span className="text-sm font-semibold text-gray-800">
                                    Alican
                                </span>
                                <span className="text-xs text-gray-500">Admin</span>
                            </div>
                        </div>
                    </Dropdown>
                </div>
            </AntHeader>

            {/* Notification Drawer */}
            <NotificationDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />
        </>
    );
};

export default Header;
