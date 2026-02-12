'use client';

import React, { useState } from 'react';
import { Segmented, Typography, Table, Input, Button, Tag, Dropdown, Space, Empty, Tooltip, Checkbox, Popover, Drawer, Divider, Spin, notification, Select, ConfigProvider, theme } from 'antd';
import {
    SearchOutlined,
    MoreOutlined,
    FilterOutlined,
    ExportOutlined,
    EyeOutlined,
    WarningOutlined,
    InfoCircleOutlined,
    SyncOutlined,
    CheckCircleOutlined,
    FileTextOutlined,
    ClockCircleOutlined,
    FileSyncOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import { Timeline } from 'antd';
import { useTheme } from '@/context/ThemeContext';
import { useDashboard } from '@/context/DashboardContext';
import type { ColumnsType } from 'antd/es/table';
import { declarationsList, riskDetails } from '@/utils/mockData';
import type { Declaration } from '@/utils/mockData';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

const DeclarationList: React.FC = () => {
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const { setGlobalChecking } = useDashboard();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    const handleStatusCheck = () => {
        setIsChecking(true);
        setTimeout(() => {
            setIsChecking(false);
            notification.success({
                message: 'Statü Güncellendi', // Updated message
                description: 'Seçilen beyannamelerin statüleri başarıyla güncellendi.', // Updated description
                placement: 'topRight'
                // Removed style object
            });
        }, 2000); // Changed timeout duration
    };

    // Drawer State
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedRiskDetail, setSelectedRiskDetail] = useState<Risk | null>(null);
    const [historyDrawerVisible, setHistoryDrawerVisible] = useState(false);
    const [selectedHistoryRecord, setSelectedHistoryRecord] = useState<Declaration | null>(null);

    // Filter States
    const [showColumnFilters, setShowColumnFilters] = useState(false);
    const [columnFilters, setColumnFilters] = useState({
        seller: null as string | null,
        buyer: null as string | null,
        riskStatus: null as string | null,
        intacStatus: null as string | null,
        riskCodesAbsolute: [] as string[],
        riskCodesPotential: [] as string[],
        riskCodesML: [] as string[],
        declarationType: 'Hepsi' as 'Hepsi' | 'İthalat' | 'İhracat',
    });

    const [activeSegment, setActiveSegment] = useState<'B2B' | 'B2C'>('B2B');
    const [senderSearchText, setSenderSearchText] = useState('');
    const [buyerSearchText, setBuyerSearchText] = useState('');

    // B2C Mock Data (Simulated)
    const b2cData: Declaration[] = [
        { key: '901', no: 'TR-B2C-001', seller: 'Amazon EU', status: 'Completed', buyer: 'Ali Yılmaz', mlRisks: [], absoluteRisks: [], potentialRisks: [], intacDate: '2024-03-21', type: 'İthalat' },
        { key: '902', no: 'TR-B2C-002', seller: 'AliExpress', status: 'Pending', buyer: 'Ayşe Demir', mlRisks: ['ML-101'], absoluteRisks: [], potentialRisks: ['Potansiyel Risk 1'], intacDate: '-', type: 'İthalat' },
        { key: '903', no: 'TR-B2C-003', seller: 'Ebay Seller', status: 'Completed', buyer: 'Mehmet Kaya', mlRisks: [], absoluteRisks: [], potentialRisks: [], intacDate: '2024-03-23', type: 'İthalat' },
    ];

    // Filter Logic
    const currentDataSource = activeSegment === 'B2B' ? declarationsList : b2cData;
    const filteredData = currentDataSource.filter(item => {
        // Global Search
        const matchesGlobalSearch =
            item.no.toLowerCase().includes(searchText.toLowerCase()) ||
            item.seller.toLowerCase().includes(searchText.toLowerCase()) ||
            item.buyer.toLowerCase().includes(searchText.toLowerCase());

        // Column Filters (Dropdowns)
        const matchesSellerFilter = !columnFilters.seller ? true : item.seller === columnFilters.seller;
        const matchesBuyerFilter = !columnFilters.buyer ? true : item.buyer === columnFilters.buyer;

        const matchesRiskStatusFilter = !columnFilters.riskStatus ? true :
            columnFilters.riskStatus === 'absolute' ? (item.absoluteRisks && item.absoluteRisks.length > 0) :
                columnFilters.riskStatus === 'potential' ? (item.potentialRisks && item.potentialRisks.length > 0) :
                    columnFilters.riskStatus === 'ml' ? (item.mlRisks && item.mlRisks.length > 0) :
                        columnFilters.riskStatus === 'none' ? (!item.absoluteRisks?.length && !item.potentialRisks?.length && !item.mlRisks?.length) : true;

        const matchesIntacStatusFilter = !columnFilters.intacStatus ? true :
            columnFilters.intacStatus === 'received' ? item.intacDate !== '-' :
                columnFilters.intacStatus === 'pending' ? item.intacDate === '-' : true;

        // Risk Code Filter
        const selectedRiskCodes = [
            ...columnFilters.riskCodesAbsolute,
            ...columnFilters.riskCodesPotential,
            ...columnFilters.riskCodesML
        ];

        const matchesRiskCodeFilter = selectedRiskCodes.length === 0 ? true :
            selectedRiskCodes.some(code =>
                item.absoluteRisks?.includes(code) ||
                item.potentialRisks?.includes(code) ||
                item.mlRisks?.includes(code)
            );

        const matchesDeclarationTypeFilter = columnFilters.declarationType === 'Hepsi' ? true : item.type === columnFilters.declarationType;

        return matchesGlobalSearch &&
            matchesSellerFilter && matchesBuyerFilter && matchesRiskStatusFilter && matchesIntacStatusFilter && matchesRiskCodeFilter && matchesDeclarationTypeFilter;
    });

    // KPI Calculations
    const totalDeclarations = filteredData.length;
    const totalAbsoluteRisk = filteredData.reduce((acc, item) => acc + (item.absoluteRisks?.length || 0), 0);
    const totalPendingIntac = filteredData.filter(item => item.intacDate === '-').length;
    const totalPotentialRisk = filteredData.reduce((acc, item) => acc + (item.potentialRisks?.length || 0), 0);
    const totalMLRisk = filteredData.reduce((acc, item) => acc + (item.mlRisks?.length || 0), 0);

    // Row Selection
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const clearFilters = () => {
        setColumnFilters({
            seller: null,
            buyer: null,
            riskStatus: null,
            intacStatus: null,
            riskCodesAbsolute: [],
            riskCodesPotential: [],
            riskCodesML: [],
            declarationType: 'Hepsi'
        });
        setSenderSearchText('');
        setBuyerSearchText('');
        setSearchText('');
    };

    // Searching
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const handleRiskClick = (riskCode: string) => {
        const detail = riskDetails[riskCode];
        if (detail) {
            setSelectedRiskDetail(detail);
            setDrawerVisible(true);
        }
    };

    // Risk Code Options
    const absoluteRiskOptions = Array.from({ length: 5 }, (_, i) => `Mutlak Risk ${i + 1}`).map(code => ({ label: code, value: code }));
    const potentialRiskOptions = Array.from({ length: 10 }, (_, i) => `Potansiyel Risk ${i + 1}`).map(code => ({ label: code, value: code }));
    const mlRiskOptions = Array.from({ length: 5 }, (_, i) => `AI-ML Bulgusu ${i + 1}`).map(code => ({ label: code, value: code }));

    const columns: ColumnsType<Declaration> = [
        {
            title: 'Beyanname No',
            dataIndex: 'no',
            key: 'no',
            sorter: (a, b) => a.no.localeCompare(b.no),
            render: (text) => <span className={`font-semibold ${isDarkMode ? 'text-white' : ''}`}>{text}</span>,
        },
        {
            title: 'Gönderici Adı',
            dataIndex: 'seller',
            key: 'seller',
            width: 200,
            sorter: (a, b) => a.seller.localeCompare(b.seller),
            render: (text) => <span className={isDarkMode ? 'text-gray-300' : ''}>{text}</span>,
        },
        {
            title: 'Alıcı Adı',
            dataIndex: 'buyer',
            key: 'buyer',
            width: 200,
            sorter: (a, b) => a.buyer.localeCompare(b.buyer),
            render: (text) => <span className={isDarkMode ? 'text-gray-300' : ''}>{text}</span>,
        },
        {
            title: 'Mutlak Risk',
            key: 'abs_risk_col',
            align: 'center',
            render: (_, record) => (
                <Tooltip title={record.absoluteRisks?.join(', ')}>
                    <Tag color={record.absoluteRisks && record.absoluteRisks.length > 0 ? 'error' : 'default'} className="m-0">
                        {record.absoluteRisks?.length || 0}
                    </Tag>
                </Tooltip>
            ),
        },
        {
            title: 'Potansiyel Risk',
            key: 'pot_risk_col',
            align: 'center',
            render: (_, record) => (
                <Tooltip title={record.potentialRisks?.join(', ')}>
                    <Tag color={record.potentialRisks && record.potentialRisks.length > 0 ? 'warning' : 'default'} className="m-0">
                        {record.potentialRisks?.length || 0}
                    </Tag>
                </Tooltip>
            ),
        },
        {
            title: 'AI-ML Bulguları',
            key: 'ml_risk_col',
            align: 'center',
            render: (_, record) => (
                <Tooltip title={record.mlRisks?.join(', ')}>
                    <Tag color={record.mlRisks && record.mlRisks.length > 0 ? 'purple' : 'default'} className="m-0">
                        {record.mlRisks?.length || 0}
                    </Tag>
                </Tooltip>
            ),
        },
        {
            title: 'Beyanname Türü',
            dataIndex: 'type',
            key: 'type',
            width: 150,
            render: (text) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${isDarkMode ? 'bg-[#303030] text-gray-300' : 'bg-gray-100 text-[#262626]'}`}>
                    {text}
                </span>
            ),
        },
        {
            title: 'İntaç Tarihi',
            dataIndex: 'intacDate',
            key: 'intacDate',
            sorter: (a, b) => {
                if (a.intacDate === '-') return 1;
                if (b.intacDate === '-') return -1;
                return a.intacDate.localeCompare(b.intacDate);
            },
            render: (text) => (
                <span className={text === '-' ? 'text-red-400 font-medium' : isDarkMode ? 'text-gray-300' : 'text-gray-800'}>
                    {text === '-' ? 'İntaç tarihi almadı' : text}
                </span>
            ),
        },
        {
            title: 'Aksiyon',
            key: 'action',
            width: 120, // Give some fixed width
            render: (_, record) => (
                <div className="flex items-center gap-2">
                    <Tooltip title="Detaya Git">
                        <Button
                            type="text"
                            shape="circle"
                            icon={<EyeOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/declarations/${record.key}`);
                            }}
                            className={isDarkMode ? 'hover:bg-[#303030] text-white' : 'bg-gray-50 hover:bg-black hover:text-white transition-colors'}
                        />
                    </Tooltip>
                    <Tooltip title="Statü Güncelle">
                        <Button
                            type="text"
                            shape="circle"
                            icon={<FileSyncOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleStatusCheck();
                            }}
                            className={isDarkMode ? 'hover:bg-[#303030] text-white' : 'bg-gray-50 hover:bg-black hover:text-white transition-colors'}
                        />
                    </Tooltip>
                    <Tooltip title="İşlem Geçmişi">
                        <Button
                            type="text"
                            shape="circle"
                            icon={<HistoryOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedHistoryRecord(record);
                                setHistoryDrawerVisible(true);
                            }}
                            className={isDarkMode ? 'hover:bg-[#303030] text-white' : 'bg-gray-50 hover:bg-black hover:text-white transition-colors'}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

    const expandedRowRender = (record: Declaration) => {
        const allRisks = [
            ...(record.absoluteRisks || []).map(r => ({ code: r, type: 'Mutlak', color: 'red' })),
            ...(record.potentialRisks || []).map(r => ({ code: r, type: 'Potansiyel', color: 'orange' })),
            ...(record.mlRisks || []).map(r => ({ code: r, type: 'AI-ML', color: 'purple' })),
        ];

        if (allRisks.length === 0) return <Typography.Text type="secondary" className="pl-4">Risk kaydı bulunmamaktadır.</Typography.Text>;

        return (
            <div className="pl-4 py-2 flex gap-4">
                <span className={`font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Risk Detayları:</span>
                <Space>
                    {allRisks.map((risk, index) => (
                        <Tag
                            key={index}
                            color={risk.color}
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleRiskClick(risk.code)}
                        >
                            {risk.type}: {risk.code}
                        </Tag>
                    ))}
                </Space>
            </div>
        );
    };

    const searchBg = isDarkMode ? '#141414' : '#fff';
    const searchBorder = isDarkMode ? '#303030' : '#E3E3E7'; // Updated border color

    return (
        <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-black' : 'bg-[#fcfcfc]'}`}>
            <div className="flex flex-col gap-6"> {/* Removed p-1, increased gap */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <Title level={4} style={{ margin: 0, color: isDarkMode ? 'white' : 'black' }}>
                            Beyanname Listesi
                        </Title>
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Tüm ithalat ve ihracat beyannamelerinizi buradan yönetin.</span>
                    </div>
                </div>

                <div className="flex items-center">
                    <ConfigProvider
                        theme={{
                            components: {
                                Segmented: {
                                    itemSelectedBg: isDarkMode ? '#ffffff' : '#000000',
                                    itemSelectedColor: isDarkMode ? '#000000' : '#ffffff',
                                    trackBg: isDarkMode ? '#1f1f1f' : '#ebebeb',
                                }
                            }
                        }}
                    >
                        <Segmented
                            options={[
                                { label: 'B2B', value: 'B2B' },
                                { label: 'B2C', value: 'B2C' }
                            ]}
                            value={activeSegment}
                            onChange={(val) => setActiveSegment(val as 'B2B' | 'B2C')}
                            style={{ width: 'fit-content' }}
                        />
                    </ConfigProvider>
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-5 gap-4`}>
                    {/* Card 1: Toplam Beyanname */}
                    <div className={`p-4 rounded-[16px] border shadow-sm relative overflow-hidden transition-all duration-300 flex justify-between items-start ${isDarkMode ? 'bg-[#1f1f1f] border-[#303030]' : 'bg-white border-[#E3E3E7]'}`}>
                        <div className="flex flex-col justify-between h-full z-10">
                            <div>
                                <span className={`text-[30px] font-bold block ${isDarkMode ? 'text-white' : 'text-[#333335]'}`}>{totalDeclarations}</span>
                                <span className={`text-[14px] font-normal tracking-wide mt-1 block opacity-70 ${isDarkMode ? 'text-gray-400' : 'text-[#333335]'}`}>Toplam Beyanname</span>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-[14px] font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                                    +12.5%
                                </span>
                                <span className={`text-[14px] opacity-60 ${isDarkMode ? 'text-gray-400' : 'text-[#333335]'}`}>bu hafta</span>
                            </div>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${isDarkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-100 text-[#333335]'}`}>
                            <FileTextOutlined />
                        </div>
                    </div>

                    {/* Card 2: Mutlak Risk */}
                    <div className={`p-4 rounded-[16px] border shadow-sm relative overflow-hidden transition-all duration-300 flex justify-between items-start ${isDarkMode ? 'bg-[#1f1f1f] border-[#303030]' : 'bg-white border-[#E3E3E7]'}`}>
                        <div className="flex flex-col justify-between h-full z-10">
                            <div>
                                <span className={`text-[30px] font-bold block ${isDarkMode ? 'text-white' : 'text-[#333335]'}`}>{totalAbsoluteRisk}</span>
                                <span className={`text-[14px] font-normal tracking-wide mt-1 block opacity-70 ${isDarkMode ? 'text-gray-400' : 'text-[#333335]'}`}>Mutlak Risk</span>
                            </div>
                            <div className="mt-4 flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[14px] font-medium text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                                        +2.1%
                                    </span>
                                    <span className={`text-[14px] opacity-60 ${isDarkMode ? 'text-gray-400' : 'text-[#333335]'}`}>geçen aya göre</span>
                                </div>
                                <span className={`text-[14px] font-medium mt-1 ${isDarkMode ? 'text-gray-400' : 'text-[#333335]'}`}>
                                    Bulgu sayısı: 12
                                </span>
                            </div>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${isDarkMode ? 'bg-pink-600/20 text-pink-500' : 'bg-rose-50 text-rose-600'}`}>
                            <WarningOutlined />
                        </div>
                    </div>

                    {/* Card 3: Potansiyel Risk */}
                    <div className={`p-4 rounded-[16px] border shadow-sm relative overflow-hidden transition-all duration-300 flex justify-between items-start ${isDarkMode ? 'bg-[#1f1f1f] border-[#303030]' : 'bg-white border-[#E3E3E7]'}`}>
                        <div className="flex flex-col justify-between h-full z-10">
                            <div>
                                <span className={`text-[30px] font-bold block ${isDarkMode ? 'text-white' : 'text-[#333335]'}`}>{totalPotentialRisk}</span>
                                <span className={`text-[14px] font-normal tracking-wide mt-1 block opacity-70 ${isDarkMode ? 'text-gray-400' : 'text-[#333335]'}`}>Potansiyel Risk</span>
                            </div>
                            <div className="mt-4 flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[14px] font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                                        -5.4%
                                    </span>
                                    <span className={`text-[14px] opacity-60 ${isDarkMode ? 'text-gray-400' : 'text-[#333335]'}`}>bu hafta</span>
                                </div>
                                <span className={`text-[14px] font-medium mt-1 ${isDarkMode ? 'text-gray-400' : 'text-[#333335]'}`}>
                                    Bulgu sayısı: 45
                                </span>
                            </div>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${isDarkMode ? 'bg-orange-600/20 text-orange-500' : 'bg-orange-50 text-orange-600'}`}>
                            <InfoCircleOutlined />
                        </div>
                    </div>

                    {/* Card 4: AI & ML Bulgusu */}
                    <div className={`p-4 rounded-[16px] border shadow-sm relative overflow-hidden transition-all duration-300 flex justify-between items-start ${isDarkMode ? 'bg-[#1f1f1f] border-[#303030]' : 'bg-white border-[#E3E3E7]'}`}>
                        <div className="flex flex-col justify-between h-full z-10">
                            <div>
                                <span className={`text-[30px] font-bold block ${isDarkMode ? 'text-white' : 'text-[#333335]'}`}>{totalMLRisk}</span>
                                <span className={`text-[14px] font-normal tracking-wide mt-1 block opacity-70 ${isDarkMode ? 'text-gray-400' : 'text-[#333335]'}`}>AI & ML Bulgusu</span>
                            </div>
                            <div className="mt-4 flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[14px] font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                                        +18.2%
                                    </span>
                                    <span className={`text-[14px] opacity-60 ${isDarkMode ? 'text-gray-400' : 'text-[#333335]'}`}>yeni model ile</span>
                                </div>
                                <span className={`text-[14px] font-medium mt-1 ${isDarkMode ? 'text-gray-400' : 'text-[#333335]'}`}>
                                    Bulgu sayısı: 8
                                </span>
                            </div>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${isDarkMode ? 'bg-purple-600/20 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                            <CheckCircleOutlined />
                        </div>
                    </div>

                    {/* Card 5: İntaç Bekleyen */}
                    <div className={`p-4 rounded-[16px] border shadow-sm relative overflow-hidden transition-all duration-300 flex justify-between items-start ${isDarkMode ? 'bg-[#1f1f1f] border-[#303030]' : 'bg-white border-[#E3E3E7]'}`}>
                        <div className="flex flex-col justify-between h-full z-10">
                            <div>
                                <span className={`text-[30px] font-bold block ${isDarkMode ? 'text-white' : 'text-[#333335]'}`}>{totalPendingIntac}</span>
                                <span className={`text-[14px] font-normal tracking-wide mt-1 block opacity-70 ${isDarkMode ? 'text-gray-400' : 'text-[#333335]'}`}>İntaç Bekleyen</span>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-[14px] font-medium text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                                    ~1.2%
                                </span>
                                <span className={`text-[14px] opacity-60 ${isDarkMode ? 'text-gray-400' : 'text-[#333335]'}`}>sabit seyir</span>
                            </div>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-green-50 text-green-600'}`}>
                            <ClockCircleOutlined />
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-lg border mb-4 shadow-sm flex flex-col gap-4 transition-colors duration-200"
                    style={{ backgroundColor: searchBg, borderColor: searchBorder }}
                >
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="flex gap-2 items-center w-full md:w-auto">
                            <Input
                                placeholder="Beyanname No, Firma veya Tutar Ara..."
                                prefix={<SearchOutlined className={isDarkMode ? 'text-gray-400' : 'text-gray-400'} />}
                                className="w-[280px]"
                                value={searchText}
                                onChange={handleSearch}
                                allowClear
                                style={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#fff', borderColor: isDarkMode ? '#303030' : '#d9d9d9', color: isDarkMode ? '#fff' : '#000' }}
                            />
                            <ConfigProvider
                                theme={{
                                    token: {
                                        colorPrimary: isDarkMode ? '#ffffff' : '#000000',
                                        colorTextLightSolid: isDarkMode ? '#000000' : '#ffffff'
                                    }
                                }}
                            >
                                <Button
                                    type="primary"
                                    icon={<FilterOutlined />}
                                    onClick={() => setShowColumnFilters(!showColumnFilters)}
                                    className="flex items-center justify-center border-0"
                                >
                                    Gelişmiş Filtre
                                    {!showColumnFilters && (
                                        (() => {
                                            const count = [
                                                columnFilters.seller,
                                                columnFilters.buyer,
                                                columnFilters.riskStatus,
                                                columnFilters.intacStatus,
                                                columnFilters.declarationType !== 'Hepsi' ? 'declarationType' : null,
                                                ...(columnFilters.riskCodesAbsolute?.length ? ['riskCodesAbsolute'] : []),
                                                ...(columnFilters.riskCodesPotential?.length ? ['riskCodesPotential'] : []),
                                                ...(columnFilters.riskCodesML?.length ? ['riskCodesML'] : [])
                                            ].filter(Boolean).length;
                                            return count > 0 ? (
                                                <span className="ml-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                    {count}
                                                </span>
                                            ) : null;
                                        })()
                                    )}
                                </Button>
                            </ConfigProvider>
                        </div>

                        <div className="flex gap-2 items-center">
                            <Button
                                icon={<ExportOutlined />}
                                style={{ backgroundColor: isDarkMode ? '#9f9fa7' : 'transparent', color: isDarkMode ? '#ffffff' : 'inherit', border: isDarkMode ? 'none' : '' }}
                            >
                                Dışa Aktar
                            </Button>

                            {selectedRowKeys.length > 0 && (
                                <Button
                                    icon={<CheckCircleOutlined />}
                                    onClick={handleStatusCheck}
                                    disabled={isChecking}
                                    style={{
                                        backgroundColor: isDarkMode ? '#3f3f46' : '#f4f4f5',
                                        color: isDarkMode ? '#ffffff' : '#000000',
                                        borderColor: isDarkMode ? '#3f3f46' : '#d4d4d8'
                                    }}
                                >
                                    Statü Kontrol Et
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Expandable Column Filters */}
                    {showColumnFilters && (
                        <ConfigProvider
                            theme={{
                                token: {
                                    controlItemBgActive: isDarkMode ? '#404040' : '#f5f5f5',
                                    controlItemBgActiveHover: isDarkMode ? '#404040' : '#f5f5f5',
                                }
                            }}
                        >
                            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t ${isDarkMode ? 'border-[#303030]' : 'border-gray-100'}`}>
                                {/* Declaration Type Filter */}
                                <div className="flex flex-col gap-1">
                                    <span className={`text-xs font-medium ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Beyanname Türü</span>
                                    <Select
                                        placeholder="Seçiniz"
                                        className="w-full"
                                        value={columnFilters.declarationType}
                                        onChange={(value) => setColumnFilters(prev => ({ ...prev, declarationType: value }))}
                                        options={[
                                            { label: 'Hepsi', value: 'Hepsi' },
                                            { label: 'İthalat', value: 'İthalat' },
                                            { label: 'İhracat', value: 'İhracat' },
                                        ]}
                                        popupClassName={isDarkMode ? 'dark-select-dropdown' : ''}
                                    />
                                </div>
                                {/* Seller Filter */}
                                <div className="flex flex-col gap-1">
                                    <span className={`text-xs font-medium ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gönderici</span>
                                    <Select
                                        placeholder="Seçiniz"
                                        allowClear
                                        className="w-full"
                                        value={columnFilters.seller}
                                        onChange={(value) => setColumnFilters(prev => ({ ...prev, seller: value }))}
                                        options={Array.from(new Set(currentDataSource.map(d => d.seller))).map(s => ({ label: s, value: s }))}
                                        popupClassName={isDarkMode ? 'dark-select-dropdown' : ''}
                                    />
                                </div>

                                {/* Buyer Filter */}
                                <div className="flex flex-col gap-1">
                                    <span className={`text-xs font-medium ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Alıcı</span>
                                    <Select
                                        placeholder="Seçiniz"
                                        allowClear
                                        className="w-full"
                                        value={columnFilters.buyer}
                                        onChange={(value) => setColumnFilters(prev => ({ ...prev, buyer: value }))}
                                        options={Array.from(new Set(currentDataSource.map(d => d.buyer))).map(b => ({ label: b, value: b }))}
                                        popupClassName={isDarkMode ? 'dark-select-dropdown' : ''}
                                    />
                                </div>

                                {/* Risk Filter */}
                                <div className="flex flex-col gap-1">
                                    <span className={`text-xs font-medium ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Risk Durumu</span>
                                    <Select
                                        placeholder="Seçiniz"
                                        allowClear
                                        className="w-full"
                                        value={columnFilters.riskStatus}
                                        onChange={(value) => setColumnFilters(prev => ({ ...prev, riskStatus: value }))}
                                        options={[
                                            { label: 'Mutlak Risk Var', value: 'absolute' },
                                            { label: 'Potansiyel Risk Var', value: 'potential' },
                                            { label: 'AI-ML Bulgusu Var', value: 'ml' },
                                            { label: 'Risk Yok', value: 'none' },
                                        ]}
                                        popupClassName={isDarkMode ? 'dark-select-dropdown' : ''}
                                    />
                                </div>

                                {/* Intac Filter */}
                                <div className="flex flex-col gap-1">
                                    <span className={`text-xs font-medium ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>İntaç Durumu</span>
                                    <Select
                                        placeholder="Seçiniz"
                                        allowClear
                                        className="w-full"
                                        value={columnFilters.intacStatus}
                                        onChange={(value) => setColumnFilters(prev => ({ ...prev, intacStatus: value }))}
                                        options={[
                                            { label: 'İntaç Alındı', value: 'received' },
                                            { label: 'İntaç Bekliyor', value: 'pending' },
                                            { label: 'Kısmi İntaç', value: 'partial' },
                                        ]}
                                        popupClassName={isDarkMode ? 'dark-select-dropdown' : ''}
                                    />
                                </div>

                                {/* Absolute Risk Codes Filter */}
                                <div className="flex flex-col gap-1">
                                    <span className={`text-xs font-medium ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Mutlak Riskler</span>
                                    <Select
                                        mode="multiple"
                                        placeholder="Seçiniz"
                                        allowClear
                                        className="w-full"
                                        value={columnFilters.riskCodesAbsolute}
                                        onChange={(value) => setColumnFilters(prev => ({ ...prev, riskCodesAbsolute: value }))}
                                        options={absoluteRiskOptions}
                                        popupClassName={isDarkMode ? 'dark-select-dropdown' : ''}
                                        maxTagCount="responsive"
                                    />
                                </div>

                                {/* Potential Risk Codes Filter */}
                                <div className="flex flex-col gap-1">
                                    <span className={`text-xs font-medium ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Potansiyel Riskler</span>
                                    <Select
                                        mode="multiple"
                                        placeholder="Seçiniz"
                                        allowClear
                                        className="w-full"
                                        value={columnFilters.riskCodesPotential}
                                        onChange={(value) => setColumnFilters(prev => ({ ...prev, riskCodesPotential: value }))}
                                        options={potentialRiskOptions}
                                        popupClassName={isDarkMode ? 'dark-select-dropdown' : ''}
                                        maxTagCount="responsive"
                                    />
                                </div>

                                {/* ML Risk Codes Filter */}
                                <div className="flex flex-col gap-1">
                                    <span className={`text-xs font-medium ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>AI-ML Bulguları</span>
                                    <Select
                                        mode="multiple"
                                        placeholder="Seçiniz"
                                        allowClear
                                        className="w-full"
                                        value={columnFilters.riskCodesML}
                                        onChange={(value) => setColumnFilters(prev => ({ ...prev, riskCodesML: value }))}
                                        options={mlRiskOptions}
                                        popupClassName={isDarkMode ? 'dark-select-dropdown' : ''}
                                        maxTagCount="responsive"
                                    />
                                </div>
                            </div>
                        </ConfigProvider>
                    )}
                </div>



                <ConfigProvider
                    theme={{
                        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                        token: {
                            colorPrimary: isDarkMode ? '#ffffff' : '#000000',
                            controlItemBgActive: isDarkMode ? '#262626' : '#ebebeb',
                            controlItemBgActiveHover: isDarkMode ? '#1f1f1f' : '#f5f5f5',
                        }
                    }}
                >
                    <div className={`rounded-[16px] border shadow-sm overflow-hidden transition-colors duration-200 ${isDarkMode ? 'border-[#303030]' : 'border-[#E3E3E7]'}`}
                        style={{ backgroundColor: searchBg }}
                    >
                        <Table
                            rowSelection={{
                                type: 'checkbox',
                                ...rowSelection,
                            }}
                            columns={columns}
                            dataSource={filteredData}
                            rowKey="key"
                            pagination={{
                                pageSize: 10,
                                showTotal: (total) => `Toplam ${total} kayıt`,
                                className: 'px-4',
                                itemRender: (page, type, originalElement) => {
                                    if (type === 'prev' || type === 'next') {
                                        const element = originalElement as React.ReactElement<{ style?: React.CSSProperties }>;
                                        return React.cloneElement(element, {
                                            style: { color: isDarkMode ? 'white' : 'black' }
                                        });
                                    }
                                    return originalElement;
                                }
                            }}
                            expandable={{
                                expandedRowRender,
                                rowExpandable: (record) => true,
                            }}
                            scroll={{ x: 1000 }}
                            onRow={(record) => ({
                                className: 'cursor-pointer group',
                            })}
                        />
                    </div>
                </ConfigProvider>

                <Drawer
                    title={
                        <div className="flex items-center gap-2">
                            <WarningOutlined className="text-red-500" />
                            <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Risk Detayı</span>
                        </div>
                    }
                    placement="right"
                    onClose={() => setDrawerVisible(false)}
                    open={drawerVisible}
                    width={500}
                    headerStyle={{ backgroundColor: isDarkMode ? '#141414' : '#fff', borderBottom: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0' }}
                    bodyStyle={{ backgroundColor: isDarkMode ? '#141414' : '#fff' }}
                >
                    {selectedRiskDetail ? (
                        <div className="flex flex-col gap-6">
                            <div className={`p-4 rounded border ${isDarkMode ? 'bg-[#450a0a] border-[#7f1d1d]' : 'bg-red-50 border-red-100'}`}>
                                <h3 className={`text-lg font-bold m-0 ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>{selectedRiskDetail.code}</h3>
                                <span className={isDarkMode ? 'text-red-400' : 'text-red-500'}>{selectedRiskDetail.subject}</span>
                            </div>

                            <Divider className={`my-0 ${isDarkMode ? 'border-[#303030]' : ''}`} />

                            <div>
                                <h4 className={`font-semibold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <InfoCircleOutlined /> Detay Açıklama
                                </h4>
                                <p className={`leading-relaxed p-3 rounded ${isDarkMode ? 'bg-[#1f1f1f] text-gray-400' : 'bg-gray-50 text-gray-600'}`}>
                                    {selectedRiskDetail.details}
                                </p>
                            </div>

                            <div>
                                <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>İlgili Kalem</h4>
                                <Tag color="blue" className="text-sm py-1 px-3">
                                    {selectedRiskDetail.relatedItem}
                                </Tag>
                            </div>

                            <div className="mt-auto pt-8">
                                <Button type="primary" className={`w-full h-10 ${isDarkMode ? 'bg-white text-black' : 'bg-black'}`} onClick={() => setDrawerVisible(false)}>
                                    Anlaşıldı, Kapat
                                </Button>
                            </div>
                        </div>

                    ) : <Empty description="Risk detayı bulunamadı" />}
                </Drawer>

                {/* History Drawer */}
                <Drawer
                    title={
                        <div className="flex items-center gap-2">
                            <HistoryOutlined className="text-blue-500" />
                            <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>İşlem Geçmişi</span>
                        </div>
                    }
                    placement="right"
                    onClose={() => setHistoryDrawerVisible(false)}
                    open={historyDrawerVisible}
                    width={400}
                    maskStyle={{ backdropFilter: 'none' }}
                    headerStyle={{ backgroundColor: isDarkMode ? '#141414' : '#fff', borderBottom: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0' }}
                    bodyStyle={{ backgroundColor: isDarkMode ? '#141414' : '#fff' }}
                >
                    {selectedHistoryRecord ? (
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
                                    dot: <ExportOutlined className="text-blue-500" />,
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
                    ) : <Empty description="İşlem geçmişi bulunamadı" />}
                </Drawer>
            </div >
        </div >
    );
};

export default DeclarationList;
