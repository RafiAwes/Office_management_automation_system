"use client"

import * as React from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { ROLES } from "@/lib/rbac/roles"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { SearchBar } from "@/components/ui/search-bar"
import { KpiCard } from "@/components/ui/kpi-card"
import { AnalyticsCard } from "@/components/ui/analytics-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { 
  TrendingUp, 
  Plus, 
  ArrowUpRight, 
  DollarSign, 
  Layers,
  Calendar,
  Building
} from "lucide-react"

interface IncomeTransaction {
  id: string
  clientName: string
  category: string
  amount: number
  date: string
  status: "Settled" | "Accrued"
}

export default function FinanceIncomePage() {
  const router = useRouter()
  const { user } = useAuthStore()

  // Role Checks
  const isFinanceManager = user?.role === ROLES.FINANCE_MANAGER || user?.role === ROLES.SUPER_ADMIN

  // Enforce Access
  React.useEffect(() => {
    if (!isFinanceManager && user) {
      router.push("/unauthorized")
    }
  }, [isFinanceManager, user])

  const [incomes, setIncomes] = React.useState<IncomeTransaction[]>([
    { id: "INC-801", clientName: "Global Logistics Pods", category: "SaaS Licensing", amount: 15400, date: "2026-06-25", status: "Settled" },
    { id: "INC-802", clientName: "Core Software Solutions", category: "Consulting Service", amount: 8900, date: "2026-06-27", status: "Settled" },
    { id: "INC-803", clientName: "Apex Logistics Corp", category: "API Integration", amount: 12500, date: "2026-06-28", status: "Accrued" },
    { id: "INC-804", clientName: "Summit Tech LLC", category: "SaaS Licensing", amount: 6200, date: "2026-06-28", status: "Settled" },
  ])

  const [searchQuery, setSearchQuery] = React.useState("")
  const [isAddOpen, setIsAddOpen] = React.useState(false)

  // Form State
  const [formData, setFormData] = React.useState({
    clientName: "",
    category: "SaaS Licensing",
    amount: 0,
    status: "Settled" as IncomeTransaction["status"],
  })

  if (!isFinanceManager) return null

  // Calculations
  const totalBilled = incomes.reduce((sum, item) => sum + item.amount, 0)
  const totalSettled = incomes.filter((i) => i.status === "Settled").reduce((sum, item) => sum + item.amount, 0)
  const totalAccrued = incomes.filter((i) => i.status === "Accrued").reduce((sum, item) => sum + item.amount, 0)

  const filteredIncomes = incomes.filter(
    (i) =>
      i.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateIncome = (e: React.FormEvent) => {
    e.preventDefault()

    const newInc: IncomeTransaction = {
      id: `INC-${Math.floor(800 + Math.random() * 99)}`,
      clientName: formData.clientName,
      category: formData.category,
      amount: Number(formData.amount) || 0,
      date: new Date().toISOString().split("T")[0],
      status: formData.status,
    }

    setIncomes([newInc, ...incomes])
    setIsAddOpen(false)
    setFormData({ clientName: "", category: "SaaS Licensing", amount: 0, status: "Settled" })
  }

  const columns = [
    { header: "Transaction Code", accessorKey: "id" },
    { header: "Client / Customer", accessorKey: "clientName" },
    { header: "Income Stream Category", accessorKey: "category" },
    {
      header: "Value Amount",
      accessorKey: "amount",
      render: (row: IncomeTransaction) => `$${row.amount.toLocaleString()}`,
    },
    { header: "Logged Date", accessorKey: "date" },
    {
      header: "Status",
      accessorKey: "status",
      render: (row: IncomeTransaction) => (
        <span className={`font-semibold ${row.status === "Settled" ? "text-success" : "text-warning animate-pulse"}`}>
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
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Income Ledger</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit GlowHaat income channels, register revenue checks, and track billing collections.
          </p>
        </div>

        <Button onClick={() => setIsAddOpen(true)} size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          Log Income Receipt
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <KpiCard
          title="Total Billed Portfolio"
          value={`$${totalBilled.toLocaleString()}`}
          icon={DollarSign}
          status="default"
        />
        <KpiCard
          title="Revenue Collected (Settled)"
          value={`$${totalSettled.toLocaleString()}`}
          icon={ArrowUpRight}
          status="success"
        />
        <KpiCard
          title="Accrued / Outstanding Ledgers"
          value={`$${totalAccrued.toLocaleString()}`}
          icon={Layers}
          status="warning"
        />
      </div>

      {/* Income Stream Breakdown Graphics */}
      <div className="grid gap-6 lg:grid-cols-3">
        <AnalyticsCard
          title="Income Streams Breakdown"
          description="Revenue distribution by business service model."
          className="lg:col-span-2"
        >
          <div className="space-y-4">
            {["SaaS Licensing", "Consulting Service", "API Integration"].map((cat) => {
              const catTotal = incomes.filter((i) => i.category === cat).reduce((sum, item) => sum + item.amount, 0)
              const pct = totalBilled > 0 ? Math.round((catTotal / totalBilled) * 100) : 0
              return (
                <div key={cat} className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">{cat}</span>
                    <span>${catTotal.toLocaleString()} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </AnalyticsCard>

        {/* Top Clients */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Major Client Accounts</CardTitle>
            <CardDescription className="text-xs">Contract portfolios summaries.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs">
            {incomes.slice(0, 3).map((i) => (
              <div key={i.id} className="flex items-center justify-between border-b border-border/40 pb-2.5 last:border-0 last:pb-0">
                <div className="space-y-0.5">
                  <p className="font-bold text-foreground">{i.clientName}</p>
                  <p className="text-[10px] text-muted-foreground">{i.category}</p>
                </div>
                <span className="font-black text-foreground">${i.amount.toLocaleString()}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Main Income ledger list */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-base font-semibold">Auditable Revenue Ledger</CardTitle>
            <SearchBar
              placeholder="Search income receipts..."
              onSearch={(val) => setSearchQuery(val)}
              className="max-w-xs"
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredIncomes}
            pageSize={5}
          />
        </CardContent>
      </Card>

      {/* Log Income Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-foreground">Log Income Receipt</h3>
            <form onSubmit={handleCreateIncome} className="space-y-4 text-xs">
              <Input
                label="Client / Customer Name"
                placeholder="e.g. Acme Tech Solutions"
                required
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Income Stream"
                  options={[
                    { label: "SaaS Licensing", value: "SaaS Licensing" },
                    { label: "Consulting Service", value: "Consulting Service" },
                    { label: "API Integration", value: "API Integration" },
                  ]}
                  value={formData.category}
                  onChange={(e: any) => setFormData({ ...formData, category: e.target.value })}
                />
                <Input
                  label="Billed Amount ($)"
                  type="number"
                  required
                  value={formData.amount || ""}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                />
              </div>
              <Select
                label="Ledger Settlement Status"
                options={[
                  { label: "Settled (Cleared Check)", value: "Settled" },
                  { label: "Accrued (Outstanding Bill)", value: "Accrued" },
                ]}
                value={formData.status}
                onChange={(e: any) => setFormData({ ...formData, status: e.target.value })}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Record Inflow
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
