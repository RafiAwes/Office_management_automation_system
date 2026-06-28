"use client"

import * as React from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { useRbac } from "@/hooks/use-rbac"
import { PERMISSIONS } from "@/lib/rbac/permissions"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Drawer } from "@/components/ui/drawer"
import { DataTable } from "@/components/ui/data-table"
import { SearchBar } from "@/components/ui/search-bar"
import { KpiCard } from "@/components/ui/kpi-card"
import { AnalyticsCard } from "@/components/ui/analytics-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  DollarSign, 
  FileText, 
  Eye, 
  CheckSquare, 
  AlertTriangle,
  Building,
  Calendar,
  Layers,
  ArrowUpRight,
  Plus
} from "lucide-react"

interface Invoice {
  id: string
  clientName: string
  value: number
  status: "Draft" | "Unpaid" | "Paid" | "Overdue"
  issueDate: string
  dueDate: string
}

export default function SalesInvoicesPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  // RBAC checks: Accessible by both Sales Managers (sales.view) and Finance Managers (finance.view)
  const { isAllowed: canView } = useRbac({ 
    requiredPermissions: [PERMISSIONS.SALES_VIEW, PERMISSIONS.FINANCE_VIEW],
    matchType: "any"
  })

  // Manager checks for disbursement actions (Only Sales Manager has sales.create)
  const { isAllowed: canManage } = useRbac({ requiredPermissions: [PERMISSIONS.SALES_CREATE] })

  // State
  const [invoices, setInvoices] = React.useState<Invoice[]>([
    {
      id: "INV-401",
      clientName: "Initech LLC",
      value: 65000,
      status: "Paid",
      issueDate: "2026-06-25",
      dueDate: "2026-07-25",
    },
    {
      id: "INV-402",
      clientName: "Acme Corp Ltd",
      value: 12450,
      status: "Unpaid",
      issueDate: "2026-06-20",
      dueDate: "2026-07-20",
    },
    {
      id: "INV-403",
      clientName: "Umbrella Corp",
      value: 290000,
      status: "Overdue",
      issueDate: "2026-05-15",
      dueDate: "2026-06-15",
    },
    {
      id: "INV-404",
      clientName: "Globex Inc",
      value: 88000,
      status: "Paid",
      issueDate: "2026-06-10",
      dueDate: "2026-07-10",
    },
  ])

  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedInvoice, setSelectedInvoice] = React.useState<Invoice | null>(null)
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)

  // Form State
  const [formData, setFormData] = React.useState({
    clientName: "",
    value: 0,
    dueDate: "",
  })

  // Enforce Access
  React.useEffect(() => {
    if (!canView && user) {
      router.push("/unauthorized")
    }
  }, [canView, user])

  if (!canView) return null

  // Filters
  const filteredInvoices = invoices.filter(
    (i) =>
      i.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculations
  const totalInvoiced = invoices.reduce((sum, i) => sum + i.value, 0)
  const totalCollected = invoices.filter((i) => i.status === "Paid").reduce((sum, i) => sum + i.value, 0)
  const totalUnpaid = invoices.filter((i) => i.status === "Unpaid" || i.status === "Overdue").reduce((sum, i) => sum + i.value, 0)

  // Actions
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canManage) return

    const newInv: Invoice = {
      id: `INV-${Math.floor(400 + Math.random() * 99)}`,
      clientName: formData.clientName,
      value: Number(formData.value) || 0,
      status: "Unpaid",
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: formData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    }

    setInvoices([newInv, ...invoices])
    setIsCreateOpen(false)
    setFormData({ clientName: "", value: 0, dueDate: "" })
  }

  const handleMarkPaid = (id: string) => {
    if (!canManage) return
    const updated = invoices.map((i) => {
      if (i.id === id) {
        return { ...i, status: "Paid" as const }
      }
      return i
    })
    setInvoices(updated)
    const target = updated.find((i) => i.id === id)
    if (target) setSelectedInvoice(target)
  }

  const columns = [
    { header: "Invoice ID", accessorKey: "id" },
    { header: "Client / Organization", accessorKey: "clientName" },
    {
      header: "Billed Value",
      accessorKey: "value",
      render: (row: Invoice) => `$${row.value.toLocaleString()}`,
    },
    { header: "Issued Date", accessorKey: "issueDate" },
    { header: "Due Date", accessorKey: "dueDate" },
    { header: "Status", accessorKey: "status" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Invoice Dashboard</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Oversee billing collections, track payment dates, and review corporate ledger charts.
          </p>
        </div>

        {canManage && (
          <Button onClick={() => setIsCreateOpen(true)} size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Invoice
          </Button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <KpiCard
          title="Total Billed Portfolio"
          value={`$${totalInvoiced.toLocaleString()}`}
          icon={FileText}
          status="default"
        />
        <KpiCard
          title="Collected Revenue"
          value={`$${totalCollected.toLocaleString()}`}
          icon={DollarSign}
          status="success"
        />
        <KpiCard
          title="Unpaid & Overdue Ledger"
          value={`$${totalUnpaid.toLocaleString()}`}
          icon={AlertTriangle}
          status="warning"
        />
      </div>

      {/* Analytics & Funnel */}
      <div className="grid gap-6 lg:grid-cols-3">
        <AnalyticsCard
          title="GlowHaat Sales Funnel Conversion"
          description="Ratios of sales pipelines advancement from leads to invoices."
          className="lg:col-span-2"
        >
          <div className="space-y-3.5">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Lead Discovery / Qualified Stage</span>
                <span>100% (248 Active Leads)</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "100%" }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Demo / Custom Proposal Dispatched</span>
                <span>60% (148 Proposals)</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div className="bg-accent h-full rounded-full" style={{ width: "60%" }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Negotiations & Closed Won Contracts</span>
                <span>32% (79 Contracts)</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "32%" }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Invoiced / Revenue Collections</span>
                <span>24% (58 Paid Invoices)</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div className="bg-success h-full rounded-full" style={{ width: "24%" }} />
              </div>
            </div>
          </div>
        </AnalyticsCard>

        {/* Mini Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Billing Collections Rate</CardTitle>
            <CardDescription className="text-xs">Collected vs Outstanding Ratios.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 text-xs">
            <div className="flex items-center justify-center py-4">
              <div className="relative h-28 w-28 rounded-full border-[8px] border-warning flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-[8px] border-success border-t-transparent border-r-transparent rotate-45" />
                <div className="text-center">
                  <p className="text-base font-black text-foreground">
                    {Math.round((totalCollected / (totalInvoiced || 1)) * 100)}%
                  </p>
                  <p className="text-[10px] text-muted-foreground">Collected</p>
                </div>
              </div>
            </div>
            <div className="space-y-1.5 leading-normal">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-success inline-block" />
                  Collected Revenue:
                </span>
                <span className="font-bold text-foreground">${totalCollected.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-warning inline-block" />
                  Unpaid / Overdue:
                </span>
                <span className="font-bold text-foreground">${totalUnpaid.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Ledger Table */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <SearchBar
            placeholder="Search invoices by client or ID..."
            onSearch={(val) => setSearchQuery(val)}
          />
          <DataTable
            columns={columns}
            data={filteredInvoices}
            pageSize={5}
            onRowClick={(row) => setSelectedInvoice(row)}
            actions={(row) => (
              <Button size="xs" variant="outline" onClick={() => setSelectedInvoice(row)}>
                <Eye className="h-3.5 w-3.5" />
              </Button>
            )}
          />
        </CardContent>
      </Card>

      {/* Invoice Drawer */}
      <Drawer
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        title={`Invoice ${selectedInvoice?.id}`}
        description={selectedInvoice?.clientName}
      >
        {selectedInvoice && (
          <div className="space-y-6 text-xs leading-normal">
            {/* Meta */}
            <div className="space-y-3 bg-muted/20 p-4 border border-border/50 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider">Invoice Metadata</span>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold text-foreground">{selectedInvoice.clientName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Issued: {selectedInvoice.issueDate} | Due: {selectedInvoice.dueDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-bold text-foreground">${selectedInvoice.value.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Status info */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider block">Billing Status</span>
              <div className="p-3 border border-border/40 rounded-xl bg-card flex justify-between items-center">
                <div>
                  <p className="text-muted-foreground">Invoice Status</p>
                  <p className="font-bold text-foreground">{selectedInvoice.status}</p>
                </div>
                {canManage && selectedInvoice.status !== "Paid" && (
                  <Button size="xs" variant="outline" onClick={() => handleMarkPaid(selectedInvoice.id)}>
                    <CheckSquare className="mr-1.5 h-3.5 w-3.5 text-success" />
                    Mark as Paid
                  </Button>
                )}
              </div>
            </div>

            {/* SLA Info */}
            <div className="space-y-2.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider block">GlowHaat Accounting Terms</span>
              <p className="text-muted-foreground leading-relaxed italic bg-muted/20 p-2.5 border border-border/40 rounded-lg">
                Payments are subject to net-30 terms. Late disbursements accrue standard interest calculations according to corporate SLA charters.
              </p>
            </div>
          </div>
        )}
      </Drawer>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsCreateOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-foreground">Create New Invoice</h3>
            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <Input
                label="Client Name"
                placeholder="e.g. Initech LLC"
                required
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              />
              <Input
                label="Billed Value ($)"
                type="number"
                required
                value={formData.value || ""}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
              />
              <Input
                label="Payment Due Date"
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Generate Invoice
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
