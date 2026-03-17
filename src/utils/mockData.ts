import {
  CheckCircleOutlined,
  FieldTimeOutlined,
  FileTextOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import React from 'react'

// KPI Data
export const kpiData = [
  {
    title: 'Toplam Beyanname',
    value: 1240,
    icon: React.createElement(FileTextOutlined, {
      style: { fontSize: '24px', color: '#000000' },
    }),
    bgColor: '#f3f4f6', // gray-100
  },
  {
    title: 'Bekleyen Riskler',
    value: 12,
    icon: React.createElement(WarningOutlined, {
      style: { fontSize: '24px', color: '#ef4444' },
    }), // red-500
    bgColor: '#fee2e2', // red-100
  },
  {
    title: 'İntaç Bekleyenler',
    value: 45,
    icon: React.createElement(FieldTimeOutlined, {
      style: { fontSize: '24px', color: '#f59e0b' },
    }), // amber-500
    bgColor: '#fef3c7', // amber-100
  },
  {
    title: 'Tamamlananlar',
    value: 1183,
    icon: React.createElement(CheckCircleOutlined, {
      style: { fontSize: '24px', color: '#10b981' },
    }), // emerald-500
    bgColor: '#d1fae5', // emerald-100
  },
]

// Area Chart Data (Weekly Trend)
export const trendData = [
  { name: 'Pzt', beyanname: 45 },
  { name: 'Sal', beyanname: 52 },
  { name: 'Çar', beyanname: 38 },
  { name: 'Per', beyanname: 65 },
  { name: 'Cum', beyanname: 48 },
  { name: 'Cmt', beyanname: 20 },
  { name: 'Paz', beyanname: 10 },
]

// Pie Chart Data (Risk Distribution)
export const riskData = [
  { name: 'Düşük', value: 850, color: '#e5e7eb' }, // gray-200
  { name: 'Orta', value: 300, color: '#9ca3af' }, // gray-400
  { name: 'Yüksek', value: 90, color: '#000000' }, // Black (Primary)
]

// Intaç Alert List Data
export const intacAlerts = [
  { id: 'TR-34-001', date: '26.01.2024', firm: 'ABC Lojistik' },
  { id: 'TR-34-002', date: '25.01.2024', firm: 'XYZ Gümrük' },
  { id: 'TR-06-089', date: '24.01.2024', firm: 'Tekno A.Ş.' },
  { id: 'TR-35-112', date: '24.01.2024', firm: 'Mega İthalat' },
  { id: 'TR-34-405', date: '23.01.2024', firm: 'Global Trade' },
]

export interface Declaration {
  key: string
  no: string
  companyId: 'comp_trendyol',
    buyer: string
  seller: string
  status: 'Completed' | 'Pending' | 'Risk' | 'Processing'
  type: 'İthalat' | 'İhracat' | 'ETGB İth.'
  intacDate: string
  absoluteRisks?: Array<string>
  potentialRisks?: Array<string>
  mlRisks?: Array<string>
  regime?: string
  paymentMethod?: string
  incoterm?: string
  items?: Array<DeclarationItem>
  companyId?: string; // RBAC Context Link
  // B2C Specific Fields
  waybillNo?: string;
  grossWeight?: number;
  netWeight?: number;
  packageCount?: number;
  marketplace?: string;
  totalTax?: number;
}

export interface DeclarationItem {
  itemNo: number | string;
  description?: string;
  hsCode?: string;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
  currency?: string;
  tax?: number;
  statisticalValue?: number;
}


export const declarationsList: Array<Declaration> = [
  {
    key: '1',
    no: 'TR-34-2024-001',
    companyId: 'comp_trendyol',
    buyer: 'ABC Lojistik',
    seller: 'Global Tech GmbH',
    status: 'Completed',
    type: 'İthalat',
    intacDate: '26.01.2024',
    absoluteRisks: ['red_1', 'red_2'],
    potentialRisks: ['pot_1'],
    mlRisks: [],
    regime: '4000',
    paymentMethod: 'Peşin',
    incoterm: 'CIF',
  },
  {
    key: '2',
    no: 'TR-34-2024-002',
    companyId: 'comp_trendyol',
    buyer: 'XYZ Gümrük',
    seller: 'Shanghai Trading Co.',
    status: 'Pending',
    type: 'İthalat',
    intacDate: '-',
    absoluteRisks: [],
    potentialRisks: ['pot_2', 'pot_3'],
    mlRisks: ['ML_1'],
    regime: '1000',
    paymentMethod: 'Peşin',
    incoterm: 'FOB',
  },
  {
    key: '3',
    no: 'TR-06-2024-089',
    companyId: 'comp_trendyol',
    buyer: 'Tekno A.Ş.',
    seller: 'EuroParts Ltd.',
    status: 'Risk',
    type: 'İthalat',
    intacDate: '-',
    absoluteRisks: ['red_3', 'red_8'],
    potentialRisks: [],
    mlRisks: ['ML_2'],
    regime: '3151',
    paymentMethod: 'Peşin',
    incoterm: 'EXW',
  },
  {
    key: '4',
    no: 'TR-35-2024-112',
    companyId: 'comp_trendyol',
    buyer: 'Mega İthalat',
    seller: 'US Electronics Inc.',
    status: 'Processing',
    type: 'İthalat',
    intacDate: '-',
    absoluteRisks: [],
    potentialRisks: [],
    mlRisks: ['ML_3'],
    regime: '4071',
    paymentMethod: 'Peşin',
    incoterm: 'DAP',
  },
  {
    key: '5',
    no: 'TR-34-2024-405',
    companyId: 'comp_trendyol',
    buyer: 'Global Trade',
    seller: 'Fabricca Italiana',
    status: 'Completed',
    type: 'İthalat',
    intacDate: '25.01.2024',
    regime: '7100',
    paymentMethod: 'Peşin',
    incoterm: 'FCA',
  },
  {
    key: '6',
    no: 'TR-01-2024-332',
    companyId: 'comp_trendyol',
    buyer: 'Adana Tarım',
    seller: 'Agro Rus',
    status: 'Pending',
    type: 'İthalat',
    intacDate: '-',
    regime: '4000',
    paymentMethod: 'Peşin',
    incoterm: 'CIP',
  },
  {
    key: '7',
    no: 'TR-16-2024-554',
    companyId: 'comp_trendyol',
    buyer: 'Bursa Otomotiv',
    seller: 'German Auto Parts',
    status: 'Risk',
    type: 'İthalat',
    intacDate: '-',
    regime: '3153',
    paymentMethod: 'Peşin',
    incoterm: 'CFR',
  },
  {
    key: '8',
    no: 'TR-34-2024-778',
    companyId: 'comp_trendyol',
    buyer: 'İstanbul Kimya',
    seller: 'ChemChina',
    status: 'Completed',
    type: 'İthalat',
    intacDate: '24.01.2024',
    regime: '4000',
    paymentMethod: 'Peşin',
    incoterm: 'CIF',
  },
  {
    key: '9',
    no: 'TR-07-2024-991',
    companyId: 'comp_trendyol',
    buyer: 'Antalya Turizm',
    seller: 'Hotel Supplies UK',
    status: 'Processing',
    type: 'İthalat',
    intacDate: '-',
    regime: '4000',
    paymentMethod: 'Peşin',
    incoterm: 'EXW',
  },
  {
    key: '10',
    no: 'TR-34-2024-101',
    companyId: 'comp_trendyol',
    buyer: 'Ege Seramik',
    seller: 'Ceramica Esp',
    status: 'Completed',
    type: 'İhracat',
    intacDate: '22.01.2024',
    regime: '1000',
    paymentMethod: 'Peşin',
    incoterm: 'FOB',
  },
  {
    key: '11',
    no: 'TR-61-2024-055',
    companyId: 'comp_trendyol',
    buyer: 'Trabzon Gıda',
    seller: 'Black Sea Traders',
    status: 'Pending',
    type: 'İhracat',
    intacDate: '-',
    regime: '1000',
    paymentMethod: 'Peşin',
    incoterm: 'FCA',
  },
  {
    key: '12',
    no: 'TR-34-2024-882',
    companyId: 'comp_trendyol',
    buyer: 'Marmara Tekstil',
    seller: 'Indian Fabrics',
    status: 'Risk',
    type: 'İthalat',
    intacDate: '-',
    regime: '4071',
    paymentMethod: 'Peşin',
    incoterm: 'CIF',
  },
]

export const b2cDeclarations: Array<Declaration> = [
  {
    key: 'b2c_1',
    no: '1245415415',
    companyId: 'comp_trendyol',
    buyer: 'YURTDIŞI FİRMA',
    seller: 'EVRİM YAZILIM VE DANIŞMANLIK TİC.LTD.ŞTİ.',
    status: 'Completed',
    type: 'ETGB İth.',
    intacDate: '26.02.2026',
    absoluteRisks: [],
    potentialRisks: [],
    mlRisks: [],
    paymentMethod: 'Peşin',
    incoterm: 'DAP',
    waybillNo: '1245415415',
    grossWeight: 300,
    netWeight: 200,
    packageCount: 0,
    marketplace: '',
    totalTax: 3908.04,
    items: [
      {
        itemNo: 1,
        description: '', // Empty in XML
        hsCode: '8517',
        totalPrice: 150,
        currency: 'EUR',
        statisticalValue: 174.71
      }
    ]
  },
  {
    key: 'b2c_2',
    no: '124578448',
    companyId: 'comp_trendyol',
    buyer: 'AVRASYA KO G L MA MEKANİK BAKIM HİZM.SAN. VE TİC.',
    seller: 'SECURITAS TEKNOLOJI HIZMETLERI',
    status: 'Processing',
    type: 'ETGB İth.',
    intacDate: '-',
    absoluteRisks: [],
    potentialRisks: ['pot_2'],
    mlRisks: [],
    paymentMethod: 'Peşin',
    incoterm: 'DAP',
    waybillNo: '124578448',
    grossWeight: 300,
    netWeight: 200,
    packageCount: 0,
    marketplace: 'Trendyol',
    totalTax: 2302.24,
    items: [
      {
        itemNo: 1,
        description: '',
        hsCode: '99302400',
        totalPrice: 150,
        currency: 'EUR',
        statisticalValue: 174.71
      }
    ]
  },
  {
    key: 'b2c_3',
    no: '451545454',
    companyId: 'comp_trendyol',
    buyer: 'AVRASYA KO G L MA MEKANİK BAKIM HİZM.SAN. VE TİC.',
    seller: 'EVRİM YAZILIM VE DANIŞMANLIK TİC.LTD.ŞTİ.',
    status: 'Pending',
    type: 'ETGB İth.',
    intacDate: '-',
    absoluteRisks: [],
    potentialRisks: [],
    mlRisks: ['ML_1'],
    paymentMethod: 'Peşin',
    incoterm: 'DAP',
    waybillNo: '451545454',
    grossWeight: 600,
    netWeight: 500,
    packageCount: 0,
    marketplace: 'Trendyol',
    totalTax: 1549.88,
    items: [
      {
        itemNo: 1,
        description: '',
        hsCode: '99302400',
        totalPrice: 100,
        currency: 'EUR',
        statisticalValue: 116.47
      }
    ]
  },
  {
    key: 'b2c_4',
    no: '897989878',
    companyId: 'comp_trendyol',
    buyer: 'YURTDIŞI FİRMA',
    seller: 'EVRİM YAZILIM VE DANIŞMANLIK TİC.LTD.ŞTİ.',
    status: 'Completed',
    type: 'ETGB İth.',
    intacDate: '15.02.2026',
    absoluteRisks: [],
    potentialRisks: [],
    mlRisks: [],
    paymentMethod: 'Peşin',
    incoterm: 'DAP',
    waybillNo: '897989878',
    grossWeight: 400,
    netWeight: 350,
    packageCount: 0,
    marketplace: '',
    totalTax: 0,
    items: [
      {
        itemNo: 1,
        description: '',
        hsCode: '99302400',
        totalPrice: 100,
        currency: 'EUR',
        statisticalValue: 116.47
      }
    ]
  },
  {
    key: 'b2c_5',
    no: 'tasıma1',
    companyId: 'comp_trendyol',
    buyer: 'aaaa',
    seller: 'bbb',
    status: 'Risk',
    type: 'ETGB İth.',
    intacDate: '-',
    absoluteRisks: ['red_1'],
    potentialRisks: [],
    mlRisks: [],
    paymentMethod: 'Peşin',
    incoterm: 'DAP',
    waybillNo: 'tasıma1',
    grossWeight: 5000,
    netWeight: 4000,
    packageCount: 10,
    marketplace: '',
    totalTax: 0,
    items: [
      {
        itemNo: 1,
        description: '25343100IM00126825',
        hsCode: '39269097',
        totalPrice: 0.15,
        currency: 'EUR',
        statisticalValue: 0.17
      },
      {
        itemNo: 2,
        description: '',
        hsCode: '39269097',
        totalPrice: 11,
        currency: 'EUR',
        statisticalValue: 12.81
      }
    ]
  },
  {
    key: 'b2c_6',
    no: 'tasıma2',
    companyId: 'comp_trendyol',
    buyer: 'EVRİM YAZILIM VE DANIŞMANLIK TİCARET A.Ş.',
    seller: 'EVRİM YAZILIM',
    status: 'Pending',
    type: 'ETGB İth.',
    intacDate: '-',
    absoluteRisks: [],
    potentialRisks: [],
    mlRisks: [],
    paymentMethod: 'Peşin',
    incoterm: 'DAP',
    waybillNo: 'tasıma2',
    grossWeight: 1200,
    netWeight: 200,
    packageCount: 0,
    marketplace: '',
    totalTax: 0
  }
]

export const mockXmlData = `<?xml version="1.0" encoding="UTF-8"?>
<Declaration xmlns="urn:customs.gov.tr:declaration:v1">
  <Header>
    <DeclarationNo>TR-34-2024-001</DeclarationNo>
    <Date>2024-01-26</Date>
    <Type>IMPORT</Type>
    <CustomsOffice>Istanbul Havalimani (3400)</CustomsOffice>
  </Header>
  <Parties>
    <Buyer>
      <Name>ABC Lojistik A.Ş.</Name>
      <TaxID>1234567890</TaxID>
      <Address>Maslak Mah. Büyükdere Cad. No:1, Istanbul</Address>
    </Buyer>
    <Seller>
      <Name>Global Tech GmbH</Name>
      <Country>DE</Country>
      <Address>Industriestrasse 5, Berlin, Germany</Address>
    </Seller>
  </Parties>
  <Goods>
    <Item>
      <Sequence>1</Sequence>
      <Description>Electronic Components (Integrated Circuits)</Description>
      <HSCode>8542.31.00.00.00</HSCode>
      <Quantity unit="KG">150</Quantity>
      <Value currency="EUR">25000</Value>
    </Item>
    <Item>
      <Sequence>2</Sequence>
      <Description>Printed Circuit Boards</Description>
      <HSCode>8534.00.11.00.00</HSCode>
      <Quantity unit="KG">50</Quantity>
      <Value currency="EUR">5000</Value>
    </Item>
  </Goods>
  <Financial>
    <TotalInvoiceAmount currency="EUR">30000</TotalInvoiceAmount>
    <Freight currency="USD">1200</Freight>
    <Insurance currency="USD">150</Insurance>
  </Financial>
</Declaration>`

export const declarationRisks = [
  {
    id: 1,
    code: 'red_1',
    itemNo: 1,
    ruleName: 'VKN Uyumsuzluğu',
    subject: 'Alıcı Bilgileri',
    details:
      'Alıcı adresi vergi kimlik numarası (VKN) kayıtları ile örtüşmüyor. Lütfen ticaret sicil gazetesini kontrol ediniz.',
    severity: 'high',
  },
  {
    id: 2,
    code: 'red_2',
    itemNo: '-',
    ruleName: 'Menşe Belgesi',
    subject: 'Belge Eksikliği',
    details:
      'İthalat yapılan ülke için zorunlu olan Menşe Şahadetnamesi sisteme yüklenmemiştir.',
    severity: 'high',
  },
  {
    id: 3,
    code: 'pot_1',
    itemNo: 2,
    ruleName: 'GTİP Tutarsızlığı',
    subject: 'Tarife Sınıflandırması',
    details:
      'Beyan edilen GTİP kodu (8534.00) geçmiş beyannamelerdeki tarife geçmişi ile farklılık gösteriyor.',
    severity: 'medium',
  },
]

export const declarationFiles = [
  {
    id: 1,
    name: 'Fatura_2024_001.pdf',
    type: 'Invoice',
    size: '1.2 MB',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: 2,
    name: 'Packing_List.pdf',
    type: 'Packing List',
    size: '850 KB',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: 3,
    name: 'ATR_Belgesi.pdf',
    type: 'Certificate',
    size: '2.4 MB',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
]

export const riskDetails: Record<
  string,
  { code: string; subject: string; details: string; relatedItem: string }
> = {
  red_1: {
    code: 'Mutlak Risk - red_1',
    subject: 'VKN Uyumsuzluğu',
    details:
      'Alıcı adresi vergi kimlik numarası (VKN) kayıtları ile örtüşmüyor. Lütfen ticaret sicil gazetesini kontrol ediniz.',
    relatedItem: 'Kalem 1: Elektronik Kart',
  },
  red_2: {
    code: 'Mutlak Risk - red_2',
    subject: 'Menşe Belgesi',
    details:
      'İthalat yapılan ülke için zorunlu olan Menşe Şahadetnamesi sisteme yüklenmemiştir.',
    relatedItem: '-',
  },
  red_3: {
    code: 'Mutlak Risk - red_3',
    subject: 'Yasaklı Gönderici',
    details: 'Gönderici firma uluslararası yaptırım listesinde bulunmaktadır.',
    relatedItem: 'Tüm Kalemler',
  },
  red_8: {
    code: 'Mutlak Risk - red_8',
    subject: 'Kıymet Tespit',
    details:
      'Beyan edilen birim fiyat, emsal değerlerin %40 altında kalmaktadır.',
    relatedItem: 'Kalem 3: Motor Parçası',
  },
  pot_1: {
    code: 'Potansiyel Risk - pot_1',
    subject: 'GTİP Tutarsızlığı',
    details:
      'Beyan edilen GTİP kodu geçmiş beyannamelerdeki tarife geçmişi ile farklılık gösteriyor.',
    relatedItem: 'Kalem 2: Plastik Hammadde',
  },
  pot_2: {
    code: 'Potansiyel Risk - pot_2',
    subject: 'Ağırlık Sapması',
    details:
      'Brüt ağırlık ile net ağırlık arasındaki fark olağan limitlerin dışındadır.',
    relatedItem: 'Kalem 1',
  },
  pot_3: {
    code: 'Potansiyel Risk - pot_3',
    subject: 'Rota Sapması',
    details:
      'Sevkiyat rotası, olağan lojistik güzergahlarından farklılık göstermektedir.',
    relatedItem: '-',
  },
  ML_1: {
    code: 'AI-ML Bulgusu - ML_1',
    subject: 'Anomali Tespiti',
    details:
      'Yapay zeka modelleri, bu beyannamede %85 olasılıkla vergi kaçağı riski tespit etmiştir.',
    relatedItem: 'Genel',
  },
  ML_2: {
    code: 'AI-ML Bulgusu - ML_2',
    subject: 'Tarife Tahmini',
    details: 'Sistem, ürün tanımı ile GTİP arasında uyumsuzluk öngörmektedir.',
    relatedItem: 'Kalem 5',
  },
  ML_3: {
    code: 'AI-ML Bulgusu - ML_3',
    subject: 'Değerleme Riski',
    details:
      'Bölgesel fiyatlandırma analizine göre düşük matrah riski bulunmaktadır.',
    relatedItem: 'Genel',
  },
}
