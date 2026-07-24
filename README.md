# Video on Demand (VOD) Backend API

Bu proje, kullanıcıların filmleri listeleyebildiği, kategori bazlı filtreleme yapabildiği ve içerik izleyebildiği bir VOD (Video on Demand) platformunun arka uç (backend) servislerini sağlamaktadır.

## 🚀 Teknolojiler ve Mimari
* **Framework:** .NET Core (RESTful Web API)
* **Kimlik Doğrulama (Security):** JWT (JSON Web Token) tabanlı yetkilendirme.ss
* **Performans (Caching):** Veritabanı maliyetlerini düşürmek için IMemoryCache entegrasyonu.
* **İzlenebilirlik (Logging):** Serilog ile günlük bazlı kalıcı metin (rolling file) loglama.
* **Hata Yönetimi:** Kesintisiz kullanıcı deneyimi için Global Exception Handling (Middleware).
* **Dokümantasyon:** Swagger / OpenAPI

## ⚙️ Kurulum ve Çalıştırma
Projeyi yerel ortamınızda (local) ayağa kaldırmak için aşağıdaki adımları izleyin:
1. Proje dizininde terminali açın.
2. Gerekli paketleri yüklemek için `dotnet restore` komutunu çalıştırın.
3. Projeyi başlatmak için `dotnet run` komutunu kullanın.
4. Tarayıcınızda `https://localhost:<port>/swagger` adresine giderek API dokümantasyonuna erişebilirsiniz.

---

## 🎯 Frontend Geliştiricileri İçin Kullanım Senaryoları (Use Cases)

Ön yüz (Frontend) entegrasyonu sırasında ekranlara göre kullanılması gereken API uç noktaları aşağıda belirtilmiştir:

### 1. Ana Sayfa (Home) Senaryosu
* **Amaç:** Kullanıcı uygulamayı açtığında vitrinde sergilenecek tüm filmleri getirmek.
* **Kullanılacak Servis:** `GET /api/Movie`
* **Beklenen Durum:** `200 OK` (Film listesi döner).

### 2. Kategori Detay Senaryosu
* **Amaç:** Kullanıcı üst menüden spesifik bir kategoriye (Örn: Aksiyon) tıkladığında o kategoriye ait içerikleri listelemek.
* **Kullanılacak Servis:** `GET /api/Category/{categoryName}` veya `GET /api/Category/{id}`
* **Beklenen Durum:** Kategori bulunursa `200 OK`, geçersiz id/isim gönderilirse `404 Not Found` döner.

### 3. İçerik Oynatma (Play) Senaryosu
* **Amaç:** Kullanıcı bir filmi izlemek için 'Oynat' butonuna bastığında video akışını başlatmak.
* **Güvenlik Notu:** Bu işlem **yetkilendirme gerektirir**. İsteğin Header (başlık) kısmına `Bearer <JWT_TOKEN>` eklenmelidir.
* **Beklenen Durum:** Token geçerliyse `200 OK`, token yoksa veya süresi dolmuşsa `401 Unauthorized` hatası döner.
