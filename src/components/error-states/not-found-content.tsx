import Link from "next/link"
import { Button } from "@/components/ui/button"

interface NotFoundContentProps {
  title?: string
  description?: string
  backUrl?: string
  backLabel?: string
}

export function NotFoundContent({
  title = "Sayfa Bulunamadı",
  description = "Aradığın sayfayı bulamadık. Ana sayfaya dönebilirsin.",
  backUrl = "/",
  backLabel = "Ana sayfaya dön",
}: NotFoundContentProps) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <div className="text-6xl font-bold">404</div>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Button asChild>
        <Link href={backUrl}>{backLabel}</Link>
      </Button>
    </div>
  )
}
