"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ErrorContentProps {
  title?: string
  message?: string
  onReset?: () => void
  showHomeButton?: boolean
}

export function ErrorContent({
  title = "Bir şeyler ters gitti",
  message = "Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin.",
  onReset,
  showHomeButton = true,
}: ErrorContentProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <AlertTriangle className="h-16 w-16 text-destructive" />
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="max-w-md text-muted-foreground">{message}</p>
      </div>
      <div className="flex gap-4">
        {onReset && <Button onClick={onReset}>Tekrar Dene</Button>}
        {showHomeButton && (
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Ana Sayfaya Dön
          </Button>
        )}
      </div>
    </div>
  )
}
