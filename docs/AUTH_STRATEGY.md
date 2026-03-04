# Authentication Strategy Guide

Bu doküman, web tabanlı admin panel projelerinde kimlik doğrulama ve oturum yönetimi için uygulanabilir best practice yaklaşımını anlatır.
Odak: Next.js/React tabanlı uygulamalar.

## 1. Hedefler

İyi bir auth mimarisi aynı anda şu ihtiyaçları karşılamalıdır:

1. Güvenlik: XSS/CSRF/token theft gibi riskleri azaltmak.
2. Tutarlılık: Client, middleware ve server tarafında aynı auth kaynağına bakmak.
3. Basitlik: Ekip için anlaşılır, bakım maliyeti düşük bir model.
4. Ölçeklenebilirlik: Büyüyen sistemde policy değişikliklerini kolayca uygulayabilmek.
5. Operasyonel kontrol: Oturum iptali, audit log, incident response desteği.

## 2. Önce Yanlışları Netleştirelim

1. Token'ı HTML `meta` tag içine koymak güvenli değildir.
2. Token'ı `localStorage`/`sessionStorage` içinde saklamak XSS riskini büyütür.
3. Aynı anda hem cookie hem client store (kaynak-of-truth belirsiz) kullanmak redirect/SSR bug'larına yol açar.
4. "Uzun süreli tek token" modeli, çalınma sonrası hasarı ciddi artırır.

## 3. Temel Kavramlar

1. Access token: API erişimi için kısa ömürlü kimlik kanıtı.
2. Refresh token: Access token yenileme için daha uzun ömürlü kimlik kanıtı.
3. Session ID (opaque token): Sunucuda tutulan oturumu işaret eden rastgele ID.
4. HttpOnly cookie: JavaScript tarafından okunamayan cookie.
5. SameSite: CSRF riskini azaltan cookie davranışı.

## 4. Senaryo Bazlı Önerilen Mimari

### 4.1 Web Admin Panel (SSR/App Router) - Varsayılan Öneri

Önerilen model: **Server-managed session + HttpOnly cookie**

1. Login sonrası server bir session oluşturur.
2. Browser'a `Set-Cookie` ile `session` cookie gönderilir.
3. Middleware ve server route handler'lar yalnızca bu cookie'yi doğrular.
4. Client tarafı sadece `/me` gibi endpoint'lerden kullanıcı bilgisini çeker.

Neden iyi:

1. JS token okuyamadığı için XSS ile token çalma zorlaşır.
2. SSR ve route guard mantığı doğal olarak uyumludur.
3. Logout/revoke sunucudan merkezi yönetilir.

### 4.2 SPA + Ayrı API Domain

1. Cookie tabanlı model hala güçlüdür.
2. `credentials: include`, CORS allowlist ve `SameSite=None; Secure` dikkatli ayarlanmalıdır.
3. CSRF koruması zorunludur (double-submit veya synchronizer token).

### 4.3 Mobile Native

1. Cookie yerine access/refresh token yaygındır.
2. Token'lar secure storage (Keychain/Keystore) içinde tutulur.
3. Refresh rotation ve cihaz bağlı oturum politikası önerilir.

### 4.4 Service-to-Service

1. User session yerine OAuth2 Client Credentials tercih edilir.
2. Kısa ömürlü token + secret vault yönetimi gerekir.

## 5. Cookie Ayarları (Web İçin Zorunlu Baseline)

Session veya refresh cookie için:

1. `HttpOnly=true`
2. `Secure=true` (yalnızca HTTPS)
3. `SameSite=Lax` (çoğu panel için iyi default)
4. `Path=/`
5. `Domain` sadece gerektiğinde set edilmeli
6. `Max-Age` veya `Expires` policy'ye göre belirlenmeli

Örnek:

```ts
Set-Cookie: session=<opaque-id>; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=3600
```

Not:

1. Cross-site zorunluysa `SameSite=None; Secure` gerekir.
2. `None` seçimi CSRF riskini büyüttüğü için ek koruma şarttır.

## 6. Token/Session Süreleri (Risk Bazlı)

Tek doğru süre yoktur; risk seviyesine göre seçilir.

1. Düşük-orta risk iç panel:
   - Session idle timeout: 30-60 dk
   - Absolute session timeout: 8-24 saat
   - Remember me: 7-14 gün (opsiyonel)
2. İnternete açık admin:
   - Idle timeout: 15-30 dk
   - Absolute timeout: 8-12 saat
   - Yüksek yetkide yeniden doğrulama (step-up auth)
3. Yüksek risk (finans/production ops):
   - Idle timeout: 5-15 dk
   - Absolute timeout: 4-8 saat
   - MFA zorunlu

Prensip:

1. Süre uzadıkça kullanıcı konforu artar, çalınma hasarı da artar.
2. Süre kısaldıkça güvenlik artar, kullanıcı friksiyonu artar.

## 7. CSRF, XSS ve Diğer Kritik Kontroller

### 7.1 CSRF

1. `SameSite=Lax/Strict` kullan.
2. State-changing endpoint'lerde CSRF token doğrula.
3. `Origin`/`Referer` doğrulaması ekle.

### 7.2 XSS

1. Güçlü CSP uygula.
2. Kullanıcı girdisini sanitize/escape et.
3. `dangerouslySetInnerHTML` kullanımını sınırla.
4. Third-party script sayısını azalt.

### 7.3 Brute-force ve Abuse

1. Login endpoint rate limiting.
2. IP + account bazlı fail2ban/kilit mekanizması.
3. Şüpheli aktivitelerde step-up verification.

### 7.4 Session Hijacking

1. Session rotate (login, privilege escalation sonrası).
2. Logout'ta server-side invalidate.
3. Şüpheli cihaz/IP değişiminde oturum sonlandırma veya challenge.

## 8. Bu Proje İçin Önerilen Referans Mimari

Mevcut proje için öneri: **cookie-first, server truth, client cache**

1. Source of truth: `HttpOnly session cookie`.
2. Middleware/proxy kontrolü: yalnızca server cookie doğrulaması.
3. Client store: sadece UI amaçlı `user` bilgisi cache'i (token saklamadan).
4. `/login`: server action veya API route ile login, `Set-Cookie` server'dan.
5. `/logout`: cookie temizleme + session invalidate.
6. `/me`: authenticated user bilgisi.

Bu sayede:

1. `/dashboard` guard davranışı deterministik olur.
2. SSR redirect ile client hydration çakışması azalır.
3. Auth bug'larının çoğu "iki ayrı state kaynağı" probleminden çıkmaz.

## 9. JWT mi Opaque Session mı?

### Opaque Session (Önerilen default)

Artı:

1. Revoke etmek kolay.
2. Token payload leak riski yok.
3. Server kontrolü merkezidir.

Eksi:

1. Session store gerektirir (db/redis).

### JWT Access + Refresh

Artı:

1. Çok servisli dağıtık mimaride taşıması kolay.
2. Bazı stateless doğrulama akışları için uygun.

Eksi:

1. Revoke ve rotation tasarımı daha karmaşık.
2. Yanlış implementasyonda güvenlik açığı riski yüksek.

Karar kuralı:

1. Tek web app admin panel -> opaque session çoğunlukla daha doğru.
2. Çoklu bağımsız consumer/API ekosistemi -> JWT değerlendirilir.

## 10. Login/Refresh/Logout Akışları

### 10.1 Login

1. Credential doğrula.
2. Session oluştur.
3. `Set-Cookie` dön.
4. Başarılı response + kullanıcı profili dön.

### 10.2 Session Yenileme

1. Sliding session uygulanacaksa sadece güvenilir event'lerde uzat.
2. Her request'te sınırsız uzatma yapma.
3. Absolute timeout aşıldığında zorunlu re-auth.

### 10.3 Logout

1. Server-side session invalidate.
2. Cookie expire et.
3. Tüm cihazlardan çıkış opsiyonu sun (high-risk panellerde).

## 11. Yetkilendirme (Authorization) Ayrımı

AuthN (kim olduğunu kanıtlamak) ile AuthZ (ne yapabildiğin) ayrı katman olmalı.

1. Role-based policy (RBAC) baseline.
2. Gerekirse resource-level ABAC/policy checks.
3. UI'da gizleme tek başına yeterli değil; API tarafı kesin kontrol etmeli.

## 12. Operasyonel Gereksinimler

1. Audit log:
   - login success/fail
   - logout
   - role değişiklikleri
   - kritik aksiyonlar
2. Gözlemlenebilirlik:
   - auth error rate
   - suspicious login alarmı
   - token refresh anomaly
3. Incident playbook:
   - token/session compromise durumunda global revoke
   - zorunlu parola reset
   - güvenlik bildirimi

## 13. Uygulama Checklist'i

1. HttpOnly/Secure/SameSite cookie aktif mi?
2. Source of truth tek mi?
3. CSRF koruması var mı?
4. Login rate limit var mı?
5. Session rotate + revoke destekleniyor mu?
6. Middleware + SSR + client davranışı tutarlı mı?
7. E2E testlerde "guard gerçekten engelliyor mu" assert ediliyor mu?
8. Audit log tutuluyor mu?
9. MFA policy tanımlı mı?
10. Dokümantasyon ve env vars üretim için güvenli default mu?

## 14. Sık Yapılan Hatalar

1. Token'ı localStorage'a koyup bunu "stateless ve kolay" sanmak.
2. Refresh token'ı da client JS erişimine açmak.
3. Logout'ta yalnızca client state temizlemek, server revoke yapmamak.
4. E2E testte gevşek assertion kullanıp false positive üretmek.
5. Dev kolaylığı için middleware kapatıp bunu default bırakmak.

## 15. Önerilen Default Politika (Hızlı Başlangıç)

Bu template için güvenli başlangıç policy:

1. `NEXT_PUBLIC_DISABLE_MIDDLEWARE=false` (default).
2. Prod'da yalnızca HTTPS.
3. Session cookie: `HttpOnly + Secure + SameSite=Lax`.
4. Idle timeout: 30 dk, absolute timeout: 12 saat.
5. Login attempt rate limit: örn. 5 deneme / 15 dk / hesap+IP.
6. Kritik işlemlerde son 5 dk içinde re-auth veya MFA challenge.
7. E2E'de route guard testleri kesin redirect/403 beklemeli.

## 16. Sonuç

Web admin panelde en dengeli yaklaşım genelde şudur:
**Server-managed session + HttpOnly cookie + güçlü CSRF/XSS kontrolleri + tek source of truth.**

Bu model, hem güvenlik hem bakım maliyeti açısından çoğu ekip için en sağlıklı varsayılandır.
