"use client"

import * as React from "react"
import { KpiCard } from "@/components/ui/kpi-card"
import { AnalyticsCard } from "@/components/ui/analytics-card"
import { ActivityFeed } from "@/components/ui/activity-feed"
import { NotificationItem } from "@/components/ui/notification-item"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { TrendingUp, Award, DollarSign, Target, Plus, ChevronRight } from "lucide-react"

export function CeoDashboard() {
  const kpis = [
    { title: "Monthly Recurring Revenue (MRR)", value: "$182,450", icon: DollarSign, trend: { value: 12.4, isPositive: true }, status: "success" as const },
    { title: "Net Margin Profit", value: "$45,200", icon: TrendingUp, trend: { value: 4.8, isPositive: true }, status: "info" as const },
    { title: "ARR Growth Rate", value: "+28.4%", icon: Target, trend: { value: 2.1, isPositive: true }, status: "success" as const },
    { title: "Department Milestones", value: "8 / 10 Met", icon: Award, trend: { value: 10, isPositive: true }, status: "default" as const },
  ]

  const recentActivities = [
    {
      id: "ceo-act-1",
      user: { name: "Marcus Chen", role: "Finance Manager" },
      action: "finalized monthly disbursement review",
      target: "Sales Operations",
      timestamp: "30m ago",
      icon: DollarSign,
      iconBg: "bg-emerald-500/10 text-emerald-500",
    },
    {
      id: "ceo-act-2",
      user: { name: "Sarah Jenkins", role: "HR Manager" },
      action: "submitted headcount update forecast",
      target: "Q3 Strategy Board",
      timestamp: "2h ago",
      icon: Award,
      iconBg: "bg-indigo-500/10 text-indigo-500",
    },
  ]

  const okrData = [
    { id: "OKR-1", objective: "Expand EU Market Client Base", department: "Sales Operations", progress: "72%", status: "On Track" },
    { id: "OKR-2", objective: "Reduce AWS Staging Overhead by 20%", department: "Engineering", progress: "45%", status: "Delayed" },
    { id: "OKR-3", objective: "Revamp Candidate Sourcing Cycle", department: "People Operations", progress: "90%", status: "Completed" },
  ]

  const okrColumns = [
    { header: "Code", accessorKey: "id" },
    { header: "Company Objective", accessorKey: "objective" },
    { header: "Department", accessorKey: "department" },
    { header: "Progress", accessorKey: "progress" },
    { header: "Status", accessorKey: "status" },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* KPIs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      {/* Analytics & Notifications */}
      <div className="grid gap-6 lg:grid-cols-3">
        <AnalyticsCard
          title="Q2 Department Revenue Contribution"
          description="Direct revenue contributions mapped by operational units."
          filterOptions={["This Quarter", "Last Quarter", "Year-To-Date"]}
          className="lg:col-span-2"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Sales Operations (Enterprise Accounts)</span>
                <span>$85,000 (46%)</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "46%" }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Product & Staging Subscriptions</span>
                <span>$65,000 (35%)</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div className="bg-accent h-full rounded-full" style={{ width: "35%" }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Corporate Consultations Services</span>
                <span>$32,450 (19%)</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "19%" }} />
              </div>
            </div>
          </div>
        </AnalyticsCard>

        {/* CEO Alerts */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Executive Alerts</h4>
          <NotificationItem
            id="ceo-not-1"
            title="Sales Target Approaching"
            message="Sales team ARR pipeline reached 95% of Q2 quota thresholds."
            timestamp="10m ago"
            type="success"
          />
          <NotificationItem
            id="ceo-not-2"
            title="Q3 Budget Finalization Alert"
            message="Pending financial ledger check before board assembly."
            timestamp="4h ago"
            type="warning"
          />
        </div>
      </div>

      {/* Activities & OKRs */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Core Audit Log</CardTitle>
            <CardDescription>Recent actions by directors and leads.</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFeed items={recentActivities} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle>Corporate OKR Ledger</CardTitle>
              <CardDescription>Visual review of company objective timelines.</CardDescription>
            </div>
            <Button size="xs" variant="outline">
              <Plus className="mr-1 h-3.5 w-3.5" />
              New Objective
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable columns={okrColumns} data={okrData} pageSize={3} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
