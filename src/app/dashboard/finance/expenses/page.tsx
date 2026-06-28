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
  DollarSign, 
  Plus, 
  ArrowDownRight, 
  Briefcase, 
  Layers,
  Calendar,
  Building
} from "lucide-react"

interface ExpenseTransaction {
  id: string
  merchant: string
  category: string
  amount: number
  date: string
  status: "Cleared" | "Pending"
}

export default function FinanceExpensesPage() {
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

  const [expenses, setExpenses] = React.useState<ExpenseTransaction[]>([
    { id: "EXP-901", merchant: "Amazon Web Services", category: "Cloud Staging hosting", amount: 4800, date: "2026-06-20", status: "Cleared" },
    { id: "EXP-902", merchant: "Office Space Rental Corp", category: "Office Rental leases", amount: 12000, date: "2026-06-25", status: "Cleared" },
    { id: "EXP-903", merchant: "Apex Logistics Suppliers", category: "Product inventory purchase", amount: 18000, date: "2026-06-27", status: "Pending" },
    { id: "EXP-904", merchant: "Google Cloud Suite", category: "Cloud Staging hosting", amount: 1500, date: "2026-06-28", status: "Cleared" },
  ])

  const [searchQuery, setSearchQuery] = React.useState("")
  const [isAddOpen, setIsAddOpen] = React.useState(false)

  // Form State
  const [formData, setFormData] = React.useState({
    merchant: "",
    category: "Cloud Staging hosting",
    amount: 0,
    status: "Cleared" as ExpenseTransaction["status"],
  })

  if (!isFinanceManager) return null

  // Calculations
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0)
  const totalCleared = expenses.filter((e) => e.status === "Cleared").reduce((sum, item) => sum + item.amount, 0)
  const totalPending = expenses.filter((e) => e.status === "Pending").reduce((sum, item) => sum + item.amount, 0)

  const filteredExpenses = expenses.filter(
    (e) =>
      e.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault()

    const newExp: ExpenseTransaction = {
      id: `EXP-${Math.floor(900 + Math.random() * 99)}`,
      merchant: formData.merchant,
      category: formData.category,
      amount: Number(formData.amount) || 0,
      date: new Date().toISOString().split("T")[0],
      status: formData.status,
    }

    setExpenses([newExp, ...expenses])
    setIsAddOpen(false)
    setFormData({ merchant: "", category: "Cloud Staging hosting", amount: 0, status: "Cleared" })
  }

  const columns = [
    { header: "Transaction Code", accessorKey: "id" },
    { header: "Merchant / Recipient", accessorKey: "merchant" },
    { header: "Expense Category", accessorKey: "category" },
    {
      header: "Disbursed Value",
      accessorKey: "amount",
      render: (row: ExpenseTransaction) => `$${row.amount.toLocaleString()}`,
    },
    { header: "Logged Date", accessorKey: "date" },
    {
      header: "Status",
      accessorKey: "status",
      render: (row: ExpenseTransaction) => (
        <span className={`font-semibold ${row.status === "Cleared" ? "text-success" : "text-warning animate-pulse"}`}>
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
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Expenses Hub</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit GlowHaat operating costs, disburse merchant balances, and catalog corporate spending.
          </p>
        </div>

        <Button onClick={() => setIsAddOpen(true)} size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          Log Expense Debit
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <KpiCard
          title="Total Operating Outflow"
          value={`$${totalSpent.toLocaleString()}`}
          icon={DollarSign}
          status="default"
        />
        <KpiCard
          title="Cleared Disbursements"
          value={`$${totalCleared.toLocaleString()}`}
          icon={ArrowDownRight}
          status="success"
        />
        <KpiCard
          title="Pending Settlements"
          value={`$${totalPending.toLocaleString()}`}
          icon={Layers}
          status="warning"
        />
      </div>

      {/* Expense categories breakdown */}
      <div className="grid gap-6 lg:grid-cols-3">
        <AnalyticsCard
          title="Expense Distribution"
          description="Operating expenditures mapped by category splits."
          className="lg:col-span-2"
        >
          <div className="space-y-4">
            {["Cloud Staging hosting", "Office Rental leases", "Product inventory purchase"].map((cat) => {
              const catTotal = expenses.filter((e) => e.category === cat).reduce((sum, item) => sum + item.amount, 0)
              const pct = totalSpent > 0 ? Math.round((catTotal / totalSpent) * 100) : 0
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

        {/* Top Vendors */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Major Vendors Accounts</CardTitle>
            <CardDescription className="text-xs">Merchant logs highlights.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs">
            {expenses.slice(0, 3).map((e) => (
              <div key={e.id} className="flex items-center justify-between border-b border-border/40 pb-2.5 last:border-0 last:pb-0">
                <div className="space-y-0.5">
                  <p className="font-bold text-foreground">{e.merchant}</p>
                  <p className="text-[10px] text-muted-foreground">{e.category}</p>
                </div>
                <span className="font-black text-foreground">${e.amount.toLocaleString()}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Main Expense ledger list */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-base font-semibold">Auditable Expenses Log</CardTitle>
            <SearchBar
              placeholder="Search expenses..."
              onSearch={(val) => setSearchQuery(val)}
              className="max-w-xs"
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredExpenses}
            pageSize={5}
          />
        </CardContent>
      </Card>

      {/* Log Expense Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-foreground">Log Expense Debit</h3>
            <form onSubmit={handleCreateExpense} className="space-y-4 text-xs">
              <Input
                label="Merchant / Recipient Name"
                placeholder="e.g. Amazon Web Services"
                required
                value={formData.merchant}
                onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Expense Category"
                  options={[
                    { label: "Cloud Staging hosting", value: "Cloud Staging hosting" },
                    { label: "Office Rental leases", value: "Office Rental leases" },
                    { label: "Product inventory purchase", value: "Product inventory purchase" },
                  ]}
                  value={formData.category}
                  onChange={(e: any) => setFormData({ ...formData, category: e.target.value })}
                />
                <Input
                  label="Debit Amount ($)"
                  type="number"
                  required
                  value={formData.amount || ""}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                />
              </div>
              <Select
                label="Ledger Settlement Status"
                options={[
                  { label: "Cleared (Disbursed)", value: "Cleared" },
                  { label: "Pending (Scheduled)", value: "Pending" },
                ]}
                value={formData.status}
                onChange={(e: any) => setFormData({ ...formData, status: e.target.value })}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Record Outflow
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
