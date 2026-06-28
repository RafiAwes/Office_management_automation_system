"use client"

import * as React from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { useRbac } from "@/hooks/use-rbac"
import { PERMISSIONS } from "@/lib/rbac/permissions"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { SearchBar } from "@/components/ui/search-bar"
import { KpiCard } from "@/components/ui/kpi-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { 
  ClipboardList, 
  Plus, 
  RefreshCw, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Box
} from "lucide-react"

interface StockItem {
  sku: string
  name: string
  warehouse: string
  stockLevel: number
  minimumRequired: number
}

interface StockTransaction {
  id: string
  sku: string
  name: string
  type: "Check-In" | "Check-Out" | "Transfer"
  quantity: number
  date: string
  operator: string
}

export default function InventoryStockPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  // RBAC checks
  const { isAllowed: canView } = useRbac({ requiredPermissions: [PERMISSIONS.INVENTORY_VIEW] })
  const { isAllowed: canManage } = useRbac({ requiredPermissions: [PERMISSIONS.INVENTORY_MANAGE] })

  // State
  const [stockItems, setStockItems] = React.useState<StockItem[]>([
    { sku: "SKU-GH-001", name: "Heavy Duty Logistics Pallet", warehouse: "US East Storage Pod", stockLevel: 150, minimumRequired: 30 },
    { sku: "SKU-GH-002", name: "High-Capacity Cloud Server Node", warehouse: "EU West Logistics Hub", stockLevel: 12, minimumRequired: 5 },
    { sku: "SKU-GH-003", name: "Cat-6 Ethernet Cable Reels", warehouse: "APAC Fulfilment Node", stockLevel: 3, minimumRequired: 10 },
    { sku: "SKU-GH-004", name: "Industrial Steel Access Lockers", warehouse: "US East Storage Pod", stockLevel: 0, minimumRequired: 8 },
  ])

  const [transactions, setTransactions] = React.useState<StockTransaction[]>([
    { id: "TX-701", sku: "SKU-GH-001", name: "Heavy Duty Logistics Pallet", type: "Check-In", quantity: 50, date: "2026-06-27 10:30", operator: "Marcus Chen" },
    { id: "TX-702", sku: "SKU-GH-003", name: "Cat-6 Ethernet Cable Reels", type: "Check-Out", quantity: 2, date: "2026-06-26 14:15", operator: "Sarah Jenkins" },
    { id: "TX-703", sku: "SKU-GH-002", name: "High-Capacity Cloud Server Node", type: "Transfer", quantity: 1, date: "2026-06-25 09:00", operator: "David Miller" },
  ])

  const [searchQuery, setSearchQuery] = React.useState("")
  const [isTxOpen, setIsTxOpen] = React.useState(false)

  // Form State
  const [formData, setFormData] = React.useState({
    sku: "SKU-GH-001",
    type: "Check-In" as StockTransaction["type"],
    quantity: 0,
  })

  // Enforce Access
  React.useEffect(() => {
    if (!canView && user) {
      router.push("/unauthorized")
    }
  }, [canView, user])

  if (!canView) return null

  // Calculations
  const lowStockItems = stockItems.filter((item) => item.stockLevel <= item.minimumRequired)
  const totalItemsCount = stockItems.reduce((sum, item) => sum + item.stockLevel, 0)

  // Actions
  const handleExecuteTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canManage) return

    const qty = Number(formData.quantity) || 0
    const targetItem = stockItems.find((i) => i.sku === formData.sku)
    if (!targetItem) return

    // Update stock levels list
    const updatedStock = stockItems.map((item) => {
      if (item.sku === formData.sku) {
        let newLevel = item.stockLevel
        if (formData.type === "Check-In") newLevel += qty
        else if (formData.type === "Check-Out") newLevel = Math.max(0, newLevel - qty)
        
        return { ...item, stockLevel: newLevel }
      }
      return item
    })
    setStockItems(updatedStock)

    // Append to transactions history
    const newTx: StockTransaction = {
      id: `TX-${Math.floor(700 + Math.random() * 99)}`,
      sku: formData.sku,
      name: targetItem.name,
      type: formData.type,
      quantity: qty,
      date: new Date().toISOString().replace("T", " ").slice(0, 16),
      operator: user?.name || "System Operator",
    }
    setTransactions([newTx, ...transactions])
    setIsTxOpen(false)
    setFormData({ sku: "SKU-GH-001", type: "Check-In", quantity: 0 })
  }

  const stockColumns = [
    { header: "SKU Code", accessorKey: "sku" },
    { header: "Product / Item", accessorKey: "name" },
    { header: "Warehouse Pod", accessorKey: "warehouse" },
    { header: "Stock count", accessorKey: "stockLevel" },
    { header: "Min. Threshold", accessorKey: "minimumRequired" },
    {
      header: "Alert Status",
      accessorKey: "sku",
      render: (row: StockItem) => {
        const isLow = row.stockLevel <= row.minimumRequired
        return (
          <span className={`font-semibold ${isLow ? "text-danger animate-pulse" : "text-success"}`}>
            {isLow ? "Low Stock Threshold Alert" : "Optimal Stock"}
          </span>
        )
      },
    },
  ]

  const txColumns = [
    { header: "TX ID", accessorKey: "id" },
    { header: "SKU Code", accessorKey: "sku" },
    { header: "Product Name", accessorKey: "name" },
    {
      header: "Action type",
      accessorKey: "type",
      render: (row: StockTransaction) => (
        <span
          className={`font-semibold flex items-center gap-1 ${
            row.type === "Check-In"
              ? "text-success"
              : row.type === "Check-Out"
              ? "text-danger"
              : "text-primary"
          }`}
        >
          {row.type === "Check-In" ? (
            <ArrowDownLeft className="h-3.5 w-3.5" />
          ) : row.type === "Check-Out" ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          {row.type}
        </span>
      ),
    },
    { header: "Units quantity", accessorKey: "quantity" },
    { header: "Logged date", accessorKey: "date" },
    { header: "Operator", accessorKey: "operator" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Stock & Transactions</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit inventory levels, track low stock alert logs, and register stock movements.
          </p>
        </div>

        {canManage && (
          <Button onClick={() => setIsTxOpen(true)} size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            Stock Action Transaction
          </Button>
        )}
      </div>

      {/* Low Stock Alerts Indicator Widgets */}
      {lowStockItems.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Critical Low Stock Alerts</h4>
          <div className="grid gap-4 md:grid-cols-2">
            {lowStockItems.map((item) => (
              <Card key={item.sku} className="border-danger/20 bg-danger/5">
                <CardContent className="p-4 flex items-center gap-3.5 text-xs">
                  <div className="rounded-full p-2 bg-danger/10 text-danger border border-danger/20">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-foreground">{item.name} ({item.sku})</h5>
                    <p className="text-muted-foreground mt-0.5">
                      Warehouse: {item.warehouse} | Current Stock: <span className="font-black text-danger">{item.stockLevel} units</span> (Min: {item.minimumRequired})
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Main Stock Levels Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Stock Ledger Tracking</CardTitle>
          <CardDescription className="text-xs font-semibold text-muted-foreground">Total items in catalog: {totalItemsCount} units.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SearchBar
            placeholder="Search stock by item or warehouse..."
            onSearch={(val) => setSearchQuery(val)}
          />
          <DataTable
            columns={stockColumns}
            data={stockItems.filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()))}
            pageSize={5}
          />
        </CardContent>
      </Card>

      {/* Recent Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Recent Stock Transactions History</CardTitle>
          <CardDescription className="text-xs text-muted-foreground font-semibold">Auditable record of all stock movement operations.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={txColumns}
            data={transactions}
            pageSize={5}
          />
        </CardContent>
      </Card>

      {/* Transaction Modal */}
      {isTxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsTxOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-foreground">Log Stock Action Transaction</h3>
            <form onSubmit={handleExecuteTransaction} className="space-y-4 text-xs">
              <Select
                label="Target SKU Product"
                options={stockItems.map((item) => ({
                  label: `${item.name} (${item.sku})`,
                  value: item.sku,
                }))}
                value={formData.sku}
                onChange={(e: any) => setFormData({ ...formData, sku: e.target.value })}
              />
              <Select
                label="Transaction Type"
                options={[
                  { label: "Check-In (Stock Inflow)", value: "Check-In" },
                  { label: "Check-Out (Stock Outflow)", value: "Check-Out" },
                ]}
                value={formData.type}
                onChange={(e: any) => setFormData({ ...formData, type: e.target.value as StockTransaction["type"] })}
              />
              <Input
                label="Operation Units quantity"
                type="number"
                required
                value={formData.quantity || ""}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsTxOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Execute Movement
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
