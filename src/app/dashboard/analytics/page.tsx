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
  BarChart3, 
  TrendingUp, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  HelpCircle,
  Lightbulb,
  Sparkles,
  ArrowUpRight,
  TrendingDown,
  Users,
  Warehouse,
  Wallet,
  Target,
  DollarSign,
  UserCheck,
  AlertCircle
} from "lucide-react"

export default function AnalyticsCenterPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  // Role Gating
  const isEmployee = user?.role === ROLES.EMPLOYEE
  const isCeo = user?.role === ROLES.CEO || user?.role === ROLES.SUPER_ADMIN
  const isOps = user?.role === ROLES.OPERATIONS_MANAGER
  const isFinance = user?.role === ROLES.FINANCE_MANAGER
  const isHr = user?.role === ROLES.HR_MANAGER

  const hasAccess = isCeo || isOps || isFinance || isHr

  React.useEffect(() => {
    if (!hasAccess && user) {
      router.push("/unauthorized")
    }
  }, [hasAccess, user])

  // Determine Default Active Tab
  const defaultTab = React.useMemo(() => {
    if (isCeo) return "executive"
    if (isOps) return "operations"
    if (isFinance) return "finance"
    if (isHr) return "workforce"
    return ""
  }, [isCeo, isOps, isFinance, isHr])

  const [activeTab, setActiveTab] = React.useState("")

  React.useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab)
    }
  }, [defaultTab])

  if (!hasAccess) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Analytics Center</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            GlowHaat Executive Business Intelligence, forecasting dashboards, and AI-driven insights.
          </p>
        </div>

        {/* Tab Selectors (Filtered by Role) */}
        <div className="flex rounded-lg border border-border bg-card p-1 shadow-sm text-xs max-w-full overflow-x-auto">
          {isCeo && (
            <button
              onClick={() => setActiveTab("executive")}
              className={`px-3 py-1.5 rounded-md font-bold transition-colors whitespace-nowrap ${
                activeTab === "executive" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Executive BI
            </button>
          )}
          {(isCeo || isFinance) && (
            <button
              onClick={() => setActiveTab("finance")}
              className={`px-3 py-1.5 rounded-md font-bold transition-colors whitespace-nowrap ${
                activeTab === "finance" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Finance BI
            </button>
          )}
          {(isCeo || isOps) && (
            <button
              onClick={() => setActiveTab("operations")}
              className={`px-3 py-1.5 rounded-md font-bold transition-colors whitespace-nowrap ${
                activeTab === "operations" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Operations BI
            </button>
          )}
          {(isCeo || isHr) && (
            <button
              onClick={() => setActiveTab("workforce")}
              className={`px-3 py-1.5 rounded-md font-bold transition-colors whitespace-nowrap ${
                activeTab === "workforce" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Workforce BI
            </button>
          )}
        </div>
      </div>

      {/* AI INSIGHTS WIDGET (Premium AI Experience - CEO/Finance/Ops) */}
      {(isCeo || isFinance || isOps) && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-3 flex flex-row items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-wider">AI Insights & Strategic recommendations</CardTitle>
              <CardDescription className="text-[10px]">Real-time predictive analytics based on active database streams.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 text-xs">
            <div className="p-3 bg-card border border-border/40 rounded-xl space-y-1.5">
              <span className="font-bold text-foreground flex items-center gap-1">
                <Lightbulb className="h-3.5 w-3.5 text-warning fill-warning/10" />
                Growth Opportunity: Regional Staging
              </span>
              <p className="text-muted-foreground leading-normal">
                Singapore APAC Fulfilment Node is currently operating at <span className="font-bold text-foreground">45% capacity</span>. Consolidating pending Asian logistics shipments to Singapore will reduce freight transfer fees by <span className="text-success font-bold">14.8%</span>.
              </p>
            </div>

            <div className="p-3 bg-card border border-border/40 rounded-xl space-y-1.5">
              <span className="font-bold text-foreground flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5 text-danger" />
                Risk Mitigation: Supply Bottleneck
              </span>
              <p className="text-muted-foreground leading-normal">
                Apex Logistics suppliers quality scores dipped slightly to <span className="font-bold text-foreground">4.2/5</span>. We recommend auto-routing the upcoming heavy pallets cargo transaction to Ironclad Security to maintain SLA standards.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TABS WORKSPACES */}

      {/* 1. EXECUTIVE BI TAB */}
      {activeTab === "executive" && isCeo && (
        <div className="space-y-6">
          {/* Executive Metrics */}
          <div className="grid gap-6 md:grid-cols-4">
            <KpiCard title="Net Monthly Profit" value="$16,700" icon={Wallet} status="success" />
            <KpiCard title="Avg OKR Achievement" value="62%" icon={Target} status="info" />
            <KpiCard title="Staff Attendance Rate" value="96%" icon={Users} status="success" />
            <KpiCard title="Active Contracts" value="4 Clients" icon={TrendingUp} status="default" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Sales Conversion Funnel */}
            <AnalyticsCard title="Sales Funnel & Conversions" description="Overall leads transition ratios.">
              <div className="space-y-3.5 text-xs">
                {[
                  { stage: "Identified Leads", value: 120, pct: 100 },
                  { stage: "Proposed Quotations", value: 45, pct: 37 },
                  { stage: "Agreed Contracts", value: 15, pct: 12 },
                  { stage: "Settled Invoices", value: 8, pct: 6 },
                ].map((s, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span className="text-muted-foreground">{s.stage}</span>
                      <span>{s.value} ({s.pct}%)</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </AnalyticsCard>

            {/* Strategic Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Growth Opportunities Summary</CardTitle>
                <CardDescription className="text-xs">Identified corporate expansions tasks.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3.5 text-xs">
                <div className="flex items-center gap-3 p-3 border border-border/40 bg-card rounded-xl">
                  <div className="h-8 w-8 rounded-full bg-success/10 text-success flex items-center justify-center font-bold">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Deploy SaaS Automation</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Estimated Q3 revenue impact: +$18,000</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 border border-border/40 bg-card rounded-xl">
                  <div className="h-8 w-8 rounded-full bg-success/10 text-success flex items-center justify-center font-bold">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Consolidate EU Supplier Pods</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Estimated cost reductions: -$6,500/mo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* 2. FINANCE BI TAB */}
      {activeTab === "finance" && (isCeo || isFinance) && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <KpiCard title="Fiscal Net Income" value="$16,700" icon={DollarSign} status="success" />
            <KpiCard title="Operating Cash Inflows" value="$43,000" icon={TrendingUp} status="success" />
            <KpiCard title="Operating Outflows" value="$26,300" icon={TrendingDown} status="default" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Cash Flow Forecast */}
            <AnalyticsCard title="Projections Cash Flow" description="Predictive cash flows based on trailing margins.">
              <div className="space-y-3.5 text-xs">
                {[
                  { quarter: "Q3 2026", revenue: 154000, expenses: 98000, pct: 70 },
                  { quarter: "Q4 2026", revenue: 189000, expenses: 110000, pct: 85 },
                  { quarter: "Q1 2027", revenue: 215000, expenses: 115000, pct: 95 },
                ].map((f, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span className="text-muted-foreground">{f.quarter} Projected Surplus</span>
                      <span className="text-success font-bold">+${(f.revenue - f.expenses).toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${f.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </AnalyticsCard>

            {/* P&L Statement Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Profit & Loss Summary</CardTitle>
                <CardDescription className="text-xs">Corporate statement metrics.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Revenue Inflows</span>
                  <span className="font-bold">$43,000</span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Cost of Goods (COGS)</span>
                  <span>($18,000)</span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2 font-bold text-foreground">
                  <span>Gross Profit Margin</span>
                  <span>$25,000</span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Operating Costs</span>
                  <span>($8,300)</span>
                </div>
                <div className="flex justify-between pt-1 font-black text-sm text-success">
                  <span>Net Income Surplus</span>
                  <span>$16,700</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* 3. OPERATIONS BI TAB */}
      {activeTab === "operations" && (isCeo || isOps) && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <KpiCard title="Active Logistics Pods" value="3 Locations" icon={Warehouse} status="default" />
            <KpiCard title="Global Capacity utilization" value="70%" icon={Activity} status="info" />
            <KpiCard title="Delivery SLA rate" value="95% On-Time" icon={CheckCircle} status="success" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Warehouse Capacities */}
            <AnalyticsCard title="Staging Capacities Rate" description="Utilizations metrics across regional warehouses.">
              <div className="space-y-3.5 text-xs">
                {[
                  { name: "US East Storage Pod", capacity: 78, status: "Optimal" },
                  { name: "EU West Logistics Hub", capacity: 88, status: "Near Limit" },
                  { name: "APAC Fulfilment Node", capacity: 45, status: "Underutilized" },
                ].map((w, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span className="text-muted-foreground">{w.name} ({w.status})</span>
                      <span>{w.capacity}%</span>
                    </div>
                    <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          w.capacity >= 80 ? "bg-warning" : w.capacity >= 50 ? "bg-success" : "bg-primary"
                        }`}
                        style={{ width: `${w.capacity}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </AnalyticsCard>

            {/* Vendor Scorecard averages */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Supplier Quality Averages</CardTitle>
                <CardDescription className="text-xs">Consolidated performance scores.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3.5 text-xs">
                {[
                  { name: "Global Server Co", score: 4.8 },
                  { name: "Apex Logistics Suppliers", score: 4.5 },
                  { name: "Ironclad Security", score: 4.2 },
                ].map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-border/40 pb-2.5 last:border-0 last:pb-0">
                    <span className="text-muted-foreground font-semibold">{s.name}</span>
                    <span className="font-bold flex items-center gap-1 text-foreground">
                      <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                      {s.score} / 5
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* 4. WORKFORCE BI TAB */}
      {activeTab === "workforce" && (isCeo || isHr) && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <KpiCard title="Roster Headcount" value="4 Active staff" icon={Users} status="default" />
            <KpiCard title="Daily Presence rate" value="96%" icon={UserCheck} status="success" />
            <KpiCard title="Pending Leave Requests" value="2 Requests" icon={AlertCircle} status="warning" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Team workloads */}
            <AnalyticsCard title="Staff Workloads Utilization" description="Tasks allocation count by department.">
              <div className="space-y-3.5 text-xs">
                {[
                  { name: "Engineering / Developers", count: 4, pct: 85 },
                  { name: "Sales / CRM Reps", count: 2, pct: 60 },
                  { name: "HR Management", count: 1, pct: 20 },
                ].map((w, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span className="text-muted-foreground">{w.name} ({w.count} active tasks)</span>
                      <span>{w.pct}% workload capacity</span>
                    </div>
                    <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${w.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </AnalyticsCard>

            {/* Attendance averages */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Daily Attendance Compliance</CardTitle>
                <CardDescription className="text-xs">Workforce check-in log records.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                {[
                  { name: "Marcus Chen", status: "Present" },
                  { name: "Sarah Jenkins", status: "Present" },
                  { name: "David Miller", status: "Late Check-in" },
                  { name: "Alice Johnson", status: "Present" },
                ].map((s, idx) => (
                  <div key={idx} className="flex justify-between border-b border-border/40 pb-2 last:border-0 last:pb-0">
                    <span className="text-muted-foreground font-semibold">{s.name}</span>
                    <span className={`font-bold ${s.status === "Present" ? "text-success" : "text-warning"}`}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

// Simple internal helper icon to prevent TS compiler errors in case of missing imports
function Star(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
