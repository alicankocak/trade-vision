import React, { useRef, useState, useEffect, ReactNode } from 'react';
import { Card, Tabs, Descriptions, Table, Tag, Statistic, Row, Col, Badge, Button, Menu, Typography } from 'antd';
import { 
  FileTextOutlined, WarningOutlined, DollarOutlined, CarOutlined, SafetyOutlined, ShoppingOutlined,
  BankOutlined, GlobalOutlined, CalendarOutlined, UserOutlined, LeftOutlined, RightOutlined,
  InfoCircleOutlined, CloseCircleOutlined, DownloadOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { TabPane } = Tabs;
const { Paragraph } = Typography;

// --- Interfaces ---
export interface KalemItem {
  siraNo: number;
  gtip: string;
  kalemAciklamasi: string;
  mense: string;
  miktar: number;
  birim: string;
  brutAgirlik: number;
  netAgirlik: number;
  faturaBedeli: number;
  riskSayisi: number;
}
export interface KalemRisk {
  id: string;
  kalemSiraNo: number;
  riskBaslik: string;
  oncelikDurumu: string;
  riskKonu: string;
  riskAciklama: string;
}
export interface RiskFinding {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  category: string;
  message: string;
  description?: string;
  relatedItem?: string;
}

// --- Mock Data ---
export const mockBeyanameDetay = {
  beyanameNo: 'IM20260000000001',
  durum: 'İşlem Görüyor',
  coverInfo: {
    rejim: '4000',
    toplamRiskSayisi: 3,
    agumruk: '344600',
    cikisGumruk: '344600',
    belgeler: ['0088 - Fatura', '0100 - ATR Belgesi']
  },
  beyanameRiskleri: [
    {
      id: "1",
      severity: "critical",
      category: "GTIP Uyumu",
      message: "Net ağırlık tutarsızlığı var",
      description: "Kalem bazında ağırlık tutarsızlığı tespit edildi.",
      relatedItem: "Kalem 1"
    },
    {
      id: "2",
      severity: "warning",
      category: "Kıymet Analizi",
      message: "Referans fiyat sapması",
      description: "Beyan edilen kıymet referans kıymetin %10 altında.",
      relatedItem: "Kalem 1, 3"
    },
    {
      id: "3",
      severity: "info",
      category: "AI Bildirimi",
      message: "Belge İncelemesi",
      description: "Benzer ithalatlarda ATR belgesi eksikliği görülmüştür.",
      relatedItem: "Genel"
    },
    {
      id: "4",
      severity: "critical",
      category: "Vergi Uyumu",
      message: "Hesaplanan vergi uyumsuz",
      description: "Sistem tarafından hesaplanan vergi tutarı ile beyan edilen tutar arasında %5 fark var.",
      relatedItem: "Genel"
    }
  ] as RiskFinding[],
  beyannameBilgileri: {
    alici: "ABC LTD. ŞTİ.",
    gonderici: "XYZ GMBH",
    beyanSahibi: "TEST GÜMRÜK MÜŞ.",
    sevkUlkesi: "Almanya",
    ticaretUlkesi: "Almanya",
    cikisUlkesi: "Almanya",
    kapadedi: 10,
    teslimSekli: "DAP",
    teslimYeri: "İSTANBUL",
    aliciSaticiIliskisi: "Yok",
    antrepo: "A3400"
  },
  faturaBilgileri: {
    faturaBedeli: 15400.50,
    kurTarihi: "12.03.2024",
    dovizAlis: 34.15,
    dovisSatis: 34.20,
    odemeSekli: "Peşin",
    banka: "Akbank",
    sozlesme: "S-123",
    odemeAraci: "Havale",
    odemeYontemi: "SWIFT"
  },
  genelVergiBilgileri: {
    toplamVergi: 2500.00,
    pesinToplam: 1000.00,
    teminatToplami: 1500.00
  },
  tasimaBilgileri: {
    tasimaSekli: "Kara Yolu",
    nakliyeciFirma: "Logistics Corp",
    liman: "Ambarlı",
    konteynerSayisi: 2,
    sinirdakiAracTipi: "TIR",
    sinirdakiAracKimligi: "34 ABC 123",
    aracUlkeKodu: "TR",
    cikistakiAracTipi: "TIR",
    cikistakiAracKimligi: "34 ABC 123",
    cikistakiAracUlkeKodu: "TR",
    yuklemeBoşaltmaYeri: "İstanbul",
    esyaninBulunduguYer: "Antrepo A",
    girisGumruk: "Kapıkule",
    cikisGumruk: "Kapıkule",
    basitUsul: "Hayır"
  },
  yurtdisiTutarlar: {
    komisyon: 0, demuraj: 0, royalti: 0, faiz: 0, gozetimKayitFarki: 0, navlun: 1000, sigorta: 50, fob: 14350.50, yurtdisiToplam: 1050
  },
  yurticiTutarlar: {
    kkdf: 0, cevre: 0, tahliye: 0, liman: 0, banka: 0, depolama: 500, kultur: 0, diger: 0, bandrol: 0, gzammi: 0, kdvGider: 0
  },
  teminatBilgileri: [
    {
      teminatSekli: "Nakit",
      tutari: 1500,
      orani: 10,
      sayisi: 1,
      nakitTutar: 1500,
      bankaTutari: 0
    }
  ],
  kalemler: [
    { siraNo: 1, gtip: "8471.30.00.00.00", kalemAciklamasi: "Dizüstü Bilgisayar", mense: "China", miktar: 10, birim: "Adet", brutAgirlik: 25.5, netAgirlik: 20.0, faturaBedeli: 10000, riskSayisi: 1 }
  ] as KalemItem[],
  kalemRiskleri: [
    {
      id: "r1",
      kalemSiraNo: 1,
      riskBaslik: "Kıymet Analizi",
      oncelikDurumu: "medium",
      riskKonu: "Referans fiyat sapması",
      riskAciklama: "Beyan edilen kıymet referans kıymetin %10 altında."
    }
  ] as KalemRisk[]
};

// --- Custom Components ---

export const NavigationSidebar = ({ items, activeKey, onChange }: any) => (
  <div style={{ width: 250 }}>
    <Menu 
      mode="inline" 
      selectedKeys={[activeKey]} 
      onClick={(e) => onChange(e.key)}
      items={items}
      style={{ borderRight: 'none', background: 'transparent' }}
      className="custom-sidebar-menu"
    />
    <style>
      {`
        .custom-sidebar-menu.ant-menu {
          background: transparent !important;
        }
        .custom-sidebar-menu .ant-menu-item {
          border-radius: 8px !important;
          margin-bottom: 8px !important;
          color: #595959 !important;
          font-weight: 500 !important;
          transition: all 0.3s ease !important;
        }
        .custom-sidebar-menu .ant-menu-item:hover {
          color: #1677ff !important;
          background: rgba(22, 119, 255, 0.04) !important;
        }
        .custom-sidebar-menu .ant-menu-item-selected {
          color: #1677ff !important;
          background: rgba(22, 119, 255, 0.1) !important;
          font-weight: 600 !important;
        }
        .custom-sidebar-menu .ant-menu-item::after {
          display: none !important;
        }
      `}
    </style>
  </div>
);

export const InfoCard = ({ title, icon, iconColor, children }: { title: string, icon: ReactNode, iconColor: string, children: ReactNode }) => (
  <Card 
    title={<span style={{ display: 'flex', alignItems: 'center' }}>{React.cloneElement(icon as React.ReactElement, { style: { color: iconColor, marginRight: 8, fontSize: 18 } })} <span style={{ fontWeight: 600 }}>{title}</span></span>}
    size="small" 
    style={{ marginBottom: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
    styles={{ body: { padding: 16 } }}
  >
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 0' }}>
      {children}
    </div>
  </Card>
);

export const InfoRow = ({ label, value, fullWidth }: { label: string, value: ReactNode, fullWidth?: boolean }) => (
  <div style={{ display: 'flex', flexDirection: 'column', width: fullWidth ? '100%' : '50%', paddingRight: 16 }}>
    <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 14, fontWeight: 500, wordBreak: 'break-word', color: '#262626' }}>{value}</div>
  </div>
);

const RiskCard: React.FC<{ risk: RiskFinding }> = ({ risk }) => {
    const getIcon = () => {
        switch (risk.severity) {
            case 'critical': return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
            case 'warning': return <WarningOutlined style={{ color: '#faad14' }} />;
            case 'info': return <InfoCircleOutlined style={{ color: '#722ed1' }} />; // Purple for AI/ML
        }
    };

    const getColor = () => {
        switch (risk.severity) {
            case 'critical': return '#fff1f0';
            case 'warning': return '#fffbe6';
            case 'info': return '#f9f0ff'; // Purple background
        }
    };

    const getBorderColor = () => {
        switch (risk.severity) {
            case 'critical': return '#ffccc7';
            case 'warning': return '#ffe58f';
            case 'info': return '#d3adf7'; // Purple border
        }
    };

    const getCategoryColor = () => {
        switch (risk.severity) {
            case 'critical': return '#ff4d4f';
            case 'warning': return '#d48806'; // Darker yellow for text
            case 'info': return '#722ed1';
        }
    };

    return (
        <Card
            size="small"
            style={{
                width: 320, 
                minWidth: 320,
                backgroundColor: getColor(),
                borderColor: getBorderColor(),
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
            styles={{ body: { padding: 16 } }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                {getIcon()}
                <span style={{ fontSize: 15, fontWeight: 700, color: getCategoryColor() }}>
                    {risk.category}
                </span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#262626', marginBottom: 8 }}>
                {risk.message}
            </div>
            <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'more' }} style={{ marginBottom: 12, fontSize: 13, color: '#595959', lineHeight: '20px' }}>
                {risk.description || risk.message}
            </Paragraph>
            {risk.relatedItem && (
                <>
                    <div style={{ width: '100%', height: 1, backgroundColor: 'rgba(0,0,0,0.06)', marginBottom: 8 }} />
                    <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>
                        Riski İçeren Kalem:
                    </div>
                    <div style={{ display: 'inline-block', border: `1px solid ${getCategoryColor()}`, borderRadius: 4, padding: '2px 8px', fontSize: 13, fontWeight: 600, color: getCategoryColor(), backgroundColor: 'rgba(255,255,255,0.6)' }}>
                        {risk.relatedItem}
                    </div>
                </>
            )}
        </Card>
    );
};

export const RiskCardsScroller: React.FC<{ riskFindings: RiskFinding[] }> = ({ riskFindings }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!scrollRef.current) return;
      const scrollContainer = scrollRef.current;
      let startTime: number | null = null;
      const duration = 2000;
      const distance = 150;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const scrollPosition = distance * easeInOutCubic(progress);
        scrollContainer.scrollLeft = scrollPosition;
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setTimeout(() => { scrollContainer.scrollTo({ left: 0, behavior: 'smooth' }); }, 500);
        }
      };
      requestAnimationFrame(animate);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const checkScrollButtons = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftButton(scrollLeft > 10);
    setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    checkScrollButtons();
    scrollContainer.addEventListener('scroll', checkScrollButtons);
    window.addEventListener('resize', checkScrollButtons);
    return () => {
      scrollContainer.removeEventListener('scroll', checkScrollButtons);
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 360;
    const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    scrollRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
  };

  return (
    <Card 
      size="small"
      style={{ marginBottom: 16, position: 'relative', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <WarningOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
          <span style={{ fontSize: 16, fontWeight: 600 }}>
            Risk Analiz Bulguları ({riskFindings.length})
          </span>
        </div>
      }
    >
      <div style={{ position: 'relative' }}>
        {showLeftButton && (
          <Button
            type="primary" shape="circle" icon={<LeftOutlined />} onClick={() => scroll('left')}
            className="scroll-button-breathing"
            style={{ position: 'absolute', left: -12, top: '50%', transform: 'translateY(-50%)', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
          />
        )}
        {showRightButton && (
          <Button
            type="primary" shape="circle" icon={<RightOutlined />} onClick={() => scroll('right')}
            className="scroll-button-breathing"
            style={{ position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
          />
        )}
        {showLeftButton && (
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 8, width: 60, background: 'linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0))', zIndex: 5, pointerEvents: 'none' }} />
        )}
        {showRightButton && (
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 8, width: 100, background: 'linear-gradient(to left, rgba(255,255,255,1) 10%, rgba(255,255,255,0))', zIndex: 5, pointerEvents: 'none' }} />
        )}
        <div
          ref={scrollRef}
          style={{ display: 'flex', gap: 16, overflowX: 'auto', overflowY: 'hidden', paddingBottom: 8, scrollBehavior: 'smooth', scrollbarWidth: 'thin', scrollbarColor: '#1677ff #f0f0f0', WebkitOverflowScrolling: 'touch', position: 'relative' }}
          className="risk-cards-scroller"
        >
          {riskFindings.map(risk => (
            <RiskCard key={risk.id} risk={risk} />
          ))}
        </div>
      </div>
      <style>
        {`
          .risk-cards-scroller::-webkit-scrollbar { height: 8px; }
          .risk-cards-scroller::-webkit-scrollbar-track { background: #f0f0f0; border-radius: 4px; }
          .risk-cards-scroller::-webkit-scrollbar-thumb { background: #1677ff; border-radius: 4px; }
          .risk-cards-scroller::-webkit-scrollbar-thumb:hover { background: #0958d9; }
          @keyframes breathing {
            0%, 100% { transform: translateY(-50%) scale(1); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
            50% { transform: translateY(-50%) scale(1.08); box-shadow: 0 6px 20px rgba(22, 119, 255, 0.4); }
          }
          .scroll-button-breathing { animation: breathing 2s ease-in-out infinite; }
          .scroll-button-breathing:hover { animation: none; }
        `}
      </style>
    </Card>
  );
};

// --- Main Page ---

export default function DeclarationRisksTab({ declaration }: { declaration?: any }) {
  const [activeMainTab, setActiveMainTab] = useState('beyanname-riskler');
  const [activeSubTab, setActiveSubTab] = useState('beyanname');

  const data = mockBeyanameDetay;

  const kalemColumns: ColumnsType<KalemItem> = [
    { title: 'Sıra', dataIndex: 'siraNo', key: 'siraNo', width: 70, align: 'center', render: (no) => <strong>{no}</strong> },
    { title: 'GTİP', dataIndex: 'gtip', key: 'gtip', width: 160, render: (gtip) => <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{gtip}</span> },
    { title: 'Kalem Açıklaması', dataIndex: 'kalemAciklamasi', key: 'kalemAciklamasi', ellipsis: true },
    { title: 'Menşe', dataIndex: 'mense', key: 'mense', width: 100 },
    { title: 'Miktar', dataIndex: 'miktar', key: 'miktar', width: 90, align: 'right', render: (miktar, record) => `${miktar} ${record.birim}` },
    { title: 'Brüt (kg)', dataIndex: 'brutAgirlik', key: 'brutAgirlik', width: 100, align: 'right', render: (agirlik) => agirlik.toFixed(2) },
    { title: 'Net (kg)', dataIndex: 'netAgirlik', key: 'netAgirlik', width: 100, align: 'right', render: (agirlik) => agirlik.toFixed(2) },
    { title: 'Fatura Bedeli', dataIndex: 'faturaBedeli', key: 'faturaBedeli', width: 130, align: 'right', render: (bedel) => `$${bedel.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` },
    { title: 'Risk', dataIndex: 'riskSayisi', key: 'riskSayisi', width: 80, align: 'center', render: (riskSayisi) => (riskSayisi > 0 ? <Badge count={riskSayisi} showZero style={{ backgroundColor: '#ff4d4f' }} /> : <Tag color="success">Temiz</Tag>) }
  ];

  const kalemRiskColumns: ColumnsType<KalemRisk> = [
    { title: 'Kalem No', dataIndex: 'kalemSiraNo', key: 'kalemSiraNo', width: 90, align: 'center' },
    { title: 'Risk Başlık', dataIndex: 'riskBaslik', key: 'riskBaslik', width: 200 },
    { title: 'Konu', dataIndex: 'riskKonu', key: 'riskKonu', width: 180 },
    { title: 'Açıklama', dataIndex: 'riskAciklama', key: 'riskAciklama', ellipsis: true },
    { title: 'Öncelik', dataIndex: 'oncelikDurumu', key: 'oncelikDurumu', width: 100, align: 'center', render: (oncelik) => {
        const config = { high: { color: 'error', text: 'Yüksek' }, medium: { color: 'warning', text: 'Orta' }, low: { color: 'default', text: 'Düşük' } };
        return <Tag color={config[oncelik as keyof typeof config]?.color || 'default'}>{config[oncelik as keyof typeof config]?.text || oncelik}</Tag>;
    } }
  ];

  return (
    <div style={{ padding: 24, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Card 
        style={{ marginBottom: 24, background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)', border: 'none', borderRadius: 12 }}
        styles={{ body: { padding: 20 } }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 6 }}>
              Beyanname Numarası
            </div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
              IM20260000000001
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Tag color="warning" style={{ fontSize: 13, padding: '4px 12px', margin: 0, border: 'none' }}>
              {data.durum}
            </Tag>
            <Button type="default" icon={<DownloadOutlined />} style={{ borderRadius: 6, fontWeight: 500 }}>
              İndir
            </Button>
          </div>
        </div>
      </Card>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <NavigationSidebar
          items={[
            { key: 'beyanname-riskler', label: 'Beyanname ve Riskler' },
            { key: 'arsiv', label: 'Arşiv' },
            { key: 'islem-gecmisi', label: 'İşlem Geçmişi' },
            { key: 'ekstra-veri', label: 'Ekstra Veri' },
            { key: 'referans-islemleri', label: 'Referans İşlemleri' }
          ]}
          activeKey={activeMainTab}
          onChange={setActiveMainTab}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          {activeMainTab === 'beyanname-riskler' && (
            <Tabs activeKey={activeSubTab} onChange={setActiveSubTab} size="large" style={{ backgroundColor: '#fff', padding: '12px 16px 0', borderRadius: 8 }}>
              <TabPane tab="📋 Beyanname" key="beyanname">
                <div style={{ marginTop: 16 }}>
                  <InfoCard title="Beyanname Kapak Bilgileri" icon={<FileTextOutlined />} iconColor="#1677ff">
                    <InfoRow label="Rejim" value={data.coverInfo.rejim} />
                    <InfoRow label="Toplam Risk Sayısı" value={<Badge count={data.coverInfo.toplamRiskSayisi} showZero style={{ backgroundColor: '#ff4d4f' }} />} />
                    <InfoRow label="A Gümrük" value={data.coverInfo.agumruk} />
                    <InfoRow label="Çıkış Gümrüğü" value={data.coverInfo.cikisGumruk} />
                    <InfoRow label="Belgeler" value={<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{data.coverInfo.belgeler.map((belge, idx) => <Tag key={idx} color="blue">{belge}</Tag>)}</div>} fullWidth />
                  </InfoCard>

                  {/* PRESERVED SCROLLER FOR RISK BULGULARI */}
                  <RiskCardsScroller riskFindings={data.beyanameRiskleri} />

                  <InfoCard title="Beyanname Bilgileri" icon={<ShoppingOutlined />} iconColor="#52c41a">
                    <InfoRow label="Alıcı" value={data.beyannameBilgileri.alici} fullWidth />
                    <InfoRow label="Gönderici" value={data.beyannameBilgileri.gonderici} fullWidth />
                    <InfoRow label="Beyan Sahibi" value={data.beyannameBilgileri.beyanSahibi} />
                    <InfoRow label="Sevk Ülkesi" value={data.beyannameBilgileri.sevkUlkesi} />
                    <InfoRow label="Ticaret Ülkesi" value={data.beyannameBilgileri.ticaretUlkesi} />
                    <InfoRow label="Çıkış Ülkesi" value={data.beyannameBilgileri.cikisUlkesi} />
                    <InfoRow label="Kapadedi" value={data.beyannameBilgileri.kapadedi} />
                    <InfoRow label="Teslim Şekli" value={data.beyannameBilgileri.teslimSekli} />
                    <InfoRow label="Teslim Yeri" value={data.beyannameBilgileri.teslimYeri} />
                    <InfoRow label="Alıcı-Satıcı İlişkisi" value={data.beyannameBilgileri.aliciSaticiIliskisi} />
                    <InfoRow label="Antrepo" value={data.beyannameBilgileri.antrepo} />
                  </InfoCard>

                  <InfoCard title="Fatura Bilgileri" icon={<DollarOutlined />} iconColor="#13c2c2">
                    <InfoRow label="Fatura Bedeli" value={<strong style={{ color: '#52c41a', fontSize: 16 }}>${data.faturaBilgileri.faturaBedeli.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</strong>} />
                    <InfoRow label="Kur Tarihi" value={data.faturaBilgileri.kurTarihi} />
                    <InfoRow label="Döviz Alış" value={`₺${data.faturaBilgileri.dovizAlis}`} />
                    <InfoRow label="Döviz Satış" value={`₺${data.faturaBilgileri.dovisSatis}`} />
                    <InfoRow label="Ödeme Şekli" value={data.faturaBilgileri.odemeSekli} />
                    <InfoRow label="Banka" value={data.faturaBilgileri.banka} />
                    <InfoRow label="Sözleşme" value={data.faturaBilgileri.sozlesme} />
                    <InfoRow label="Ödeme Aracı" value={data.faturaBilgileri.odemeAraci} />
                    <InfoRow label="Ödeme Yöntemi" value={data.faturaBilgileri.odemeYontemi} />
                  </InfoCard>

                  <InfoCard title="Genel Vergi Bilgileri" icon={<BankOutlined />} iconColor="#722ed1">
                    <Row gutter={16} style={{ width: '100%' }}>
                      <Col xs={24} sm={8}>
                        <Statistic title="Toplam Vergi" value={data.genelVergiBilgileri.toplamVergi} precision={2} prefix="₺" valueStyle={{ color: '#ff4d4f' }} />
                      </Col>
                      <Col xs={24} sm={8}>
                        <Statistic title="Peşin Toplam" value={data.genelVergiBilgileri.pesinToplam} precision={2} prefix="₺" valueStyle={{ color: '#1677ff' }} />
                      </Col>
                      <Col xs={24} sm={8}>
                        <Statistic title="Teminat Toplamı" value={data.genelVergiBilgileri.teminatToplami} precision={2} prefix="₺" valueStyle={{ color: '#faad14' }} />
                      </Col>
                    </Row>
                  </InfoCard>

                  <InfoCard title="Taşıma Bilgileri" icon={<CarOutlined />} iconColor="#fa8c16">
                    <InfoRow label="Taşıma Şekli" value={data.tasimaBilgileri.tasimaSekli} />
                    <InfoRow label="Nakliyeci Firma" value={data.tasimaBilgileri.nakliyeciFirma} />
                    <InfoRow label="Liman" value={data.tasimaBilgileri.liman} />
                    <InfoRow label="Konteyner Sayısı" value={data.tasimaBilgileri.konteynerSayisi} />
                    <InfoRow label="Sınırdaki Araç Tipi" value={data.tasimaBilgileri.sinirdakiAracTipi} />
                    <InfoRow label="Sınırdaki Araç Kimliği" value={data.tasimaBilgileri.sinirdakiAracKimligi} />
                    <InfoRow label="Araç Ülke Kodu" value={data.tasimaBilgileri.aracUlkeKodu} />
                    <InfoRow label="Çıkıştaki Araç Tipi" value={data.tasimaBilgileri.cikistakiAracTipi} />
                    <InfoRow label="Çıkıştaki Araç Kimliği" value={data.tasimaBilgileri.cikistakiAracKimligi} />
                    <InfoRow label="Çıkıştaki Araç Ülke Kodu" value={data.tasimaBilgileri.cikistakiAracUlkeKodu} />
                    <InfoRow label="Yükleme/Boşaltma Yeri" value={data.tasimaBilgileri.yuklemeBoşaltmaYeri} fullWidth />
                    <InfoRow label="Eşyanın Bulunduğu Yer" value={data.tasimaBilgileri.esyaninBulunduguYer} />
                    <InfoRow label="Giriş Gümrük" value={data.tasimaBilgileri.girisGumruk} />
                    <InfoRow label="Çıkış Gümrük" value={data.tasimaBilgileri.cikisGumruk} />
                    <InfoRow label="Basit Usül" value={data.tasimaBilgileri.basitUsul} />
                  </InfoCard>

                  <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col xs={24} md={12}>
                      <Card title="💱 Yurtdışı Tutarlar" size="small" style={{ borderRadius: 12 }}>
                        <Descriptions bordered size="small" column={1}>
                          <Descriptions.Item label="Komisyon">${data.yurtdisiTutarlar.komisyon.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</Descriptions.Item>
                          <Descriptions.Item label="Demuraj">${data.yurtdisiTutarlar.demuraj.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</Descriptions.Item>
                          <Descriptions.Item label="Royalti">${data.yurtdisiTutarlar.royalti.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</Descriptions.Item>
                          <Descriptions.Item label="Faiz">${data.yurtdisiTutarlar.faiz.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</Descriptions.Item>
                          <Descriptions.Item label="Gözetim Kayıt Farkı">${data.yurtdisiTutarlar.gozetimKayitFarki.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</Descriptions.Item>
                          <Descriptions.Item label="Navlun">${data.yurtdisiTutarlar.navlun.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</Descriptions.Item>
                          <Descriptions.Item label="Sigorta">${data.yurtdisiTutarlar.sigorta.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</Descriptions.Item>
                          <Descriptions.Item label="FOB">${data.yurtdisiTutarlar.fob.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</Descriptions.Item>
                          <Descriptions.Item label="Yurtdışı Toplam"><strong style={{ color: '#1677ff', fontSize: 15 }}>${data.yurtdisiTutarlar.yurtdisiToplam.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</strong></Descriptions.Item>
                        </Descriptions>
                      </Card>
                    </Col>
                    <Col xs={24} md={12}>
                      <Card title="🏦 Yurtiçi Tutarlar" size="small" style={{ borderRadius: 12 }}>
                        <Descriptions bordered size="small" column={1}>
                          <Descriptions.Item label="KKDF">₺{data.yurticiTutarlar.kkdf.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</Descriptions.Item>
                          <Descriptions.Item label="Çevre">₺{data.yurticiTutarlar.cevre.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</Descriptions.Item>
                          <Descriptions.Item label="Tahliye">₺{data.yurticiTutarlar.tahliye.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</Descriptions.Item>
                          <Descriptions.Item label="Liman">₺{data.yurticiTutarlar.liman.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</Descriptions.Item>
                          <Descriptions.Item label="Banka">₺{data.yurticiTutarlar.banka.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</Descriptions.Item>
                          <Descriptions.Item label="Depolama">₺{data.yurticiTutarlar.depolama.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</Descriptions.Item>
                          <Descriptions.Item label="Kültür">₺{data.yurticiTutarlar.kultur.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</Descriptions.Item>
                          <Descriptions.Item label="Diğer">₺{data.yurticiTutarlar.diger.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</Descriptions.Item>
                          <Descriptions.Item label="Bandrol">₺{data.yurticiTutarlar.bandrol.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</Descriptions.Item>
                          <Descriptions.Item label="G.Zammı">₺{data.yurticiTutarlar.gzammi.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</Descriptions.Item>
                          <Descriptions.Item label="KDV Gider">₺{data.yurticiTutarlar.kdvGider.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</Descriptions.Item>
                        </Descriptions>
                      </Card>
                    </Col>
                  </Row>

                  <Card title={<span><SafetyOutlined style={{ marginRight: 8 }} />Teminat Bilgileri</span>} size="small" style={{ marginBottom: 16, borderRadius: 12 }}>
                    {data.teminatBilgileri.map((teminat, index) => (
                      <Card key={index} type="inner" title={`Teminat ${index + 1}: ${teminat.teminatSekli}`} size="small" style={{ marginBottom: index < data.teminatBilgileri.length - 1 ? 12 : 0 }}>
                        <Descriptions bordered size="small" column={{ xs: 1, sm: 2, md: 3 }}>
                          <Descriptions.Item label="Tutarı">₺{teminat.tutari.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</Descriptions.Item>
                          <Descriptions.Item label="Oranı">%{teminat.orani}</Descriptions.Item>
                          <Descriptions.Item label="Sayısı">{teminat.sayisi}</Descriptions.Item>
                          <Descriptions.Item label="Nakit Tutar">₺{teminat.nakitTutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</Descriptions.Item>
                          <Descriptions.Item label="Banka Tutarı">₺{teminat.bankaTutari.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</Descriptions.Item>
                        </Descriptions>
                      </Card>
                    ))}
                  </Card>

                  <Card title={<span><FileTextOutlined style={{ marginRight: 8 }} />Kalemler Listesi</span>} size="small" style={{ borderRadius: 12 }}>
                    <Table columns={kalemColumns} dataSource={data.kalemler} rowKey="siraNo" pagination={false} size="small" scroll={{ x: 1200 }} />
                  </Card>
                </div>
              </TabPane>

              <TabPane tab="📦 Kalem" key="kalem">
                <div style={{ marginTop: 16 }}>
                  <Card title={<span><WarningOutlined style={{ marginRight: 8, color: '#ff4d4f' }} />Kalem Riskleri ({data.kalemRiskleri.length})</span>} size="small" style={{ marginBottom: 16 }}>
                    <Table columns={kalemRiskColumns} dataSource={data.kalemRiskleri} rowKey="id" pagination={{ pageSize: 10 }} size="small" scroll={{ x: 900 }} />
                  </Card>
                  <Card title={<span><FileTextOutlined style={{ marginRight: 8 }} />Kalem Detayları</span>} size="small">
                    <Table 
                      columns={kalemColumns} dataSource={data.kalemler} rowKey="siraNo" pagination={false} size="small" scroll={{ x: 1200 }}
                      expandable={{
                        expandedRowRender: (record) => {
                          const kalemRiskleri = data.kalemRiskleri.filter(r => r.kalemSiraNo === record.siraNo);
                          return (
                            <div style={{ padding: '12px 24px' }}>
                              <h4 style={{ marginBottom: 12, color: '#1677ff' }}>Bu Kaleme Ait Riskler ({kalemRiskleri.length})</h4>
                              {kalemRiskleri.length > 0 ? (
                                kalemRiskleri.map((risk) => (
                                  <Card key={risk.id} size="small" type="inner" style={{ marginBottom: 8 }} title={<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>{risk.riskBaslik}</span><Tag color={risk.oncelikDurumu === 'high' ? 'error' : risk.oncelikDurumu === 'medium' ? 'warning' : 'default'}>{risk.oncelikDurumu === 'high' ? 'Yüksek' : risk.oncelikDurumu === 'medium' ? 'Orta' : 'Düşük'}</Tag></div>}>
                                    <p style={{ margin: 0, marginBottom: 8 }}><strong>Konu:</strong> {risk.riskKonu}</p>
                                    <p style={{ margin: 0 }}><strong>Açıklama:</strong> {risk.riskAciklama}</p>
                                  </Card>
                                ))
                              ) : <Tag color="success">Bu kalemde risk bulunmamaktadır</Tag>}
                            </div>
                          );
                        }
                      }}
                    />
                  </Card>
                </div>
              </TabPane>
            </Tabs>
          )}

          {activeMainTab === 'arsiv' && (
            <Card size="small" style={{ marginTop: 16 }}>
              <p style={{ textAlign: 'center', color: '#8c8c8c', padding: 40 }}>Arşiv içeriği yakında eklenecektir.</p>
            </Card>
          )}

          {activeMainTab === 'islem-gecmisi' && (
            <Card size="small" style={{ marginTop: 16 }}>
              <p style={{ textAlign: 'center', color: '#8c8c8c', padding: 40 }}>İşlem geçmişi içeriği yakında eklenecektir.</p>
            </Card>
          )}

          {activeMainTab === 'ekstra-veri' && (
            <Card size="small" style={{ marginTop: 16 }}>
              <p style={{ textAlign: 'center', color: '#8c8c8c', padding: 40 }}>Ekstra veri içeriği yakında eklenecektir.</p>
            </Card>
          )}

          {activeMainTab === 'referans-islemleri' && (
            <Card size="small" style={{ marginTop: 16 }}>
              <p style={{ textAlign: 'center', color: '#8c8c8c', padding: 40 }}>Referans işlemleri içeriği yakında eklenecektir.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
