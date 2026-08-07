# 📱DKZ VOD & Streaming Platform (Full-Stack)

[🇬🇧 English](#-english) | [🇹🇷 Türkçe](#-türkçe)

---

## 🇬🇧 English

This project is a full-stack **Video on Demand (VOD)** platform where users can browse movies, filter by categories, like items, manage personal watchlists, and handle secure authentication (JWT & OTP Email Verification).

### 🚀 Tech Stack & Architecture

#### 🔙 Backend (API)
* **Framework:** .NET Core (RESTful Web API)
* **Database / ORM:** Supabase (PostgreSQL) & Entity Framework Core
* **Security:** JWT (JSON Web Token) authorization and SMTP (Gmail OTP) Password Reset service.
* **Performance:** IMemoryCache integration to reduce database load.

#### 📱 Frontend (Mobile)
* **Framework:** React Native / Expo (Expo Router)
* **UI/UX:** Modern dark-mode interface inspired by Netflix / Digiturk.
* **State & Storage:** Asynchronous local storage (`AsyncStorage`) and secure token management.

### 📂 Project Structure
```text
DKZVOD/
│
├── Backend/          # .NET Core Web API services and database contexts
└── Mobil/            # Expo-based React Native mobile application

TR:
🔙 Backend (API)
Çatı (Framework): .NET Core (RESTful Web API)

Veritabanı / ORM: Supabase (PostgreSQL) & Entity Framework Core

Güvenlik: JWT (JSON Web Token) tabanlı yetkilendirme ve SMTP (Gmail OTP) Şifre Sıfırlama altyapısı.

Performans: Bellek maliyetlerini düşürmek için IMemoryCache entegrasyonu.

📱 Frontend (Mobil)
Çatı (Framework): React Native / Expo (Expo Router)

Arayüz (UI/UX): Modern, karanlık tema (Dark Mode) Netflix / Digiturk hibrit arayüz tasarımı.

Veri Yönetimi: Asenkron yerel depolama (AsyncStorage) ve güvenli token yönetimi.
