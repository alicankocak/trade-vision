'use client';

import React, { useState, Suspense } from 'react';
import { Typography, Table, Button, Tag, Space, ConfigProvider, theme, message, Popconfirm, Tabs, Checkbox } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SafetyOutlined, TeamOutlined } from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { UserModal, UserFormData } from '@/components/settings/UserModal';

export const dynamic = 'force-dynamic';

const { Title } = Typography;

// Mock data
const initialUsers: UserFormData[] = [
    { id: '1', name: 'Alican Admin', email: 'alican@tradevision.com', role: 'Admin', status: 'Aktif' },
    { id: '2', name: 'Zeynep Yılmaz', email: 'zeynep@tradevision.com', role: 'Manager', status: 'Aktif' },
    { id: '3', name: 'Ahmet Demir', email: 'ahmet@tradevision.com', role: 'Viewer', status: 'Pasif' },
];

function UsersContent() {
    const { isDarkMode } = useTheme();
    const { isAdmin, isManager } = useAuth();

    const [users, setUsers] = useState<UserFormData[]>(initialUsers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserFormData | null>(null);
    const [loading, setLoading] = useState(false);

    if (!isAdmin && !isManager) {
        return (
            <div className="p-12 text-center">
                <Title level={4} type="danger">Erişim Reddedildi</Title>
                <p>Bu sayfayı görüntüleme yetkiniz bulunmamaktadır.</p>
            </div>
        );
    }

    const openModal = (user?: UserFormData) => {
        setEditingUser(user || null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSubmit = async (values: UserFormData) => {
        setLoading(true);
        // Simulate API call frontend queue
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (editingUser) {
            setUsers(users.map(u => u.id === values.id ? { ...u, ...values } : u));
            message.success('Kullanıcı güncellendi');
        } else {
            setUsers([...users, { ...values, id: Math.random().toString() }]);
            message.success('Kullanıcı eklendi');
        }

        setLoading(false);
        closeModal();
    };

    const handleDelete = async (id: string) => {
        const hide = message.loading('Siliniyor...', 0);
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        hide();
        setUsers(users.filter(u => u.id !== id));
        message.success('Kullanıcı başarıyla silindi');
    };

    const searchBg = isDarkMode ? '#141414' : '#ffffff';
    const borderCol = isDarkMode ? '#303030' : '#d9d9d9';

    const columns = [
        {
            title: 'Ad Soyad',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-[#262626]'}`}>{text}</span>,
        },
        {
            title: 'E-posta',
            dataIndex: 'email',
            key: 'email',
            render: (text: string) => <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{text}</span>,
        },
        {
            title: 'Rol',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => {
                let color = 'default';
                if (role === 'Admin') color = 'red';
                if (role === 'Manager') color = 'blue';
                if (role === 'Viewer') color = 'green';

                return (
                    <Tag color={color} className="m-0 border-0">
                        {role}
                    </Tag>
                );
            },
        },
        {
            title: 'Statü',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'Aktif' ? 'success' : 'default'} className="m-0 bg-transparent">
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Aksiyon',
            key: 'action',
            render: (_: any, record: UserFormData) => (
                <PermissionGuard allowedRoles={['Admin']}>
                    <Space size="middle">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => openModal(record)}
                            className={isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}
                        />
                        <Popconfirm
                            title="Kullanıcıyı silmek istediğinize emin misiniz?"
                            onConfirm={() => handleDelete(record.id!)}
                            okText="Evet"
                            cancelText="Hayır"
                            okButtonProps={{ danger: true, style: { borderRadius: 8 } }}
                            cancelButtonProps={{ style: { borderRadius: 8 } }}
                        >
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                            />
                        </Popconfirm>
                    </Space>
                </PermissionGuard>
            ),
        },
    ];

    return (
        <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-black' : 'bg-[#fafafa]'}`}>
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <div>
                        <Title level={4} style={{ margin: 0, color: isDarkMode ? 'white' : '#262626' }}>
                            Kullanıcı Yönetimi
                        </Title>
                        <span className={isDarkMode ? 'text-gray-400' : 'text-[#262626] opacity-70'}>
                            Sistem kullanıcılarını görüntüleyin ve yönetin.
                        </span>
                    </div>

                    <PermissionGuard allowedRoles={['Admin']}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            size="large"
                            onClick={() => openModal()}
                            style={{
                                backgroundColor: isDarkMode ? '#ffffff' : '#262626',
                                color: isDarkMode ? '#000000' : '#ffffff',
                                borderRadius: 8
                            }}
                        >
                            Yeni Kullanıcı
                        </Button>
                    </PermissionGuard>
                </div>

                <ConfigProvider
                    theme={{
                        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                        token: {
                            colorPrimary: isDarkMode ? '#ffffff' : '#000000',
                            colorBgContainer: "transparent",
                            colorBorder: borderCol,
                            borderRadius: 8,
                        },
                        components: {
                            Tabs: {
                                itemSelectedColor: isDarkMode ? '#ffffff' : '#000000',
                                itemColor: isDarkMode ? '#a1a1a1' : '#595959',
                                itemHoverColor: isDarkMode ? '#ffffff' : '#000000',
                                titleFontSize: 15,
                            }
                        }
                    }}
                >
                    <Tabs
                        defaultActiveKey="1"
                        items={[
                            {
                                key: '1',
                                label: <span className="flex items-center gap-2"><TeamOutlined /> Kullanıcı Listesi</span>,
                                children: (
                                    <ConfigProvider
                                        theme={{
                                            algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                                            token: {
                                                colorPrimary: isDarkMode ? '#ffffff' : '#000000',
                                                colorBgContainer: searchBg,
                                                colorBorder: borderCol,
                                                borderRadius: 8,
                                            },
                                            components: {
                                                Table: {
                                                    borderRadius: 8,
                                                    colorBgContainer: searchBg,
                                                    headerBg: isDarkMode ? '#1f1f1f' : '#f5f5f5',
                                                    headerColor: isDarkMode ? '#e5e7eb' : '#262626',
                                                    rowHoverBg: isDarkMode ? '#1f1f1f' : '#fafafa',
                                                    borderColor: borderCol,
                                                }
                                            }
                                        }}
                                    >
                                        <div className="rounded-[8px] border overflow-hidden mt-4" style={{ borderColor: borderCol }}>
                                            <Table
                                                columns={columns}
                                                dataSource={users}
                                                rowKey="id"
                                                pagination={{
                                                    pageSize: 10,
                                                    showTotal: (total) => `Toplam ${total} kullanıcı`,
                                                    style: { paddingRight: 16 }
                                                }}
                                            />
                                        </div>
                                    </ConfigProvider>
                                ),
                            },
                            {
                                key: '2',
                                label: <span className="flex items-center gap-2"><SafetyOutlined /> Sistem Yetki Matrisi</span>,
                                children: (
                                    <ConfigProvider
                                        theme={{
                                            algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                                            token: {
                                                colorBgContainer: isDarkMode ? '#1f1f1f' : '#ffffff',
                                                colorBorder: borderCol,
                                                borderRadius: 8,
                                            },
                                            components: {
                                                Table: {
                                                    headerBg: isDarkMode ? '#141414' : '#fafafa',
                                                    borderColor: borderCol,
                                                    borderRadius: 8,
                                                }
                                            }
                                        }}
                                    >
                                        <div className="mt-4">
                                            <div className="rounded-[8px] border overflow-hidden" style={{ borderColor: borderCol }}>
                                                <Table
                                                    rowKey="key"
                                                    pagination={false}
                                                    size="middle"
                                                    columns={[
                                                        { title: 'Fonksiyon / İşlem', dataIndex: 'feature', key: 'feature', width: '40%' },
                                                        { title: 'Admin', dataIndex: 'admin', key: 'admin', align: 'center', render: (val) => val === null ? '' : <Checkbox checked={val} disabled className="matrix-checkbox" /> },
                                                        { title: 'Manager', dataIndex: 'manager', key: 'manager', align: 'center', render: (val) => val === null ? '' : <Checkbox checked={val} disabled className="matrix-checkbox" /> },
                                                        { title: 'Viewer', dataIndex: 'viewer', key: 'viewer', align: 'center', render: (val) => val === null ? '' : <Checkbox checked={val} disabled className="matrix-checkbox" /> },
                                                    ]}
                                                    dataSource={[
                                                        { key: 'c1', feature: <span className="font-semibold text-gray-400 uppercase text-xs tracking-wider">Kullanıcı İşlemleri</span>, admin: null, manager: null, viewer: null },
                                                        { key: '1', feature: <span className="pl-4">Ekleme, Silme</span>, admin: true, manager: false, viewer: false },
                                                        { key: '2', feature: <span className="pl-4">Düzenleme (Admin hariç e-posta kilitli)</span>, admin: true, manager: false, viewer: false },
                                                        { key: '3', feature: <span className="pl-4">Rol Atama</span>, admin: true, manager: false, viewer: false },
                                                        { key: 'c2', feature: <span className="font-semibold text-gray-400 uppercase text-xs tracking-wider">Beyanname İşlemleri</span>, admin: null, manager: null, viewer: null },
                                                        { key: '4', feature: <span className="pl-4">Görüntüleme</span>, admin: true, manager: true, viewer: true },
                                                        { key: '5', feature: <span className="pl-4">Yeni Oluşturma, Düzenleme</span>, admin: true, manager: true, viewer: false },
                                                        { key: '6', feature: <span className="pl-4">Statü Sorgulama</span>, admin: true, manager: true, viewer: false },
                                                        { key: 'c3', feature: <span className="font-semibold text-gray-400 uppercase text-xs tracking-wider">Veri & Raporlama</span>, admin: null, manager: null, viewer: null },
                                                        { key: '7', feature: <span className="pl-4">Excel/PDF Dışa Aktar</span>, admin: true, manager: true, viewer: false },
                                                        { key: '8', feature: <span className="pl-4">İşlem Geçmişi Görüntüleme</span>, admin: true, manager: true, viewer: false },
                                                        { key: 'c4', feature: <span className="font-semibold text-gray-400 uppercase text-xs tracking-wider">Sistem</span>, admin: null, manager: null, viewer: null },
                                                        { key: '9', feature: <span className="pl-4">Kendi Profilini Düzenleme</span>, admin: true, manager: true, viewer: true },
                                                        { key: '10', feature: <span className="pl-4">Dashboard İstatistiklerini Görme</span>, admin: true, manager: true, viewer: true },
                                                    ]}
                                                />
                                            </div>
                                            <div className={`mt-4 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center gap-2 bg-opacity-5 p-3 rounded-lg`} style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
                                                <SafetyOutlined className="text-[16px]" />
                                                <span>Tüm şifre işlemleri SHA-256 ile korunmakta ve kritik aksiyonlar Frontend Queue kontrolü altındadır.</span>
                                            </div>
                                        </div>
                                    </ConfigProvider>
                                ),
                            }
                        ]}
                    />
                </ConfigProvider>
            </div>

            <UserModal
                open={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                initialValues={editingUser}
                loading={loading}
            />

        </div>
    );
}

export default function UsersPage() {
    return (
        <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
            <UsersContent />
        </Suspense>
    );
}
