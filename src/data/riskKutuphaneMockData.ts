export interface RiskKutuphaneItem {
  id: string | number;
  baslik: string;
  detay: string;
  aciklama: string;
  companyId: 'comp_trendyol',
    riskKategori: string;
  riskSeviye: string;
  onerilenAksiyonlar?: string[];
  ilgiliMevzuat?: string;
  ornekSenaryo?: string;
  ilgiliKalem?: string;
  companyId?: string;
}

export const riskKategoriler = [
  'Tümü',
  'Kıymet Analizi',
  'GTIP Uyumu',
  'Belge Eksikliği',
  'Vergi Uyumu',
  'Menşe Analizi',
  'Yasaklı Gönderici',
  'Kısıtlamalar ve İzinler'
];

export const riskSeviyeleri = [
  { value: 'tumu', label: 'Tümü' },
  { value: 'red-1', label: 'Red-1 (Kritik)' },
  { value: 'red-2', label: 'Red-2 (Yüksek)' },
  { value: 'potansiyel', label: 'Potansiyel Risk' },
  { value: 'ai-ml-yuksek', label: 'AI/ML Yüksek' },
  { value: 'ai-ml-orta', label: 'AI/ML Orta' },
  { value: 'ai-ml-dusuk', label: 'AI/ML Düşük' },
  { value: 'kurallar', label: 'Kural Bazlı' }
];

export const riskKutuphaneData: RiskKutuphaneItem[] = [
  {
    id: '1',
    baslik: 'Kıymet Analizi - Referans Fiyat Altı Beyan',
    detay: 'Beyan edilen eşya kıymetinin referans eşya kıymetine göre belirgin şekilde düşük olması.',
    aciklama: 'Aynı veya benzer eşya için belirlenen referans fiyatların %20 ve daha fazla altında bir birim fiyat beyanı söz konusudur. Bu durum vergi kaybına yol açabileceği için dikkatle incelenmelidir.',
    companyId: 'comp_trendyol',
    riskKategori: 'Kıymet Analizi',
    riskSeviye: 'red-1',
    onerilenAksiyonlar: [
      'Satıcıdan alınan orijinal faturaları detaylı kontrol edin.',
      'Banka ödeme dekontlarını ve transfer belgelerini talep edin.',
      'Geçmiş beyannamelerdeki benzer eşya fiyatları ile karşılaştırma yapın.'
    ],
    ilgiliMevzuat: 'Gümrük Kanunu Madde 24 ve Gümrük Yönetmeliği Eşya Kıymeti Bölümü.',
    ornekSenaryo: 'Firma, piyasa ortalaması 150 EUR olan bir elektronik parçayı 45 EUR olarak beyan etmiştir. Risk motorumuz bu senaryoda %70 referans bedel sapması tespit etmiştir.',
    ilgiliKalem: 'Genel',
  },
  {
    id: '2',
    baslik: 'GTİP Uyumu - İstatistiksel Karakteristik Sapması (AI)',
    detay: 'Beyan edilen eşya tanımı ile GTİP arasında makine öğrenimi modellerince tespit edilen uyumsuzluk.',
    aciklama: 'Yapay zeka modellerimiz, eşyanın ticari tanımını analiz ederek, %85 güven skoruna sahip başka bir GTİP ile eşleşmesi gerektiğini bulmuştur. Beyan edilen GTİP, geçmiş işlem verilerine göre bu tanım ile uyumsuzdur.',
    companyId: 'comp_trendyol',
    riskKategori: 'GTIP Uyumu',
    riskSeviye: 'ai-ml-yuksek',
    onerilenAksiyonlar: [
      'Ürünün teknik veri föyünü (datasheet) ve kataloğunu inceleyin.',
      'Gümrük Tarife Cetveli Açıklama Notları\'na (TGTC) başvurarak sınıflandırma kurallarını teyit edin.'
    ],
    ilgiliMevzuat: 'Gümrük Tarife Cetveli İzahnamesi ve Sınıflandırma Kararları.',
    ornekSenaryo: '"Plastik levha" olarak beyan edilen (39. Fasıl) ürünün, aslında bir "makine aksamı" (84. Fasıl) olarak değerlendirilmesi gerektiği tahmin ediliyor.',
  },
  {
    id: '3',
    baslik: 'Belge Eksikliği - Tercihli Menşe / ATR',
    detay: 'Muafiyet veya tercihli tarife uygulanan işlemler için menşe belgesinin bulunmaması.',
    aciklama: 'İthalatta indirimli veya sıfır gümrük vergisi oranından yararlanmak için gerekli olan ATR Dolaşım Belgesi veya Menşe Şahadetnamesi sistemde eksik veya geçersiz görünmektedir.',
    companyId: 'comp_trendyol',
    riskKategori: 'Belge Eksikliği',
    riskSeviye: 'red-2',
    onerilenAksiyonlar: [
      'İhracatçıdan ilgili belgelerin asıllarını veya sonradan verilmiş kopyalarını talep edin.',
      'Belgenin mührünü ve geçerlilik süresini (son kullanma tarihini) kontrol edin.'
    ],
    ilgiliMevzuat: 'AB-Türkiye Gümrük Birliği Kararı, Serbest Ticaret Anlaşmaları.'
  },
  {
    id: '4',
    baslik: 'Ağırlık Sapması - Anormal Brüt / Net Farkı',
    detay: 'Geçmiş dönemlerde benzer eşyalar için beyan edilen brüt/net ağırlık oranından ciddi sapma',
    aciklama: 'Belirtilen GTİP veya benzer mal gruplarında daha önce yapılmış ithalatlara kıyasla beyan edilen net ve brüt ağırlık miktarları arasında sistem ortalamasının çok dışında (%30+ fark) bir sapma saptanmıştır.',
    companyId: 'comp_trendyol',
    riskKategori: 'Kıymet Analizi',
    riskSeviye: 'ai-ml-orta',
    onerilenAksiyonlar: [
      'Konteyner ve koli ambalaj listelerini (packing list) doğrudan kontrol edin.',
      'Liman/Antrepo tartım fişlerini inceleyin.'
    ],
    ornekSenaryo: 'Normalde brüt ağırlığı 10kg, net 9.5kg olması beklenen bir tekstil grubunun; brüt ağırlığı 20kg olarak girilmiş ve aradaki farkın izahı yapılmamış.'
  },
  {
    id: '5',
    baslik: 'Yasaklı veya Yüksek Riskli Ülke Ticareti',
    detay: 'Eşyanın menşe ülkesi, sevk veya ticaret ülkesinin yüksek riskli (gri/kara liste) bölgeleri içermesi.',
    aciklama: 'Uluslararası kuruluşlarca (FATF vb.) belirlenmiş yüksek riskli ülkeler listesinde yer alan bir bölgeden ithalat yapılıyor. Bu işlem özel izlemeye tabi olup daha dikkatli fiziki kontrol ve belge denetimi gerektirir.',
    companyId: 'comp_trendyol',
    riskKategori: 'Yasaklı Gönderici',
    riskSeviye: 'red-1',
    onerilenAksiyonlar: [
      'Kırmızı hat kontrolüne sevk edip %100 fiziki muayene talebinde bulunun.',
      'Tüm sevkiyat aracını X-Ray taramasından geçirin.',
      'Ödeme şekli ve finansal transfer hareketlerini ekstra denetleyin.'
    ]
  },
];
