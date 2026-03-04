# Deployment (GitHub Actions + Vercel)

Bu proje için Docker kullanmadan deploy modeli:
**GitHub Actions -> Vercel**.

## 1. Vercel Proje Bağlantısı

1. Repo'yu Vercel'e import et.
2. Vercel Project Settings içinde gerekli environment variable'ları tanımla.
3. Vercel üzerinden aşağıdaki değerleri al:
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

## 2. GitHub Secrets

Repo -> `Settings` -> `Secrets and variables` -> `Actions` içine ekle:

1. `VERCEL_TOKEN`
2. `VERCEL_ORG_ID`
3. `VERCEL_PROJECT_ID`

## 3. Workflow

Workflow dosyası:

`/.github/workflows/deploy.yml`

Tetiklenme:

1. `main/master` branch'ine push
2. Manuel tetikleme (`workflow_dispatch`)

Akış:

1. `npm ci`
2. `npm run build`
3. `vercel pull`
4. `vercel build --prod`
5. `vercel deploy --prebuilt --prod`

## 4. Önemli Not

GitHub Actions bir hosting ortamı değildir; kalıcı olarak uygulamayı ayakta tutmaz.  
Actions burada sadece build/deploy orchestrator olarak çalışır, app Vercel'de host edilir.
