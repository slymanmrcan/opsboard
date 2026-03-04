import { redirect } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ana Sayfa",
}

export default function Home() {
  redirect("/login")
}
