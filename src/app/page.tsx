import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ana Sayfa",
}

export default async function Home() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")

  // Kullanıcı giriş yapmışsa dashboard'a, yoksa login'e yönlendir
  if (token?.value) {
    redirect("/dashboard")
  } else {
    redirect("/login")
  }
}
