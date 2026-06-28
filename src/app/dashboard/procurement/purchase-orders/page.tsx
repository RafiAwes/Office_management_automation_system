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
  FileText, 
  Plus, 
  Eye, 
  Check, 
  X,
  Truck,
  Calendar,
  Building,
  CheckCircle,
  HelpCircle,
  Timer
} from "lucide-react"

interface PO {
  id: string
  supplierName: string
  value: number
  status: "Pending" | "Approved" | "Rejected" | "Processing" | "Completed"
  issueDate: string
  deliveryDate: string
  items: string
}

export default function ProcurementPurchaseOrdersPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  // RBAC checks
  const { isAllowed: canView } = useRbac({ requiredPermissions: [PERMISSIONS.INVENTORY_VIEW] })
  const { isAllowed: canManage } = useRbac({ requiredPermissions: [PERMISSIONS.INVENTORY_MANAGE] })

  // State
  const [purchaseOrders, setPurchaseOrders] = React.useState<PO[]>([
    {
      id: "PO-301",
      supplierName: "Apex Logistics Suppliers",
      value: 18000,
      status: "Processing",
      issueDate: "2026-06-20",
      deliveryDate: "2026-07-05",
      items: "150x Heavy Duty Logistics Pallets",
    },
    {
      id: "PO-302",
      supplierName: "Global Server Co",
      value: 54000,
      status: "Approved",
      issueDate: "2026-06-25",
      deliveryDate: "2026-07-15",
      items: "12x High-Capacity Server Nodes",
    },
    {
      id: "PO-303",
      supplierName: "Ironclad Security",
      value: 2392,
      status: "Pending",
      issueDate: "2026-06-27",
      deliveryDate: "2026-07-10",
      items: "8x Industrial Steel Access Lockers",
    },
  ])

  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedPO, setSelectedPO] = React.useState<PO | null>(null)
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)

  // Form State
  const [formData, setFormData] = React.useState({
    supplierName: "Apex Logistics Suppliers",
    value: 0,
    items: "",
    deliveryDate: "",
  })

  // Enforce Access Gating
  React.useEffect(() => {
    if (!canView && user) {
      router.push("/unauthorized")
    }
  }, [canView, user])

  if (!canView) return null

  // Filters
  const filteredPOs = purchaseOrders.filter(
    (po) =>
      po.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Actions
  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canManage) return

    const newPO: PO = {
      id: `PO-${Math.floor(300 + Math.random() * 99)}`,
      supplierName: formData.supplierName,
      value: Number(formData.value) || 0,
      status: "Pending",
      issueDate: new Date().toISOString().split("T")[0],
      deliveryDate: formData.deliveryDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      items: formData.items,
    }

    setPurchaseOrders([newPO, ...purchaseOrders])
    setIsCreateOpen(false)
    setFormData({ supplierName: "Apex Logistics Suppliers", value: 0, items: "", deliveryDate: "" })
  }

  const handleUpdateStatus = (id: string, nextStatus: PO["status"]) => {
    if (!canManage) return
    const updated = purchaseOrders.map((po) => {
      if (po.id === id) {
        return { ...po, status: nextStatus }
      }
      return po
    })
    setPurchaseOrders(updated)
    const target = updated.find((po) => po.id === id)
    if (target) setSelectedPO(target)
  }

  const columns = [
    { header: "PO Number", accessorKey: "id" },
    { header: "Vendor Supplier", accessorKey: "supplierName" },
    {
      header: "PO Total Value",
      accessorKey: "value",
      render: (row: PO) => `$${row.value.toLocaleString()}`,
    },
    { header: "Issue Date", accessorKey: "issueDate" },
    { header: "Target Delivery", accessorKey: "deliveryDate" },
    { header: "Approval Status", accessorKey: "status" },
  ]

  // Timeline helpers for workflow visualization
  const getTimelineSteps = (status: PO["status"]) => {
    if (status === "Rejected") {
      return [
        { label: "Submitted", state: "completed" },
        { label: "Approval Rejected", state: "failed" },
        { label: "Processing", state: "upcoming" },
        { label: "Completed", state: "upcoming" },
      ]
    }

    const steps = [
      { label: "Submitted", state: "completed" },
      { label: "Approved", state: "upcoming" },
      { label: "Processing", state: "upcoming" },
      { label: "Completed", state: "upcoming" },
    ]

    if (status === "Approved") {
      steps[1].state = "completed"
    } else if (status === "Processing") {
      steps[1].state = "completed"
      steps[2].state = "current animate-pulse"
    } else if (status === "Completed") {
      steps[1].state = "completed"
      steps[2].state = "completed"
      steps[3].state = "completed"
    } else if (status === "Pending") {
      steps[1].state = "current"
    }

    return steps
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Purchase Orders</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Formulate purchase requests, review vendor billing totals, and inspect approval workflows.
          </p>
        </div>

        {canManage && (
          <Button onClick={() => setIsCreateOpen(true)} size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Purchase Order
          </Button>
        )}
      </div>

      {/* PO List Table */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <SearchBar
            placeholder="Search POs by supplier name, code, or status..."
            onSearch={(val) => setSearchQuery(val)}
          />
          <DataTable
            columns={columns}
            data={filteredPOs}
            pageSize={5}
            onRowClick={(row) => setSelectedPO(row)}
            actions={(row) => (
              <Button size="xs" variant="outline" onClick={() => setSelectedPO(row)}>
                <Eye className="h-3.5 w-3.5" />
              </Button>
            )}
          />
        </CardContent>
      </Card>

      {/* PO Drawer & Workflow Visualization */}
      <Drawer
        isOpen={!!selectedPO}
        onClose={() => setSelectedPO(null)}
        title={`Purchase Order ${selectedPO?.id}`}
        description={selectedPO?.supplierName}
      >
        {selectedPO && (
          <div className="space-y-6 text-xs leading-normal">
            {/* Meta */}
            <div className="space-y-3 bg-muted/20 p-4 border border-border/50 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider">Order Specifications</span>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold text-foreground">{selectedPO.supplierName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Issued: {selectedPO.issueDate} | Delivery: {selectedPO.deliveryDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground truncate">{selectedPO.items}</span>
                </div>
              </div>
            </div>

            {/* Approval Workflow Visualization */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider block">Approval Workflow Visualization</span>
              <div className="p-4 border border-border/40 bg-card rounded-xl">
                <div className="flex items-center justify-between relative pl-4 border-l border-border/85 space-y-4 flex-col items-start border-l-2">
                  {getTimelineSteps(selectedPO.status).map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3 relative -left-[22px] bg-card pr-2 py-0.5">
                      <div
                        className={`h-5.5 w-5.5 rounded-full flex items-center justify-center border font-bold text-[9px] ${
                          step.state === "completed"
                            ? "bg-success text-success-foreground border-success"
                            : step.state === "failed"
                            ? "bg-danger text-danger-foreground border-danger"
                            : step.state.startsWith("current")
                            ? "bg-primary text-primary-foreground border-primary animate-pulse"
                            : "bg-secondary text-muted-foreground border-border"
                        }`}
                      >
                        {step.state === "completed" ? (
                          <CheckCircle className="h-3.5 w-3.5" />
                        ) : step.state === "failed" ? (
                          <X className="h-3.5 w-3.5" />
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{step.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Status adjustments (Ops Manager only) */}
            {canManage && (
              <div className="space-y-2.5 pt-4 border-t border-border/50">
                <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider block">Workflow Actions</span>
                <div className="flex gap-2">
                  {selectedPO.status === "Pending" && (
                    <>
                      <Button size="xs" className="flex-grow" onClick={() => handleUpdateStatus(selectedPO.id, "Approved")}>
                        <Check className="mr-1 h-3.5 w-3.5 text-success" />
                        Approve Order
                      </Button>
                      <Button size="xs" variant="destructive" className="flex-grow" onClick={() => handleUpdateStatus(selectedPO.id, "Rejected")}>
                        <X className="mr-1 h-3.5 w-3.5" />
                        Reject Order
                      </Button>
                    </>
                  )}
                  {selectedPO.status === "Approved" && (
                    <Button size="xs" className="w-full" onClick={() => handleUpdateStatus(selectedPO.id, "Processing")}>
                      <Timer className="mr-1.5 h-4 w-4" />
                      Begin Processing
                    </Button>
                  )}
                  {selectedPO.status === "Processing" && (
                    <Button size="xs" className="w-full" onClick={() => handleUpdateStatus(selectedPO.id, "Completed")}>
                      <Truck className="mr-1.5 h-4 w-4 text-success" />
                      Confirm Receipt (Complete)
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
            <h3 className="text-base font-bold text-foreground">Draft Purchase Order</h3>
            <form onSubmit={handleCreatePO} className="space-y-4 text-xs">
              <Select
                label="Target Supplier / Vendor"
                options={[
                  { label: "Apex Logistics Suppliers", value: "Apex Logistics Suppliers" },
                  { label: "Global Server Co", value: "Global Server Co" },
                  { label: "Ironclad Security", value: "Ironclad Security" },
                ]}
                value={formData.supplierName}
                onChange={(e: any) => setFormData({ ...formData, supplierName: e.target.value })}
              />
              <Input
                label="Procured Items Scope"
                placeholder="e.g. 150x Heavy Duty Staging Pallets"
                required
                value={formData.items}
                onChange={(e) => setFormData({ ...formData, items: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Purchase Cost ($)"
                  type="number"
                  required
                  value={formData.value || ""}
                  onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                />
                <Input
                  label="Expected Delivery Date"
                  type="date"
                  required
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Submit Purchase Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
