# Opsboard

Next.js App Router tabanlı, React Query + Zustand + Shadcn/UI altyapısı ile operasyon yönetimi odaklı admin panel.
docker ile kurulum ve çalıştırma kolaylığı sağlar.

## Özellikler

- ✅ Next.js 15 App Router
- ✅ TypeScript
- ✅ Tailwind CSS 4
- ✅ Shadcn/UI bileşenleri
- ✅ React Query (veri yönetimi)
- ✅ Zustand (state management)
- ✅ Dark/Light tema
- ✅ Responsive tasarım
- ✅ Mock auth sistemi
- ✅ E2E testler (Playwright)
- ✅ Docker desteği
- ✅ Security headers
- ✅ SEO optimizasyonu

## Hızlı Başlangıç

```bash
# Bağımlılıkları yükle
npm install

# Environment dosyasını oluştur
cp .env.example .env.local

# Geliştirme sunucusunu başlat
npm run dev
```

Uygulama: http://localhost:3000

## Komutlar

- `npm run dev` — geliştirme sunucusu
- `npm run build` — production build
- `npm run start` — production sunucusu
- `npm run lint` — ESLint kontrolü
- `npm run lint:fix` — ESLint otomatik düzeltme
- `npm run format` — Prettier formatla
- `npm run type-check` — TypeScript tip kontrolü
- `npm test` — Playwright E2E testleri
- `npm run test:ui` — Playwright UI modu
- `npm run test:debug` — Playwright debug modu

## Docker ile Çalıştırma

```bash
# Image oluştur
docker build -t admin-panel .

# Container başlat
docker run -p 3000:3000 admin-panel
```

Docker Compose:

```bash
docker compose up --build
```

## Konfigürasyon

- `src/config/site.ts` — proje adı, açıklama, URL
- `src/config/nav.ts` — sidebar menü yapısı
- `src/app/globals.css` — tema ve renk paleti
- `.env.example` — örnek environment değişkenleri
- `middleware.ts` — auth middleware

## Environment Variables

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# API
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Mock Auth (geliştirme için)
NEXT_PUBLIC_MOCK_AUTH=true
NEXT_PUBLIC_DISABLE_MIDDLEWARE=true
```

## Mock Auth

Backend olmadan geliştirme için `.env.local` içine:

```bash
NEXT_PUBLIC_MOCK_AUTH=true
NEXT_PUBLIC_DISABLE_MIDDLEWARE=true
```

Mock kullanıcı:

- Email: herhangi bir email
- Password: herhangi bir şifre

## Özelleştirme Checklist

- [ ] `config/site.ts` → proje adı ve URL
- [ ] `config/nav.ts` → sidebar menüsü
- [ ] `globals.css` → tema renkleri
- [ ] `app/(admin)/dashboard/` → sayfa ekle/çıkar
- [ ] `src/app/layout.tsx` → SEO metadata
- [ ] `src/app/robots.ts` → robots.txt
- [ ] `src/app/sitemap.ts` → sitemap.xml
- [ ] `middleware.ts` → auth kuralları
- [ ] `public/favicon/` → favicon dosyaları

## Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── (admin)/           # Admin layout grubu
│   │   └── dashboard/     # Dashboard sayfaları
│   ├── (auth)/            # Auth layout grubu
│   └── api/               # API routes
├── components/            # React bileşenleri
│   ├── ui/               # Shadcn/UI bileşenleri
│   ├── header/           # Header bileşenleri
│   └── sidebar/          # Sidebar bileşenleri
├── config/               # Konfigürasyon dosyaları
├── constants/            # Sabitler
├── hooks/                # Custom React hooks
├── lib/                  # Utility fonksiyonlar
├── providers/            # Context providers
├── services/             # API servisleri
├── store/                # Zustand stores
└── types/                # TypeScript tipleri
```

## Dokümantasyon

- `docs/ARCHITECTURE.md` — Mimari kararlar ve klasör yapısı
- `docs/AUTH_STRATEGY.md` — Auth, session, cookie/token best practice rehberi
- `docs/DEPLOYMENT.md` — GitHub Actions ile GHCR + VPS deployment
- `docs/COMPONENTS.md` — Component kütüphanesi ve kullanım örnekleri
- `docs/ADD_NEW_FEATURE.md` — Yeni özellik ekleme
- `docs/REACT_QUERY.md` — React Query kullanımı
- `docs/STATE_MANAGEMENT.md` — State yönetimi
- `docs/FORM_TEMPLATES.md` — Form şablonları
- `docs/ONBOARDING.md` — Onboarding rehberi
- `docs/E2E_TESTING.md` — E2E test yazma

## Güvenlik

- Security headers (HSTS, CSP, X-Frame-Options, vb.)
- Middleware ile route koruması
- Token tabanlı auth
- Environment variable validation
- Input sanitization

## Performans

- React Compiler aktif
- Image optimization (next/image)
- Font optimization (next/font)
- Code splitting
- Lazy loading
- React Query caching

## Lisans

MIT
