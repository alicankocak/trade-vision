import React, { useState, useMemo } from 'react';
import { Card, Input, Select, Tag, Row, Col, Empty, Space, Badge } from 'antd';
import { SearchOutlined, FilterOutlined, WarningOutlined, BookOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { riskKutuphaneData, riskKategoriler, riskSeviyeleri, RiskKutuphaneItem } from '../../data/riskKutuphaneMockData';
import { useAuthStore } from '@/store/useAuthStore';

const { Search } = Input;
const { Option } = Select;

export const RiskAnalizKutuphanesi: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Tümü');
  const [selectedSeviye, setSelectedSeviye] = useState('tumu');
  const { activeCompanyContext } = useAuthStore();

  // Filtreleme ve arama
  const filteredData = useMemo(() => {
    // RBAC Filtrelemesi
    const rbacFiltered = riskKutuphaneData.filter(item => {
        if (!activeCompanyContext) return false;
        if (activeCompanyContext.type === 'GUMRUK') return true; 
        return item.companyId === activeCompanyContext.id;
    });

    return rbacFiltered.filter(risk => {
      const matchesSearch = 
        risk.baslik.toLowerCase().includes(searchText.toLowerCase()) ||
        risk.detay.toLowerCase().includes(searchText.toLowerCase()) ||
        risk.aciklama.toLowerCase().includes(searchText.toLowerCase()) ||
        risk.riskKategori.toLowerCase().includes(searchText.toLowerCase());
      
      const matchesKategori = selectedKategori === 'Tümü' || risk.riskKategori === selectedKategori;
      const matchesSeviye = selectedSeviye === 'tumu' || risk.riskSeviye === selectedSeviye;

      return matchesSearch && matchesKategori && matchesSeviye;
    });
  }, [searchText, selectedKategori, selectedSeviye]);

  // Risk seviye renkleri
  const getRiskColors = (seviye: string) => {
    const colorMap = {
      'red-1': { border: '#ff4d4f', bg: '#fff1f0', tagColor: 'error', label: 'Red-1 (Kritik)' },
      'red-2': { border: '#ff7a45', bg: '#fff7e6', tagColor: 'warning', label: 'Red-2 (Yüksek)' },
      'potansiyel': { border: '#faad14', bg: '#fffbe6', tagColor: 'gold', label: 'Potansiyel Risk' },
      'ai-ml-yuksek': { border: '#9254de', bg: '#f9f0ff', tagColor: 'purple', label: 'AI/ML Yüksek' },
      'ai-ml-orta': { border: '#597ef7', bg: '#f0f5ff', tagColor: 'geekblue', label: 'AI/ML Orta' },
      'ai-ml-dusuk': { border: '#69c0ff', bg: '#e6f7ff', tagColor: 'cyan', label: 'AI/ML Düşük' },
      'kurallar': { border: '#13c2c2', bg: '#e6fffb', tagColor: 'cyan', label: 'Kural Bazlı' }
    };
    return colorMap[seviye as keyof typeof colorMap] || colorMap['potansiyel'];
  };

  return (
    <div style={{ padding: 24, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      {/* Page Header */}
      <Card 
        style={{ 
          marginBottom: 24,
          background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)',
          border: 'none',
          borderRadius: 12
        }}
        styles={{ body: { padding: 20 } }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 6 }}>
              Gümrük Risk Yönetimi
            </div>
            <h1 style={{ 
              margin: 0, 
              fontSize: 28, 
              fontWeight: 700, 
              color: '#fff',
              letterSpacing: '-0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <BookOutlined />
              Risk Analiz Kütüphanesi
            </h1>
          </div>
          <Badge 
            count={filteredData.length} 
            showZero 
            style={{ 
              backgroundColor: '#fff', 
              color: '#1677ff',
              fontSize: 16,
              fontWeight: 700,
              padding: '4px 12px',
              height: 'auto'
            }} 
          />
        </div>
      </Card>

      {/* Filters */}
      <Card style={{ marginBottom: 24 }} styles={{ body: { padding: 20 } }}>
        <Row gutter={16}>
          <Col xs={24} md={12} lg={8}>
            <div style={{ marginBottom: 8, fontWeight: 500, fontSize: 13, color: '#595959' }}>
              <SearchOutlined style={{ marginRight: 6 }} />
              Arama
            </div>
            <Search 
              placeholder="Risk başlığı, açıklama veya kategori..." 
              allowClear 
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          
          <Col xs={24} md={12} lg={8}>
            <div style={{ marginBottom: 8, fontWeight: 500, fontSize: 13, color: '#595959' }}>
              <FilterOutlined style={{ marginRight: 6 }} />
              Risk Seviyesi
            </div>
            <Select 
              value={selectedSeviye}
              onChange={setSelectedSeviye}
              size="large"
              style={{ width: '100%' }}
            >
              {riskSeviyeleri.map(seviye => (
                <Option key={seviye.value} value={seviye.value}>
                  <Tag color={seviye.value === 'tumu' ? 'default' : getRiskColors(seviye.value).tagColor}>
                    {seviye.label}
                  </Tag>
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} md={12} lg={8}>
            <div style={{ marginBottom: 8, fontWeight: 500, fontSize: 13, color: '#595959' }}>
              <FilterOutlined style={{ marginRight: 6 }} />
              Risk Kategorisi
            </div>
            <Select 
              value={selectedKategori}
              onChange={setSelectedKategori}
              size="large"
              style={{ width: '100%' }}
              showSearch
            >
              {riskKategoriler.map(kategori => (
                <Option key={kategori} value={kategori}>
                  {kategori}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Results */}
      {filteredData.length === 0 ? (
        <Card>
          <Empty 
            description="Arama kriterlerine uygun risk bulunamadı"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredData.map(risk => {
            const colors = getRiskColors(risk.riskSeviye);
            
            return (
              <Col xs={24} lg={12} xl={8} key={risk.id}>
                <Card
                  hoverable
                  style={{
                    height: '100%',
                    borderLeft: `4px solid ${colors.border}`,
                    backgroundColor: colors.bg,
                    transition: 'all 0.3s ease'
                  }}
                  styles={{ body: { padding: 20, display: 'flex', flexDirection: 'column', height: '100%' } }}
                >
                  {/* Header */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <WarningOutlined 
                        style={{ 
                          fontSize: 16, 
                          color: colors.border 
                        }} 
                      />
                      <Tag color={colors.tagColor} style={{ margin: 0, fontWeight: 600 }}>
                        {colors.label}
                      </Tag>
                    </div>
                    <Tag color="blue" style={{ marginBottom: 8 }}>
                      {risk.riskKategori}
                    </Tag>
                  </div>

                  {/* Title */}
                  <h3 style={{ 
                    margin: 0, 
                    marginBottom: 12, 
                    fontSize: 16, 
                    fontWeight: 600,
                    color: '#262626',
                    lineHeight: 1.4
                  }}>
                    {risk.baslik}
                  </h3>

                  {/* Short Description */}
                  <p style={{ 
                    margin: 0, 
                    marginBottom: 16,
                    fontSize: 13, 
                    color: '#595959',
                    lineHeight: 1.6
                  }}>
                    {risk.detay}
                  </p>

                  {/* Long Description */}
                  <div style={{
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    padding: 14,
                    borderRadius: 8,
                    marginBottom: 16,
                    border: '1px solid rgba(0,0,0,0.06)'
                  }}>
                    <div style={{ 
                      fontSize: 12, 
                      fontWeight: 600, 
                      color: '#8c8c8c', 
                      marginBottom: 8,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      📖 Detaylı Açıklama
                    </div>
                    <p style={{ 
                      margin: 0, 
                      fontSize: 13, 
                      color: '#262626',
                      lineHeight: 1.7
                    }}>
                      {risk.aciklama}
                    </p>
                  </div>

                  {/* Önerilen Aksiyonlar */}
                  {risk.onerilenAksiyonlar && risk.onerilenAksiyonlar.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ 
                        fontSize: 12, 
                        fontWeight: 600, 
                        color: '#8c8c8c', 
                        marginBottom: 10,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}>
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                        Önerilen Aksiyonlar
                      </div>
                      <ul style={{ 
                        margin: 0, 
                        paddingLeft: 20,
                        fontSize: 13,
                        color: '#262626',
                        lineHeight: 1.8
                      }}>
                        {risk.onerilenAksiyonlar.map((aksiyon, idx) => (
                          <li key={idx}>{aksiyon}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* İlgili Mevzuat */}
                  {risk.ilgiliMevzuat && (
                    <div style={{ 
                      marginBottom: 12,
                      padding: 10,
                      backgroundColor: 'rgba(22, 119, 255, 0.08)',
                      borderRadius: 6,
                      borderLeft: '3px solid #1677ff'
                    }}>
                      <div style={{ 
                        fontSize: 11, 
                        fontWeight: 600, 
                        color: '#1677ff', 
                        marginBottom: 4,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        ⚖️ İlgili Mevzuat
                      </div>
                      <div style={{ fontSize: 12, color: '#262626' }}>
                        {risk.ilgiliMevzuat}
                      </div>
                    </div>
                  )}

                  {/* Örnek Senaryo */}
                  {risk.ornekSenaryo && (
                    <div style={{ 
                      marginBottom: 12,
                      padding: 10,
                      backgroundColor: 'rgba(250, 173, 20, 0.08)',
                      borderRadius: 6,
                      borderLeft: '3px solid #faad14'
                    }}>
                      <div style={{ 
                        fontSize: 11, 
                        fontWeight: 600, 
                        color: '#faad14', 
                        marginBottom: 4,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        💡 Örnek Senaryo
                      </div>
                      <div style={{ fontSize: 12, color: '#262626', lineHeight: 1.6 }}>
                        {risk.ornekSenaryo}
                      </div>
                    </div>
                  )}

                  {/* İlgili Kalem */}
                  {risk.ilgiliKalem && (
                    <div style={{ 
                      paddingTop: 12, 
                      borderTop: '1px solid rgba(0,0,0,0.06)',
                      marginTop: 'auto'
                    }}>
                      <Tag color="cyan" style={{ fontSize: 12 }}>
                        {risk.ilgiliKalem}
                      </Tag>
                    </div>
                  )}
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
};

export default RiskAnalizKutuphanesi;
