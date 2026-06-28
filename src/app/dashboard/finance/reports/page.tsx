"use client"

import * as React from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { ROLES } from "@/lib/rbac/roles"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { KpiCard } from "@/components/ui/kpi-card"
import { AnalyticsCard } from "@/components/ui/analytics-card"
import { Button } from "@/components/ui/button"
import { 
  Wallet, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  TrendingUp,
  AlertTriangle
} from "lucide-react"

interface ForecastItem {
  quarter: string
  projectedRevenue: number
  projectedExpenses: number
  netProfit: number
  growthRatePct: number
}

interface BudgetCategory {
  category: string
  allocated: number
  spent: number
}

export default function FinanceReportsPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  // Role Checks
  const isFinanceOrCeo = user?.role === ROLES.FINANCE_MANAGER || user?.role === ROLES.CEO || user?.role === ROLES.SUPER_ADMIN

  // Enforce Access Gating
  React.useEffect(() => {
    if (!isFinanceOrCeo && user) {
      router.push("/unauthorized")
    }
  }, [isFinanceOrCeo, user])

  // Mock Budget data
  const [budgets] = React.useState<BudgetCategory[]>([
    { category: "Infrastructure & Cloud", allocated: 15000, spent: 6300 },
    { category: "Office Rent & Leases", allocated: 12000, spent: 12000 },
    { category: "Inventory Procurement", allocated: 25000, spent: 26300 }, // Over budget
    { category: "SaaS Software Tooling", allocated: 5000, spent: 2500 },
  ])

  // Mock Forecast data
  const [forecasts] = React.useState<ForecastItem[]>([
    { quarter: "Q3 2026 (Proj)", projectedRevenue: 154000, projectedExpenses: 98000, netProfit: 56000, growthRatePct: 18 },
    { quarter: "Q4 2026 (Proj)", projectedRevenue: 189000, projectedExpenses: 110000, netProfit: 79000, growthRatePct: 22 },
    { quarter: "Q1 2027 (Proj)", projectedRevenue: 215000, projectedExpenses: 115000, netProfit: 100000, growthRatePct: 13 },
  ])

  if (!isFinanceOrCeo) return null

  // P&L Statement calculations
  const revenue = 43000
  const cogs = 18000
  const grossProfit = revenue - cogs
  const opex = 8300
  const netIncome = grossProfit - opex

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Financial Reports</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Overview tracking of P&L ledgers, budgets compliance, and predictive quarterly cash flows.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <KpiCard
          title="Net Corporate Income"
          value={`$${netIncome.toLocaleString()}`}
          icon={Wallet}
          status="success"
        />
        <KpiCard
          title="Gross Profit Margin"
          value={`${Math.round((grossProfit / revenue) * 100)}%`}
          icon={ArrowUpRight}
          status="success"
        />
        <KpiCard
          title="Operating Expenses Ratio"
          value={`${Math.round((opex / revenue) * 100)}%`}
          icon={ArrowDownRight}
          status="default"
        />
      </div>

      {/* Profit & Loss Statement + Cash Flow */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* P&L Statement Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Profit & Loss Statement (P&L)</CardTitle>
            <CardDescription className="text-xs">Corporate ledger statement for current fiscal cycle.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs">
            <div className="flex justify-between border-b border-border/40 pb-2 font-bold text-foreground">
              <span>Total Revenue Inflow</span>
              <span>${revenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-2 text-muted-foreground pl-4">
              <span>Cost of Goods Sold (COGS)</span>
              <span>(${cogs.toLocaleString()})</span>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-2 font-bold text-foreground pl-4">
              <span>Gross Profit Margin</span>
              <span>${grossProfit.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-2 text-muted-foreground pl-4">
              <span>Operating Expenses (OpEx)</span>
              <span>(${opex.toLocaleString()})</span>
            </div>
            <div className="flex justify-between pt-1 font-black text-sm text-foreground">
              <span>Net Net Income</span>
              <span className="text-success">${netIncome.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Cash Flow */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Cash Flow Statement</CardTitle>
            <CardDescription className="text-xs">Tracking cash inflows vs operating outflows.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border border-border/40 bg-card rounded-xl space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Cash Inflows</span>
                <p className="font-bold text-success text-sm">+${revenue.toLocaleString()}</p>
              </div>
              <div className="p-3 border border-border/40 bg-card rounded-xl space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Operating Outflows</span>
                <p className="font-bold text-danger text-sm">-${(cogs + opex).toLocaleString()}</p>
              </div>
            </div>
            <div className="p-3.5 bg-secondary/30 border border-border/40 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">Net Cash Flow Variance</p>
                <p className="text-[10px] text-muted-foreground">Favorable operating surplus.</p>
              </div>
              <span className="font-black text-success text-sm">+${(revenue - (cogs + opex)).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Tracking + Forecast Dashboard */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Budget Tracking */}
        <AnalyticsCard
          title="Corporate Budget Allocation"
          description="Assigned spending budget vs actual operating debits."
        >
          <div className="space-y-4 text-xs">
            {budgets.map((b, idx) => {
              const pct = Math.round((b.spent / b.allocated) * 100)
              const isOver = b.spent > b.allocated
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center font-semibold">
                    <span className="text-muted-foreground">{b.category}</span>
                    <span className={isOver ? "text-danger font-bold animate-pulse" : "text-foreground"}>
                      ${b.spent.toLocaleString()} / ${b.allocated.toLocaleString()} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isOver ? "bg-danger" : "bg-primary"}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </AnalyticsCard>

        {/* Forecast Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Quarterly Growth Forecasts</CardTitle>
            <CardDescription className="text-xs">Predictive revenue projections based on trailing performance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs">
            {forecasts.map((f, idx) => (
              <div key={idx} className="p-3 border border-border/40 bg-card rounded-xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-bold text-foreground">{f.quarter}</p>
                  <p className="text-[10px] text-muted-foreground">
                    Projected Revenue: ${f.projectedRevenue.toLocaleString()} | Margin: ${f.netProfit.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-black text-success flex items-center gap-1 justify-end text-sm">
                    <TrendingUp className="h-4 w-4" />
                    +{f.growthRatePct}%
                  </span>
                  <span className="text-[9px] text-muted-foreground">Est. Growth</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
