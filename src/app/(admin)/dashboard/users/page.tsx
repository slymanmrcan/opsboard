"use client"

import { useMemo, useState } from "react"
import { useUsers } from "@/hooks/use-users"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { DataTable } from "@/components/data-table"
import { columns } from "./columns"
import { Breadcrumb } from "@/components/breadcrumb"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import type { User } from "@/types"

type UserRole = User["role"]

export default function UsersPage() {
  // React Query Hook - Mock data için pagination yok
  const { data, isLoading } = useUsers()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [customUsers, setCustomUsers] = useState<User[]>([])
  const [formName, setFormName] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [formRole, setFormRole] = useState<UserRole>("user")

  const users = useMemo(() => {
    const baseUsers = data?.data ?? []
    const customUserIds = new Set(customUsers.map((user) => user.id))
    const filteredBaseUsers = baseUsers.filter((user) => !customUserIds.has(user.id))

    return [...customUsers, ...filteredBaseUsers]
  }, [customUsers, data?.data])

  const handleAddUser = () => {
    const name = formName.trim()
    const email = formEmail.trim()

    if (!name) {
      toast.error("İsim zorunlu.")
      return
    }

    if (!email || !email.includes("@")) {
      toast.error("Geçerli bir e-posta gir.")
      return
    }

    const now = new Date().toISOString()
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role: formRole,
      createdAt: now,
      updatedAt: now,
    }

    const nextUsers = [newUser, ...customUsers]
    setCustomUsers(nextUsers)

    setFormName("")
    setFormEmail("")
    setFormRole("user")
    setIsCreateOpen(false)

    toast.success("Kullanıcı eklendi.")
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kullanıcılar</h1>
          <p className="text-muted-foreground">Ekip üyelerini ve izinleri yönet.</p>
        </div>
        <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
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

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni Kullanıcı</DialogTitle>
            <DialogDescription>Tabloya hızlıca bir kullanıcı ekle.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-user-name">Ad Soyad</Label>
              <Input
                id="new-user-name"
                placeholder="Örn: Ayşe Yılmaz"
                value={formName}
                onChange={(event) => setFormName(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-user-email">E-posta</Label>
              <Input
                id="new-user-email"
                type="email"
                placeholder="ornek@site.com"
                value={formEmail}
                onChange={(event) => setFormEmail(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Rol</Label>
              <Select value={formRole} onValueChange={(value: UserRole) => setFormRole(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Rol seç" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Yönetici</SelectItem>
                  <SelectItem value="editor">Editör</SelectItem>
                  <SelectItem value="user">Kullanıcı</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleAddUser}>Kullanıcıyı ekle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
