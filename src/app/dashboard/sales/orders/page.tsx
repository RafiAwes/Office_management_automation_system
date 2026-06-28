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
  ClipboardList, 
  Plus, 
  Eye, 
  Truck, 
  CheckCircle2, 
  Timer,
  Building,
  Calendar,
  Box
} from "lucide-react"

interface Order {
  id: string
  clientName: string
  value: number
  status: "Pending" | "Assembling" | "Shipped" | "Delivered"
  orderDate: string
  deliveryTarget: string
  items: string
}

export default function SalesOrdersPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  // RBAC checks
  const { isAllowed: canView } = useRbac({ requiredPermissions: [PERMISSIONS.SALES_VIEW] })
  const { isAllowed: canCreate } = useRbac({ requiredPermissions: [PERMISSIONS.SALES_CREATE] })

  // State
  const [orders, setOrders] = React.useState<Order[]>([
    {
      id: "ORD-991",
      clientName: "Initech LLC",
      value: 65000,
      status: "Assembling",
      orderDate: "2026-06-25",
      deliveryTarget: "2026-07-10",
      items: "Next.js Custom ERP Panel Setup + Cloud Deployment",
    },
    {
      id: "ORD-992",
      clientName: "Acme Corp Ltd",
      value: 12450,
      status: "Shipped",
      orderDate: "2026-06-20",
      deliveryTarget: "2026-07-02",
      items: "SLA Custom support contracts files bundle",
    },
    {
      id: "ORD-993",
      clientName: "Globex Inc",
      value: 88000,
      status: "Delivered",
      orderDate: "2026-06-10",
      deliveryTarget: "2026-06-24",
      items: "DB replication sync modules cluster",
    },
  ])

  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null)
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)

  // Form State
  const [formData, setFormData] = React.useState({
    clientName: "",
    value: 0,
    items: "",
    deliveryTarget: "",
  })

  // Enforce Access
  React.useEffect(() => {
    if (!canView && user) {
      router.push("/unauthorized")
    }
  }, [canView, user])

  if (!canView) return null

  // Filters
  const filteredOrders = orders.filter(
    (o) =>
      o.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Actions
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canCreate) return

    const newOrder: Order = {
      id: `ORD-${Math.floor(900 + Math.random() * 99)}`,
      clientName: formData.clientName,
      value: Number(formData.value) || 0,
      status: "Pending",
      orderDate: new Date().toISOString().split("T")[0],
      deliveryTarget: formData.deliveryTarget || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      items: formData.items,
    }

    setOrders([newOrder, ...orders])
    setIsCreateOpen(false)
    setFormData({ clientName: "", value: 0, items: "", deliveryTarget: "" })
  }

  const handleUpdateStatus = (id: string, nextStatus: Order["status"]) => {
    if (!canCreate) return
    const updated = orders.map((o) => {
      if (o.id === id) {
        return { ...o, status: nextStatus }
      }
      return o
    })
    setOrders(updated)
    const target = updated.find((o) => o.id === id)
    if (target) setSelectedOrder(target)
  }

  const columns = [
    { header: "Order ID", accessorKey: "id" },
    { header: "Client / Organization", accessorKey: "clientName" },
    {
      header: "Contract Worth",
      accessorKey: "value",
      render: (row: Order) => `$${row.value.toLocaleString()}`,
    },
    { header: "Order Date", accessorKey: "orderDate" },
    { header: "Est. Delivery", accessorKey: "deliveryTarget" },
    { header: "Status", accessorKey: "status" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Order Management</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Administer order cycles, check assembly metrics, and monitor shipping timelines.
          </p>
        </div>

        {canCreate && (
          <Button onClick={() => setIsCreateOpen(true)} size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            Add New Order
          </Button>
        )}
      </div>

      {/* Grid and list */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <SearchBar
            placeholder="Search orders by client, ID, or status..."
            onSearch={(val) => setSearchQuery(val)}
          />
          <DataTable
            columns={columns}
            data={filteredOrders}
            pageSize={5}
            onRowClick={(row) => setSelectedOrder(row)}
            actions={(row) => (
              <Button size="xs" variant="outline" onClick={() => setSelectedOrder(row)}>
                <Eye className="h-3.5 w-3.5" />
              </Button>
            )}
          />
        </CardContent>
      </Card>

      {/* Details Drawer */}
      <Drawer
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order ${selectedOrder?.id}`}
        description={selectedOrder?.clientName}
      >
        {selectedOrder && (
          <div className="space-y-6 text-xs leading-normal">
            {/* Meta */}
            <div className="space-y-3 bg-muted/20 p-4 border border-border/50 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider">Order Specifications</span>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold text-foreground">{selectedOrder.clientName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Ordered: {selectedOrder.orderDate} | Estimated: {selectedOrder.deliveryTarget}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Box className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground truncate">{selectedOrder.items}</span>
                </div>
              </div>
            </div>

            {/* Progress stage indicator */}
            <div className="space-y-2.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider block">Fulfillment Cycle</span>
              <div className="grid grid-cols-4 gap-1.5 p-2 rounded-xl bg-muted/30 border border-border/40 text-center font-bold text-[9px] uppercase">
                <div className={`p-1.5 rounded-lg ${selectedOrder.status === "Pending" ? "bg-warning text-warning-foreground" : "bg-card text-muted-foreground"}`}>
                  Pending
                </div>
                <div className={`p-1.5 rounded-lg ${selectedOrder.status === "Assembling" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}>
                  Assembly
                </div>
                <div className={`p-1.5 rounded-lg ${selectedOrder.status === "Shipped" ? "bg-accent text-accent-foreground" : "bg-card text-muted-foreground"}`}>
                  Shipped
                </div>
                <div className={`p-1.5 rounded-lg ${selectedOrder.status === "Delivered" ? "bg-success text-success-foreground" : "bg-card text-muted-foreground"}`}>
                  Delivered
                </div>
              </div>
            </div>

            {/* Actions controls */}
            {canCreate && (
              <div className="space-y-3 pt-4 border-t border-border/50">
                <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider block">Logistics Updates</span>
                <div className="flex gap-2">
                  {selectedOrder.status === "Pending" && (
                    <Button size="xs" className="flex-1" onClick={() => handleUpdateStatus(selectedOrder.id, "Assembling")}>
                      <Timer className="mr-1 h-3.5 w-3.5" />
                      Begin Assembly
                    </Button>
                  )}
                  {selectedOrder.status === "Assembling" && (
                    <Button size="xs" className="flex-1" onClick={() => handleUpdateStatus(selectedOrder.id, "Shipped")}>
                      <Truck className="mr-1 h-3.5 w-3.5" />
                      Dispatch Shipment
                    </Button>
                  )}
                  {selectedOrder.status === "Shipped" && (
                    <Button size="xs" className="flex-1" onClick={() => handleUpdateStatus(selectedOrder.id, "Delivered")}>
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5 text-success" />
                      Confirm Delivery
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsCreateOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-foreground">Create New Order</h3>
            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              <Input
                label="Client Name"
                placeholder="e.g. Initech LLC"
                required
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              />
              <Input
                label="Contract Value ($)"
                type="number"
                required
                value={formData.value || ""}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
              />
              <Input
                label="Fulfillment Scope Items"
                placeholder="e.g. Next.js ERP custom template setup"
                required
                value={formData.items}
                onChange={(e) => setFormData({ ...formData, items: e.target.value })}
              />
              <Input
                label="Target Delivery Date"
                type="date"
                required
                value={formData.deliveryTarget}
                onChange={(e) => setFormData({ ...formData, deliveryTarget: e.target.value })}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Generate Order
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
