import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined, InfoCircleOutlined, FileTextOutlined, RiseOutlined, InboxOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Button, Badge, Modal, Tabs } from 'antd';
import {
    DownloadOutlined,
    PrinterOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';

import { useRouter } from 'next/navigation';
import { GroupedView } from './GroupedView';
import { FlatView } from './FlatView';
import { MasterHeader } from './MasterHeader';
import { RiskCardsScroller } from './RiskCardsScroller';
import { ETGBData, HAWBItem, RiskFinding } from './types';
import { Declaration } from '@/utils/mockData';

type ViewMode = 'grouped' | 'flat';

interface B2CDeclarationDetailProps {
    declaration: Declaration;
}

const B2CDeclarationDetail: React.FC<B2CDeclarationDetailProps> = ({ declaration }) => {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<ViewMode>('flat');
    const [etgbData, setEtgbData] = useState<ETGBData | null>(null);
    const [selectedHawb, setSelectedHawb] = useState<HAWBItem | null>(null);

    useEffect(() => {
        // Transform declaration data to ETGBData format
        const transformedData: ETGBData = {
            id: declaration.key,
            totalShipments: declaration.items?.length || declaration.packageCount || 0,
            totalValue: declaration.totalTax || 0, // In a real scenario, this would be total value of goods
            masterInfo: {
                etgbNo: declaration.no,
                etgbDate: declaration.intacDate !== '-' ? declaration.intacDate : '26.02.2024',
                flightNo: 'TK-1923', // Mock
                mawB: declaration.waybillNo || '000-00000000',
                destination: 'IST', // Mock
                warehouse: 'MNG', // Mock
                totalPieces: declaration.packageCount || 0,
                totalWeight: declaration.grossWeight || 0,

                // New Fields Population
                fileNo: '2024/123456',
                declarant: 'TRADE VISION LOJİSTİK A.Ş.',
                location: 'İSTANBUL HAVALİMANI',
                customs: 'İSTANBUL GÜMRÜK MÜDÜRLÜĞÜ',
                inspectionOfficer: 'AHMET YILMAZ',
                totalValue: declaration.totalTax || 0,
            },
            hawbs: [
                {
                    id: 'h-1',
                    hawbNo: `${declaration.waybillNo}-1`,
                    sequenceNo: '1',
                    buyer: 'Tech Solutions Ltd.',
                    consignor: 'Global Electronics GmbH', // Legacy field
                    sender: 'Global Electronics GmbH',
                    receiver: 'Tech Solutions Ltd.',
                    senderCompany: 'Global Electronics GmbH',
                    receiverCompany: 'Tech Solutions Ltd.',
                    packageType: 'Koli',
                    senderTaxId: 'DE123456789',
                    tradingCountry: 'DE',
                    destinationCountry: 'TR',
                    departureCountry: 'DE',
                    origin: 'DE',
                    gtip: '8517.12.00.00.00',
                    description: 'Akıllı Telefon - Model X (128GB, Siyah)',
                    netWeight: 12.5,
                    weight: 14.2,
                    regime: '4000',
                    fullMeasurement: 10,
                    currency: 'EUR',
                    value: 12500.00,
                    euroAmount: 12500.00,
                    pieces: 10,
                    status: 'Cleared',
                    riskScore: 10,
                    findings: []
                },
                {
                    id: 'h-2',
                    hawbNo: `${declaration.waybillNo}-2`,
                    sequenceNo: '2',
                    buyer: 'Moda Tekstil A.Ş.',
                    consignor: 'Fashion Italy S.R.L.',
                    sender: 'Fashion Italy S.R.L.',
                    receiver: 'Moda Tekstil A.Ş.',
                    senderCompany: 'Fashion Italy S.R.L.',
                    receiverCompany: 'Moda Tekstil A.Ş.',
                    packageType: 'Askılı Koli',
                    senderTaxId: 'IT987654321',
                    tradingCountry: 'IT',
                    destinationCountry: 'TR',
                    departureCountry: 'IT',
                    origin: 'IT',
                    gtip: '6204.62.00.00.00',
                    description: 'Bayan Pamuklu Pantolon (Yazlık Koleksiyon)',
                    netWeight: 45.0,
                    weight: 48.5,
                    regime: '4000',
                    fullMeasurement: 120,
                    currency: 'EUR',
                    value: 3600.50,
                    euroAmount: 3600.50,
                    pieces: 5,
                    status: 'Risk',
                    riskScore: 85,
                    findings: [
                        {
                            id: 'r-2',
                            severity: 'warning',
                            message: 'Kıymet Uyumsuzluğu',
                            category: 'Kıymet',
                            description: 'Birim fiyat referans değerlerin altında.'
                        }
                    ]
                },
                {
                    id: 'h-3',
                    hawbNo: `${declaration.waybillNo}-3`,
                    sequenceNo: '3',
                    buyer: 'Oto Yedek Parça Ltd.',
                    consignor: 'AutoParts Germany',
                    sender: 'AutoParts Germany',
                    receiver: 'Oto Yedek Parça Ltd.',
                    senderCompany: 'AutoParts Germany',
                    receiverCompany: 'Oto Yedek Parça Ltd.',
                    packageType: 'Palet',
                    senderTaxId: 'DE555666777',
                    tradingCountry: 'DE',
                    destinationCountry: 'TR',
                    departureCountry: 'DE',
                    origin: 'DE',
                    gtip: '8708.99.97.90.11',
                    description: 'Fren Balatası Seti (Seramik Kaplamalı)',
                    netWeight: 150.0,
                    weight: 165.2,
                    regime: '4000',
                    fullMeasurement: 50,
                    currency: 'EUR',
                    value: 8450.00,
                    euroAmount: 8450.00,
                    pieces: 2,
                    status: 'Cleared',
                    riskScore: 5,
                    findings: []
                },
                {
                    id: 'h-4',
                    hawbNo: `${declaration.waybillNo}-4`,
                    sequenceNo: '4',
                    buyer: 'Kozmetik Dünyası',
                    consignor: 'Beauty Paris SAS',
                    sender: 'Beauty Paris SAS',
                    receiver: 'Kozmetik Dünyası',
                    senderCompany: 'Beauty Paris SAS',
                    receiverCompany: 'Kozmetik Dünyası',
                    packageType: 'Kutu',
                    senderTaxId: 'FR11223344',
                    tradingCountry: 'FR',
                    destinationCountry: 'TR',
                    departureCountry: 'FR',
                    origin: 'FR',
                    gtip: '3304.99.00.00.00',
                    description: 'Nemlendirici Yüz Kremi (50ml Kavanoz)',
                    netWeight: 5.2,
                    weight: 6.0,
                    regime: '4000',
                    fullMeasurement: 200,
                    currency: 'EUR',
                    value: 4200.75,
                    euroAmount: 4200.75,
                    pieces: 4,
                    status: 'Risk',
                    riskScore: 65,
                    findings: [
                        {
                            id: 'r-4',
                            severity: 'info',
                            message: 'GTİP Kontrolü',
                            category: 'Sınıflandırma',
                            description: 'Kozmetik ürünler için ek analiz gerekebilir.'
                        }
                    ]
                },
                {
                    id: 'h-5',
                    hawbNo: `${declaration.waybillNo}-5`,
                    sequenceNo: '5',
                    buyer: 'Spor Malzemeleri A.Ş.',
                    consignor: 'FitGear USA Inc.',
                    sender: 'FitGear USA Inc.',
                    receiver: 'Spor Malzemeleri A.Ş.',
                    senderCompany: 'FitGear USA Inc.',
                    receiverCompany: 'Spor Malzemeleri A.Ş.',
                    packageType: 'Koli',
                    senderTaxId: 'US99887766',
                    tradingCountry: 'US',
                    destinationCountry: 'TR',
                    departureCountry: 'US',
                    origin: 'CN',
                    gtip: '9506.91.90.00.00',
                    description: 'Profesyonel Koşu Bandı (Ev Tipi)',
                    netWeight: 85.0,
                    weight: 92.5,
                    regime: '4000',
                    fullMeasurement: 1,
                    currency: 'USD',
                    value: 1250.00,
                    euroAmount: 1150.00, // Approx conversion
                    pieces: 1,
                    status: 'Cleared',
                    riskScore: 12,
                    findings: []
                },
                {
                    id: 'h-6',
                    hawbNo: `${declaration.waybillNo}-6`,
                    sequenceNo: '6',
                    buyer: 'Elektronik Market',
                    consignor: 'TechGiant China Ltd.',
                    sender: 'TechGiant China Ltd.',
                    receiver: 'Elektronik Market',
                    senderCompany: 'TechGiant China Ltd.',
                    receiverCompany: 'Elektronik Market',
                    packageType: 'Palet',
                    senderTaxId: 'CN55443322',
                    tradingCountry: 'CN',
                    destinationCountry: 'TR',
                    departureCountry: 'CN',
                    origin: 'CN',
                    gtip: '8471.30.00.00.00',
                    description: 'Dizüstü Bilgisayar (15 inç, 16GB RAM)',
                    netWeight: 240.0,
                    weight: 265.0,
                    regime: '4000',
                    fullMeasurement: 100,
                    currency: 'USD',
                    value: 45000.00,
                    euroAmount: 41400.00,
                    pieces: 5,
                    status: 'Risk',
                    riskScore: 45,
                    findings: [
                        {
                            id: 'r-6',
                            severity: 'info',
                            message: 'Menşe Şahadetnamesi',
                            category: 'Belge Kontrolü',
                            description: 'Menşe belgesi doğrulanamadı.'
                        }
                    ]
                }
            ],
            riskFindings: true ? [ // Force risk findings for demo
                {
                    id: 'gen-1',
                    severity: 'critical',
                    message: 'Yasaklı Madde Şüphesi',
                    category: 'Mutlak Risk',
                    description: 'X-Ray taramasında organik madde yoğunluğu tespit edildi. Fiziksel kontrol gerektirir.',
                    relatedItem: '2025ARK75798 / Kalem 1'
                },
                {
                    id: 'gen-2',
                    severity: 'warning',
                    message: 'Kıymet Düşüklüğü',
                    category: 'Potansiyel Risk',
                    description: 'Genel beyan ortalamasının %20 altında kıymet beyanı.',
                    relatedItem: '2025ARK75798 / Kalem 3'
                },
                {
                    id: 'gen-3',
                    severity: 'info',
                    message: 'GTİP Kontrolü',
                    category: 'AI/ML Bulguları',
                    description: 'Ürün tanımı ile GTİP kodu arasında olası uyumsuzluk.',
                    relatedItem: '2025ARK75798 / Kalem 2'
                },
                {
                    id: 'gen-4',
                    severity: 'warning',
                    message: 'Alıcı Limiti',
                    category: 'Potansiyel Risk',
                    description: 'Alıcı aylık muafiyet limitine (5 adet) yaklaşmıştır.',
                    relatedItem: 'Tüm Beyanname'
                },
                {
                    id: 'gen-5',
                    severity: 'critical',
                    message: 'Marka İhlali',
                    category: 'Mutlak Risk',
                    description: 'Ünlü marka taklidi şüphesi. Numune alınması gerekebilir.',
                    relatedItem: '2025ARK75798 / Kalem 4'
                },
                {
                    id: 'gen-6',
                    severity: 'warning',
                    message: 'Ağırlık Uyumsuzluğu',
                    category: 'Potansiyel Risk',
                    description: 'Beyan edilen ağırlık ile tartım sonucu arasında %10 fark var.',
                    relatedItem: '2025ARK75798 / Kalem 1'
                },
                {
                    id: 'gen-7',
                    severity: 'info',
                    message: 'Yeni Alıcı',
                    category: 'AI/ML Bulguları',
                    description: 'Alıcı sistemde ilk kez işlem yapmaktadır.',
                    relatedItem: 'Tüm Beyanname'
                },
                {
                    id: 'gen-8',
                    severity: 'warning',
                    message: 'Menşei Uyumsuzluğu',
                    category: 'Potansiyel Risk',
                    description: 'Ürün üzerindeki etiket ile beyan edilen menşei ülke farklı.',
                    relatedItem: '2025ARK75798 / Kalem 5'
                },
                {
                    id: 'gen-9',
                    severity: 'critical',
                    message: 'Yaptırım Listesi',
                    category: 'Mutlak Risk',
                    description: 'Gönderici firma uluslararası yaptırım listesinde yer alıyor olabilir.',
                    relatedItem: 'Tüm Beyanname'
                }
            ] : []
        };

        // Force status to Risk for demo visualization if not already
        // transformation happens here, data is set below

        setEtgbData(transformedData);
        if (transformedData.hawbs.length > 0) {
            setSelectedHawb(transformedData.hawbs[0]);
        }
    }, [declaration]);

    if (!etgbData) return null;

    const handleExportExcel = () => {
        Modal.info({ title: 'Export', content: 'Excel export functionality is not implemented yet.' });
    };

    const handlePrintPDF = () => {
        window.print();
    };

    return (
        <div className="flex flex-col gap-4 pb-8 p-6">
            {/* Back Button */}
            <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => router.back()}
                className="w-fit -ml-2 mb-2 flex items-center gap-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100/50 transition-all duration-200 font-medium"
            >
                Listeye Dön
            </Button>

            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-[22px] font-bold text-gray-900">
                            {etgbData.masterInfo.etgbNo}
                        </h1>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold border border-blue-200">
                            İhracat
                        </span>
                    </div>
                    <p className="text-[13px] text-gray-600 mt-1">
                        {etgbData.masterInfo.warehouse} | {etgbData.masterInfo.etgbDate}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExportExcel}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 text-sm font-semibold text-gray-700"
                    >
                        <DownloadOutlined className="w-4 h-4" />
                        Excel'e Aktar
                    </button>
                    <button
                        onClick={handlePrintPDF}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 text-sm font-semibold text-gray-700"
                    >
                        <PrinterOutlined className="w-4 h-4" />
                        PDF Yazdır
                    </button>
                </div>
            </div>

            {/* Statistics Summary */}


            {/* Main Content */}
            <div className="space-y-4">
                {/* Master Header - 8 Fields */}
                <div style={{ paddingTop: 16 }}>
                    <MasterHeader masterInfo={etgbData.masterInfo} />
                </div>

                {/* Risk Analysis Cards Section - Scroller */}
                <div style={{ paddingBottom: 16, marginTop: 32 }}>
                    <RiskCardsScroller riskFindings={etgbData.riskFindings} />
                </div>

                {/* View Switcher Tabs */}
                <div style={{ marginBottom: 16 }}>
                    <Tabs
                        activeKey={viewMode}
                        onChange={(key) => setViewMode(key as ViewMode)}
                        tabBarStyle={{ marginBottom: 0 }}
                        items={[
                            {
                                key: 'flat',
                                label: (
                                    <span style={{ fontSize: 14, fontWeight: 500 }}>
                                        Full Liste Görünümü
                                    </span>
                                )
                            },
                            {
                                key: 'grouped',
                                label: (
                                    <span style={{ fontSize: 14, fontWeight: 500 }}>
                                        Gruplandırılmış Görünüm
                                    </span>
                                )
                            }
                        ]}
                    />
                </div>

                {/* Data Tables */}
                {viewMode === 'grouped' ? (
                    <GroupedView
                        hawbs={etgbData.hawbs}
                        selectedHawb={selectedHawb}
                        onSelectHawb={setSelectedHawb}
                    />
                ) : (
                    <FlatView hawbs={etgbData.hawbs} />
                )}

                {/* Legal Footer */}
                <Card
                    size="small"
                    style={{
                        marginTop: 24,
                        backgroundColor: '#fafafa',
                        borderColor: '#d9d9d9'
                    }}
                >
                    <div style={{ fontSize: 11, color: '#595959', lineHeight: 1.6 }}>
                        <strong>Yasal Uyarı:</strong> Bu belge Gümrük Kanunu ve ilgili yönetmelikler
                        çerçevesinde düzenlenmiştir. Belgedeki bilgilerin doğruluğu ihracatçı firma
                        sorumluluğundadır. ETGB numarasının gümrük idaresince onaylanması ile işlem
                        tamamlanmış sayılır. (Kanun No: 4458, Yönetmelik: 2009/15481)
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default B2CDeclarationDetail;
