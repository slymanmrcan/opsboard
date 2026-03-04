import { useState } from "react"
import { toast } from "sonner"

/**
 * Copy text to clipboard with feedback
 */
export function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false)

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      toast.success("Panoya kopyalandı")
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      toast.error("Kopyalama başarısız")
      console.error("Copy failed:", error)
    }
  }

  return { copy, isCopied }
}
