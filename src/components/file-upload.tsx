"use client"

import { useCallback, useState } from "react"
import { Upload, X, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatFileSize } from "@/lib/format"

interface FileUploadProps {
  accept?: string
  maxSize?: number // bytes
  multiple?: boolean
  onFilesChange: (files: File[]) => void
  value?: File[]
}

export function FileUpload({
  accept,
  maxSize = 5 * 1024 * 1024, // 5MB default
  multiple = false,
  onFilesChange,
  value = [],
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles) return

      setError(null)
      const filesArray = Array.from(newFiles)

      // Validate file size
      const oversizedFiles = filesArray.filter((file) => file.size > maxSize)
      if (oversizedFiles.length > 0) {
        setError(`Dosya boyutu ${formatFileSize(maxSize)} limitini aşıyor`)
        return
      }

      if (multiple) {
        onFilesChange([...value, ...filesArray])
      } else {
        onFilesChange(filesArray.slice(0, 1))
      }
    },
    [maxSize, multiple, onFilesChange, value]
  )

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index)
    onFilesChange(newFiles)
  }

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm font-medium mb-1">Dosya yüklemek için tıklayın veya sürükleyin</p>
        <p className="text-xs text-muted-foreground">
          Maksimum dosya boyutu: {formatFileSize(maxSize)}
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <File className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
