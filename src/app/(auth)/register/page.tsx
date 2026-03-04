import { RegisterCard } from "@/components/auth/register-card"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kayıt Ol",
  description: "Yeni hesap oluşturun",
}

export default function RegisterPage() {
  return <RegisterCard />
}
