TR:
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
İNG:
# Video on Demand (VOD) Backend API

This project provides the backend services for a VOD (Video on Demand) platform where users can list movies, filter by categories, and stream content.

## 🚀 Technologies & Architecture
* **Framework:** .NET Core (RESTful Web API)
* **Security (Authentication):** JWT (JSON Web Token) based authorization.
* **Performance (Caching):** IMemoryCache integration to reduce database load and improve response times.
* **Traceability (Logging):** Rolling file logging with Serilog.
* **Error Handling:** Global Exception Handling (Middleware) for a seamless and uninterrupted user experience.
* **Documentation:** Swagger / OpenAPI

## ⚙️ Setup and Execution
Follow the steps below to run the project in your local environment:
1. Open your terminal in the project directory.
2. Run the `dotnet restore` command to install the required dependencies.
3. Run the `dotnet run` command to start the application.
4. Navigate to `https://localhost:<port>/swagger` in your browser to access the API documentation.

---

## 🎯 Use Cases for Frontend Developers

The following API endpoints should be used according to the specific screens during frontend integration:

### 1. Home Page Scenario
* **Purpose:** To fetch all available movies to be displayed on the main storefront when the user opens the application.
* **Endpoint to Use:** `GET /api/Movie`
* **Expected Response:** `200 OK` (Returns the list of movies).

### 2. Category Detail Scenario
* **Purpose:** To list the content belonging to a specific category (e.g., Action) when the user selects it from the menu.
* **Endpoint to Use:** `GET /api/Category/{categoryName}` or `GET /api/Category/{id}`
* **Expected Response:** Returns `200 OK` if the category is found, or `404 Not Found` if an invalid ID/name is provided.

### 3. Content Play Scenario
* **Purpose:** To start the video stream when the user clicks the 'Play' button for a specific movie.
* **Security Note:** This operation **requires authorization**. A valid token must be added to the request header as `Bearer <JWT_TOKEN>`.
* **Expected Response:** Returns `200 OK` if the token is valid, or `401 Unauthorized` if the token is missing or expired.
