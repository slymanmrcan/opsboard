"use client"

import { useEffect } from "react"
import { ErrorContent } from "@/components/error-states/error-content"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global error:", error)
  }, [error])

  return (
    <html lang="tr">
      <body>
        <ErrorContent message={error.message} onReset={reset} />
      </body>
    </html>
  )
}
