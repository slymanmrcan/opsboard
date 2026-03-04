import { api } from "./api"
import type { ApiResponse, User } from "@/types"
import { clearAuthCookie, setAuthCookie } from "@/lib/auth-cookie"

type LoginCredentials = {
  email: string
  password: string
}

type RegisterData = {
  email: string
  password: string
  name: string
  // diğer gerekli alanlar...
}

type AuthResponse = {
  user: User
  token?: string | null
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    // MOCK LOGIN IMPLEMENTATION
    if (process.env.NEXT_PUBLIC_MOCK_AUTH === "true") {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Fake delay

      const mockUser: User = {
        id: "1",
        name: "Demo User",
        email: credentials.email,
        role: "admin",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const mockToken = "mock-jwt-token-12345"
      setAuthCookie(mockToken)

      return { user: mockUser, token: mockToken }
    }

    const response = await api.post<ApiResponse<AuthResponse> | AuthResponse>(
      "/auth/login",
      credentials,
      {
        noAuth: true,
      }
    )

    const authData = "data" in response ? response.data : response
    if (!authData?.user) {
      throw new Error("Login response did not include user information.")
    }

    if (authData.token) {
      setAuthCookie(authData.token)
    }

    return {
      user: authData.user,
      token: authData.token ?? null,
    }
  },

  register: async (data: RegisterData) => {
    return api.post<ApiResponse<User>>("/auth/register", data, {
      noAuth: true,
    })
  },

  logout: async () => {
    try {
      if (process.env.NEXT_PUBLIC_MOCK_AUTH !== "true") {
        await api.post("/auth/logout", null, {
          noAuth: true,
          credentials: "include",
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      clearAuthCookie()
    }
  },

  getCurrentUser: async () => {
    if (process.env.NEXT_PUBLIC_MOCK_AUTH === "true") {
      // Mock user dön
      const mockUser: User = {
        id: "1",
        name: "Demo User",
        email: "demo@example.com",
        role: "admin",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      return mockUser
    }

    const response = await api.get<ApiResponse<User>>("/auth/me")
    return response.data
  },
}
