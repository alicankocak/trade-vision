# Trade-Vision Global Guidelines

## 1. Tasarım Sistemi (Shadcn & Neutral)
- **Teknoloji:** Ant Design (Bileşen kütüphanesi) & Tailwind CSS (Utility styling).
- **Stil:** Shadcn benzeri yüksek kontrastlı siyah-beyaz-gri (Neutral Palette).
- **Radius:** Tüm Antd bileşenleri ve Tailwind sınıflarında istisnasız **8px** kavis kullanılacaktır.
- **Kural:** Antd bileşenleri `ConfigProvider` üzerinden global stilize edilmeli, özel layout ihtiyaçları Tailwind ile çözülmelidir.

## 2. Teknik Mimari & Güvenlik
- **Framework:** Next.js (App Router).
- **Security:** - Hassas tokenlar **SHA-256** ile hash'lenmelidir.
  - JWT işlemlerinde algoritma kontrolü ve `exp` süresi zorunludur.
  - Kritik buton işlemlerinde (Örn: Gönder) **Frontend Queue** sistemiyle "double-action" engellenmelidir.
- **Dinamik Yapı:** `useSearchParams` olan sayfalar `<Suspense>` ile sarmalanmalı ve `force-dynamic` flag'i eklenmelidir.

## 3. Kullanıcı ve Rol Yönetimi (RBAC)
- **Admin:** Tam yetki (Kullanıcı yönetimi + Tüm veriler).
- **Manager:** Beyanname & Rapor (Düzenle/İndir) + Kullanıcı Listesi (Sadece görüntüle).
- **Viewer:** Sadece beyannameleri görüntüler. İndirme/Düzenleme yetkisi yoktur.
- **Kural:** Her buton/aksiyon öncesi rol yetkisi `PermissionGuard` ile kontrol edilmelidir.

## 4. Kod Yazım Kuralları
- **Standardizasyon:** Tekrar eden UI'lar `src/components` altında toplanmalı (DRY).
- **Temizlik:** Kullanılmayan import ve loglar build öncesi silinmelidir.
- **Hata Yönetimi:** Tüm API çağrıları merkezi bir error-handler ile yönetilmeli, kullanıcıya dostça hata kodları gösterilmelidir.

## 5. Ajan Protokolü (Zorunlu)
- **Plan Mode:** Kod yazmadan önce mutlaka yapılacak işlemleri "Plan" olarak sun ve onay al.
- **Context Management:** Context doluluk oranı %70'e ulaştığında kullanıcıyı yeni bir oturum açması için uyar.