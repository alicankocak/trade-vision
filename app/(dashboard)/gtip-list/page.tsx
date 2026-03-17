'use client';

import React, { useState, useMemo } from 'react';
import { Table, Typography, Card, Space, Button, Select, Breadcrumb } from 'antd';
import { 
    BarChartOutlined, 
    ArrowLeftOutlined, 
    DownloadOutlined,
    SearchOutlined,
    NumberOutlined,
    DashboardOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { mockGtipUsage } from '@/data/mockGtipData';
import { useAuthStore } from '@/store/useAuthStore';

const { Title, Text } = Typography;

export default function GtipListPage() {
    const { isDarkMode } = useTheme();
    const router = useRouter();
    const { activeCompanyContext } = useAuthStore();
    const [selectedYear, setSelectedYear] = useState(2024);

    const columns = [
        {
            title: 'Sıra',
            key: 'index',
            width: 80,
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: 'GTIP Numarası',
            dataIndex: 'gtipNo',
            key: 'gtipNo',
            render: (text: string) => (
                <Space>
                    <NumberOutlined className="text-blue-500" />
                    <Text strong className={isDarkMode ? 'text-zinc-200' : 'text-gray-800'}>{text}</Text>
                </Space>
            ),
            sorter: (a: any, b: any) => a.gtipNo.localeCompare(b.gtipNo),
        },
        {
            title: 'Kullanım Sayısı',
            dataIndex: 'usageCount',
            key: 'usageCount',
            render: (value: number) => (
                <Text strong className="text-blue-600 dark:text-blue-400">{value.toLocaleString('tr-TR')}</Text>
            ),
            sorter: (a: any, b: any) => a.usageCount - b.usageCount,
            defaultSortOrder: 'descend' as const,
        },
        {
            title: 'Yıl',
            dataIndex: 'year',
            key: 'year',
        },
    ];

    const filteredData = useMemo(() => {
        return mockGtipUsage
            .filter(item => item.companyId === activeCompanyContext?.id && item.year === selectedYear)
            .sort((a, b) => b.usageCount - a.usageCount);
    }, [activeCompanyContext, selectedYear]);

    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            <div className="mb-8 flex justify-between items-start">
                <Space direction="vertical" size={2}>
                    <Breadcrumb 
                        items={[
                            { title: <Space onClick={() => router.push('/dashboard')} className="cursor-pointer"><DashboardOutlined /> Dashboard</Space> },
                            { title: 'GTIP Analizi' }
                        ]}
                        className="mb-4"
                    />
                    <Title level={2} className="m-0 flex items-center gap-3">
                        <BarChartOutlined className="text-blue-600" />
                        En Çok Kullanılan GTIP'ler
                    </Title>
                    <Text type="secondary" className="text-lg">
                        Firmanızın yıllık bazda en çok kullandığı GTIP kalemlerinin dökümü.
                    </Text>
                </Space>

                <Space size="middle">
                    <Select
                        value={selectedYear}
                        onChange={setSelectedYear}
                        style={{ width: 120 }}
                        options={[
                            { value: 2024, label: '2024 Yılı' },
                            { value: 2023, label: '2023 Yılı' },
                        ]}
                    />
                    <Button icon={<DownloadOutlined />}>Excel İndir</Button>
                    <Button 
                        type="primary" 
                        icon={<ArrowLeftOutlined />} 
                        onClick={() => router.back()}
                    >
                        Geri Dön
                    </Button>
                </Space>
            </div>

            <Card 
                className={`shadow-xl border-none ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}
                styles={{ body: { padding: 0 } }}
            >
                <Table 
                    columns={columns} 
                    dataSource={filteredData} 
                    rowKey="id"
                    pagination={{ pageSize: 20 }}
                    size="large"
                    className="custom-table"
                />
            </Card>
        </div>
    );
}
