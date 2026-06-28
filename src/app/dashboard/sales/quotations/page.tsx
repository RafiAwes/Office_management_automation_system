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
import { EmptyState } from "@/components/ui/empty-state"
import { 
  FileText, 
  Plus, 
  Eye, 
  Trash2, 
  Send, 
  CheckCircle, 
  XCircle,
  Building,
  Mail,
  Calendar,
  DollarSign
} from "lucide-react"

interface QuotationItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

interface Quotation {
  id: string
  clientName: string
  clientEmail: string
  value: number
  status: "Draft" | "Dispatched" | "Accepted" | "Expired"
  issueDate: string
  expiryDate: string
  items: QuotationItem[]
}

export default function SalesQuotationsPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  // RBAC checks
  const { isAllowed: canView } = useRbac({ requiredPermissions: [PERMISSIONS.SALES_VIEW] })
  const { isAllowed: canCreate } = useRbac({ requiredPermissions: [PERMISSIONS.SALES_CREATE] })

  // State
  const [quotations, setQuotations] = React.useState<Quotation[]>([
    {
      id: "QT-881",
      clientName: "Initech LLC",
      clientEmail: "peter@initech.com",
      value: 65000,
      status: "Accepted",
      issueDate: "2026-06-01",
      expiryDate: "2026-07-01",
      items: [
        { id: "item-1", description: "Vite/Next.js Custom ERP Panel Setup", quantity: 1, unitPrice: 45000 },
        { id: "item-2", description: "Postgres Cloud Cluster Deployment", quantity: 1, unitPrice: 20000 },
      ],
    },
    {
      id: "QT-882",
      clientName: "Apex Tech Solutions",
      clientEmail: "alice@apextech.com",
      value: 48000,
      status: "Dispatched",
      issueDate: "2026-06-15",
      expiryDate: "2026-07-15",
      items: [
        { id: "item-3", description: "HR Staff Directory API Integration", quantity: 1, unitPrice: 38000 },
        { id: "item-4", description: "Support tickets SLAs templates", quantity: 2, unitPrice: 5000 },
      ],
    },
    {
      id: "QT-883",
      clientName: "Umbrella Corp",
      clientEmail: "wesker@umbrella.com",
      value: 290000,
      status: "Draft",
      issueDate: "2026-06-25",
      expiryDate: "2026-07-25",
      items: [
        { id: "item-5", description: "Global Operations Security Grid API", quantity: 1, unitPrice: 290000 },
      ],
    },
  ])

  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedQuot, setSelectedQuot] = React.useState<Quotation | null>(null)
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)

  // Form State
  const [formData, setFormData] = React.useState({
    clientName: "",
    clientEmail: "",
    itemName: "",
    quantity: 1,
    unitPrice: 0,
  })

  // Enforce Access Gating
  React.useEffect(() => {
    if (!canView && user) {
      router.push("/unauthorized")
    }
  }, [canView, user])

  if (!canView) return null

  // Filters
  const filteredQuots = quotations.filter(
    (q) =>
      q.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Actions
  const handleCreateQuotation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canCreate) return

    const price = Number(formData.unitPrice) || 0
    const qty = Number(formData.quantity) || 1
    const totalVal = price * qty

    const newQuot: Quotation = {
      id: `QT-${Math.floor(900 + Math.random() * 99)}`,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      value: totalVal,
      status: "Draft",
      issueDate: new Date().toISOString().split("T")[0],
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      items: [
        {
          id: `item-${Date.now()}`,
          description: formData.itemName,
          quantity: qty,
          unitPrice: price,
        },
      ],
    }

    setQuotations([newQuot, ...quotations])
    setIsCreateOpen(false)
    setFormData({ clientName: "", clientEmail: "", itemName: "", quantity: 1, unitPrice: 0 })
  }

  const handleUpdateStatus = (id: string, nextStatus: Quotation["status"]) => {
    if (!canCreate) return // Only creators/Sales Managers can update
    const updated = quotations.map((q) => {
      if (q.id === id) {
        return { ...q, status: nextStatus }
      }
      return q
    })
    setQuotations(updated)
    const target = updated.find((q) => q.id === id)
    if (target) setSelectedQuot(target)
  }

  const columns = [
    { header: "Quotation ID", accessorKey: "id" },
    { header: "Client / Recipient", accessorKey: "clientName" },
    {
      header: "Value Target",
      accessorKey: "value",
      render: (row: Quotation) => `$${row.value.toLocaleString()}`,
    },
    { header: "Issued Date", accessorKey: "issueDate" },
    { header: "Valid Until", accessorKey: "expiryDate" },
    { header: "Status", accessorKey: "status" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Quotations Management</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Create, dispatch, and monitor commercial agreements for GlowHaat clients.
          </p>
        </div>

        {canCreate && (
          <Button onClick={() => setIsCreateOpen(true)} size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Quotation
          </Button>
        )}
      </div>

      {/* Search and Table */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <SearchBar
            placeholder="Search quotations by client or ID..."
            onSearch={(val) => setSearchQuery(val)}
          />
          <DataTable
            columns={columns}
            data={filteredQuots}
            pageSize={5}
            onRowClick={(row) => setSelectedQuot(row)}
            actions={(row) => (
              <Button size="xs" variant="outline" onClick={() => setSelectedQuot(row)}>
                <Eye className="h-3.5 w-3.5" />
              </Button>
            )}
          />
        </CardContent>
      </Card>

      {/* Details Drawer */}
      <Drawer
        isOpen={!!selectedQuot}
        onClose={() => setSelectedQuot(null)}
        title={`Quotation ${selectedQuot?.id}`}
        description={selectedQuot?.clientName}
      >
        {selectedQuot && (
          <div className="space-y-6 text-xs leading-normal">
            {/* Metadata */}
            <div className="space-y-3 bg-muted/20 p-4 border border-border/50 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider">Client Registry</span>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold text-foreground">{selectedQuot.clientName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${selectedQuot.clientEmail}`} className="text-foreground hover:underline">
                    {selectedQuot.clientEmail}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Issued: {selectedQuot.issueDate} | Expires: {selectedQuot.expiryDate}</span>
                </div>
              </div>
            </div>

            {/* Status Selector */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider block">Quotation State</span>
              <div className="flex justify-between items-center p-3 border border-border/40 rounded-xl bg-card">
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-bold text-foreground">{selectedQuot.status}</p>
                </div>
                {canCreate && (
                  <select
                    value={selectedQuot.status}
                    onChange={(e) => handleUpdateStatus(selectedQuot.id, e.target.value as Quotation["status"])}
                    className="text-xs font-semibold rounded border border-border bg-card p-1 focus:outline-none"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Expired">Expired</option>
                  </select>
                )}
              </div>
            </div>

            {/* Line items table */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider block">Line Items</span>
              <div className="border border-border/50 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/40 text-muted-foreground font-semibold text-[10px] uppercase border-b border-border/50">
                      <th className="p-2.5">Item Description</th>
                      <th className="p-2.5 text-right">Qty</th>
                      <th className="p-2.5 text-right">Price</th>
                      <th className="p-2.5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 bg-card/40">
                    {selectedQuot.items.map((item) => (
                      <tr key={item.id}>
                        <td className="p-2.5 font-medium text-foreground">{item.description}</td>
                        <td className="p-2.5 text-right text-muted-foreground">{item.quantity}</td>
                        <td className="p-2.5 text-right text-muted-foreground">${item.unitPrice.toLocaleString()}</td>
                        <td className="p-2.5 text-right font-bold text-foreground">
                          ${(item.quantity * item.unitPrice).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-muted/10 font-bold border-t border-border/50">
                      <td colSpan={3} className="p-2.5 text-right text-muted-foreground">Total Quotation Value:</td>
                      <td className="p-2.5 text-right text-foreground text-sm">${selectedQuot.value.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dispatch controls */}
            {canCreate && selectedQuot.status === "Draft" && (
              <div className="pt-2">
                <Button size="sm" className="w-full animate-pulse" onClick={() => handleUpdateStatus(selectedQuot.id, "Dispatched")}>
                  <Send className="mr-1.5 h-4 w-4" />
                  Dispatch to Client
                </Button>
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
            <h3 className="text-base font-bold text-foreground">Draft New Quotation</h3>
            <form onSubmit={handleCreateQuotation} className="space-y-4 text-xs">
              <Input
                label="Client Name"
                placeholder="e.g. Initech LLC"
                required
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              />
              <Input
                label="Client Email"
                placeholder="peter@initech.com"
                type="email"
                required
                value={formData.clientEmail}
                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
              />
              <Input
                label="Scope of Work Item"
                placeholder="e.g. Frontend App Build Layout"
                required
                value={formData.itemName}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Quantity"
                  type="number"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                />
                <Input
                  label="Unit Price ($)"
                  type="number"
                  required
                  value={formData.unitPrice || ""}
                  onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Draft
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
