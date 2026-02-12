import { useState } from 'react';
import { mockDeclarations, ExtendedDeclaration, ShippingInsurance, Tax } from './mockData';
import {
    FileText,
    Calendar,
    Truck,
    CreditCard,
    Package,
    DollarSign,
    Receipt,
    Download,
    Eye,
    Globe,
    MapPin,
    Shield,
    TrendingUp,
    AlertCircle,
    AlertTriangle,
    Info,
    ChevronRight
} from 'lucide-react';

interface ErrorCard {
    id: string;
    title: string;
    description: string;
    severity: 'critical' | 'warning' | 'info';
    category: string;
    field?: string;
    suggestion?: string;
    itemNumber?: string;
}

const mockErrors: ErrorCard[] = [
    {
        id: '1',
        title: 'GTIP - Eşya Tanımı Uyumu',
        description: 'Kalem bazında net ağırlık başına toplam yurt dışı gideri ile tüm beyanname kalemlerine ait yurt dışı gider ortalaması arasında %15 üstü sapma bulunmaktadır.',
        severity: 'critical',
        category: 'Net kilo başına yurt dışı gider ortalaması: 259.79 TL\'dir. İlgili kalemin net kilo başına yurt dışı gider tutarı 300.55 TL\'dir.',
        field: 'GTIP',
        suggestion: 'Tarife Sınıflandırması',
        itemNumber: '1'
    },
    {
        id: '2',
        title: 'CIF Teslim - Sigorta Kontrolü',
        description: 'CIF teslim şeklinde yapılan beyanname için sigorta bilgisi eksik veya hatalı girilmiştir. Kıymet beyanında tutarsızlık tespit edilmiştir.',
        severity: 'warning',
        category: 'Beyan edilen sigorta tutarı: 0.00 TL. CIF teslimat için minimum sigorta oranı: %0.5 olmalıdır. Eksik tutar: ~4.250 TL.',
        field: 'Sigorta Tutarı',
        suggestion: 'CIF teslim şekli seçilmiş ancak sigorta tutarı %0 olarak girilmiş.',
        itemNumber: 'Genel'
    },
    {
        id: '3',
        title: 'Menşe Belgesi Zorunluluğu',
        description: 'Tercihli tarife uygulaması için gerekli olan menşe şahadetnamesi veya menşe beyanı belgesi sisteme yüklenmemiştir.',
        severity: 'critical',
        category: 'EUR.1 menşe belgesi gereklidir. Antlaşma kodu: BK (Birleşik Krallık). Etkilenen kalem adedi: 2. Potansiyel vergi farkı: ~8.500 TL.',
        field: 'EUR.1',
        suggestion: 'BK antlaşması kapsamındaki kalemler için menşe şahadetnamesi eksiktir.',
        itemNumber: '1, 3'
    },
    {
        id: '4',
        title: 'Döviz Kuru Farkı Analizi',
        description: 'Beyanname tarihinde kullanılan döviz kuru ile TCMB güncel kuru arasında önemli fark tespit edilmiştir. Kur farkından kaynaklı vergi değişikliği olabilir.',
        severity: 'warning',
        category: 'Beyanname kuru: 34.15 TL/EUR. TCMB güncel kur: 36.25 TL/EUR. Fark oranı: %6.14. Potansiyel kıymet farkı: ~2.100 TL.',
        field: 'Kur Farkı',
        suggestion: 'Beyan tarihi ile güncel TCMB kuru arasında %5\'ten fazla fark bulunmaktadır.',
        itemNumber: 'Genel'
    },
    {
        id: '5',
        title: 'İstatistik Değeri Kontrolü',
        description: 'Kalem istatistik değeri hesaplamasında tutarsızlık tespit edilmiştir. Miktar birimi ve değer bilgisi uyumsuzluğu bulunmaktadır.',
        severity: 'info',
        category: 'Beyan edilen miktar: 16.000 KG. İstatistik değeri girilmemiş. Birim değer kontrolü yapılamamıştır.',
        field: 'İstatistik Değeri',
        suggestion: 'Miktar birimi KGM olan kalemde istatistik değeri girilmemiş.',
        itemNumber: '2'
    },
    {
        id: '6',
        title: 'Ödeme Belgesi Eksikliği',
        description: 'Peşin ödeme şekli seçilmiş ancak ödeme dekont belgesi veya banka transfer belgesi sisteme yüklenmemiştir.',
        severity: 'info',
        category: 'Ödeme şekli: Peşin. Toplam tutar: 850.000 TL. Beklenen belge: Swift dekont veya banka transfer belgesi.',
        field: 'Ödeme Dekontu',
        suggestion: 'Ödeme dekontunu belge yönetiminden ekleyebilirsiniz.',
        itemNumber: 'Genel'
    },
];

export default function DeclarationRisksTab() {
    const [selectedDeclaration] = useState<ExtendedDeclaration>(mockDeclarations[0]);
    const [activeTab, setActiveTab] = useState<'risks' | 'documents' | 'history'>('risks');

    const criticalCount = mockErrors.filter(e => e.severity === 'critical').length;
    const warningCount = mockErrors.filter(e => e.severity === 'warning').length;
    const infoCount = mockErrors.filter(e => e.severity === 'info').length;

    const totalShippingTRY = selectedDeclaration.shippingInsurance.reduce(
        (sum: number, item: ShippingInsurance) => sum + item.totalInvoiceTRY,
        0
    );

    const totalPaidTaxes = selectedDeclaration.paidTaxes.reduce(
        (sum: number, tax: Tax) => sum + tax.calculatedTax,
        0
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {selectedDeclaration.declarationNumber}
                        </h1>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold border border-blue-200">
                            İthalat
                        </span>
                    </div>
                    <p className="text-gray-600 mt-1">
                        İstanbul Havaalimanı (ISL00) | {new Date(selectedDeclaration.date).toLocaleDateString('tr-TR')}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Eye className="w-4 h-4" />
                        XML İndir
                    </button>
                    <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all flex items-center gap-2 text-sm font-semibold">
                        TCGB Statü Güncelle
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex gap-8">
                    <button
                        onClick={() => setActiveTab('risks')}
                        className={`pb-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'risks'
                            ? 'border-gray-900 text-gray-900'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Beyanname ve Riskler
                    </button>
                    <button
                        onClick={() => setActiveTab('documents')}
                        className={`pb-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'documents'
                            ? 'border-gray-900 text-gray-900'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Arşiv Dokümanları
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`pb-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'history'
                            ? 'border-gray-900 text-gray-900'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        İşlem Geçmişi
                    </button>
                </nav>
            </div>

            {/* Content */}
            {activeTab === 'risks' && (
                <>
                    {/* Stats Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                                    <AlertCircle className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Mutlak Risk</p>
                                    <p className="text-3xl font-bold text-gray-900">{criticalCount}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Potansiyel Risk</p>
                                    <p className="text-3xl font-bold text-gray-900">{warningCount}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                                    <Info className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">AI & ML</p>
                                    <p className="text-3xl font-bold text-gray-900">{infoCount}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-12 gap-6">
                        {/* Left Side - Blue Card + Sections */}
                        <div className="col-span-12 lg:col-span-7 space-y-6">
                            {/* Blue Declaration Card */}
                            <div className="bg-gradient-to-br from-[#2563EB] via-[#1d4ed8] to-[#1e40af] rounded-xl p-6 shadow-lg">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                                            <FileText className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">
                                                {selectedDeclaration.declarationNumber}
                                            </h2>
                                            <p className="text-blue-100 text-sm mt-1">Beyanname Detayları</p>
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-lg border border-white/30 transition-all flex items-center gap-2 text-sm font-semibold">
                                        <Eye className="w-4 h-4" />
                                        Görüntüle
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
                                        <p className="text-xs text-blue-100 font-medium mb-1">Tarih</p>
                                        <p className="text-white font-bold text-sm">
                                            {new Date(selectedDeclaration.date).toLocaleDateString('tr-TR')}
                                        </p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
                                        <p className="text-xs text-blue-100 font-medium mb-1">Teslim Şekli</p>
                                        <p className="text-white font-bold text-sm">{selectedDeclaration.deliveryType}</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
                                        <p className="text-xs text-blue-100 font-medium mb-1">Ödeme</p>
                                        <p className="text-white font-bold text-sm">{selectedDeclaration.paymentType}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Company Info */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-white rounded-xl border border-gray-200 p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <Globe className="w-4 h-4 text-gray-700" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">Gönderici Ülke</p>
                                            <p className="font-bold text-gray-900 text-sm">{selectedDeclaration.sender.country}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-600">{selectedDeclaration.sender.name}</p>
                                </div>

                                <div className="bg-white rounded-xl border border-gray-200 p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <MapPin className="w-4 h-4 text-gray-700" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">Çıkış Ülkesi</p>
                                            <p className="font-bold text-gray-900 text-sm">{selectedDeclaration.exitCountry}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl border border-gray-200 p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <Shield className="w-4 h-4 text-gray-700" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">Rejim Kodu</p>
                                            <p className="font-bold text-gray-900 text-sm">{selectedDeclaration.regimeCode}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Navlun & Sigorta + Ödenen Vergiler */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-5 h-5 text-gray-700" />
                                            <h3 className="font-bold text-gray-900 text-sm">Navlun & Sigorta</h3>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="space-y-3 max-h-[240px] overflow-y-auto">
                                            {selectedDeclaration.shippingInsurance.slice(0, 2).map((item, index) => (
                                                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                                        <div>
                                                            <p className="text-gray-500 mb-1">Toplam Fatura</p>
                                                            <p className="font-bold text-gray-900">
                                                                ₺{item.totalInvoiceTRY.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-500 mb-1">PBC</p>
                                                            <p className="font-bold text-gray-900">{item.pbc}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-500 mb-1">Navlun</p>
                                                            <p className="font-semibold text-gray-700">
                                                                ₺{item.shipping.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-500 mb-1">Sigorta</p>
                                                            <p className="font-semibold text-gray-700">
                                                                ₺{item.insurance.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs font-semibold text-gray-600">Toplam (TRY)</p>
                                                <p className="text-lg font-bold text-blue-600">
                                                    ₺{totalShippingTRY.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                                        <div className="flex items-center gap-2">
                                            <Receipt className="w-5 h-5 text-gray-700" />
                                            <h3 className="font-bold text-gray-900 text-sm">Ödenen Vergiler</h3>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="space-y-2">
                                            {selectedDeclaration.paidTaxes.slice(0, 2).map((tax, index) => (
                                                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="font-semibold text-gray-900 text-xs">{tax.taxType}</p>
                                                        <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs font-bold">
                                                            %{tax.rate}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                                        <div>
                                                            <p className="text-gray-500 mb-1">Matrah</p>
                                                            <p className="font-semibold text-gray-700">
                                                                ₺{tax.base.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-500 mb-1">Hesaplanan</p>
                                                            <p className="font-bold text-gray-900">
                                                                ₺{tax.calculatedTax.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs font-semibold text-gray-600">Toplam Vergi</p>
                                                <p className="text-lg font-bold text-green-600">
                                                    ₺{totalPaidTaxes.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Error/Risk Cards */}
                        <div className="col-span-12 lg:col-span-5">
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <div className="p-4 border-b border-gray-200 bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                            <AlertCircle className="w-5 h-5 text-red-600" />
                                            Hata Kontrolleri ({mockErrors.length})
                                        </h3>
                                        <span className="px-3 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-bold border border-red-200">
                                            {criticalCount} Mutlak
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 space-y-3 max-h-[calc(100vh-380px)] overflow-y-auto">
                                    {mockErrors.map((error, index) => {
                                        const iconConfig = error.severity === 'critical'
                                            ? {
                                                icon: AlertCircle,
                                                color: 'text-red-700',
                                                bg: 'bg-red-50',
                                                label: 'Mutlak Risk',
                                                labelBg: 'bg-red-100 text-red-800 border-red-200',
                                                cardBg: 'bg-red-50',
                                                cardBorder: 'border-red-200',
                                                cardHover: 'hover:border-red-300 hover:bg-red-100'
                                            }
                                            : error.severity === 'warning'
                                                ? {
                                                    icon: AlertTriangle,
                                                    color: 'text-yellow-700',
                                                    bg: 'bg-yellow-50',
                                                    label: 'Potansiyel Risk',
                                                    labelBg: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                                                    cardBg: 'bg-yellow-50',
                                                    cardBorder: 'border-yellow-200',
                                                    cardHover: 'hover:border-yellow-300 hover:bg-yellow-100'
                                                }
                                                : {
                                                    icon: Info,
                                                    color: 'text-purple-700',
                                                    bg: 'bg-purple-50',
                                                    label: 'AI & ML Risk',
                                                    labelBg: 'bg-purple-100 text-purple-800 border-purple-200',
                                                    cardBg: 'bg-purple-50',
                                                    cardBorder: 'border-purple-200',
                                                    cardHover: 'hover:border-purple-300 hover:bg-purple-100'
                                                };

                                        const Icon = iconConfig.icon;

                                        return (
                                            <div
                                                key={error.id}
                                                className={`${iconConfig.cardBg} border-2 ${iconConfig.cardBorder} rounded-lg ${iconConfig.cardHover} transition-all shadow-sm`}
                                            >
                                                <div className="p-3">
                                                    {/* Header */}
                                                    <div className="flex items-start gap-2 mb-2">
                                                        <div className={`w-9 h-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                                            <Icon className={`w-5 h-5 ${iconConfig.color}`} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-2 mb-1.5">
                                                                <h4 className="font-bold text-gray-900 text-xs leading-tight">
                                                                    {error.title}
                                                                </h4>
                                                                <span className="text-[10px] text-gray-700 font-bold flex-shrink-0 bg-white px-1.5 py-0.5 rounded shadow-sm border border-gray-200">
                                                                    Kalem: {error.itemNumber}
                                                                </span>
                                                            </div>
                                                            <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${iconConfig.labelBg}`}>
                                                                {iconConfig.label}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="space-y-1.5">
                                                        <div className="bg-white/80 rounded-md p-2 border border-gray-200">
                                                            <p className="text-[10px] font-bold text-gray-700 mb-1">KONU</p>
                                                            <p className="text-[11px] text-gray-700 leading-relaxed">{error.description}</p>
                                                        </div>

                                                        <div className="bg-white/80 rounded-md p-2 border border-gray-200">
                                                            <p className="text-[10px] font-bold text-gray-700 mb-1">DEĞER</p>
                                                            <p className="text-[11px] text-gray-700 leading-relaxed">{error.category}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'documents' && (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Arşiv Dokümanları</p>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">İşlem Geçmişi</p>
                </div>
            )}
        </div>
    );
}
