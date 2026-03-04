const AUTH_COOKIE_NAME = "token"
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24

export function setAuthCookie(token: string): void {
  if (typeof document === "undefined") {
    return
  }

  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}`
}

export function clearAuthCookie(): void {
  if (typeof document === "undefined") {
    return
  }

  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}

export function getAuthCookie(): string | null {
  if (typeof document === "undefined") {
    return null
  }

  const cookies = document.cookie ? document.cookie.split("; ") : []
  const entry = cookies.find((item) => item.startsWith(`${AUTH_COOKIE_NAME}=`))

  if (!entry) {
    return null
  }

  const value = entry.slice(AUTH_COOKIE_NAME.length + 1)
  return value ? decodeURIComponent(value) : null
}
