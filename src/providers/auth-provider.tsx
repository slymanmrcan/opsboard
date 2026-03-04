"use client"

import { useEffect } from "react"
import { authService } from "@/services"
import { useAuthStore } from "@/store/auth-store"
import { getAuthCookie } from "@/lib/auth-cookie"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token)
  const updateUser = useAuthStore((state) => state.updateUser)
  const logout = useAuthStore((state) => state.logout)
  const setToken = useAuthStore((state) => state.setToken)

  useEffect(() => {
    const cookieToken = getAuthCookie()
    const activeToken = token ?? cookieToken

    if (!activeToken) {
      return
    }

    if (!token && cookieToken) {
      setToken(cookieToken)
    }

    const validateToken = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        updateUser(currentUser)
      } catch {
        logout()
      }
    }

    validateToken()
  }, [token, updateUser, logout, setToken])

  return <>{children}</>
}
