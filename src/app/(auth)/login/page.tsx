import { LoginCard } from "@/components/auth/login-card"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Giriş Yap",
  description: "Hesabınıza giriş yapın",
}

export default function LoginPage() {
  return <LoginCard />
}
