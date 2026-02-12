'use client';

import React, { useEffect, useState } from 'react'
import {
    Alert,
    Button,
    Card,
    Col,
    List,
    Modal,
    Row,
    Skeleton,
    Space,
    Tabs,
    Tag,
    Typography,
    message,
    Timeline,
} from 'antd'
import {
    CloudDownloadOutlined,
    EyeOutlined,
    FilePdfOutlined,
    WarningOutlined,
} from '@ant-design/icons'
import { useTheme } from '@/context/ThemeContext'
import {
    declarationFiles,
    declarationRisks,
    mockXmlData,
} from '@/utils/mockData'
import DeclarationRisksTab from '@/components/declarations/DeclarationRisksTab'

const { Title: _Title } = Typography

const DeclarationDetail: React.FC = () => {
    const { isDarkMode } = useTheme()
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewUrl, setPreviewUrl] = useState('')

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800)
        return () => clearTimeout(timer)
    }, [])

    const handleUpdateStatus = () => {
        setUpdating(true)
        setTimeout(() => {
            setUpdating(false)
            message.success('Statü başarıyla güncellendi')
        }, 1500)
    }

    const handlePreview = (url: string) => {
        setPreviewUrl(url)
        setPreviewVisible(true)
    }

    // Card Styles
    const cardStyle = {
        background: isDarkMode ? '#141414' : '#ffffff',
        borderColor: isDarkMode ? '#303030' : '#e2e2e4',
    }

    const items = [
        {
            key: '1',
            label: 'Beyanname ve Riskler',
            children: <DeclarationRisksTab />,
        },
        {
            key: '2',
            label: 'Arşiv Dokümanları',
            children: (
                <Card className="shadow-sm border border-gray-100" style={cardStyle}>
                    <List
                        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
                        dataSource={declarationFiles}
                        renderItem={(item) => (
                            <List.Item>
                                <Card
                                    hoverable
                                    className="border-gray-200"
                                    style={{
                                        ...cardStyle,
                                        borderColor: isDarkMode ? '#303030' : '#e2e2e4',
                                    }}
                                >
                                    <div className="flex flex-col items-center gap-4 py-4">
                                        <FilePdfOutlined className="text-4xl text-red-500" />
                                        <div className="text-center">
                                            <div
                                                className={`font-medium truncate max-w-[150px] ${isDarkMode ? 'text-gray-200' : ''}`}
                                                title={item.name}
                                            >
                                                {item.name}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">
                                                {item.type} • {item.size}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            <Button
                                                size="small"
                                                icon={<EyeOutlined />}
                                                onClick={() => handlePreview(item.url)}
                                                className={
                                                    isDarkMode
                                                        ? 'bg-[#303030] text-white border-none'
                                                        : ''
                                                }
                                            >
                                                Önizle
                                            </Button>
                                            <Button
                                                size="small"
                                                icon={<CloudDownloadOutlined />}
                                                className={
                                                    isDarkMode
                                                        ? 'bg-[#303030] text-white border-none'
                                                        : ''
                                                }
                                            >
                                                İndir
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </List.Item>
                        )}
                    />
                </Card>
            ),
        },

        {
            key: '3',
            label: 'İşlem Geçmişi',
            children: (
                <Card className="shadow-sm border border-gray-100" style={cardStyle}>
                    <div className="p-4">
                        <Timeline
                            mode="left"
                            items={[
                                {
                                    color: 'green',
                                    children: (
                                        <>
                                            <div className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Beyanname Oluşturuldu</div>
                                            <div className="text-xs text-gray-500">26.01.2024 14:30 - Sistem</div>
                                        </>
                                    ),
                                },
                                {
                                    color: 'blue',
                                    children: (
                                        <>
                                            <div className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Customs X-ray Ön Analiz Başlatıldı</div>
                                            <div className="text-xs text-gray-500">26.01.2024 14:35 - Otomasyon</div>
                                        </>
                                    ),
                                },
                                {
                                    color: 'orange',
                                    children: (
                                        <>
                                            <div className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Riskler Tespit Edildi</div>
                                            <div className="text-xs text-gray-500">26.01.2024 14:36 - Customs X-ray AI</div>
                                            <div className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Potansiyel GTİP uyumsuzluğu ve menşei riski tespit edildi.</div>
                                        </>
                                    ),
                                },
                                {
                                    dot: <CloudDownloadOutlined className="text-blue-500" />,
                                    children: (
                                        <>
                                            <div className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>TPS Başvurusu Yapıldı</div>
                                            <div className="text-xs text-gray-500">26.01.2024 15:00 - Operasyon Uzmanı</div>
                                        </>
                                    ),
                                },
                                {
                                    color: 'gray',
                                    children: (
                                        <>
                                            <div className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>İntaç Bekleniyor</div>
                                            <div className="text-xs text-gray-500">İşlem devam ediyor...</div>
                                        </>
                                    ),
                                },
                            ]}
                        />
                    </div>
                </Card>
            ),
        },
    ]

    return (
        <div className="flex flex-col gap-4 pb-8 p-6">
            <DeclarationRisksTab />
        </div>
    )
}

export default DeclarationDetail
