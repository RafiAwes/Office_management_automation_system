"use client"

import * as React from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { useRbac } from "@/hooks/use-rbac"
import { PERMISSIONS } from "@/lib/rbac/permissions"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Drawer } from "@/components/ui/drawer"
import { DataTable } from "@/components/ui/data-table"
import { SearchBar } from "@/components/ui/search-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { 
  Box, 
  Plus, 
  Eye, 
  Trash2, 
  Layers,
  ArrowRight,
  TrendingUp
} from "lucide-react"

interface Product {
  sku: string
  name: string
  category: string
  price: number
  stockCount: number
  status: "In Stock" | "Low Stock" | "Out of Stock"
  supplier: string
}

export default function InventoryProductsPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  // RBAC checks
  const { isAllowed: canView } = useRbac({ requiredPermissions: [PERMISSIONS.INVENTORY_VIEW] })
  const { isAllowed: canManage } = useRbac({ requiredPermissions: [PERMISSIONS.INVENTORY_MANAGE] })

  // State
  const [products, setProducts] = React.useState<Product[]>([
    { sku: "SKU-GH-001", name: "Heavy Duty Logistics Pallet", category: "Warehouse Staging", price: 120, stockCount: 150, status: "In Stock", supplier: "Apex Logistics Suppliers" },
    { sku: "SKU-GH-002", name: "High-Capacity Cloud Server Node", category: "Tech Nodes", price: 4500, stockCount: 12, status: "In Stock", supplier: "Global Server Co" },
    { sku: "SKU-GH-003", name: "Cat-6 Ethernet Cable Reels (1000ft)", category: "Network Cabling", price: 85, stockCount: 3, status: "Low Stock", supplier: "Network Wire Inc" },
    { sku: "SKU-GH-004", name: "Industrial Steel Access Lockers", category: "Office Safety", price: 299, stockCount: 0, status: "Out of Stock", supplier: "Ironclad Security" },
  ])

  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedProd, setSelectedProd] = React.useState<Product | null>(null)
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)

  // Form State
  const [formData, setFormData] = React.useState({
    sku: "",
    name: "",
    category: "Warehouse Staging",
    price: 0,
    stockCount: 0,
    supplier: "",
  })

  // Enforce Access
  React.useEffect(() => {
    if (!canView && user) {
      router.push("/unauthorized")
    }
  }, [canView, user])

  if (!canView) return null

  // Filters
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Actions
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canManage) return

    const qty = Number(formData.stockCount) || 0
    let status: Product["status"] = "In Stock"
    if (qty === 0) status = "Out of Stock"
    else if (qty <= 5) status = "Low Stock"

    const newProd: Product = {
      sku: formData.sku || `SKU-GH-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name,
      category: formData.category,
      price: Number(formData.price) || 0,
      stockCount: qty,
      status,
      supplier: formData.supplier || "Internal Sourcing",
    }

    setProducts([newProd, ...products])
    setIsCreateOpen(false)
    setFormData({ sku: "", name: "", category: "Warehouse Staging", price: 0, stockCount: 0, supplier: "" })
  }

  const columns = [
    { header: "SKU / Code", accessorKey: "sku" },
    { header: "Product / Item", accessorKey: "name" },
    { header: "Category", accessorKey: "category" },
    {
      header: "Unit Price",
      accessorKey: "price",
      render: (row: Product) => `$${row.price.toLocaleString()}`,
    },
    { header: "Stock count", accessorKey: "stockCount" },
    {
      header: "Status",
      accessorKey: "status",
      render: (row: Product) => (
        <span
          className={`font-semibold ${
            row.status === "In Stock"
              ? "text-success"
              : row.status === "Low Stock"
              ? "text-warning animate-pulse"
              : "text-danger"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Product Catalog</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Maintain SKU profiles, verify unit costs, and audit GlowHaat product lines.
          </p>
        </div>

        {canManage && (
          <Button onClick={() => setIsCreateOpen(true)} size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            Add SKU Product
          </Button>
        )}
      </div>

      {/* Catalog Table */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <SearchBar
            placeholder="Filter product SKUs by name, code, or category..."
            onSearch={(val) => setSearchQuery(val)}
          />
          <DataTable
            columns={columns}
            data={filteredProducts}
            pageSize={5}
            onRowClick={(row) => setSelectedProd(row)}
            actions={(row) => (
              <Button size="xs" variant="outline" onClick={() => setSelectedProd(row)}>
                <Eye className="h-3.5 w-3.5" />
              </Button>
            )}
          />
        </CardContent>
      </Card>

      {/* Details Drawer */}
      <Drawer
        isOpen={!!selectedProd}
        onClose={() => setSelectedProd(null)}
        title={selectedProd?.name}
        description={selectedProd?.sku}
      >
        {selectedProd && (
          <div className="space-y-6 text-xs leading-normal">
            {/* Meta */}
            <div className="space-y-3 bg-muted/20 p-4 border border-border/50 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider">Item Details</span>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Box className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold text-foreground">{selectedProd.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Category: {selectedProd.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Supplier: {selectedProd.supplier}</span>
                </div>
              </div>
            </div>

            {/* Calculations info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-0.5">
                <p className="text-muted-foreground">SKU / Code</p>
                <p className="font-bold text-foreground">{selectedProd.sku}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-muted-foreground">Unit Cost price</p>
                <p className="font-bold text-foreground text-sm">${selectedProd.price.toLocaleString()}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-muted-foreground">Stock Balance</p>
                <p className="font-bold text-foreground text-sm">{selectedProd.stockCount} units</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-muted-foreground">Supply Status</p>
                <p className={`font-bold text-sm ${
                  selectedProd.status === "In Stock"
                    ? "text-success"
                    : selectedProd.status === "Low Stock"
                    ? "text-warning"
                    : "text-danger"
                }`}>
                  {selectedProd.status}
                </p>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsCreateOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-foreground">Add SKU Product</h3>
            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <Input
                label="Product Name"
                placeholder="e.g. Heavy Duty Logistics Pallet"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="SKU Code"
                placeholder="e.g. SKU-GH-001"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Category"
                  options={[
                    { label: "Warehouse Staging", value: "Warehouse Staging" },
                    { label: "Tech Nodes", value: "Tech Nodes" },
                    { label: "Network Cabling", value: "Network Cabling" },
                    { label: "Office Safety", value: "Office Safety" },
                  ]}
                  value={formData.category}
                  onChange={(e: any) => setFormData({ ...formData, category: e.target.value })}
                />
                <Input
                  label="Unit Price ($)"
                  type="number"
                  required
                  value={formData.price || ""}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Initial Stock Qty"
                  type="number"
                  required
                  value={formData.stockCount || ""}
                  onChange={(e) => setFormData({ ...formData, stockCount: Number(e.target.value) })}
                />
                <Input
                  label="Supplier Name"
                  placeholder="e.g. Apex Suppliers"
                  required
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save SKU
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
