'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Button, Input, Select, Tooltip, Empty, Typography, Divider, Tag, Grid, Dropdown, MenuProps, Drawer } from 'antd';
import {
    SearchOutlined,
    SettingOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    MoreOutlined,
    CloseOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

// --- Types ---
interface Notification {
    id: string;
    type: 'Bakım' | 'Duyuru' | 'Uyarı' | 'Olay';
    title: string;
    description: string;
    impact: 'High' | 'Medium' | 'Low';
    time: string;
    date: string;
    read: boolean;
    // Detail fields
    component?: string;
    location?: string;
    startTime?: string;
    endTime?: string;
    updateTime?: string;
    severity?: string;
    fullBody: React.ReactNode;
}

// --- Mock Data ---
const initialNotifications: Array<Notification> = [
    {
        id: '1',
        type: 'Uyarı',
        title: 'Risk Tespiti: Kritik İşlem Hacmi',
        description: 'Belirlenen işlem limitleri aşıldı.',
        impact: 'High',
        time: '5 dk önce',
        date: 'Bugün, 14:20',
        read: false,
        component: 'Risk Motoru',
        location: 'Istanbul',
        startTime: '14:20 TSİ',
        endTime: '-',
        updateTime: 'Az önce',
        severity: 'Kritik',
        fullBody: (
            <div>
                <p className="mb-4">Sistem, belirlenen 24 saatlik işlem hacmi limitlerinin aşıldığını tespit etti. Lütfen ilgili hesapları kontrol edin ve gerekirse manuel onay sürecini başlatın.</p>
                <p>Otomatik durdurma mekanizması devreye girmiş olabilir.</p>
            </div>
        )
    },
    {
        id: '2',
        type: 'Duyuru',
        title: 'Kural Güncellemesi: Yeni Mevzuat Uyumu',
        description: 'Gümrük mevzuatındaki son değişiklikler sisteme işlendi.',
        impact: 'Low',
        time: '12 dk önce',
        date: 'Bugün, 10:00',
        read: false,
        component: 'Kural Seti',
        location: 'Global',
        startTime: '10:00 TSİ',
        endTime: '10:00 TSİ',
        updateTime: '12 dk önce',
        severity: 'Düşük',
        fullBody: (
            <div>
                <p className="mb-4">Resmi Gazete'de yayınlanan yeni gümrük tarifeleri ve vergi oranları sistem kural setlerine entegre edilmiştir. Sonraki işlemlerde yeni oranlar geçerli olacaktır.</p>
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-blue-900 mb-4">
                    <strong>Bilgi:</strong> Geçmiş işlemler bu güncellemeden etkilenmez.
                </div>
            </div>
        )
    },
    {
        id: '3',
        type: 'Bakım',
        title: 'Risk Tespiti: Veri Tabanı Bakımı',
        description: 'Performans iyileştirmesi için planlı çalışma.',
        impact: 'Medium',
        time: '1 saat önce',
        date: 'Bugün, 09:00',
        read: true,
        component: 'Database',
        location: 'Frankfurt',
        startTime: '03:00 TSİ',
        endTime: '05:00 TSİ',
        updateTime: '1 saat önce',
        severity: 'Orta',
        fullBody: (
            <div>
                <p className="mb-6">Veri tabanı indeksleme ve optimizasyon çalışmaları tamamlandı. Sistem performansı normal değerlerine döndü.</p>
            </div>
        )
    },
    {
        id: '4',
        type: 'Olay',
        title: 'Kural Güncellemesi: İhracat Kısıtlamaları',
        description: 'Belirli GTİP kodları için yeni kısıtlamalar tanımlandı.',
        impact: 'Medium',
        time: 'Dün',
        date: '31 Oca, 16:45',
        read: true,
        component: 'Compliance',
        location: 'Global',
        severity: 'Orta',
        fullBody: <p>Yasaklı ve kısıtlı ürünler listesi güncellendi. İlgili GTİP kodlarını içeren beyannameler ek onaya düşecektir.</p>
    },
    {
        id: '5',
        type: 'Duyuru',
        title: 'Risk Tespiti: Şüpheli Giriş Denemesi',
        description: 'Hesabınıza farklı bir lokasyondan giriş denendi.',
        impact: 'High',
        time: '28 Oca',
        date: '28 Oca, 08:30',
        read: true,
        component: 'Security',
        location: 'Global',
        severity: 'Yüksek',
        fullBody: <p>IP: 192.168.1.1 üzerinden başarısız giriş denemeleri tespit edildi. Güvenliğiniz için şifrenizi yenilemenizi öneririz.</p>
    },
    {
        id: '6',
        type: 'Bakım',
        title: 'Sistem Bakımı: Yıllık Kontrol',
        description: 'Genel sistem sağlığı kontrolleri.',
        impact: 'Low',
        time: '20 Oca',
        date: '20 Oca, 00:00',
        read: true,
        component: 'Infrastructure',
        location: 'Global',
        severity: 'Düşük',
        fullBody: <p>Yıllık periyodik sistem sağlık kontrolleri sorunsuz tamamlandı.</p>
    }
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Array<Notification>>(initialNotifications);
    const [selectedId, setSelectedId] = useState<string | null>('1');
    const [searchText, setSearchText] = useState('');
    const [filterType, setFilterType] = useState<string | undefined>(undefined);
    const [searchExpanded, setSearchExpanded] = useState(false);
    const screens = useBreakpoint();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Filter Logic
    const filteredNotifications = useMemo(() => {
        return notifications.filter(n => {
            const matchesSearch =
                n.title.toLowerCase().includes(searchText.toLowerCase()) ||
                n.description.toLowerCase().includes(searchText.toLowerCase());
            const matchesType = filterType ? n.type === filterType : true;
            return matchesSearch && matchesType;
        });
    }, [notifications, searchText, filterType]);

    const selectedNotification = notifications.find(n => n.id === selectedId);

    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    // Mark as read when clicked
    const handleNotificationClick = (id: string) => {
        setSelectedId(id);
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const getImpactTag = (impact: string) => {
        switch (impact) {
            case 'High': return <Tag bordered={true} color="red" className="mr-0">High</Tag>;
            case 'Medium': return <Tag bordered={true} color="gold" className="mr-0">Medium</Tag>;
            case 'Low': return <Tag bordered={true} color="blue" className="mr-0">Low</Tag>;
            default: return <Tag bordered={true}>{impact}</Tag>;
        }
    };

    // --- Responsive Visibility Logic ---
    // If not mounted yet (SSR), default to standard large view to prevent mismatch
    // But since we use simple conditionals, better to check !screens.md etc. safely
    const isSmallScreen = mounted && !screens.sm; // Mobile
    const isMediumScreen = mounted && !screens.md; // Tablet Portrait
    const isLargeScreen = mounted && !screens.lg; // Tablet Landscape
    const isXlScreen = mounted && !!screens.xl; // Desktop (Split View Trigger)

    // Overflow Menu Items
    const overflowItems: MenuProps['items'] = [];

    // 1. Filter (if screen is smaller than MD)
    if (isMediumScreen) {
        overflowItems.push({
            key: 'filter',
            label: 'Filter Type',
            children: [
                { key: 'all', label: 'All', onClick: () => setFilterType(undefined) },
                { key: 'Bakım', label: 'Bakım', onClick: () => setFilterType('Bakım') },
                { key: 'Duyuru', label: 'Duyuru', onClick: () => setFilterType('Duyuru') },
                { key: 'Uyarı', label: 'Uyarı', onClick: () => setFilterType('Uyarı') },
                { key: 'Olay', label: 'Olay', onClick: () => setFilterType('Olay') },
            ]
        });
    }

    // 2. Mark Read (if screen is smaller than LG)
    if (isLargeScreen) {
        if (overflowItems.length > 0) overflowItems.push({ type: 'divider' });
        overflowItems.push({
            key: 'markRead',
            label: 'Okundu İşaretle',
            icon: <CheckCircleOutlined />,
            onClick: handleMarkAllRead
        });
    }

    // --- Render Detail Helper ---
    const renderDetailContent = () => {
        if (!selectedNotification) return <Empty description="Select a notification to view details" />;

        return (
            <div className="p-8 h-full overflow-y-auto">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2 leading-tight">
                    {selectedNotification.title}
                </h2>

                <div className="flex justify-between items-center mb-6 text-sm text-gray-500 border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2">
                        <ClockCircleOutlined />
                        <span>{selectedNotification.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">Impact:</span>
                        {getImpactTag(selectedNotification.impact)}
                    </div>
                </div>

                <div className="text-gray-800 text-base mb-8 italic border-l-4 border-gray-200 pl-4">
                    {selectedNotification.description}
                </div>

                <div className="text-gray-900 text-sm leading-7 text-justify mb-8">
                    {selectedNotification.fullBody}
                </div>

                <div className="bg-gray-50 rounded-lg p-6 text-sm border border-gray-100">
                    <h3 className="text-gray-900 font-bold mb-4 uppercase text-xs tracking-wider">Technical Details</h3>
                    <div className="space-y-3">
                        <div className="grid grid-cols-12 gap-2">
                            <div className="col-span-4 font-semibold text-gray-600">Component:</div>
                            <div className="col-span-8 text-gray-900">{selectedNotification.component || '-'}</div>
                        </div>
                        <div className="grid grid-cols-12 gap-2">
                            <div className="col-span-4 font-semibold text-gray-600">Location:</div>
                            <div className="col-span-8 text-gray-900">{selectedNotification.location || 'Global'}</div>
                        </div>
                        <div className="grid grid-cols-12 gap-2">
                            <div className="col-span-4 font-semibold text-gray-600">Severity:</div>
                            <div className="col-span-8 text-gray-900">{selectedNotification.severity}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-screen bg-white font-sans text-gray-900">
            {/* --- Top Header --- */}
            <header className="px-8 py-6 pb-2 shrink-0">
                <div className="flex items-center gap-2 mb-4">
                    <h1 className="text-2xl font-bold text-gray-900 m-0">Notifications</h1>
                    <Tooltip title="Bildirim Ayarları">
                        <Button
                            type="text"
                            icon={<SettingOutlined />}
                            className="opacity-50 hover:opacity-100"
                        />
                    </Tooltip>
                </div>
                <p className="text-gray-600 text-sm max-w-5xl leading-relaxed">
                    View personalized notifications that are sent because you have an affected resource. Global notifications that affect all users in the platform can also be found in this list. To limit the types of notifications that you receive, configure your notification preferences.
                </p>
            </header>

            {/* --- Main Content Split --- */}
            <div className="flex-1 overflow-hidden flex border-t border-gray-100 mt-6">

                {/* --- Left Panel: List --- */}
                <div className={`flex flex-col bg-[#f4f4f4] border-r border-gray-200 transition-all duration-300 ${isXlScreen ? 'w-[60%]' : 'w-full'}`}>
                    {/* Filters & Actions */}
                    <div className="px-6 py-4 flex items-center gap-4 border-b border-gray-200 shrink-0 h-[72px]">

                        {/* Responsive Search */}
                        {isSmallScreen && !searchExpanded ? (
                            <Tooltip title="Search">
                                <Button
                                    icon={<SearchOutlined />}
                                    onClick={() => setSearchExpanded(true)}
                                />
                            </Tooltip>
                        ) : (
                            <div className={`flex items-center gap-2 ${searchExpanded ? 'w-full' : 'max-w-xs'}`}>
                                <Input
                                    prefix={<SearchOutlined className="text-gray-500" />}
                                    placeholder="Search"
                                    className="bg-white h-10 border-gray-300 w-full"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    autoFocus={searchExpanded}
                                />
                                {searchExpanded && (
                                    <Button
                                        type="text"
                                        icon={<CloseOutlined />}
                                        onClick={() => {
                                            setSearchExpanded(false);
                                            setSearchText('');
                                        }}
                                    />
                                )}
                            </div>
                        )}

                        {/* Inline Filter */}
                        {!searchExpanded && !isMediumScreen && (
                            <Select
                                placeholder="Filter by type ..."
                                style={{ width: 200 }}
                                className="h-10"
                                allowClear
                                value={filterType}
                                onChange={(value) => setFilterType(value)}
                                options={[
                                    { value: 'Bakım', label: 'Bakım' },
                                    { value: 'Duyuru', label: 'Duyuru' },
                                    { value: 'Uyarı', label: 'Uyarı' },
                                    { value: 'Olay', label: 'Olay' },
                                ]}
                            />
                        )}

                        <div className="flex-1"></div>

                        {/* Inline Mark Read Button */}
                        {!searchExpanded && !isLargeScreen && (
                            <Tooltip title="Hepsini okundu işaretle">
                                <Button
                                    type="primary"
                                    className="bg-black"
                                    icon={<CheckCircleOutlined />}
                                    onClick={handleMarkAllRead}
                                >
                                    Okundu
                                </Button>
                            </Tooltip>
                        )}

                        {/* Overflow Menu */}
                        {!searchExpanded && (isLargeScreen || isMediumScreen) && (
                            <Dropdown menu={{ items: overflowItems }} trigger={['click']}>
                                <Button icon={<MoreOutlined />} />
                            </Dropdown>
                        )}
                    </div>

                    {/* List Items */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="flex items-center px-6 py-3 border-b border-gray-200 text-xs font-bold text-gray-500 bg-[#f4f4f4]">
                            <div className="hidden lg:block w-[20%]">Type</div>
                            <div className="flex-1">Message</div>
                            <div className="hidden md:block w-[20%] text-right pr-4">Impact</div>
                            <div className="hidden xl:block w-[10%] text-right">Tarih</div>
                        </div>

                        {filteredNotifications.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => handleNotificationClick(item.id)}
                                className={`
                                    flex items-center px-6 py-4 border-b border-gray-200 cursor-pointer text-sm
                                    hover:bg-gray-100 transition-colors
                                    ${isXlScreen && selectedId === item.id ? 'bg-[#e0e0e0] border-l-4 border-l-gray-600 pl-[20px]' : 'bg-white pl-6'}
                                    ${item.read ? 'text-gray-500 font-normal' : 'text-gray-900 font-bold'}
                                `}
                            >
                                <div className="hidden lg:block w-[20%] pr-2">
                                    <Tag bordered={true} className="text-gray-600 mr-0">
                                        {item.type}
                                    </Tag>
                                </div>

                                <div className={`flex-1 pr-4 truncate min-w-0 ${!item.read ? 'font-bold' : 'font-normal'}`}>
                                    {item.title}
                                </div>

                                <div className="hidden md:block w-[20%] text-right pr-4">
                                    {getImpactTag(item.impact)}
                                </div>

                                <div className="hidden xl:block w-[10%] text-right font-medium">
                                    {item.time}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Right Panel: Detail (Split View - Only visible on XL+) --- */}
                {isXlScreen && (
                    <div className="w-[40%] shrink-0 bg-white flex flex-col overflow-y-auto border-l border-gray-200">
                        {renderDetailContent()}
                    </div>
                )}

                {/* --- Drawer: Detail (Overlay - Only visible when !XL) --- */}
                <Drawer
                    title={null}
                    placement="right"
                    width={screens.md ? '66.66%' : '100%'}
                    onClose={() => setSelectedId(null)}
                    open={!isXlScreen && !!selectedId}
                    styles={{ body: { padding: 0 } }}
                >
                    {renderDetailContent()}
                </Drawer>
            </div>
        </div>
    );
}
