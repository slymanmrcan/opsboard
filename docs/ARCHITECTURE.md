# Admin Panel Template — Yapı Dökümanı

## Tech Stack

| Teknoloji             | Versiyon | Amaç                              |
| --------------------- | -------- | --------------------------------- |
| Next.js               | 16.1.6   | App Router, RSC, Server Actions   |
| React                 | 19.2.3   | UI framework                      |
| TypeScript            | ^5       | Tip güvenliği                     |
| Tailwind CSS          | v4       | Utility-first CSS                 |
| Zod                   | ^4       | Schema validation                 |
| React Query           | ^5       | Server state management & caching |
| Zustand               | ^5       | Client state management           |
| Shadcn/UI             | Latest   | Reusable accessible components    |
| React Compiler        | 1.0.0    | Otomatik memoization              |
| react-hook-form + zod | ^7 / ^4  | Form yönetimi + validasyon        |
| recharts              | ^2.15    | Grafikler                         |
| next-themes           | ^0.4     | Dark/Light mode                   |
| lucide-react          | ^0.564   | İkon seti                         |
| Prettier              | ^3.8     | Kod formatlama                    |
| Playwright            | ^1.58    | E2E testing                       |

---

## Klasör Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (fonts, providers, metadata)
│   ├── page.tsx            # "/" → akıllı redirect (token kontrolü)
│   ├── not-found.tsx       # 404 sayfası
│   ├── error.tsx           # Global error boundary
│   ├── loading.tsx         # Root loading state
│   ├── globals.css         # Global styles + Tailwind
│   │
│   ├── api/                # API Routes
│   │   └── health/         # Health check endpoint (Docker için)
│   │
│   ├── (admin)/            # 🔒 Admin route group (sidebar layout)
│   │   └── dashboard/
│   │       ├── layout.tsx  # Sidebar + Header + Content wrapper
│   │       ├── page.tsx    # /dashboard
│   │       ├── error.tsx   # Dashboard error boundary
│   │       ├── loading.tsx # Dashboard loading state
│   │       ├── analytics/  # /dashboard/analytics
│   │       ├── users/      # /dashboard/users
│   │       ├── products/   # /dashboard/products
│   │       ├── forms/      # /dashboard/forms
│   │       ├── files/      # /dashboard/files
│   │       ├── settings/   # /dashboard/settings
│   │       ├── typography/ # /dashboard/typography
│   │       ├── layout/     # /dashboard/layout
│   │       ├── components/ # /dashboard/components
│   │       └── auth/       # Demo auth pages (sidebar'da yok)
│   │           ├── login/
│   │           └── register/
│   │
│   └── (auth)/             # 🔓 Auth route group (split-screen layout)
│       ├── layout.tsx      # Sol branding + sağ form
│       ├── loading.tsx     # Auth loading state
│       ├── login/          # /login
│       ├── register/       # /register
│       └── forgot-password/# /forgot-password
│
├── components/             # UI bileşenleri
│   ├── ui/                 # shadcn/ui (button, card, dialog vs.)
│   ├── header/             # Header (search, notifications, user menu)
│   │   ├── index.tsx
│   │   ├── search-bar.tsx
│   │   ├── notifications.tsx
│   │   └── user-menu.tsx
│   ├── sidebar/            # Sidebar (brand, nav-menu)
│   │   ├── index.tsx
│   │   ├── brand.tsx
│   │   └── nav-menu.tsx
│   ├── auth/               # Auth bileşenleri
│   │   ├── login-card.tsx
│   │   └── register-card.tsx
│   ├── error-states/       # 🆕 Paylaşılabilir error/loading UI
│   │   ├── not-found-content.tsx
│   │   ├── error-content.tsx
│   │   ├── loading-content.tsx
│   │   └── index.ts
│   ├── theme-toggle.tsx    # Dark/Light toggle butonu
│   └── skip-to-content.tsx # 🆕 Accessibility - klavye navigasyonu
│
├── config/                 # ⚙️ Proje konfigürasyonu
│   ├── site.ts             # Proje adı, açıklama, URL, locale
│   ├── nav.ts              # Sidebar menü yapılandırması
│   └── index.ts            # Barrel export
│
├── constants/              # 📋 Sabit değerler
│   └── index.ts            # PAGE_SIZE, BREAKPOINTS, DATE_FORMATS
│
├── hooks/                  # 🪝 Custom React hooks
│   ├── use-mobile.ts       # Breakpoint hook
│   ├── use-users.ts        # React Query - users hook
│   └── use-form-templates.ts # React Query - form templates hook
│
├── lib/                    # 🔧 Utility fonksiyonlar
│   ├── utils.ts            # cn() — Tailwind class merge
│   ├── env.ts              # 🆕 Environment validation (Zod)
│   └── format.ts           # 🆕 Format utilities (currency, date, file size)
│
├── providers/              # 🎁 Context Providers
│   ├── theme-provider.tsx  # next-themes wrapper
│   ├── query-provider.tsx  # React Query + DevTools
│   ├── auth-provider.tsx   # Auth token validation
│   └── index.ts            # Barrel export
│
├── services/               # 🌐 API katmanı
│   ├── api.ts              # Fetch wrapper + interceptors
│   ├── auth-service.ts     # Login, register, logout
│   ├── user-service.ts     # User CRUD operations
│   ├── form-templates-service.ts # Form templates
│   └── index.ts            # Barrel export
│
├── store/                  # 📦 Zustand stores
│   └── auth-store.ts       # User, token, login/logout state
│
└── types/                  # 📝 Global TypeScript tipleri
    └── index.ts            # ApiResponse, User, BaseEntity, etc.
```

---

## 🆕 Yeni Eklenenler

### 1. Middleware (`middleware.ts`)

- Auth koruması: `/dashboard/*` route'ları token kontrolü yapar
- Giriş yapmamış kullanıcıları `/login`'e yönlendirir
- Giriş yapmış kullanıcıları auth sayfalarından `/dashboard`'a yönlendirir
- `NEXT_PUBLIC_DISABLE_MIDDLEWARE=true` ile devre dışı bırakılabilir

### 2. Environment Validation (`src/lib/env.ts`)

- Zod ile runtime environment variable kontrolü
- Tip güvenliği sağlar (`env.NEXT_PUBLIC_MOCK_AUTH` → `boolean`)
- Hatalı config ile production'a çıkmayı engeller

### 3. Error States Component'leri (`src/components/error-states/`)

- **NotFoundContent**: Özelleştirilebilir 404 UI
- **ErrorContent**: Özelleştirilebilir error boundary UI
- **LoadingContent**: Özelleştirilebilir loading spinner
- Props ile mesaj, buton, URL değiştirilebilir
- Tüm `not-found.tsx`, `error.tsx`, `loading.tsx` dosyalarında kullanılıyor

### 4. Format Utilities (`src/lib/format.ts`)

- `formatCurrency()` - Para formatı (₺1.234,56)
- `formatNumber()` - Sayı formatı (1.234)
- `formatDate()` - Tarih formatı (24 Şubat 2026)
- `formatRelativeTime()` - Göreceli zaman (2 saat önce)
- `formatFileSize()` - Dosya boyutu (1.5 MB)
- `truncate()` - Metin kısaltma
- `capitalize()` - İlk harf büyük
- `getInitials()` - İsimden baş harfler (John Doe → JD)

### 5. Security Headers (`next.config.ts`)

- HSTS (Strict-Transport-Security)
- X-Frame-Options (SAMEORIGIN)
- X-Content-Type-Options (nosniff)
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

### 6. Health Check Endpoint (`/api/health`)

- Docker healthcheck için
- Status, timestamp, uptime bilgisi döner

### 7. Accessibility İyileştirmeleri

- Skip to content linki (klavye navigasyonu)
- `main` element'e `id="main-content"` eklendi
- ARIA labels ve semantic HTML

### 8. React Query DevTools

- Development modunda otomatik aktif
- Query cache'i görselleştirme
- Debug için kullanışlı

---

## Data Fetching Strategy

1.  **Service Layer:**
    - `src/services/` altında ham API istekleri yapılır (fetch tabanlı client kullanılır).
    - Mock data desteği buradadır (`NEXT_PUBLIC_MOCK_AUTH=true`).
    - Interceptor'lar: Auth token ekleme, 401 handling, global error toast

2.  **React Query Hooks:**
    - Componentlerde servisleri doğrudan çağırmayız.
    - `src/hooks/` altında `useQuery` veya `useMutation` hook'ları oluştururuz.
    - Örnek: `useUsers` hook'u `userService.getUsers`'ı çağırır ve cache yönetimini yapar.

3.  **Global State (Zustand):**
    - Sadece **Client State** (Auth user, Token, Theme, Sidebar open/close) burada tutulur.
    - Sunucudan gelen veriler (Users list, Products list) **React Query**'de tutulur.
    - `persist` middleware ile localStorage'a kaydedilir

## 🚀 Yeni Özellik Ekleme

Yeni bir rota veya özellik eklemek için (Örn: Courses, Orders) detaylı rehberi inceleyin:
👉 **[Yeni Özellik Ekleme Rehberi (Adım Adım)](./ADD_NEW_FEATURE.md)**

## Route Groups Nasıl Çalışır?

Parantezli klasörler `(admin)`, `(auth)` **URL'yi etkilemez**, sadece layout gruplar:

```
(admin)/dashboard/page.tsx  → /dashboard
(auth)/login/page.tsx       → /login
```

Yeni layout ihtiyacı olursa yeni bir route group eklenir:

```
(marketing)/        → Navbar + Footer layout
(onboarding)/       → Wizard layout
```

Her grubun kendi `layout.tsx`'i vardır.

---

## Config Dosyaları

### `config/site.ts`

Yeni proje açınca tek değiştirmen gereken yer:

```ts
export const siteConfig = {
  name: "Opsboard",
  description: "Operasyonları tek ekranda yöneten modern admin panel",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  locale: "tr",
}
```

### `config/nav.ts`

Sidebar menü grupları burada tanımlı. Yeni sayfa ekleyince sadece buraya eklenir:

```ts
export const navConfig: NavGroup[] = [
  {
    label: "Genel",
    items: [
      { title: "Panel", icon: LayoutDashboard, url: "/dashboard" },
      { title: "Analitik", icon: BarChart3, url: "/dashboard/analytics" },
    ],
  },
  // ...
]
```

Her `NavItem` şu tipleri destekler: `title`, `url`, `icon`, `badge?`, `disabled?`

---

## Services — API Kullanımı

`services/api.ts` generic bir fetch wrapper:

```ts
import { api } from "@/services"
import type { ApiResponse, User } from "@/types"

// GET
const users = await api.get<ApiResponse<User[]>>("/users")

// POST
await api.post<ApiResponse<User>>("/users", { name: "Ali", email: "ali@test.com" })

// PUT
await api.put<ApiResponse<User>>("/users/1", { name: "Ali Yeni" })

// DELETE
await api.delete<ApiResponse<void>>("/users/1")
```

### Interceptor'lar

1. **Request Interceptor**: Otomatik `Bearer` token ekler
2. **Response Interceptor**: 401 hatasında token refresh dener, başarısızsa logout yapar
3. **Error Interceptor**: Global toast mesajları gösterir

`NEXT_PUBLIC_API_URL` env variable'ı ile base URL değiştirilir.

---

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

Tüm env variable'lar `src/lib/env.ts` ile validate edilir.

---

## Scripts

| Komut                  | Açıklama                  |
| ---------------------- | ------------------------- |
| `npm run dev`          | Development server        |
| `npm run build`        | Production build          |
| `npm run start`        | Production server         |
| `npm run lint`         | ESLint kontrolü           |
| `npm run lint:fix`     | ESLint auto-fix           |
| `npm run format`       | Prettier ile formatla     |
| `npm run format:check` | Format kontrolü (CI için) |
| `npm run type-check`   | TypeScript tip kontrolü   |
| `npm test`             | Playwright E2E testleri   |
| `npm run test:ui`      | Playwright UI modu        |
| `npm run test:debug`   | Playwright debug modu     |
| `npm run clean`        | Cache temizleme           |
| `npm run analyze`      | Bundle size analizi       |

---

## Core Infrastructure

### 1. State Management (Zustand)

- `useAuthStore` (`store/auth-store.ts`): User, token, login/logout.
- LocalStorage'a persist edilir (`auth-storage` key)

### 2. API Client & Auth

- Interceptor'lar (`services/api.ts`):
  - **Request**: Otomatik `Bearer` token ekler.
  - **Response**: 401 hatasında token refresh dener, başarısızsa logout yapar.
  - **Error**: Global hata mesajlarını (toast) yönetir.
- Auth Service (`services/auth-service.ts`): Login, register, logout, getCurrentUser, refreshToken metodları.
- Mock auth desteği: `NEXT_PUBLIC_MOCK_AUTH=true`

### 3. Middleware

- `middleware.ts`: Protected route (`/dashboard/*`) kontrolü yapar.
- Token yoksa `/login?from=/dashboard/...` şeklinde yönlendirir
- Giriş yapmış kullanıcıları auth sayfalarından dashboard'a yönlendirir
- `NEXT_PUBLIC_DISABLE_MIDDLEWARE=true` ile devre dışı bırakılabilir

### 4. Toast Notifications

- `sonner` ve `Toaster` bileşeni ile global bildirimler.
- `toast.success("OK")` veya `toast.error("Hata")` şeklinde kullanılır.
- API hatalarında otomatik toast gösterilir

### 5. Error Boundaries

- Root level: `app/error.tsx` (global hatalar)
- Dashboard level: `app/(admin)/dashboard/error.tsx` (dashboard hataları)
- Tüm error boundary'ler `ErrorContent` component'ini kullanır

### 6. Loading States

- Root level: `app/loading.tsx`
- Auth level: `app/(auth)/loading.tsx`
- Dashboard level: `app/(admin)/dashboard/loading.tsx`
- Tüm loading state'ler `LoadingContent` component'ini kullanır

---

## Docker

### Dockerfile

- Multi-stage build (deps → builder → runner)
- Standalone output (küçük image boyutu)
- Non-root user (güvenlik)
- Health check desteği

### docker-compose.yml

- Port: 4008:3000
- Resource limits (CPU: 1, Memory: 512M)
- Security options (no-new-privileges, cap_drop)
- Health check: `/api/health`

---

## Yeni Proje Başlatma Checklist

1. ✅ `config/site.ts` → proje adı, URL, locale değiştir
2. ✅ `config/nav.ts` → sidebar menüsünü düzenle
3. ✅ `globals.css` → renk paletini değiştir (oklch değerleri)
4. ✅ `app/(admin)/dashboard/` → sayfa ekle/çıkar
5. ✅ `.env.example`'ı `.env.local`'a kopyala, değerleri doldur
6. ✅ `public/favicon/` → favicon dosyalarını değiştir
7. ✅ `middleware.ts` → auth kurallarını özelleştir
8. ✅ `npm run format` ile kodu formatla
9. ✅ `npm run type-check` ile tip kontrolü yap
10. ✅ `npm test` ile E2E testleri çalıştır

---

## Best Practices

### 1. Component Organizasyonu

- `app/` içindeki dosyalar Next.js convention'ı (page, layout, error, loading, not-found)
- `components/` içindeki dosyalar paylaşılabilir UI component'leri
- Error/loading state'leri için component wrapper kullan

### 2. State Management

- Server state → React Query
- Client state → Zustand
- Form state → react-hook-form

### 3. API Calls

- Servisleri direkt çağırma, React Query hook'ları kullan
- Error handling API layer'da yapılır (toast)
- Mock data desteği için env variable kullan

### 4. Type Safety

- Tüm API response'ları tip tanımlı
- Environment variable'lar validate edilmiş
- Zod ile runtime validation

### 5. Accessibility

- Semantic HTML kullan
- ARIA labels ekle
- Klavye navigasyonu destekle
- Skip to content linki ekle

### 6. Performance

- React Compiler aktif (otomatik memoization)
- Image optimization (next/image)
- Font optimization (next/font)
- Code splitting (dynamic import)
- React Query caching

### 7. Security

- Security headers aktif
- CSRF protection
- XSS protection
- Input validation (Zod)
- Environment variable validation
