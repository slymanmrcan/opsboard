"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Search, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"

type ProductStatus = "Aktif" | "Düşük Stok" | "Tükendi"

type Product = {
  id: string
  name: string
  category: string
  price: string
  stock: number
  status: ProductStatus
}

const products: Product[] = [
  {
    id: "PRD-1001",
    name: "Smart Dashboard",
    category: "SaaS",
    price: "₺1.250",
    stock: 42,
    status: "Aktif",
  },
  {
    id: "PRD-1002",
    name: "Analytics Pro",
    category: "Analitik",
    price: "₺2.400",
    stock: 8,
    status: "Düşük Stok",
  },
  {
    id: "PRD-1003",
    name: "CRM Plus",
    category: "Operasyon",
    price: "₺1.800",
    stock: 0,
    status: "Tükendi",
  },
  {
    id: "PRD-1004",
    name: "Billing Hub",
    category: "Finans",
    price: "₺950",
    stock: 16,
    status: "Aktif",
  },
]

function getStatusFromStock(stock: number): ProductStatus {
  if (stock <= 0) {
    return "Tükendi"
  }
  if (stock <= 10) {
    return "Düşük Stok"
  }
  return "Aktif"
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2,
  }).format(value)
}

export default function ProductsPage() {
  const [search, setSearch] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [customProducts, setCustomProducts] = useState<Product[]>([])
  const [formName, setFormName] = useState("")
  const [formCategory, setFormCategory] = useState("")
  const [formPrice, setFormPrice] = useState("")
  const [formStock, setFormStock] = useState("")

  const allProducts = useMemo(() => {
    const customProductIds = new Set(customProducts.map((product) => product.id))
    const filteredDefaultProducts = products.filter((product) => !customProductIds.has(product.id))
    return [...customProducts, ...filteredDefaultProducts]
  }, [customProducts])

  const filteredProducts = useMemo(() => {
    if (!search.trim()) {
      return allProducts
    }

    return allProducts.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [allProducts, search])

  const handleAddProduct = () => {
    const name = formName.trim()
    const category = formCategory.trim()
    const priceNumber = Number(formPrice)
    const stockNumber = Number(formStock)

    if (!name) {
      toast.error("Ürün adı zorunlu.")
      return
    }

    if (!category) {
      toast.error("Kategori zorunlu.")
      return
    }

    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      toast.error("Geçerli bir fiyat gir.")
      return
    }

    if (!Number.isInteger(stockNumber) || stockNumber < 0) {
      toast.error("Stok 0 veya pozitif tam sayı olmalı.")
      return
    }

    const newProduct: Product = {
      id: `PRD-${Date.now()}`,
      name,
      category,
      price: formatPrice(priceNumber),
      stock: stockNumber,
      status: getStatusFromStock(stockNumber),
    }

    const nextProducts = [newProduct, ...customProducts]
    setCustomProducts(nextProducts)

    setFormName("")
    setFormCategory("")
    setFormPrice("")
    setFormStock("")
    setIsCreateOpen(false)

    toast.success("Ürün eklendi.")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ürünler</h1>
          <p className="text-muted-foreground">Katalog, stok ve satış performansı.</p>
        </div>
        <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Yeni ürün
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ürün Listesi</CardTitle>
          <CardDescription>Fiyat, stok ve durum bilgileriyle tüm ürünler.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4 gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ürün ara..."
                className="pl-8"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ürün</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Fiyat</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Ürün bulunamadı.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.status === "Aktif"
                              ? "default"
                              : product.status === "Düşük Stok"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Menüyü aç</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                            <DropdownMenuItem>Detayları görüntüle</DropdownMenuItem>
                            <DropdownMenuItem>Düzenle</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Ürünü kaldır
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni Ürün</DialogTitle>
            <DialogDescription>Ürün tablosuna hızlıca yeni bir kayıt ekle.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-product-name">Ürün adı</Label>
              <Input
                id="new-product-name"
                placeholder="Örn: Opsboard CRM"
                value={formName}
                onChange={(event) => setFormName(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-product-category">Kategori</Label>
              <Input
                id="new-product-category"
                placeholder="Örn: Operasyon"
                value={formCategory}
                onChange={(event) => setFormCategory(event.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-product-price">Fiyat (TRY)</Label>
                <Input
                  id="new-product-price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="1250"
                  value={formPrice}
                  onChange={(event) => setFormPrice(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-product-stock">Stok</Label>
                <Input
                  id="new-product-stock"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="25"
                  value={formStock}
                  onChange={(event) => setFormStock(event.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleAddProduct}>Ürünü ekle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
