import React, { useState } from 'react';
import { Table, Input, Button, Tag, Dropdown, Space, Typography, Empty, Tooltip, Checkbox, Popover, Drawer, Divider, Spin, notification } from 'antd';
import {
    SearchOutlined,
    MoreOutlined,
    FilterOutlined,
    ExportOutlined,
    EyeOutlined,
    WarningOutlined,
    InfoCircleOutlined,
    DownloadOutlined,
    PlusOutlined,
    LoadingOutlined,
    SyncOutlined,
    CheckCircleOutlined,
    FileTextOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext'; // Import context
import type { ColumnsType } from 'antd/es/table';
import { declarationsList, riskDetails } from '../utils/mockData';
import type { Declaration } from '../utils/mockData';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const DeclarationList: React.FC = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    const handleStatusCheck = () => {
        setIsChecking(true);
        setTimeout(() => {
            setIsChecking(false);
            notification.success({
                message: 'İşlem Tamamlandı',
                description: 'Statü kontrol işlemi tamamlanmıştır.',
                placement: 'topRight',
                style: {
                    backgroundColor: isDarkMode ? '#141414' : '#ffffff',
                    color: isDarkMode ? '#ffffff' : '#000000',
                    border: `1px solid ${isDarkMode ? '#303030' : '#e2e2e4'}`,
                },
            });
        }, 2500);
    };

    // Drawer State
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedRiskDetail, setSelectedRiskDetail] = useState<{ code: string; subject: string; details: string; relatedItem: string } | null>(null);

    // Filter States
    const [openFilter, setOpenFilter] = useState(false);
    const [intacFilter, setIntacFilter] = useState<'All' | 'Received' | 'NotReceived'>('All');
    const [riskFilter, setRiskFilter] = useState<string[]>([]);
    const hasActiveFilters = intacFilter !== 'All' || riskFilter.length > 0;
    const filterCount = (intacFilter !== 'All' ? 1 : 0) + riskFilter.length;

    const [activeSegment, setActiveSegment] = useState<'B2B' | 'B2C'>('B2B');
    const [senderSearchText, setSenderSearchText] = useState('');
    const [buyerSearchText, setBuyerSearchText] = useState('');

    // B2C Mock Data (Simulated)
    const b2cData: Declaration[] = [
        { key: '901', no: 'TR-B2C-001', seller: 'Amazon EU', status: 'Completed', buyer: 'Ali Yılmaz', mlRisks: [], absoluteRisks: [], potentialRisks: [], intacDate: '2024-03-21' },
        { key: '902', no: 'TR-B2C-002', seller: 'AliExpress', status: 'Pending', buyer: 'Ayşe Demir', mlRisks: ['ML-101'], absoluteRisks: [], potentialRisks: ['Potansiyel Risk 1'], intacDate: '-' },
        { key: '903', no: 'TR-B2C-003', seller: 'Ebay Seller', status: 'Completed', buyer: 'Mehmet Kaya', mlRisks: [], absoluteRisks: [], potentialRisks: [], intacDate: '2024-03-23' },
    ];

    // Filter Logic
    const currentDataSource = activeSegment === 'B2B' ? declarationsList : b2cData;

    const filteredData = currentDataSource.filter((item) => {

        // Global Text Search
        const matchesGlobalSearch =
            item.no.toLowerCase().includes(searchText.toLowerCase()) ||
            item.buyer.toLowerCase().includes(searchText.toLowerCase());

        // Column Specific Filters
        const matchesSender = item.seller.toLowerCase().includes(senderSearchText.toLowerCase());
        const matchesBuyer = item.buyer.toLowerCase().includes(buyerSearchText.toLowerCase());

        // Intaç Filter
        const matchesIntac =
            intacFilter === 'All' ? true :
                intacFilter === 'Received' ? item.intacDate !== '-' :
                    item.intacDate === '-';

        // Risk Filter
        const matchesRisk = riskFilter.length === 0 ? true :
            riskFilter.some(filter =>
                item.absoluteRisks?.includes(filter) ||
                item.potentialRisks?.includes(filter) ||
                item.mlRisks?.includes(filter)
            );

        return matchesGlobalSearch && matchesIntac && matchesRisk && matchesSender && matchesBuyer;
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

    // Filter Handlers
    const handleRiskFilterChange = (key: string, checked: boolean) => {
        setRiskFilter(prev => checked ? [...prev, key] : prev.filter(k => k !== key));
    };

    const clearFilters = () => {
        setIntacFilter('All');
        setRiskFilter([]);
        setSenderSearchText('');
        setBuyerSearchText('');
        setSearchText('');
    };

    // Searching
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const handleVisibleChange = (newVisible: boolean) => {
        setOpenFilter(newVisible);
    };

    // Open Drawer Handler
    const handleRiskClick = (riskCode: string) => {
        const detail = riskDetails[riskCode];
        if (detail) {
            setSelectedRiskDetail(detail);
            setDrawerVisible(true);
        }
    };

    // Mega Menu Config
    const filterItems: { [key: string]: string[] } = {
        intac: ['İntaç Yapıldı', 'İntaç Bekliyor', 'Kısmi İntaç'],
        risk_absolute: Array.from({ length: 5 }, (_, i) => `Mutlak Risk ${i + 1}`),
        risk_potential: Array.from({ length: 10 }, (_, i) => `Potansiyel Risk ${i + 1}`),
        risk_ml: Array.from({ length: 5 }, (_, i) => `AI-ML Bulgusu ${i + 1}`)
    };

    // Mega Menu Content
    const filterMenuContent = (
        <div className="w-[800px] flex flex-col h-[400px]">
            {/* ... keeping existing huge mega menu content ... */}
            {/* Header */}
            <div className={`p-4 border-b flex justify-between items-center shrink-0 ${isDarkMode ? 'border-[#303030] bg-[#141414] text-white' : 'border-[#e2e2e4] bg-white'}`}>
                <span className="font-bold text-lg">Gelişmiş Filtreleme</span>
                {hasActiveFilters && (
                    <span className="text-gray-500 text-sm">{filterCount} filtre seçili</span>
                )}
            </div>

            {/* Scrollable Content Grid */}
            <div className={`flex-1 overflow-hidden grid grid-cols-4 divide-x ${isDarkMode ? 'divide-[#303030] bg-[#141414]' : 'divide-[#e2e2e4] bg-white'}`}>
                {/* Column 1: İntaç */}
                <div className="p-4 flex flex-col h-full overflow-hidden">
                    <h4 className="font-semibold text-gray-500 mb-3 text-xs tracking-wider uppercase">İntaç Durumu</h4>
                    <div className="flex flex-col gap-2 overflow-y-auto max-h-full pr-2">
                        <Checkbox
                            checked={intacFilter === 'Received'}
                            onChange={(e) => setIntacFilter(e.target.checked ? 'Received' : 'All')}
                            className={`p-1 rounded transition-colors ${isDarkMode ? 'text-white hover:bg-[#1f1f1f]' : 'hover:bg-gray-50'}`}
                        >
                            İntaç Alındı
                        </Checkbox>
                        <Checkbox
                            checked={intacFilter === 'NotReceived'}
                            onChange={(e) => setIntacFilter(e.target.checked ? 'NotReceived' : 'All')}
                            className={`p-1 rounded transition-colors ${isDarkMode ? 'text-white hover:bg-[#1f1f1f]' : 'hover:bg-gray-50'}`}
                        >
                            İntaç Alınmadı
                        </Checkbox>
                    </div>
                </div>

                {/* Column 2: Mutlak Riskler */}
                <div className="p-4 flex flex-col h-full overflow-hidden">
                    <h4 className="font-semibold text-gray-500 mb-3 text-xs tracking-wider uppercase">Mutlak Riskler</h4>
                    <div className="flex flex-col gap-2 overflow-y-auto max-h-full pr-2">
                        {filterItems.risk_absolute.map(code => (
                            <Checkbox
                                key={code}
                                checked={riskFilter.includes(code)}
                                onChange={(e) => handleRiskFilterChange(code, e.target.checked)}
                                className={`p-1 rounded transition-colors ${isDarkMode ? 'text-white hover:bg-[#1f1f1f]' : 'hover:bg-gray-50'}`}
                            >
                                {code}
                            </Checkbox>
                        ))}
                    </div>
                </div>

                {/* Column 3: Potansiyel Riskler */}
                <div className="p-4 flex flex-col h-full overflow-hidden">
                    <h4 className="font-semibold text-gray-500 mb-3 text-xs tracking-wider uppercase">Potansiyel Riskler</h4>
                    <div className="flex flex-col gap-2 overflow-y-auto max-h-full pr-2">
                        {filterItems.risk_potential.map(code => (
                            <Checkbox
                                key={code}
                                checked={riskFilter.includes(code)}
                                onChange={(e) => handleRiskFilterChange(code, e.target.checked)}
                                className={`p-1 rounded transition-colors ${isDarkMode ? 'text-white hover:bg-[#1f1f1f]' : 'hover:bg-gray-50'}`}
                            >
                                {code}
                            </Checkbox>
                        ))}
                    </div>
                </div>

                {/* Column 4: AI & ML Bulguları */}
                <div className="p-4 flex flex-col h-full overflow-hidden">
                    <h4 className="font-semibold text-gray-500 mb-3 text-xs tracking-wider uppercase">AI & ML Bulguları</h4>
                    <div className="flex flex-col gap-2 overflow-y-auto max-h-full pr-2">
                        {filterItems.risk_ml.map(code => (
                            <Checkbox
                                key={code}
                                checked={riskFilter.includes(code)}
                                onChange={(e) => handleRiskFilterChange(code, e.target.checked)}
                                className={`p-1 rounded transition-colors ${isDarkMode ? 'text-white hover:bg-[#1f1f1f]' : 'hover:bg-gray-50'}`}
                            >
                                {code}
                            </Checkbox>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className={`p-4 border-t flex justify-between items-center shrink-0 ${isDarkMode ? 'border-[#303030] bg-[#141414]' : 'border-[#e2e2e4] bg-white'}`}>
                <Button
                    onClick={clearFilters}
                    className={isDarkMode ? 'border-[#303030] text-gray-300 hover:text-white hover:border-white' : 'border-gray-300 text-black hover:border-black hover:text-black'}
                >
                    Filtreyi Temizle
                </Button>
                <Button
                    type="primary"
                    onClick={() => setOpenFilter(false)}
                    className={isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black hover:bg-gray-800'}
                >
                    Filtreyi Uygula
                </Button>
            </div>
        </div>
    );



    // Table Columns
    const columns: ColumnsType<Declaration> = [
        {
            title: 'Beyanname No',
            dataIndex: 'no',
            key: 'no',
            render: (text) => <span className={`font-semibold ${isDarkMode ? 'text-white' : ''}`}>{text}</span>,
        },
        {
            title: (
                <div className="flex flex-col gap-2 pb-2">
                    <span>Gönderici Adı</span>
                    <Input
                        placeholder="Ara..."
                        size="small"
                        prefix={<SearchOutlined className="text-gray-400" />}
                        value={senderSearchText}
                        onChange={e => setSenderSearchText(e.target.value)}
                        className={`rounded-lg ${isDarkMode ? 'bg-[#1f1f1f] border-[#303030] text-white' : ''}`}
                        allowClear
                        onClick={e => e.stopPropagation()}
                    />
                </div>
            ),
            dataIndex: 'seller',
            key: 'seller',
            width: 200,
            render: (text) => <span className={isDarkMode ? 'text-gray-300' : ''}>{text}</span>,
        },
        {
            title: (
                <div className="flex flex-col gap-2 pb-2">
                    <span>Alıcı Adı</span>
                    <Input
                        placeholder="Ara..."
                        size="small"
                        prefix={<SearchOutlined className="text-gray-400" />}
                        value={buyerSearchText}
                        onChange={e => setBuyerSearchText(e.target.value)}
                        className={`rounded-lg ${isDarkMode ? 'bg-[#1f1f1f] border-[#303030] text-white' : ''}`}
                        allowClear
                        onClick={e => e.stopPropagation()}
                    />
                </div>
            ),
            dataIndex: 'buyer',
            key: 'buyer',
            width: 200,
            render: (text) => <span className={isDarkMode ? 'text-gray-300' : ''}>{text}</span>,
        },
        {
            title: (
                <div className="flex flex-col items-center">
                    <span>Mutlak Risk</span>
                    <span className="text-xs text-gray-400 font-normal">Toplam: {totalAbsoluteRisk}</span>
                </div>
            ),
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
            title: (
                <div className="flex flex-col items-center">
                    <span>Potansiyel Risk</span>
                    <span className="text-xs text-gray-400 font-normal">Toplam: {totalPotentialRisk}</span>
                </div>
            ),
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
            title: (
                <div className="flex flex-col items-center">
                    <span>AI-ML Bulguları</span>
                    <span className="text-xs text-gray-400 font-normal">Toplam: {totalMLRisk}</span>
                </div>
            ),
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
            title: 'İntaç Tarihi',
            dataIndex: 'intacDate',
            key: 'intacDate',
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
                                navigate(`/declarations/${record.key}`);
                            }}
                            className={isDarkMode ? 'hover:bg-[#303030] text-white' : 'bg-gray-50 hover:bg-black hover:text-white transition-colors'}
                        />
                    </Tooltip>
                    <Dropdown
                        menu={{
                            items: [
                                {
                                    key: '1',
                                    label: 'Detaya Git',
                                    icon: <EyeOutlined />,
                                    onClick: () => navigate(`/declarations/${record.key}`),
                                },
                                {
                                    key: '2',
                                    label: 'Statü Güncelle',
                                    icon: <SyncOutlined />,
                                    onClick: () => handleStatusCheck(),
                                },
                            ],
                        }}
                        trigger={['click']}
                    >
                        <Button type="text" shape="circle" icon={<MoreOutlined className={isDarkMode ? 'text-white' : ''} />} />
                    </Dropdown>
                </div >
            ),
        },
    ];

    // Expandable Row Renderer
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

    const searchBg = isDarkMode ? '#141414' : '#fff'; // Darker card bg
    const searchBorder = isDarkMode ? '#303030' : '#e2e2e4';

    return (
        <div className="flex flex-col gap-6 p-1">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Title level={2} style={{ margin: 0, color: isDarkMode ? 'white' : 'black' }}>
                        Beyanname Listesi
                    </Title>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Tüm ithalat ve ihracat beyannamelerinizi buradan yönetin.</span>
                </div>

                <Space>
                    {/* Actions moved to Table Header */}
                </Space>
            </div>

            {/* Segment Toggle */}
            <div className="flex items-center">
                <div className={`p-1 rounded-lg inline-flex ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200/50'}`}>
                    <button
                        onClick={() => setActiveSegment('B2B')}
                        className={`px-6 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 ${activeSegment === 'B2B'
                            ? (isDarkMode ? 'bg-[#303030] text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm')
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        B2B
                    </button>
                    <button
                        onClick={() => setActiveSegment('B2C')}
                        className={`px-6 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 ${activeSegment === 'B2C'
                            ? (isDarkMode ? 'bg-[#303030] text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm')
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        B2C
                    </button>
                </div>
            </div>

            {/* KPI Cards - 5 Card Layout (Update 18.0) */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

                {/* Card 1: Total Declarations (Light: Navy | Dark: Cyan Theme) */}
                <div className={`p-4 rounded-2xl relative overflow-hidden transition-all duration-300 flex justify-between items-start ${isDarkMode ? 'bg-slate-900 shadow-lg shadow-cyan-900/10' : 'bg-[#0f172a] shadow-sm text-white'}`}>
                    <div className="flex flex-col justify-between h-full z-10">
                        <div>
                            <span className={`text-3xl font-bold block ${isDarkMode ? 'text-cyan-400' : 'text-white'}`}>{totalDeclarations}</span>
                            <span className={`text-xs font-light tracking-wide mt-1 block opacity-70 ${isDarkMode ? 'text-gray-300' : 'text-gray-300'}`}>Toplam Beyanname</span>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                                +12.5%
                            </span>
                            <span className="text-[10px] opacity-60">bu hafta</span>
                        </div>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${isDarkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/10 text-cyan-200'}`}>
                        <FileTextOutlined />
                    </div>
                </div>

                {/* Card 2: Absolute Risk (Light: White | Dark: Pink Theme) */}
                <div className={`p-4 rounded-2xl relative overflow-hidden transition-all duration-300 flex justify-between items-start ${isDarkMode ? 'bg-[#2a0f1b] shadow-lg shadow-pink-900/10' : 'bg-white border border-[#e2e2e4] shadow-sm'}`}>
                    <div className="flex flex-col justify-between h-full z-10">
                        <div>
                            <span className={`text-3xl font-bold block ${isDarkMode ? 'text-pink-500' : 'text-gray-900'}`}>{totalAbsoluteRisk}</span>
                            <span className={`text-xs font-light tracking-wide mt-1 block opacity-70 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Mutlak Risk</span>
                        </div>
                        <div className="mt-4 flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                                    +2.1%
                                </span>
                                <span className={`text-[10px] opacity-60 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>geçen aya göre</span>
                            </div>
                            <span className={`text-[10px] font-medium mt-1 ${isDarkMode ? 'text-pink-200/70' : 'text-gray-600'}`}>
                                Bulgu sayısı: 12
                            </span>
                        </div>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${isDarkMode ? 'bg-pink-600/20 text-pink-500' : 'bg-rose-50 text-rose-600'}`}>
                        <WarningOutlined />
                    </div>
                </div>

                {/* Card 3: Potential Risk (Light: White | Dark: Orange Theme) */}
                <div className={`p-4 rounded-2xl relative overflow-hidden transition-all duration-300 flex justify-between items-start ${isDarkMode ? 'bg-[#431407] shadow-lg shadow-orange-900/10' : 'bg-white border border-[#e2e2e4] shadow-sm'}`}>
                    <div className="flex flex-col justify-between h-full z-10">
                        <div>
                            <span className={`text-3xl font-bold block ${isDarkMode ? 'text-orange-500' : 'text-gray-900'}`}>{totalPotentialRisk}</span>
                            <span className={`text-xs font-light tracking-wide mt-1 block opacity-70 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Potansiyel Risk</span>
                        </div>
                        <div className="mt-4 flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                                    -5.4%
                                </span>
                                <span className={`text-[10px] opacity-60 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>bu hafta</span>
                            </div>
                            <span className={`text-[10px] font-medium mt-1 ${isDarkMode ? 'text-orange-200/70' : 'text-gray-600'}`}>
                                Bulgu sayısı: 45
                            </span>
                        </div>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${isDarkMode ? 'bg-orange-600/20 text-orange-500' : 'bg-orange-50 text-orange-600'}`}>
                        <InfoCircleOutlined />
                    </div>
                </div>

                {/* Card 4: AI & ML (Light: White | Dark: Purple Theme) */}
                <div className={`p-4 rounded-2xl relative overflow-hidden transition-all duration-300 flex justify-between items-start ${isDarkMode ? 'bg-[#3b0764] shadow-lg shadow-purple-900/10' : 'bg-white border border-[#e2e2e4] shadow-sm'}`}>
                    <div className="flex flex-col justify-between h-full z-10">
                        <div>
                            <span className={`text-3xl font-bold block ${isDarkMode ? 'text-purple-400' : 'text-gray-900'}`}>{totalMLRisk}</span>
                            <span className={`text-xs font-light tracking-wide mt-1 block opacity-70 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>AI & ML Bulgusu</span>
                        </div>
                        <div className="mt-4 flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                                    +18.2%
                                </span>
                                <span className={`text-[10px] opacity-60 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>yeni model ile</span>
                            </div>
                            <span className={`text-[10px] font-medium mt-1 ${isDarkMode ? 'text-purple-200/70' : 'text-gray-600'}`}>
                                Bulgu sayısı: 8
                            </span>
                        </div>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${isDarkMode ? 'bg-purple-600/20 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                        <CheckCircleOutlined />
                    </div>
                </div>

                {/* Card 5: Pending Intac (Light: White | Dark: Green Theme) */}
                <div className={`p-4 rounded-2xl relative overflow-hidden transition-all duration-300 flex justify-between items-start ${isDarkMode ? 'bg-[#052e16] shadow-lg shadow-emerald-900/10' : 'bg-white border border-[#e2e2e4] shadow-sm'}`}>
                    <div className="flex flex-col justify-between h-full z-10">
                        <div>
                            <span className={`text-3xl font-bold block ${isDarkMode ? 'text-emerald-400' : 'text-gray-900'}`}>{totalPendingIntac}</span>
                            <span className={`text-xs font-light tracking-wide mt-1 block opacity-70 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>İntaç Bekleyen</span>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="text-xs font-medium text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                                ~1.2%
                            </span>
                            <span className={`text-[10px] opacity-60 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>sabit seyir</span>
                        </div>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-green-50 text-green-600'}`}>
                        <ClockCircleOutlined />
                    </div>
                </div>
            </div>

            <div className="p-4 rounded-lg border mb-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center transition-colors duration-200"
                style={{ backgroundColor: searchBg, borderColor: searchBorder }}
            >
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
                    <Input
                        placeholder="Beyanname No, Firma veya Tutar Ara..."
                        prefix={<SearchOutlined className={isDarkMode ? 'text-gray-400' : 'text-gray-400'} />}
                        className="w-[280px]"
                        value={searchText}
                        onChange={handleSearch}
                        allowClear
                        style={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#fff', borderColor: isDarkMode ? '#303030' : '#d9d9d9', color: isDarkMode ? '#fff' : '#000' }}
                    />
                </div>

                <div className="flex gap-2 items-center">
                    <Button
                        icon={<ExportOutlined />}
                        style={{ backgroundColor: isDarkMode ? '#9f9fa7' : 'transparent', color: isDarkMode ? '#ffffff' : 'inherit', border: isDarkMode ? 'none' : '' }}
                    >
                        Dışa Aktar
                    </Button>

                    <Popover
                        content={filterMenuContent}
                        trigger="click"
                        open={openFilter}
                        onOpenChange={setOpenFilter}
                        placement="bottomRight"
                        arrow={false}
                        overlayClassName={isDarkMode ? 'dark-popover' : ''}
                    >
                        <Button
                            icon={<FilterOutlined />}
                            style={{
                                backgroundColor: isDarkMode ? '#3f3f46' : (hasActiveFilters ? '#f3f4f6' : '#000000'),
                                color: isDarkMode ? '#ffffff' : (hasActiveFilters ? '#000000' : '#ffffff'),
                                borderColor: isDarkMode ? '#3f3f46' : (hasActiveFilters ? '#d1d5db' : '#000000')
                            }}
                            className="transition-colors"
                        >
                            Gelişmiş Filtre {filterCount > 0 && `(${filterCount})`}
                        </Button>
                    </Popover>

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

            {/* Loading Overlay */}
            {isChecking && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center flex-col gap-4">
                    <Spin size="large" />
                    <span className="text-white font-medium text-lg">Kontrol ediliyor...</span>
                </div>
            )}

            <div className="rounded-lg border shadow-sm overflow-hidden transition-colors duration-200"
                style={{ backgroundColor: searchBg, borderColor: searchBorder }}
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
        </div>
    );
};

export default DeclarationList;
