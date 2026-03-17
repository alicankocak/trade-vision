import React from 'react';
import {
    LoginOutlined,
    LogoutOutlined,
    TeamOutlined,
    DollarOutlined,
    MoreOutlined,
    DownOutlined,
    DownloadOutlined,
    CalendarOutlined,
    RiseOutlined,
    FallOutlined,
    AppstoreOutlined,
    ClockCircleOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Button, Dropdown, Tooltip as AntdTooltip } from 'antd';
import { TopGtipWidget } from '@/components/dashboard/TopGtipWidget';

// ... (previous components)

export const FindingSubjectSummaryComponent = ({ isDarkMode, borderClass, textClass, subTextClass, cardBg, colSpan = 3 }: any) => {
    const [selectedYear, setSelectedYear] = React.useState('2026');

    const yearMenu = {
        items: [
            { key: '2026', label: '2026', onClick: () => setSelectedYear('2026') },
            { key: '2025', label: '2025', onClick: () => setSelectedYear('2025') },
            { key: '2024', label: '2024', onClick: () => setSelectedYear('2024') },
        ]
    };

    // Mock Data for 10 items
    const listItems = [
        { id: 1, title: 'Pot_1', subtitle: 'Potansiyel risk', value: '2,877', change: 22.5, isPositive: true },
        { id: 2, title: 'Pot_2', subtitle: 'Potansiyel risk', value: '1,452', change: -12.3, isPositive: false },
        { id: 3, title: 'Pot_3', subtitle: 'Potansiyel risk', value: '982', change: 8.4, isPositive: true },
        { id: 4, title: 'Pot_4', subtitle: 'Potansiyel risk', value: '876', change: -5.1, isPositive: false },
        { id: 5, title: 'Pot_5', subtitle: 'Potansiyel risk', value: '754', change: 15.2, isPositive: true },
        { id: 6, title: 'Pot_6', subtitle: 'Potansiyel risk', value: '632', change: 3.8, isPositive: true },
        { id: 7, title: 'Pot_7', subtitle: 'Potansiyel risk', value: '541', change: -2.5, isPositive: false },
        { id: 8, title: 'Pot_8', subtitle: 'Potansiyel risk', value: '420', change: 10.1, isPositive: true },
        { id: 9, title: 'Pot_9', subtitle: 'Potansiyel risk', value: '385', change: -8.7, isPositive: false },
        { id: 10, title: 'Pot_10', subtitle: 'Potansiyel risk', value: '298', change: 5.5, isPositive: true },
    ];

    return (
        <div className={`p-8 rounded-[8px] border border-gray-100 bg-white h-full flex flex-col shadow-sm overflow-hidden`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-[18px] text-gray-900">Bulgu Konu Özeti</h3>
                <Dropdown menu={yearMenu} trigger={['click']}>
                    <Button className={`flex items-center gap-2 font-medium bg-white border border-gray-200 shadow-sm rounded-lg px-3 py-1 text-sm hover:bg-gray-50`}>
                        <CalendarOutlined /> {selectedYear} <DownOutlined style={{ fontSize: '10px' }} />
                    </Button>
                </Dropdown>
            </div>

            {/* List */}
            <div className="flex flex-col gap-1 overflow-y-auto pr-1">
                {listItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                        {/* Left: Text */}
                        <div className="flex items-center gap-4">
                            <div>
                                <div className="font-bold text-gray-900 text-sm">{item.title}</div>
                                <div className="text-gray-500 text-sm">{item.subtitle}</div>
                            </div>
                        </div>

                        {/* Right: Value + Chart (Trend) */}
                        <div className="flex items-center gap-6">
                            <span className="font-bold text-lg text-gray-900">{item.value}</span>

                            <AntdTooltip title={`${selectedYear === '2026' ? '2025' : 'Geçen yıl'} verisine göre`}>
                                <div className={`flex items-center gap-1 font-medium text-[10px] text-gray-900 bg-gray-100 px-2 py-1 rounded-lg`}>
                                    {item.isPositive ? <RiseOutlined /> : <FallOutlined />}
                                    {Math.abs(item.change)}%
                                </div>
                            </AntdTooltip>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};



// 1. Pastel Stats Card Component
// Now responsive to colSpan
export const PastelCardComponent = ({
    title,
    value,
    subtext,
    icon,
    bgColor,
    iconBg,
    iconColor,
    valueColor,
    isDarkMode,
    colSpan = 1
}: any) => {

    return (
        <div className={`p-6 rounded-[12px] ${bgColor} relative flex flex-col justify-start min-h-[160px] transition-all duration-300 h-full w-full gap-4 border-0 shadow-none`}>

            {/* Header: Icon + Menu */}
            <div className="flex justify-between items-start w-full">
                <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-[12px] flex items-center justify-center shrink-0 ${iconBg} ${iconColor} text-sm lg:text-base`}>
                    {icon}
                </div>

                <button className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400">
                    <MoreOutlined style={{ fontSize: '18px' }} />
                </button>
            </div>

            {/* Content Area */}
            <div className="flex flex-col gap-1 mt-2">
                <div className={`font-medium text-[14px] ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>{title}</div>
                <div className={`font-bold text-[28px] leading-tight ${valueColor || (isDarkMode ? 'text-white' : 'text-slate-900')}`}>{value}</div>
                <div className={`text-[12px] ${isDarkMode ? 'text-gray-500' : 'text-slate-400'} mt-1`}>{subtext}</div>
            </div>
        </div>
    );
};

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// ... other imports

// 3. Stacked Bar Chart Component (Campaign / Risk General Status)
export const CampaignChartComponent = ({ isDarkMode, borderClass, textClass, subTextClass, cardBg, colSpan = 6 }: any) => {
    const [selectedYear, setSelectedYear] = React.useState('2026');

    // Dummy Data - 12 Months
    const data = [
        { name: 'Oca', mutlak: 400, potansiyel: 240, ai: 150 },
        { name: 'Şub', mutlak: 300, potansiyel: 139, ai: 120 },
        { name: 'Mar', mutlak: 200, potansiyel: 980, ai: 160 },
        { name: 'Nis', mutlak: 278, potansiyel: 390, ai: 140 },
        { name: 'May', mutlak: 189, potansiyel: 480, ai: 180 },
        { name: 'Haz', mutlak: 239, potansiyel: 380, ai: 130 },
        { name: 'Tem', mutlak: 349, potansiyel: 430, ai: 170 },
        { name: 'Ağu', mutlak: 500, potansiyel: 200, ai: 190 },
        { name: 'Eyl', mutlak: 390, potansiyel: 300, ai: 210 },
        { name: 'Eki', mutlak: 450, potansiyel: 150, ai: 160 },
        { name: 'Kas', mutlak: 300, potansiyel: 200, ai: 140 },
        { name: 'Ara', mutlak: 400, potansiyel: 300, ai: 220 },
    ];

    const yearMenu = {
        items: [
            { key: '2026', label: '2026', onClick: () => setSelectedYear('2026') },
            { key: '2025', label: '2025', onClick: () => setSelectedYear('2025') },
            { key: '2024', label: '2024', onClick: () => setSelectedYear('2024') },
        ]
    };

    return (
        <div className={`p-6 rounded-[8px] border ${cardBg} ${borderClass} h-full flex flex-col`}>
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className={`font-bold text-[18px] ${textClass}`}>Genel Risk Durumu</h3>
                    <p className={`text-sm ${subTextClass}`}>Genel Risk Özeti</p>
                </div>

                {/* Top Right Date Filter (Simulated with just Year for now or full range style) */}
                <Dropdown menu={yearMenu} trigger={['click']}>
                    <Button className={`flex items-center gap-2 font-medium bg-white border border-gray-200 shadow-sm rounded-lg px-3 py-1 text-sm hover:bg-gray-50`}>
                        <CalendarOutlined /> {selectedYear} <DownOutlined style={{ fontSize: '10px' }} />
                    </Button>
                </Dropdown>
            </div>

            {/* Chart Area */}
            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
                        barSize={32}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#333' : '#F3F4F6'} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
                        />
                        <Tooltip
                            cursor={{ fill: isDarkMode ? '#333' : '#F9FAFB' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: isDarkMode ? '#1F2937' : '#fff' }}
                            labelFormatter={(value) => {
                                const fullMonths: { [key: string]: string } = {
                                    'Oca': 'Ocak', 'Şub': 'Şubat', 'Mar': 'Mart', 'Nis': 'Nisan', 'May': 'Mayıs', 'Haz': 'Haziran',
                                    'Tem': 'Temmuz', 'Ağu': 'Ağustos', 'Eyl': 'Eylül', 'Eki': 'Ekim', 'Kas': 'Kasım', 'Ara': 'Aralık'
                                };
                                return fullMonths[value] || value;
                            }}
                        />
                        <Bar dataKey="mutlak" stackId="a" fill="#000000" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="potansiyel" stackId="a" fill="#d4d4d8" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="ai" stackId="a" fill="#f4f4f5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-black"></span>
                    <span className={`text-sm font-medium ${textClass}`}>Mutlak Risk</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-[#d4d4d8]"></span>
                    <span className={`text-sm font-medium ${textClass}`}>Potansiyel Risk</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-[#f4f4f5]"></span>
                    <span className={`text-sm font-medium ${textClass}`}>AI & ML</span>
                </div>
            </div>
        </div>
    );
};
export const RiskSummaryChartComponent = ({ isDarkMode, borderClass, textClass, subTextClass, cardBg, colSpan = 3 }: any) => {
    const [selectedYear, setSelectedYear] = React.useState('2026');

    // Dummy Data
    const rawData = {
        '2026': { mutlak: 450, potansiyel: 550, ai: 250 },
        '2025': { mutlak: 300, potansiyel: 480, ai: 200 },
        '2024': { mutlak: 250, potansiyel: 400, ai: 200 },
    }[selectedYear] || { mutlak: 0, potansiyel: 0, ai: 0 };

    const chartData = [
        { name: 'MUTLAK RİSK', value: rawData.mutlak, color: '#000000' }, // Black
        { name: 'POTANSİYEL', value: rawData.potansiyel, color: '#d4d4d8' }, // Dark Gray
        { name: 'AI & ML', value: rawData.ai, color: '#f4f4f5' }, // Light Gray
    ];

    const total = chartData.reduce((sum, item) => sum + item.value, 0);

    const yearMenu = {
        items: [
            { key: '2026', label: '2026', onClick: () => setSelectedYear('2026') },
            { key: '2025', label: '2025', onClick: () => setSelectedYear('2025') },
            { key: '2024', label: '2024', onClick: () => setSelectedYear('2024') },
        ]
    };

    // If widget is very small (3 cols ~ 1/4 width), simplified view? 
    // Actually full component fits in 3 cols (standard card size).
    const isSmall = colSpan < 3;

    return (
        <div className={`p-6 rounded-[8px] border ${cardBg} ${borderClass} h-full flex flex-col`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <h3 className={`font-bold text-[18px] ${textClass}`}>Risk Özeti</h3>
                <Dropdown menu={yearMenu} trigger={['click']}>
                    <Button className={`flex items-center gap-2 font-medium bg-white border border-gray-200 shadow-sm rounded-lg px-3 py-1 text-sm hover:bg-gray-50`}>
                        {selectedYear} <DownOutlined style={{ fontSize: '10px' }} />
                    </Button>
                </Dropdown>
            </div>

            {/* Content: Chart + Stats */}
            <div className="flex items-center justify-between flex-1 relative gap-4 pr-6">

                {/* Donut Chart */}
                <div className="w-2/3 h-[250px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={85}
                                outerRadius={110}
                                paddingAngle={0}
                                dataKey="value"
                                startAngle={90}
                                endAngle={-270}
                                stroke="none"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <RechartsTooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className={`text-5xl font-bold ${textClass}`}>{total}</span>
                        <span className={`text-sm font-medium opacity-50 mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Bulgu</span>
                    </div>
                </div>

                {/* Legend Stats Grid - Right Side Align */}
                <div className="flex flex-col justify-center gap-6 w-1/3">
                    {chartData.map((item, index) => (
                        <div key={index} className="flex flex-col items-start gap-1">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>{item.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const PipelineChartComponent = ({ isDarkMode, borderClass, textClass, subTextClass, cardBg, colSpan = 3 }: any) => {
    const [selectedYear, setSelectedYear] = React.useState('2026');

    // Dummy Data
    const rawData = {
        '2026': { mutlak: 450, potansiyel: 550, ai: 250 },
        '2025': { mutlak: 300, potansiyel: 480, ai: 200 },
        '2024': { mutlak: 250, potansiyel: 400, ai: 200 },
    }[selectedYear] || { mutlak: 0, potansiyel: 0, ai: 0 };

    // Calculate percentages for the display
    const totalValue = rawData.mutlak + rawData.potansiyel + rawData.ai;
    const getPercent = (val: number) => totalValue > 0 ? Math.round((val / totalValue) * 100) : 0;

    const chartData = [
        { name: 'Mutlak Risk', value: rawData.mutlak, color: '#111827', percentage: getPercent(rawData.mutlak) }, // Dark/Black
        { name: 'Potansiyel Risk', value: rawData.potansiyel, color: '#4B5563', percentage: getPercent(rawData.potansiyel) }, // Dark Gray
        { name: 'AI & ML', value: rawData.ai, color: '#9CA3AF', percentage: getPercent(rawData.ai) }, // Light Gray
    ];

    // Recalculate total for bar widths (should be 100% logic but using value for internal calc)
    const total = chartData.reduce((sum, item) => sum + item.value, 0);

    const yearMenu = {
        items: [
            { key: '2026', label: '2026', onClick: () => setSelectedYear('2026') },
            { key: '2025', label: '2025', onClick: () => setSelectedYear('2025') },
            { key: '2024', label: '2024', onClick: () => setSelectedYear('2024') },
        ]
    };

    return (
        <div className={`p-8 rounded-[8px] border border-gray-100 bg-white h-full flex flex-col shadow-sm`}>
            {/* Header */}
            <div className="mb-8">
                <h3 className="font-bold text-[18px] text-gray-900 mb-1">Risk Özeti 2</h3>
                <p className="text-gray-500 text-sm">Risk durumunun dağılımı.</p>
            </div>

            {/* Pipeline Bar Chart - Single Continuous Bar with Segments */}
            <div className="w-full h-4 rounded-full flex overflow-hidden mb-10 bg-gray-100">
                {chartData.map((item, index) => {
                    const widthPercent = (item.value / total) * 100;
                    return (
                        <div
                            key={index}
                            style={{ width: `${widthPercent}%`, backgroundColor: item.color }}
                            className="h-full"
                        ></div>
                    );
                })}
            </div>

            {/* Detailed List */}
            <div className="flex flex-col gap-6 flex-1">
                {chartData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between group">
                        {/* Left: Dot + Title + Subtext */}
                        <div className="flex items-start gap-4">
                            <div className="w-3 h-3 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: item.color }}></div>
                            <div>
                                <div className="font-medium text-gray-900 text-base leading-tight mb-0.5">{item.name}</div>
                                <div className="text-gray-500 text-sm">{item.value} bulgu</div>
                            </div>
                        </div>

                        {/* Right: Mini Bar + Percent */}
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-2 rounded-full overflow-hidden bg-gray-200">
                                <div className="h-full rounded-full" style={{ width: `${item.percentage}%`, backgroundColor: item.color }}></div>
                            </div>
                            <div className="text-gray-600 font-medium text-sm w-8 text-right">{item.percentage}%</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Widget Registry ---
export const WIDGET_REGISTRY: any = {
    'list_finding_summary': {
        component: FindingSubjectSummaryComponent,
        defaultProps: {},
        defaultColSpan: 4,
    },
    'stat_checkin': {
        component: PastelCardComponent,
        defaultProps: {
            title: "Today's check-in",
            icon: <ClockCircleOutlined />,
            // Dynamic props map (will be merged in parent)
            propMap: (data: any) => ({
                value: data?.checkIn?.value || '0',
                subtext: data?.checkIn?.sub || 'Data yok',
            }),
            colors: (isDarkMode: boolean) => ({
                bgColor: isDarkMode ? 'bg-gradient-to-tr from-cyan-950/40 to-cyan-900/40' : 'bg-gradient-to-tr from-cyan-200/40 to-cyan-100/40',
                iconBg: isDarkMode ? 'bg-cyan-800' : 'bg-[#002B36]',
                iconColor: 'text-white/90',
                valueColor: isDarkMode ? 'text-white' : 'text-slate-900'
            })
        },
        defaultColSpan: 3, // 3/12 = 1/4 width
    },
    'stat_checkout': {
        component: PastelCardComponent,
        defaultProps: {
            title: "Today check-out",
            icon: <LogoutOutlined />,
            propMap: (data: any) => ({
                value: data?.checkOut?.value || '0',
                subtext: data?.checkOut?.sub || 'Data yok',
            }),
            colors: (isDarkMode: boolean) => ({
                bgColor: isDarkMode ? 'bg-gradient-to-tr from-green-950/40 to-green-900/40' : 'bg-gradient-to-tr from-green-200/40 to-green-100/40',
                iconBg: isDarkMode ? 'bg-green-800' : 'bg-[#003B22]',
                iconColor: 'text-white/90',
                valueColor: isDarkMode ? 'text-white' : 'text-slate-900'
            })
        },
        defaultColSpan: 3,
    },
    'stat_guests': {
        component: PastelCardComponent,
        defaultProps: {
            title: "Total guests",
            icon: <UserOutlined />,
            propMap: (data: any) => ({
                value: data?.guests?.value || '0',
                subtext: data?.guests?.sub || 'Data yok',
            }),
            colors: (isDarkMode: boolean) => ({
                bgColor: isDarkMode ? 'bg-gradient-to-tr from-pink-950/40 to-pink-900/40' : 'bg-gradient-to-tr from-pink-200/40 to-pink-100/40',
                iconBg: isDarkMode ? 'bg-pink-800' : 'bg-[#4B0033]',
                iconColor: 'text-white/90',
                valueColor: isDarkMode ? 'text-white' : 'text-slate-900'
            })
        },
        defaultColSpan: 3,
    },
    'stat_amount': {
        component: PastelCardComponent,
        defaultProps: {
            title: "Total amount",
            icon: <DollarOutlined />,
            propMap: (data: any) => ({
                value: data?.amount?.value || '0',
                subtext: data?.amount?.sub || 'Data yok',
            }),
            colors: (isDarkMode: boolean) => ({
                bgColor: isDarkMode ? 'bg-gradient-to-tr from-yellow-950/40 to-yellow-900/40' : 'bg-gradient-to-tr from-yellow-200/40 to-yellow-100/40',
                iconBg: isDarkMode ? 'bg-yellow-800' : 'bg-[#4A3200]',
                iconColor: 'text-white/90',
                valueColor: isDarkMode ? 'text-white' : 'text-slate-900'
            })
        },
        defaultColSpan: 3,
    },
    'chart_risk_summary': {
        component: RiskSummaryChartComponent,
        defaultProps: {},
        defaultColSpan: 6, // 6/12 = 1/2 width
    },
    'chart_campaign': {
        component: CampaignChartComponent,
        defaultProps: {},
        defaultColSpan: 6,
    },
    'chart_pipeline': {
        component: PipelineChartComponent,
        defaultProps: {},
        defaultColSpan: 6,
    },
    'gtip_list': {
        component: TopGtipWidget,
        defaultProps: {},
        defaultColSpan: 3,
    },
};
