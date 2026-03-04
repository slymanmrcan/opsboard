# Deployment (GitHub Actions + GHCR + VPS)

Bu proje GitHub Pages'e uygun değildir (Next.js server runtime, proxy ve auth akışı var).  
Bu nedenle deployment modeli: **GitHub Actions -> GHCR image -> VPS üzerinde Docker run**.

## 1. Server Hazırlığı

Sunucuda şu araçlar kurulu olmalı:

1. Docker
2. Docker daemon erişimi olan bir kullanıcı
3. SSH ile erişim

Opsiyonel önerilen klasör yapısı:

```bash
sudo mkdir -p /opt/opsboard
sudo chown -R $USER:$USER /opt/opsboard
```

## 2. Env Dosyası (Server)

Sunucuda bir env dosyası oluştur:

`/opt/opsboard/.env`

Örnek:

```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://senin-domainin.com
NEXT_PUBLIC_API_URL=https://api.senin-domainin.com
NEXT_PUBLIC_MOCK_AUTH=false
NEXT_PUBLIC_DISABLE_MIDDLEWARE=false
```

## 3. GitHub Secrets

Repo -> `Settings` -> `Secrets and variables` -> `Actions` kısmında aşağıdakileri ekle:

Zorunlu:

1. `DEPLOY_SSH_HOST` - Sunucu IP veya domain
2. `DEPLOY_SSH_USER` - SSH kullanıcı adı
3. `DEPLOY_SSH_KEY` - Private key (PEM/OpenSSH)
4. `GHCR_USERNAME` - GHCR kullanıcı adı
5. `GHCR_READ_TOKEN` - `read:packages` yetkili token

Opsiyonel:

1. `DEPLOY_SSH_PORT` - Varsayılan `22`
2. `DEPLOY_CONTAINER_NAME` - Varsayılan `opsboard`
3. `DEPLOY_HOST_PORT` - Varsayılan `4008`
4. `DEPLOY_ENV_FILE` - Varsayılan `/opt/opsboard/.env`

## 4. Workflow Akışı

Yeni workflow dosyası:

`/.github/workflows/deploy.yml`

Tetiklenme:

1. `Container Publish` başarılı bitince otomatik (main/master)
2. Manuel tetikleme (`workflow_dispatch`)

Yaptığı işlem:

1. GHCR'dan `ghcr.io/<owner>/<repo>:latest` image çeker
2. Mevcut container varsa siler
3. Yeni container'ı `--env-file` ile ayağa kaldırır

## 5. İlk Canlı Alma

1. `main` branch'ine push yap
2. `Container Publish` workflow'unu kontrol et
3. Ardından `Deploy` workflow'un başarılı bittiğini doğrula
4. Sunucuda:

```bash
docker ps
docker logs -f opsboard
```

## 6. Notlar

1. Eğer reverse proxy (Nginx/Caddy/Traefik) kullanıyorsan app'i `DEPLOY_HOST_PORT` üzerinden proxy et.
2. TLS/HTTPS termination reverse proxy tarafında yapılmalı.
3. `latest` yerine immutable tag ile deploy etmek istersen workflow tag stratejisi genişletilebilir.
