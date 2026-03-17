import React from 'react';
import { Button, Avatar, Dropdown, Layout, Badge, message } from 'antd';
import type { MenuProps } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    BellOutlined,
    UserOutlined,
    LogoutOutlined,
    SunOutlined,
    MoonOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import NotificationDrawer from '../notifications/NotificationDrawer';
import { CompanySwitcher } from '../common/CompanySwitcher';

const { Header: AntHeader } = Layout;

interface HeaderProps {
    collapsed: boolean;
    onToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ collapsed, onToggle }) => {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const { isDarkMode, toggleTheme } = useTheme();
    const router = useRouter();
    const { user, logout, login } = useAuth();

    // Profile Dropdown Menu
    const userMenu: MenuProps['items'] = [
        {
            key: '0',
            label: (
                <div className="flex flex-col px-4 py-1">
                    <span className="font-semibold text-[14px]">{user?.name}</span>
                    <span className="text-xs text-gray-500 font-medium">{user?.role}</span>
                </div>
            ),
            disabled: true,
            style: { cursor: 'default' }
        },
        { type: 'divider' },
        {
            key: '1',
            icon: <UserOutlined />,
            label: 'Profilim',
            onClick: () => router.push('/settings/profile'),
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Ayarlar',
            onClick: () => {
                if (user?.role === 'Admin' || user?.role === 'Manager') {
                    router.push('/settings/users');
                } else {
                    router.push('/settings/profile');
                }
            },
        },
        { type: 'divider' },
        {
            key: 'logout',
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
                    padding: 0,
                    background: isDarkMode ? '#141414' : '#fff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: isDarkMode ? '1px solid #303030' : '1px solid #E3E3E7',
                    zIndex: 1000,
                    height: '64px',
                    position: 'sticky',
                    top: 0,
                    width: '100%',
                }}
            >
                {/* Left Section: Toggle Only - Custom Trigger Style */}
                <div className="flex items-center gap-4 flex-1">
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={onToggle}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                        className={isDarkMode ? 'text-white hover:bg-[#1f1f1f]' : 'text-gray-500 hover:bg-gray-100'}
                    />
                </div>

                {/* Right Section: Icons - Added padding-right since Header padding is 0 */}
                <div className="flex items-center gap-2 pr-6">

                    {/* Company Switcher */}
                    <CompanySwitcher />

                    {/* Theme Toggle */}
                    <Button
                        type="text"
                        icon={isDarkMode ? <MoonOutlined /> : <SunOutlined />}
                        onClick={toggleTheme}
                        className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}
                    />

                    {/* Notification */}
                    <Badge count={2} size="small" dot offset={[-4, 4]}>
                        <Button
                            type="text"
                            icon={<BellOutlined />}
                            onClick={() => setDrawerOpen(true)}
                            className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}
                        />
                    </Badge>

                    {/* Profile Avatar */}
                    <Dropdown
                        menu={{
                            items: userMenu,
                            style: {
                                borderRadius: 8,
                                padding: 8,
                                minWidth: 200,
                                backgroundColor: isDarkMode ? '#262626' : '#ffffff',
                            }
                        }}
                        placement="bottomRight"
                        trigger={['click']}
                    >
                        <Button
                            type="text"
                            icon={<Avatar size={32} icon={<UserOutlined />} style={{ backgroundColor: isDarkMode ? '#434343' : '#f0f0f0', color: isDarkMode ? '#ffffff' : '#595959' }} />}
                            style={{ padding: 0, height: 40, width: 40, borderRadius: '50%' }}
                        />
                    </Dropdown>
                </div>
            </AntHeader>

            <NotificationDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />
        </>
    );
};

export default Header;
