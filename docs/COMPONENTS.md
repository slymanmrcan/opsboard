# Component Kütüphanesi

Admin template'de kullanılan özel component'ler ve kullanım örnekleri.

## 📊 DataTable

Tanstack Table tabanlı, sorting, filtering ve pagination destekli tablo component'i.

### Özellikler

- ✅ Sıralama (sorting)
- ✅ Filtreleme (search)
- ✅ Sayfalama (pagination)
- ✅ Özelleştirilebilir kolonlar
- ✅ Responsive tasarım

### Kullanım

```tsx
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"

// 1. Kolon tanımları oluştur
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Ad",
  },
  {
    accessorKey: "email",
    header: "E-posta",
  },
]

// 2. Component'te kullan
<DataTable
  columns={columns}
  data={users}
  searchKey="name"
  searchPlaceholder="Kullanıcı ara..."
/>
```

### Gelişmiş Örnek (Sorting + Actions)

```tsx
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Ad <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleEdit(user)}>Düzenle</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(user)}>Sil</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
```

---

## 🍞 Breadcrumb

Otomatik breadcrumb navigation component'i. URL'den otomatik oluşturur.

### Kullanım

```tsx
import { Breadcrumb } from "@/components/breadcrumb"
;<Breadcrumb />
```

### Davranış

- `/dashboard` → Breadcrumb gösterilmez
- `/dashboard/users` → Home > Users
- `/dashboard/users/123` → Home > Users > 123

---

## 📄 Pagination

Server-side pagination için component.

### Kullanım

```tsx
import { Pagination } from "@/components/pagination"
;<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
  totalItems={100}
  itemsPerPage={10}
/>
```

---

## 🎨 StatsCard

Dashboard istatistik kartları için component.

### Kullanım

```tsx
import { StatsCard } from "@/components/stats-card"
import { Users } from "lucide-react"
;<StatsCard
  title="Toplam Kullanıcı"
  value="2,350"
  change={{ value: "+15.3%", trend: "up" }}
  icon={Users}
  description="geçen aydan"
/>
```

---

## 📭 EmptyState

Boş liste/tablo durumları için component.

### Kullanım

```tsx
import { EmptyState } from "@/components/empty-state"
import { Users } from "lucide-react"
;<EmptyState
  icon={Users}
  title="Henüz kullanıcı yok"
  description="İlk kullanıcıyı ekleyerek başlayın"
  action={{
    label: "Kullanıcı ekle",
    onClick: () => router.push("/users/new"),
  }}
/>
```

---

## ⚠️ ConfirmDialog

Onay dialog'u component'i.

### Kullanım

```tsx
import { ConfirmDialog } from "@/components/confirm-dialog"
import { useState } from "react"

const [open, setOpen] = useState(false)

<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  title="Kullanıcıyı sil"
  description="Bu işlem geri alınamaz. Kullanıcı kalıcı olarak silinecek."
  confirmText="Sil"
  cancelText="İptal"
  variant="destructive"
  onConfirm={handleDelete}
/>
```

---

## 📤 FileUpload

Drag & drop destekli dosya yükleme component'i.

### Kullanım

```tsx
import { FileUpload } from "@/components/file-upload"
import { useState } from "react"

const [files, setFiles] = useState<File[]>([])

<FileUpload
  accept="image/*"
  maxSize={5 * 1024 * 1024} // 5MB
  multiple={true}
  value={files}
  onFilesChange={setFiles}
/>
```

---

## 🎯 Error States

Paylaşılabilir error/loading/404 UI component'leri.

### NotFoundContent

```tsx
import { NotFoundContent } from "@/components/error-states"
;<NotFoundContent
  title="Ürün Bulunamadı"
  description="Bu ürün artık mevcut değil"
  backUrl="/products"
  backLabel="Ürünlere dön"
/>
```

### ErrorContent

```tsx
import { ErrorContent } from "@/components/error-states"
;<ErrorContent
  title="Kayıt Başarısız"
  message="Lütfen bilgilerinizi kontrol edin"
  onReset={handleRetry}
  showHomeButton={false}
/>
```

### LoadingContent

```tsx
import { LoadingContent } from "@/components/error-states"
;<LoadingContent message="Veriler yükleniyor..." />
```

---

## 🪝 Custom Hooks

### useDebounce

Search input'ları için debounce hook'u.

```tsx
import { useDebounce } from "@/hooks/use-debounce"
import { useState } from "react"

const [search, setSearch] = useState("")
const debouncedSearch = useDebounce(search, 500)

// debouncedSearch 500ms sonra güncellenir
useEffect(() => {
  fetchData(debouncedSearch)
}, [debouncedSearch])
```

### useCopyToClipboard

Panoya kopyalama hook'u (toast feedback ile).

```tsx
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"

const { copy, isCopied } = useCopyToClipboard()

<Button onClick={() => copy(user.id)}>
  {isCopied ? "Kopyalandı!" : "ID Kopyala"}
</Button>
```

### useMobile

Responsive breakpoint hook'u.

```tsx
import { useMobile } from "@/hooks/use-mobile"

const isMobile = useMobile()

{
  isMobile ? <MobileMenu /> : <DesktopMenu />
}
```

---

## 🔧 Utility Functions

### Format Utilities (`src/lib/format.ts`)

```tsx
import {
  formatCurrency,
  formatDate,
  formatFileSize,
  formatRelativeTime,
  getInitials,
} from "@/lib/format"

formatCurrency(1234.56) // "₺1.234,56"
formatDate(new Date()) // "24 Şubat 2026"
formatFileSize(1536000) // "1.46 MB"
formatRelativeTime(new Date()) // "2 saat önce"
getInitials("John Doe") // "JD"
```

### API Error Utilities (`src/lib/api-error.ts`)

```tsx
import { parseApiError, isApiError, ERROR_MESSAGES } from "@/lib/api-error"

try {
  await api.post("/users", data)
} catch (error) {
  const message = parseApiError(error)
  toast.error(message)

  if (isApiError(error, 401)) {
    // Unauthorized handling
  }
}
```

---

## 📝 Best Practices

### 1. DataTable Kullanımı

- Kolon tanımlarını ayrı dosyada tut (`columns.tsx`)
- Sorting için `header` prop'unu kullan
- Actions için `id` column kullan

### 2. Form Validation

- `react-hook-form` + `zod` kullan
- Error mesajlarını Türkçe yaz
- Toast feedback ver

### 3. Loading States

- Skeleton yerine spinner kullan (daha hızlı)
- Loading state'i component seviyesinde yönet
- Suspense boundary'ler kullan

### 4. Error Handling

- API error'ları otomatik toast gösterir
- Component seviyesinde error boundary kullan
- User-friendly mesajlar göster

### 5. Accessibility

- Semantic HTML kullan
- ARIA labels ekle
- Klavye navigasyonu destekle
- Skip to content linki ekle

---

## 🎨 Styling Guidelines

### Tailwind Classes

- `gap-4` yerine `space-y-4` kullan (vertical spacing için)
- `text-muted-foreground` kullan (secondary text için)
- `hover:` prefix'i ile hover state'leri ekle

### Component Variants

- Button: `default`, `destructive`, `outline`, `ghost`, `link`
- Badge: `default`, `secondary`, `destructive`, `outline`
- Card: Hover effect için `hover:shadow-md transition-shadow`

### Responsive Design

- Mobile-first yaklaşım
- `sm:`, `md:`, `lg:` breakpoint'leri kullan
- `useMobile()` hook'u ile conditional rendering
