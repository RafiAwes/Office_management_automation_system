"use client"

import * as React from "react"
import { KpiCard } from "@/components/ui/kpi-card"
import { AnalyticsCard } from "@/components/ui/analytics-card"
import { ActivityFeed } from "@/components/ui/activity-feed"
import { NotificationItem } from "@/components/ui/notification-item"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { DollarSign, Landmark, Receipt, ArrowUpRight, BarChart4 } from "lucide-react"

export function FinanceDashboard() {
  const kpis = [
    { title: "Revenue Ledger", value: "$412,800", icon: DollarSign, trend: { value: 18.2, isPositive: true }, status: "success" as const },
    { title: "Operating Expenses", value: "$124,500", icon: Receipt, trend: { value: 5.4, isPositive: false }, status: "default" as const },
    { title: "Tax Provision", value: "$32,400", icon: Landmark, trend: { value: 2.1, isPositive: true }, status: "info" as const },
    { title: "Net Operating Margin", value: "69.8%", icon: BarChart4, trend: { value: 4.5, isPositive: true }, status: "success" as const },
  ]

  const recentActivities = [
    {
      id: "fin-act-1",
      user: { name: "Marcus Chen", role: "Finance Manager" },
      action: "settled account invoice payble",
      target: "SYS-AWS-Billing ($14,500)",
      timestamp: "20m ago",
      icon: Receipt,
      iconBg: "bg-emerald-500/10 text-emerald-500",
    },
    {
      id: "fin-act-2",
      user: { name: "CEO / Owner", role: "Executive Board" },
      action: "authorized operating budget adjustments",
      target: "Corporate Marketing",
      timestamp: "3h ago",
      icon: DollarSign,
      iconBg: "bg-indigo-500/10 text-indigo-500",
    },
  ]

  const ledgerData = [
    { id: "INV-492", client: "Acme Corp Ltd", amount: "$15,200", date: "June 25", status: "Paid" },
    { id: "INV-493", client: "Globex Inc", amount: "$9,800", date: "June 26", status: "Overdue" },
    { id: "INV-494", client: "Vandelay Industries", amount: "$12,450", date: "June 27", status: "Pending" },
  ]

  const ledgerColumns = [
    { header: "Invoice ID", accessorKey: "id" },
    { header: "Client / Account", accessorKey: "client" },
    { header: "Total Amount", accessorKey: "amount" },
    { header: "Due Date", accessorKey: "date" },
    { header: "Ledger Status", accessorKey: "status" },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* KPIs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      {/* Analytics & Warnings */}
      <div className="grid gap-6 lg:grid-cols-3">
        <AnalyticsCard
          title="Q2 Monthly Expense Breakdown"
          description="Enterprise expenditures by cost centers."
          filterOptions={["This Month", "Last Month", "Year-To-Date"]}
          className="lg:col-span-2"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Infrastructure & Cloud Hosting</span>
                <span>$45,200 (36%)</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "36%" }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Staff & Contractor Payroll</span>
                <span>$68,000 (54%)</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div className="bg-accent h-full rounded-full" style={{ width: "54%" }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Operations & Administration Fees</span>
                <span>$11,300 (10%)</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "10%" }} />
              </div>
            </div>
          </div>
        </AnalyticsCard>

        {/* Finance Warnings */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Treasury Alerts</h4>
          <NotificationItem
            id="fin-not-1"
            title="Overdue Client Invoices"
            message="Invoice INV-493 (Globex Inc, $9,800) is 5 days past due."
            timestamp="1h ago"
            type="danger"
          />
          <NotificationItem
            id="fin-not-2"
            title="Tax Remittance Processed"
            message="Q2 corporate estimate filings completed successfully."
            timestamp="1d ago"
            type="success"
          />
        </div>
      </div>

      {/* Activities & Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Accounts Action Log</CardTitle>
            <CardDescription>Auditable treasury updates.</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFeed items={recentActivities} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle>Receivables Ledger</CardTitle>
              <CardDescription>Outstanding corporate balances.</CardDescription>
            </div>
            <Button size="xs" variant="outline">
              <ArrowUpRight className="mr-1.5 h-3.5 w-3.5" />
              Disburse Dividends
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable columns={ledgerColumns} data={ledgerData} pageSize={3} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
