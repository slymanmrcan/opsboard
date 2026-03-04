/**
 * API Error handling utilities
 */

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: unknown
  ) {
    super(message)
    this.name = "ApiError"
  }
}

/**
 * Parse error from API response or unknown error
 */
export function parseApiError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === "string") {
    return error
  }

  return "Beklenmeyen bir hata oluştu"
}

/**
 * Check if error is specific status code
 */
export function isApiError(error: unknown, status?: number): error is ApiError {
  if (!(error instanceof ApiError)) return false
  if (status === undefined) return true
  return error.status === status
}

/**
 * Common error messages for Turkish locale
 */
export const ERROR_MESSAGES = {
  NETWORK: "Bağlantı hatası. İnternet bağlantınızı kontrol edin.",
  UNAUTHORIZED: "Oturum süresi doldu. Lütfen tekrar giriş yapın.",
  FORBIDDEN: "Bu işlem için yetkiniz yok.",
  NOT_FOUND: "İstenen kaynak bulunamadı.",
  VALIDATION: "Lütfen form alanlarını kontrol edin.",
  SERVER: "Sunucu hatası. Lütfen daha sonra tekrar deneyin.",
  UNKNOWN: "Beklenmeyen bir hata oluştu.",
} as const
