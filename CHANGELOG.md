# Changelog

Tüm önemli değişiklikler bu dosyada belgelenir.

## [Unreleased]

### ✨ Eklenenler

#### Güvenlik & Altyapı

- **Middleware**: Auth koruması ve route yönlendirme (`middleware.ts`)
- **Environment Validation**: Zod ile runtime env kontrolü (`src/lib/env.ts`)
- **Security Headers**: HSTS, X-Frame-Options, CSP vb. (`next.config.ts`)
- **Health Check**: Docker healthcheck endpoint'i (`/api/health`)
- **API Error Handler**: Merkezi error handling utilities (`src/lib/api-error.ts`)

#### UI Components & Features

- **DataTable Component**: Tanstack Table tabanlı, sorting/filtering/pagination (`src/components/data-table/`)
- **Breadcrumb Component**: Otomatik URL-based navigation (`src/components/breadcrumb.tsx`)
- **Pagination Component**: Server-side pagination (`src/components/pagination.tsx`)
- **StatsCard Component**: Dashboard istatistik kartları (`src/components/stats-card.tsx`)
- **EmptyState Component**: Boş liste durumları (`src/components/empty-state.tsx`)
- **ConfirmDialog Component**: Onay dialog'ları (`src/components/confirm-dialog.tsx`)
- **FileUpload Component**: Drag & drop file upload (`src/components/file-upload.tsx`)
- **Error States Component'leri**: Paylaşılabilir error/loading/404 UI (`src/components/error-states/`)
  - `NotFoundContent` - Özelleştirilebilir 404 sayfası
  - `ErrorContent` - Özelleştirilebilir error boundary
  - `LoadingContent` - Özelleştirilebilir loading spinner

#### Custom Hooks

- **useDebounce**: Search input'ları için debounce (`src/hooks/use-debounce.ts`)
- **useCopyToClipboard**: Toast feedback ile clipboard (`src/hooks/use-copy-to-clipboard.ts`)
- **useMobile**: Responsive breakpoint hook (zaten vardı)

#### UI Library

- **Alert Dialog**: Shadcn alert-dialog component'i eklendi

#### Developer Experience

- **Format Utilities**: Para, tarih, dosya boyutu formatları (`src/lib/format.ts`)
- **React Query DevTools**: Development modunda otomatik aktif
- **Package Scripts**: `clean` ve `analyze` komutları eklendi

### 🔧 İyileştirmeler

#### Routing & Navigation

- Ana sayfa (`/`) artık token kontrolü yapıyor:
  - Giriş yapmışsa → `/dashboard`
  - Yapmamışsa → `/login`
- Sidebar'dan "Kimlik Doğrulama" grubu kaldırıldı (Giriş, Kayıt, Şifre Sıfırla)
- Login sayfasında "Şifremi unuttum" linki mevcut
- Breadcrumb navigation tüm sayfalara eklendi

#### Users Sayfası

- DataTable component'i ile yeniden yazıldı
- Sorting ve filtering desteği
- Column definitions ayrı dosyada (`columns.tsx`)
- Copy to clipboard özelliği

#### Metadata & SEO

- Tüm sayfalara metadata eklendi:
  - Ana sayfa
  - Dashboard sayfası
  - Login/Register/Forgot Password sayfaları

#### Loading States

- Root level loading (`app/loading.tsx`)
- Auth level loading (`app/(auth)/loading.tsx`)
- Dashboard level loading (`app/(admin)/dashboard/loading.tsx`)

#### Error Handling

- Root level error boundary (`app/error.tsx`)
- Dashboard level error boundary (`app/(admin)/dashboard/error.tsx`)
- Tüm error boundary'ler artık `ErrorContent` component'ini kullanıyor

#### Accessibility

- `main` element'e `id="main-content"` eklendi
- Skip to content linki eklendi
- Semantic HTML iyileştirmeleri

### 📝 Dokümantasyon

- **ARCHITECTURE.md**: Güncel klasör yapısı ve yeni özellikler
- **COMPONENTS.md**: 🆕 Component kütüphanesi ve kullanım örnekleri
- **README.md**: Daha detaylı kurulum ve kullanım rehberi
- **CHANGELOG.md**: 🆕 Tüm değişikliklerin kaydı
- **.gitignore**: IDE ve test dosyaları eklendi

### 🐛 Düzeltmeler

- Environment validation tip hataları düzeltildi
- Sidebar toggle mobile'da düzgün çalışıyor
- Dashboard layout padding responsive yapıldı
- Header'a mobile sidebar toggle eklendi

---

## Önceki Sürümler

### [0.1.0] - İlk Sürüm

#### Temel Özellikler

- Next.js 15 App Router
- TypeScript
- Tailwind CSS 4
- Shadcn/UI bileşenleri
- React Query (veri yönetimi)
- Zustand (state management)
- Dark/Light tema
- Responsive tasarım
- Mock auth sistemi
- E2E testler (Playwright)
- Docker desteği

#### Sayfa Yapısı

- Dashboard (Panel, Analitik, Kullanıcılar, Ürünler, Formlar, Dosyalar, Ayarlar)
- Auth (Login, Register, Forgot Password)
- Tipografi, Layout, Bileşenler demo sayfaları

#### Altyapı

- Service layer (API client)
- React Query hooks
- Zustand stores
- Form validation (react-hook-form + zod)
- Toast notifications (sonner)
- CI/CD pipeline (GitHub Actions)
