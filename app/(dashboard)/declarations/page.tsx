'use client';


import React, { useState, Suspense } from 'react';
import { Segmented, Typography, Table, Input, Button, Tag, Space, Empty, Tooltip, Drawer, notification, Select, ConfigProvider, theme, DatePicker } from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    ExportOutlined,
    EyeOutlined,
    WarningOutlined,
    InfoCircleOutlined,
    CheckCircleOutlined,
    FileTextOutlined,
    ClockCircleOutlined,
    HistoryOutlined,
    ThunderboltOutlined,
    ExclamationCircleOutlined,
    CloseOutlined,
    ArrowRightOutlined,
    FileSyncOutlined,
    SafetyCertificateOutlined
} from '@ant-design/icons';
import { Timeline } from 'antd';
import { useTheme } from '@/context/ThemeContext';
import { useDashboard } from '@/context/DashboardContext';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import type { ColumnsType } from 'antd/es/table';
import { declarationsList, riskDetails, b2cDeclarations } from '@/utils/mockData';
import type { Declaration } from '@/utils/mockData';
import { useRouter, useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';
import { useAuthStore } from '@/store/useAuthStore';

export const dynamic = 'force-dynamic';

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface Risk {
    code: string;
    subject: string;
    details: string;
    relatedItem: string;
}

const DeclarationsContent: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') === 'B2C' ? 'B2C' : 'B2B';

    const { isDarkMode } = useTheme();
    const { setGlobalChecking } = useDashboard();
    const { activeCompanyContext } = useAuthStore();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    const handleStatusCheck = () => {
        setIsChecking(true);
        setTimeout(() => {
            setIsChecking(false);
            notification.success({
                message: 'Statü Güncellendi',
                description: 'Seçilen beyannamelerin statüleri başarıyla güncellendi.',
                placement: 'topRight'
            });
        }, 2000);
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
        intacStatus: null as string | null,
        riskCodesAbsolute: [] as string[],
        riskCodesPotential: [] as string[],
        riskCodesML: [] as string[],
        declarationType: 'Hepsi' as 'Hepsi' | 'İthalat' | 'İhracat' | 'ETGB İth.',
        regime: null as string | null,
        year: null as string | null,
        paymentMethod: null as string | null,
        incoterm: null as string | null,
        dateRange: null as [dayjs.Dayjs, dayjs.Dayjs] | null,
    });



    const [activeSegment, setActiveSegment] = useState<'B2B' | 'B2C'>(initialTab);
    const [senderSearchText, setSenderSearchText] = useState('');
    const [buyerSearchText, setBuyerSearchText] = useState('');

    // B2C Mock Data (Sourced from XML)
    const b2cData = b2cDeclarations;

    // Filter Logic
    const currentDataSource = activeSegment === 'B2B' ? declarationsList : b2cData;
    
    // RBAC Filter: Only show items matching active company context, 
    // unless they belong to GUMRUK (Admin or Musavir looking at their general dashboard)
    // For now: Only show if item.companyId === activeCompanyContext.id
    const rbacFilteredData = currentDataSource.filter(item => {
        if (!activeCompanyContext) return false;
        if (activeCompanyContext.type === 'GUMRUK') return true; // Show all to Müşavir's default view
        return item.companyId === activeCompanyContext.id;
    });

    const filteredData = rbacFilteredData.filter(item => {
        // Global Search
        const matchesGlobalSearch =
            item.no.toLowerCase().includes(searchText.toLowerCase()) ||
            item.seller.toLowerCase().includes(searchText.toLowerCase()) ||
            item.buyer.toLowerCase().includes(searchText.toLowerCase());

        // Column Filters (Dropdowns)
        const matchesSellerFilter = !columnFilters.seller ? true : item.seller === columnFilters.seller;
        const matchesBuyerFilter = !columnFilters.buyer ? true : item.buyer === columnFilters.buyer;

        const matchesIntacStatusFilter = !columnFilters.intacStatus ? true :
            columnFilters.intacStatus === 'received' ? item.intacDate !== '-' :
                columnFilters.intacStatus === 'pending' ? item.intacDate === '-' : true;

        // New Filters
        const matchesRegimeFilter = !columnFilters.regime ? true : item.regime === columnFilters.regime;
        const matchesPaymentMethodFilter = !columnFilters.paymentMethod ? true : item.paymentMethod === columnFilters.paymentMethod;
        const matchesIncotermFilter = !columnFilters.incoterm ? true : item.incoterm === columnFilters.incoterm;

        const matchesYearFilter = !columnFilters.year ? true :
            item.intacDate !== '-' && item.intacDate.split('.').length === 3 ? item.intacDate.split('.')[2] === columnFilters.year :
                true;

        let matchesYear = true;
        if (columnFilters.year) {
            if (item.intacDate && item.intacDate !== '-') {
                const parts = item.intacDate.split('.');
                if (parts.length === 3) {
                    matchesYear = parts[2] === columnFilters.year;
                } else {
                    matchesYear = false;
                }
            } else {
                matchesYear = false;
            }
        }

        // Date Range Filter (checks intacDate)
        let matchesDateRange = true;
        if (columnFilters.dateRange) {
            if (item.intacDate && item.intacDate !== '-') {
                const parts = item.intacDate.split('.');
                if (parts.length === 3) {
                    const d = dayjs(`${parts[2]}-${parts[1]}-${parts[0]}`);
                    matchesDateRange = d.isAfter(columnFilters.dateRange[0].startOf('day')) && d.isBefore(columnFilters.dateRange[1].endOf('day'));
                } else {
                    matchesDateRange = false;
                }
            } else {
                matchesDateRange = false;
            }
        }

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
            matchesSellerFilter && matchesBuyerFilter &&
            matchesIntacStatusFilter && matchesRiskCodeFilter && matchesDeclarationTypeFilter &&
            matchesRegimeFilter && matchesPaymentMethodFilter && matchesIncotermFilter && matchesYear && matchesDateRange;
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
            intacStatus: null,
            riskCodesAbsolute: [],
            riskCodesPotential: [],
            riskCodesML: [],
            declarationType: 'Hepsi',
            regime: null,
            year: null,
            paymentMethod: null,
            incoterm: null,
            dateRange: null,
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
            render: (text) => <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-[#262626]'}`}>{text}</span>,
        },
        {
            title: 'Gönderici Adı',
            dataIndex: 'seller',
            key: 'seller',
            width: 200,
            sorter: (a, b) => a.seller.localeCompare(b.seller),
            render: (text) => <span className={isDarkMode ? 'text-gray-300' : 'text-[#262626]'}>{text}</span>,
        },
        {
            title: 'Alıcı Adı',
            dataIndex: 'buyer',
            key: 'buyer',
            width: 200,
            sorter: (a, b) => a.buyer.localeCompare(b.buyer),
            render: (text) => <span className={isDarkMode ? 'text-gray-300' : 'text-[#262626]'}>{text}</span>,
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
                <span className={`px-2 py-1 rounded text-xs font-medium ${isDarkMode ? 'bg-[#303030] text-gray-300' : 'bg-[#f5f5f5] text-[#262626]'}`}>
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
                text === '-' ? (
                    <Tag color="error" className="m-0">İntaç tarihi almadı</Tag>
                ) : (
                    <Tag className={`m-0 ${isDarkMode ? 'bg-[#303030] text-gray-300 border-[#424242]' : 'bg-[#f5f5f5] text-[#262626] border-[#d9d9d9]'}`}>
                        {text}
                    </Tag>
                )
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
                            className={isDarkMode ? 'hover:bg-[#303030] text-white' : 'bg-transparent hover:bg-gray-100 text-[#262626] transition-colors'}
                        />
                    </Tooltip>

                    <PermissionGuard allowedRoles={['Admin', 'Manager']}>
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
                                className={isDarkMode ? 'hover:bg-[#303030] text-white' : 'bg-transparent hover:bg-gray-100 text-[#262626] transition-colors'}
                            />
                        </Tooltip>
                    </PermissionGuard>
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
                <span className={`font-semibold ${isDarkMode ? 'text-gray-400' : 'text-[#262626]'}`}>Risk Detayları:</span>
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

    const searchBg = isDarkMode ? '#141414' : '#ffffff';
    const searchBorder = isDarkMode ? '#303030' : '#d9d9d9';

    return (
        <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-black' : 'bg-[#fafafa]'}`}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <Title level={4} style={{ margin: 0, color: isDarkMode ? 'white' : '#262626' }}>
                            Beyanname Listesi
                        </Title>
                        <span className={isDarkMode ? 'text-gray-400' : 'text-[#262626] opacity-70'}>Tüm ithalat ve ihracat beyannamelerinizi buradan yönetin.</span>
                    </div>
                </div>

                <div className="flex items-center">
                    <ConfigProvider
                        theme={{
                            components: {
                                Segmented: {
                                    itemSelectedBg: isDarkMode ? '#ffffff' : '#262626',
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
                            onChange={(val) => {
                                const newValue = val as 'B2B' | 'B2C';
                                setActiveSegment(newValue);
                                const params = new URLSearchParams(searchParams.toString());
                                params.set('tab', newValue);
                                router.replace(`?${params.toString()}`);
                            }}
                            style={{ width: 'fit-content' }}
                        />
                    </ConfigProvider>
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-5 gap-4`}>
                    {/* Card 1: Toplam Beyanname */}
                    <div className={`p-4 rounded-[8px] border shadow-sm relative overflow-hidden transition-all duration-300 flex justify-between items-start ${isDarkMode ? 'bg-[#1f1f1f] border-[#303030]' : 'bg-white border-[#d9d9d9]'}`}>
                        <div className="flex flex-col justify-between h-full z-10">
                            <div>
                                <span className={`text-[30px] font-bold block ${isDarkMode ? 'text-white' : 'text-[#262626]'}`}>{totalDeclarations}</span>
                                <span className={`text-[14px] font-normal tracking-wide mt-1 block opacity-70 ${isDarkMode ? 'text-gray-400' : 'text-[#262626]'}`}>Toplam Beyanname</span>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-[14px] font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                                    +12.5%
                                </span>
                                <span className={`text-[14px] opacity-60 ${isDarkMode ? 'text-gray-400' : 'text-[#262626]'}`}>bu hafta</span>
                            </div>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${isDarkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-100 text-[#262626]'}`}>
                            <FileTextOutlined />
                        </div>
                    </div>

                    {/* Card 2: Mutlak Risk */}
                    <div className={`p-4 rounded-[8px] border shadow-sm relative overflow-hidden transition-all duration-300 flex justify-between items-start ${isDarkMode ? 'bg-[#1f1f1f] border-[#303030]' : 'bg-white border-[#d9d9d9]'}`}>
                        <div className="flex flex-col justify-between h-full z-10">
                            <div>
                                <span className={`text-[30px] font-bold block ${isDarkMode ? 'text-white' : 'text-[#262626]'}`}>{totalAbsoluteRisk}</span>
                                <span className={`text-[14px] font-normal tracking-wide mt-1 block opacity-70 ${isDarkMode ? 'text-gray-400' : 'text-[#262626]'}`}>Mutlak Risk</span>
                            </div>
                            <div className="mt-4 flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[14px] font-medium text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                                        +2.1%
                                    </span>
                                    <span className={`text-[14px] opacity-60 ${isDarkMode ? 'text-gray-400' : 'text-[#262626]'}`}>geçen aya göre</span>
                                </div>
                                <span className={`text-[14px] font-medium mt-1 ${isDarkMode ? 'text-gray-400' : 'text-[#262626]'}`}>
                                    Bulgu sayısı: 12
                                </span>
                            </div>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${isDarkMode ? 'bg-pink-600/20 text-pink-500' : 'bg-rose-50 text-rose-600'}`}>
                            <WarningOutlined />
                        </div>
                    </div>

                    {/* Card 3: Potansiyel Risk */}
                    <div className={`p-4 rounded-[8px] border shadow-sm relative overflow-hidden transition-all duration-300 flex justify-between items-start ${isDarkMode ? 'bg-[#1f1f1f] border-[#303030]' : 'bg-white border-[#d9d9d9]'}`}>
                        <div className="flex flex-col justify-between h-full z-10">
                            <div>
                                <span className={`text-[30px] font-bold block ${isDarkMode ? 'text-white' : 'text-[#262626]'}`}>{totalPotentialRisk}</span>
                                <span className={`text-[14px] font-normal tracking-wide mt-1 block opacity-70 ${isDarkMode ? 'text-gray-400' : 'text-[#262626]'}`}>Potansiyel Risk</span>
                            </div>
                            <div className="mt-4 flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[14px] font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                                        -5.4%
                                    </span>
                                    <span className={`text-[14px] opacity-60 ${isDarkMode ? 'text-gray-400' : 'text-[#262626]'}`}>bu hafta</span>
                                </div>
                                <span className={`text-[14px] font-medium mt-1 ${isDarkMode ? 'text-gray-400' : 'text-[#262626]'}`}>
                                    Bulgu sayısı: 45
                                </span>
                            </div>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${isDarkMode ? 'bg-orange-600/20 text-orange-500' : 'bg-orange-50 text-orange-600'}`}>
                            <InfoCircleOutlined />
                        </div>
                    </div>

                    {/* Card 4: AI & ML Bulgusu */}
                    <div className={`p-4 rounded-[8px] border shadow-sm relative overflow-hidden transition-all duration-300 flex justify-between items-start ${isDarkMode ? 'bg-[#1f1f1f] border-[#303030]' : 'bg-white border-[#d9d9d9]'}`}>
                        <div className="flex flex-col justify-between h-full z-10">
                            <div>
                                <span className={`text-[30px] font-bold block ${isDarkMode ? 'text-white' : 'text-[#262626]'}`}>{totalMLRisk}</span>
                                <span className={`text-[14px] font-normal tracking-wide mt-1 block opacity-70 ${isDarkMode ? 'text-gray-400' : 'text-[#262626]'}`}>AI & ML Bulgusu</span>
                            </div>
                            <div className="mt-4 flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[14px] font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                                        +18.2%
                                    </span>
                                    <span className={`text-[14px] opacity-60 ${isDarkMode ? 'text-gray-400' : 'text-[#262626]'}`}>yeni model ile</span>
                                </div>
                                <span className={`text-[14px] font-medium mt-1 ${isDarkMode ? 'text-gray-400' : 'text-[#262626]'}`}>
                                    Bulgu sayısı: 8
                                </span>
                            </div>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${isDarkMode ? 'bg-purple-600/20 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                            <CheckCircleOutlined />
                        </div>
                    </div>

                    {/* Card 5: İntaç Bekleyen */}
                    <div className={`p-4 rounded-[8px] border shadow-sm relative overflow-hidden transition-all duration-300 flex justify-between items-start ${isDarkMode ? 'bg-[#1f1f1f] border-[#303030]' : 'bg-white border-[#d9d9d9]'}`}>
                        <div className="flex flex-col justify-between h-full z-10">
                            <div>
                                <span className={`text-[30px] font-bold block ${isDarkMode ? 'text-white' : 'text-[#262626]'}`}>{totalPendingIntac}</span>
                                <span className={`text-[14px] font-normal tracking-wide mt-1 block opacity-70 ${isDarkMode ? 'text-gray-400' : 'text-[#262626]'}`}>İntaç Bekleyen</span>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-[14px] font-medium text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                                    ~1.2%
                                </span>
                                <span className={`text-[14px] opacity-60 ${isDarkMode ? 'text-gray-400' : 'text-[#262626]'}`}>sabit seyir</span>
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
                                className="w-[280px] focus:w-[400px] transition-all duration-300"
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
                                                columnFilters.intacStatus,
                                                columnFilters.regime,
                                                columnFilters.year,
                                                columnFilters.paymentMethod,
                                                columnFilters.incoterm,
                                                columnFilters.dateRange,
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
                            <PermissionGuard allowedRoles={['Admin', 'Manager']}>
                                <Button
                                    icon={<ExportOutlined />}
                                    style={{ backgroundColor: isDarkMode ? '#9f9fa7' : 'transparent', color: isDarkMode ? '#ffffff' : 'inherit', border: isDarkMode ? 'none' : '' }}
                                >
                                    Dışa Aktar
                                </Button>
                            </PermissionGuard>

                            {selectedRowKeys.length > 0 && (
                                <PermissionGuard allowedRoles={['Admin', 'Manager']}>
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
                                </PermissionGuard>
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
                            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4 border-t ${isDarkMode ? 'border-[#303030]' : 'border-gray-100'}`}>
                                {/* 1. Regime Filter */}
                                <div className="flex flex-col gap-1">
                                    <span className={`text-xs font-medium ml-1 ${isDarkMode ? 'text-gray-400' : 'text-[#262626]'}`}>Rejim</span>
                                    <Select
                                        placeholder="Seçiniz"
                                        allowClear
                                        className="w-full"
                                        value={columnFilters.regime}
                                        onChange={(value) => setColumnFilters(prev => ({ ...prev, regime: value }))}
                                        options={[
                                            { label: '1000', value: '1000' },
                                            { label: '3151', value: '3151' },
                                            { label: '3153', value: '3153' },
                                            { label: '4000', value: '4000' },
                                            { label: '4071', value: '4071' },
                                            { label: '7100', value: '7100' },
                                        ]}
                                        popupClassName={isDarkMode ? 'dark-select-dropdown' : ''}
                                    />
                                </div>

                                {/* 2. Year Filter */}
                                <div className="flex flex-col gap-1">
                                    <span className={`text-xs font-medium ml-1 ${isDarkMode ? 'text-gray-400' : 'text-[#262626]'}`}>Yıl</span>
                                    <Select
                                        placeholder="Seçiniz"
                                        allowClear
                                        className="w-full"
                                        value={columnFilters.year}
                                        onChange={(value) => setColumnFilters(prev => ({ ...prev, year: value }))}
                                        options={[
                                            { label: '2024', value: '2024' },
                                            { label: '2025', value: '2025' },
                                            { label: '2026', value: '2026' },
                                        ]}
                                        popupClassName={isDarkMode ? 'dark-select-dropdown' : ''}
                                    />
                                </div>

                                {/* 3. Payment Method Filter */}
                                <div className="flex flex-col gap-1">
                                    <span className={`text-xs font-medium ml-1 ${isDarkMode ? 'text-gray-400' : 'text-[#262626]'}`}>Ödeme Şekli</span>
                                    <Select
                                        placeholder="Seçiniz"
                                        allowClear
                                        className="w-full"
                                        value={columnFilters.paymentMethod}
                                        onChange={(value) => setColumnFilters(prev => ({ ...prev, paymentMethod: value }))}
                                        options={[
                                            { label: 'Peşin', value: 'Peşin' },
                                        ]}
                                        popupClassName={isDarkMode ? 'dark-select-dropdown' : ''}
                                    />
                                </div>

                                {/* 4. Incoterm Filter */}
                                <div className="flex flex-col gap-1">
                                    <span className={`text-xs font-medium ml-1 ${isDarkMode ? 'text-gray-400' : 'text-[#262626]'}`}>Incoterm</span>
                                    <Select
                                        placeholder="Seçiniz"
                                        allowClear
                                        className="w-full"
                                        value={columnFilters.incoterm}
                                        onChange={(value) => setColumnFilters(prev => ({ ...prev, incoterm: value }))}
                                        options={[
                                            { label: 'CFR', value: 'CFR' },
                                            { label: 'CIF', value: 'CIF' },
                                            { label: 'CIP', value: 'CIP' },
                                            { label: 'DAP', value: 'DAP' },
                                            { label: 'EXW', value: 'EXW' },
                                            { label: 'FCA', value: 'FCA' },
                                            { label: 'FOB', value: 'FOB' },
                                        ]}
                                        popupClassName={isDarkMode ? 'dark-select-dropdown' : ''}
                                    />
                                </div>

                                {/* 5. Date Range Filter */}
                                <div className="flex flex-col gap-1">
                                    <span className={`text-xs font-medium ml-1 ${isDarkMode ? 'text-gray-400' : 'text-[#262626]'}`}>Tarih Aralığı</span>
                                    <RangePicker
                                        className="w-full"
                                        value={columnFilters.dateRange}
                                        onChange={(dates) => setColumnFilters(prev => ({ ...prev, dateRange: dates as any }))}
                                        style={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#fff', borderColor: isDarkMode ? '#424242' : '#d9d9d9', color: isDarkMode ? '#fff' : '#000' }}
                                    />
                                </div>

                                {/* 6. Absolute Risk Codes Filter */}
                                <div className="flex flex-col gap-1">
                                    <span className={`text-xs font-medium ml-1 ${isDarkMode ? 'text-gray-400' : 'text-[#262626]'}`}>Mutlak Riskler</span>
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

                                {/* 7. Potential Risk Codes Filter */}
                                <div className="flex flex-col gap-1">
                                    <span className={`text-xs font-medium ml-1 ${isDarkMode ? 'text-gray-400' : 'text-[#262626]'}`}>Potansiyel Riskler</span>
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

                                {/* 8. ML Risk Codes Filter */}
                                <div className="flex flex-col gap-1">
                                    <span className={`text-xs font-medium ml-1 ${isDarkMode ? 'text-gray-400' : 'text-[#262626]'}`}>AI-ML Bulguları</span>
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

                                {/* 9. Sender Filter */}
                                <div className="flex flex-col gap-1">
                                    <span className={`text-xs font-medium ml-1 ${isDarkMode ? 'text-gray-400' : 'text-[#262626]'}`}>Gönderici</span>
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

                                {/* 10. Buyer Filter */}
                                <div className="flex flex-col gap-1">
                                    <span className={`text-xs font-medium ml-1 ${isDarkMode ? 'text-gray-400' : 'text-[#262626]'}`}>Alıcı</span>
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

                                {/* 11. Intac Status Filter */}
                                <div className="flex flex-col gap-1">
                                    <span className={`text-xs font-medium ml-1 ${isDarkMode ? 'text-gray-400' : 'text-[#262626]'}`}>İntaç Durumu</span>
                                    <Select
                                        placeholder="Seçiniz"
                                        allowClear
                                        className="w-full"
                                        value={columnFilters.intacStatus}
                                        onChange={(value) => setColumnFilters(prev => ({ ...prev, intacStatus: value }))}
                                        options={[
                                            { label: 'Alındı', value: 'received' },
                                            { label: 'Alınmadı', value: 'pending' },
                                        ]}
                                        popupClassName={isDarkMode ? 'dark-select-dropdown' : ''}
                                    />
                                </div>

                                {/* 12. Declaration Type Filter */}
                                <div className="flex flex-col gap-1">
                                    <span className={`text-xs font-medium ml-1 ${isDarkMode ? 'text-gray-400' : 'text-[#262626]'}`}>Beyanname Türü</span>
                                    <Select
                                        placeholder="Seçiniz"
                                        className="w-full"
                                        value={columnFilters.declarationType}
                                        onChange={(value) => setColumnFilters(prev => ({ ...prev, declarationType: value }))}
                                        options={[
                                            { label: 'Hepsi', value: 'Hepsi' },
                                            { label: 'İthalat', value: 'İthalat' },
                                            { label: 'İhracat', value: 'İhracat' },
                                            { label: 'ETGB İth.', value: 'ETGB İth.' },
                                        ]}
                                        popupClassName={isDarkMode ? 'dark-select-dropdown' : ''}
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
                    <div className={`rounded-[8px] border shadow-sm overflow-hidden transition-colors duration-200 ${isDarkMode ? 'border-[#303030]' : 'border-[#d9d9d9]'}`}
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
                    title={null}
                    placement="right"
                    onClose={() => setDrawerVisible(false)}
                    open={drawerVisible}
                    width={480}
                    closable={false}
                    bodyStyle={{ padding: 0, height: '100%', backgroundColor: isDarkMode ? '#141414' : '#fff' }}
                >
                    {selectedRiskDetail ? (
                        <div className="flex flex-col h-full">
                            {/* Header Section */}
                            <div className={`p-6 border-b ${isDarkMode ? 'border-[#303030]' : 'border-gray-100'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl ${selectedRiskDetail.code.includes('red') || selectedRiskDetail.code.includes('Mutlak')
                                        ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                                        : selectedRiskDetail.code.includes('pot') || selectedRiskDetail.code.includes('Potansiyel')
                                            ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
                                            : 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
                                        }`}>
                                        {selectedRiskDetail.code.includes('red') || selectedRiskDetail.code.includes('Mutlak') ? (
                                            <WarningOutlined className="text-2xl" />
                                        ) : selectedRiskDetail.code.includes('pot') || selectedRiskDetail.code.includes('Potansiyel') ? (
                                            <ExclamationCircleOutlined className="text-2xl" />
                                        ) : (
                                            <ThunderboltOutlined className="text-2xl" />
                                        )}
                                    </div>
                                    <Button
                                        type="text"
                                        icon={<CloseOutlined />}
                                        onClick={() => setDrawerVisible(false)}
                                        className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-[#262626] hover:text-gray-600'}
                                    />
                                </div>
                                <h2 className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-[#262626]'}`}>
                                    {selectedRiskDetail.code.split(' - ')[0]}
                                </h2>
                                <p className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {selectedRiskDetail.subject}
                                </p>
                            </div>

                            {/* Content Section */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="space-y-6">
                                    {/* Risk Card Info */}
                                    <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-[#1f1f1f] border-[#303030]' : 'bg-gray-50 border-gray-100'}`}>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className={`text-xs font-semibold uppercase tracking-wider block mb-1 ${isDarkMode ? 'text-gray-500' : 'text-[#262626] opacity-60'}`}>
                                                    RİSK KODU
                                                </span>
                                                <span className={`font-mono font-medium ${isDarkMode ? 'text-gray-300' : 'text-[#262626]'}`}>
                                                    {selectedRiskDetail.code.split(' - ')[1] || selectedRiskDetail.code}
                                                </span>
                                            </div>
                                            <div>
                                                <span className={`text-xs font-semibold uppercase tracking-wider block mb-1 ${isDarkMode ? 'text-gray-500' : 'text-[#262626] opacity-60'}`}>
                                                    ŞİDDET DÜZEYİ
                                                </span>
                                                <Tag
                                                    color={
                                                        selectedRiskDetail.code.includes('red') || selectedRiskDetail.code.includes('Mutlak') ? 'red' :
                                                            selectedRiskDetail.code.includes('pot') || selectedRiskDetail.code.includes('Potansiyel') ? 'orange' : 'purple'
                                                    }
                                                    className="m-0 border-0 px-2 py-0.5"
                                                >
                                                    {selectedRiskDetail.code.includes('red') || selectedRiskDetail.code.includes('Mutlak') ? 'Yüksek' :
                                                        selectedRiskDetail.code.includes('pot') || selectedRiskDetail.code.includes('Potansiyel') ? 'Orta' : 'Düşük'}
                                                </Tag>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-[#262626]'}`}>
                                            <FileTextOutlined className="text-blue-500" />
                                            Detay Açıklama
                                        </h3>
                                        <p className={`text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {selectedRiskDetail.details}
                                        </p>
                                    </div>

                                    {/* Related Item */}
                                    <div>
                                        <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-[#262626]'}`}>
                                            <SafetyCertificateOutlined className="text-emerald-500" />
                                            Etkilenen Kalem
                                        </h3>
                                        <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-[#1f1f1f] border-[#303030]' : 'bg-white border-gray-200'}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400`}>
                                                    <FileSyncOutlined />
                                                </div>
                                                <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-[#262626]'}`}>
                                                    {selectedRiskDetail.relatedItem}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Suggestion Section (Optional - Mocked for visual) */}
                                    <div className={`p-4 rounded-xl border border-dashed ${isDarkMode ? 'border-gray-700 bg-[#1a1a1a]' : 'border-gray-300 bg-gray-50'}`}>
                                        <h4 className={`text-xs font-bold uppercase mb-2 ${isDarkMode ? 'text-gray-500' : 'text-[#262626] opacity-60'}`}>
                                            ÖNERİLEN AKSİYON
                                        </h4>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Lütfen ilgili kalemin GTİP kodunu ve menşe şahadetnamesini kontrol ediniz. Uyumsuzluk durumunda gümrük müşavirinizle iletişime geçiniz.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Section */}
                            <div className={`p-6 border-t ${isDarkMode ? 'border-[#303030]' : 'border-gray-100'}`}>
                                <Button
                                    type="primary"
                                    size="large"
                                    block
                                    icon={<ArrowRightOutlined />}
                                    onClick={() => setDrawerVisible(false)}
                                    className={`${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black hover:bg-gray-800'}`}
                                >
                                    Anlaşıldı
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

const DeclarationsPage: React.FC = () => {
    return (
        <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
            <DeclarationsContent />
        </Suspense>
    );
};

export default DeclarationsPage;
