# Deployment (GitHub Actions + GitHub Pages)

Bu kurulum sadece frontend publish içindir.

## 1. GitHub Pages Ayarı

Repo -> `Settings` -> `Pages`:

1. `Build and deployment` altında source olarak `GitHub Actions` seç.

## 2. Workflow

Deploy workflow dosyası:

`/.github/workflows/deploy.yml`

Tetiklenme:

1. `main/master` branch push
2. Manuel tetikleme (`workflow_dispatch`)

Akış:

1. `npm ci`
2. `NEXT_STATIC_EXPORT=true npm run build`
3. `out/` klasörünü artifact olarak upload
4. GitHub Pages'e deploy

## 3. Teknik Not

Static publish için build sırasında `NEXT_STATIC_EXPORT=true` kullanılır.  
Bu modda Next.js `export` çıktısı (`out/`) üretilir.
Bu nedenle API route ve proxy/middleware tarafı Pages üzerinde çalışmaz.
