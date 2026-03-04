"use client"

import { useUsers } from "@/hooks/use-users"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { DataTable } from "@/components/data-table"
import { columns } from "./columns"
import { Breadcrumb } from "@/components/breadcrumb"

export default function UsersPage() {
  // React Query Hook - Mock data için pagination yok
  const { data, isLoading } = useUsers()

  const users = data?.data || []

  return (
    <div className="space-y-6">
      <Breadcrumb />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kullanıcılar</h1>
          <p className="text-muted-foreground">Ekip üyelerini ve izinleri yönet.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Kullanıcı ekle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tüm Kullanıcılar</CardTitle>
          <CardDescription>Ad, e-posta ve rol dahil tüm kullanıcıların listesi.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-24">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={users}
              searchKey="name"
              searchPlaceholder="Kullanıcı ara..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
