import React from 'react';
import { Card, Row, Col, Typography, Statistic, List, Tag, Select, Space } from 'antd';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';
import { trendData, riskData, intacAlerts } from '../utils/mockData';
import { WarningOutlined, FileTextOutlined, SafetyCertificateOutlined, ThunderboltOutlined, BulbOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const { Title, Text } = Typography;
const { Option } = Select;

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }: any) => {
    const { isDarkMode } = useTheme();
    if (active && payload && payload.length) {
        return (
            <div className={`p-3 rounded border shadow-sm ${isDarkMode ? 'bg-[#1a1a1a] text-white border-[#2d2d2d]' : 'bg-white text-black border-[#e2e2e4]'}`}>
                <p className={`font-semibold mb-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
                <p className="font-bold text-sm">{`${payload[0].name}: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();

    // Theme Variables
    const primaryColor = isDarkMode ? '#ffffff' : '#000000';
    const secondaryColor = isDarkMode ? '#a3a3a3' : '#4b5563';
    const gridColor = isDarkMode ? '#2d2d2d' : '#f3f4f6';
    const borderColor = isDarkMode ? 'border-[#2d2d2d]' : 'border-[#e2e2e4]';
    const cardClass = `shadow-sm hover:shadow-md transition-shadow h-full border ${borderColor}`;

    // Enhanced KPI Data Construction
    const dashboardKPIs = [
        {
            title: 'Toplam Beyanname',
            value: 1248,
            icon: <FileTextOutlined className={`text-xl ${isDarkMode ? 'text-white' : 'text-black'}`} />,
            bgColor: isDarkMode ? '#262626' : '#f3f4f6', // Dark gray vs Light gray
            suffix: 'Adet'
        },
        {
            title: 'Mutlak Risk',
            value: 12,
            icon: <SafetyCertificateOutlined className={`text-xl ${isDarkMode ? 'text-white' : 'text-[#000000]'}`} />,
            bgColor: isDarkMode ? '#450a0a' : '#fee2e2', // Dark Red vs Light Red
            color: isDarkMode ? '#ffffff' : '#000000',
            suffix: 'Kritik'
        },
        {
            title: 'Potansiyel Risk',
            value: 45,
            icon: <ThunderboltOutlined className="text-xl text-gray-500" />,
            bgColor: isDarkMode ? '#262626' : '#f3f4f6',
            color: isDarkMode ? '#a3a3a3' : '#4b5563',
            suffix: 'İnceleme'
        },
        {
            title: 'AI-ML Bulgusu',
            value: 8,
            icon: <BulbOutlined className="text-xl text-gray-500" />,
            bgColor: isDarkMode ? '#262626' : '#f9fafb',
            color: isDarkMode ? '#a3a3a3' : '#6b7280',
            suffix: 'Model'
        },
        {
            title: 'İntaç Bekleyen',
            value: 156,
            icon: <CalendarOutlined className="text-xl text-gray-500" />,
            bgColor: isDarkMode ? '#262626' : '#f3f4f6',
            color: isDarkMode ? '#a3a3a3' : '#374151',
            suffix: 'Gecikme'
        }
    ];

    // Dynamic Risk Data Colors for Pie Chart
    const dynamicRiskData = riskData.map(item => ({
        ...item,
        color: item.name === 'Yüksek'
            ? (isDarkMode ? '#ffffff' : '#000000')
            : (isDarkMode ? '#525252' : item.color) // Adjust grays for dark mode
    }));

    return (
        <div className="flex flex-col gap-6">
            {/* Header with Date Filter */}
            <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 rounded-lg border shadow-sm ${isDarkMode ? 'bg-[#1a1a1a] border-[#2d2d2d]' : 'bg-white border-[#e2e2e4]'}`}>
                <div>
                    <Title level={2} style={{ margin: 0, color: isDarkMode ? 'white' : 'black' }}>
                        Dashboard
                    </Title>
                    <Text type="secondary" style={{ color: isDarkMode ? '#a3a3a3' : undefined }}>İthalat ve ihracat operasyonlarınızın genel görünümü.</Text>
                </div>
                <Space wrap>
                    <Select defaultValue="2024" style={{ width: 100 }} bordered={false}>
                        <Option value="2024">2024</Option>
                        <Option value="2023">2023</Option>
                    </Select>
                    <Select defaultValue="3M" style={{ width: 120 }} bordered={false}>
                        <Option value="3M">Son 3 Ay</Option>
                        <Option value="6M">Son 6 Ay</Option>
                        <Option value="custom">Özel Tarih</Option>
                    </Select>
                </Space>
            </div>

            {/* 5-Column KPI Grid */}
            <Row gutter={[16, 16]}>
                {dashboardKPIs.map((kpi, index) => (
                    <Col xs={24} sm={12} md={8} lg={4} xl={4} style={{ flex: '1 0 20%' }} key={index}>
                        <Card
                            bordered={false}
                            className={cardClass}
                            bodyStyle={{ padding: '20px' }}
                        >
                            <div className="flex flex-col justify-between h-full gap-2">
                                <div className="flex justify-between items-start">
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                                        style={{ backgroundColor: kpi.bgColor }}
                                    >
                                        {kpi.icon}
                                    </div>
                                    {kpi.suffix && <Tag className={`m-0 text-[10px] uppercase font-bold border-none ${isDarkMode ? 'bg-[#262626] text-gray-400' : 'bg-gray-100 text-gray-500'}`}>{kpi.suffix}</Tag>}
                                </div>
                                <div>
                                    <Statistic
                                        value={kpi.value}
                                        valueStyle={{ fontWeight: 700, fontSize: '24px', color: kpi.color || (isDarkMode ? 'white' : 'black') }}
                                    />
                                    <p className={`text-xs font-medium uppercase tracking-wide mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{kpi.title}</p>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row gutter={[16, 16]}>
                {/* Main Trend Chart */}
                <Col xs={24} lg={16}>
                    <Card
                        title={<span style={{ color: isDarkMode ? 'white' : 'black' }}>Haftalık Beyanname Trendi</span>}
                        bordered={false}
                        className={cardClass}
                    >
                        <div style={{ height: 350 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="colorBeyanname" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={primaryColor} stopOpacity={0.1} />
                                            <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: secondaryColor }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: secondaryColor }} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: borderColor, strokeWidth: 1, strokeDasharray: '4 4' }} />
                                    <Area
                                        type="monotone"
                                        dataKey="beyanname"
                                        stroke={primaryColor}
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorBeyanname)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>

                {/* Right Side: Risk Distribution */}
                <Col xs={24} lg={8}>
                    <Card title={<span style={{ color: isDarkMode ? 'white' : 'black' }}>Risk Dağılımı</span>} bordered={false} className={cardClass}>
                        <div className="h-full flex flex-col justify-center" style={{ minHeight: 350 }}>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={dynamicRiskData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {dynamicRiskData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        iconType="circle"
                                        formatter={(value) => (
                                            <span className={`text-xs ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{value}</span>
                                        )}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Compact Analysis Lists */}
            <Row gutter={[16, 16]}>
                {/* Pending Intaç List */}
                <Col xs={24} md={12}>
                    <Card
                        title={
                            <div className="flex items-center gap-2">
                                <WarningOutlined className="text-orange-500" />
                                <span style={{ color: isDarkMode ? 'white' : 'black' }}>İntaç Bekleyen Beyannameler</span>
                            </div>
                        }
                        bordered={false}
                        className={cardClass}
                        bodyStyle={{ padding: '16px' }}
                        extra={<a className={`text-xs ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-black'}`} onClick={() => navigate('/declarations')}>Tümü</a>}
                    >
                        <List
                            dataSource={intacAlerts.slice(0, 5)}
                            renderItem={(item) => (
                                <List.Item
                                    className={`px-4 py-3 cursor-pointer transition-colors border-b last:border-0 ${isDarkMode ? 'border-[#2d2d2d] hover:bg-[#262626]' : 'border-gray-50 hover:bg-gray-50'}`}
                                    onClick={() => navigate(`/declarations/${item.id}`)}
                                >
                                    <List.Item.Meta
                                        title={<span className={`font-medium text-sm ${isDarkMode ? 'text-gray-200' : 'text-black'}`}>{item.id}</span>}
                                        description={<span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{item.firm}</span>}
                                    />
                                    <Tag color="orange" className={`mr-0 border-none ${isDarkMode ? 'bg-[#431407] text-orange-400' : 'bg-orange-50 text-orange-600'}`}>
                                        {item.date}
                                    </Tag>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                {/* High Risk List (Mocked for now based on request) */}
                <Col xs={24} md={12}>
                    <Card
                        title={
                            <div className="flex items-center gap-2">
                                <SafetyCertificateOutlined className="text-red-500" />
                                <span style={{ color: isDarkMode ? 'white' : 'black' }}>En Çok Risk İçerenler</span>
                            </div>
                        }
                        bordered={false}
                        className={cardClass}
                        bodyStyle={{ padding: '16px' }}
                        extra={<a className={`text-xs ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-black'}`} onClick={() => navigate('/declarations')}>Tümü</a>}
                    >
                        <List
                            dataSource={[
                                { id: 'TR-34-2024-001', score: 3, firm: 'Tekno A.Ş.' },
                                { id: 'TR-06-2024-882', score: 2, firm: 'Mega Yapı Ltd.' },
                                { id: 'TR-35-2024-104', score: 2, firm: 'Global Lojistik' },
                            ]}
                            renderItem={(item) => (
                                <List.Item
                                    className={`px-4 py-3 cursor-pointer transition-colors border-b last:border-0 ${isDarkMode ? 'border-[#2d2d2d] hover:bg-[#262626]' : 'border-gray-50 hover:bg-gray-50'}`}
                                    onClick={() => navigate(`/declarations/${item.id}`)}
                                >
                                    <List.Item.Meta
                                        title={<span className={`font-medium text-sm ${isDarkMode ? 'text-gray-200' : 'text-black'}`}>{item.id}</span>}
                                        description={<span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{item.firm}</span>}
                                    />
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Risk Skoru:</span>
                                        <Tag color="red" className="mr-0 font-bold">
                                            {item.score}
                                        </Tag>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
