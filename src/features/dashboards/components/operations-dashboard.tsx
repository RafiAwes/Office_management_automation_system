"use client"

import * as React from "react"
import { KpiCard } from "@/components/ui/kpi-card"
import { AnalyticsCard } from "@/components/ui/analytics-card"
import { ActivityFeed } from "@/components/ui/activity-feed"
import { NotificationItem } from "@/components/ui/notification-item"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Settings, ClipboardList, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react"

export function OperationsDashboard() {
  const kpis = [
    { title: "Task Completion Rate", value: "94.2%", icon: CheckCircle, trend: { value: 0.8, isPositive: true }, status: "success" as const },
    { title: "Active Projects", value: "8 Operational", icon: ClipboardList, trend: { value: 1, isPositive: true }, status: "info" as const },
    { title: "Active Blockers", value: "2 Items", icon: AlertTriangle, trend: { value: 50, isPositive: false }, status: "warning" as const },
    { title: "System Health Rating", value: "99.9%", icon: Settings, trend: { value: 0.01, isPositive: true }, status: "success" as const },
  ]

  const recentActivities = [
    {
      id: "ops-act-1",
      user: { name: "Sarah Jenkins", role: "HR Manager" },
      action: "submitted candidate profile",
      target: "David Miller",
      timestamp: "10m ago",
      icon: CheckCircle,
      iconBg: "bg-emerald-500/10 text-emerald-500",
    },
    {
      id: "ops-act-2",
      user: { name: "Marcus Chen", role: "Finance Manager" },
      action: "allocated budget reserves",
      target: "Operations Pod-02",
      timestamp: "2h ago",
      icon: Settings,
      iconBg: "bg-indigo-500/10 text-indigo-500",
    },
  ]

  const operationsData = [
    { id: "OPS-1", task: "SSL Cert Update", assignee: "David Miller", severity: "High", progress: "90%" },
    { id: "OPS-2", task: "Billing System Migration", assignee: "Marcus Chen", severity: "Medium", progress: "45%" },
    { id: "OPS-3", task: "Office Space Expansion Review", assignee: "Sarah Jenkins", severity: "Low", progress: "100%" },
  ]

  const operationsColumns = [
    { header: "ID", accessorKey: "id" },
    { header: "Operational Task", accessorKey: "task" },
    { header: "Lead Assignee", accessorKey: "assignee" },
    { header: "Severity", accessorKey: "severity" },
    { header: "Progress", accessorKey: "progress" },
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
          title="Operational Capacity Allocations"
          description="Resource metrics mapped against ongoing milestones."
          filterOptions={["This Week", "Last Week", "This Month"]}
          className="lg:col-span-2"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Logistics Staging Optimization</span>
                <span>78% capacity utilized</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "78%" }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Engineering Sprint Velocity</span>
                <span>88% capacity utilized</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div className="bg-accent h-full rounded-full" style={{ width: "88%" }} />
              </div>
            </div>
          </div>
        </AnalyticsCard>

        {/* Operational Warnings */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Ops Warnings</h4>
          <NotificationItem
            id="ops-not-1"
            title="Logistics Pipeline Delayed"
            message="North-East delivery hub bottleneck identified."
            timestamp="1h ago"
            type="warning"
          />
          <NotificationItem
            id="ops-not-2"
            title="Security Audit Check Completed"
            message="Office access validation logs archived."
            timestamp="4h ago"
            type="success"
          />
        </div>
      </div>

      {/* Activities & Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Operations Log</CardTitle>
            <CardDescription>Activity logs of active divisions.</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFeed items={recentActivities} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle>Pipeline Work Items</CardTitle>
              <CardDescription>Active operations task ledger.</CardDescription>
            </div>
            <Button size="xs" variant="outline">
              <RefreshCw className="mr-1.5 h-3 w-3" />
              Re-allocate Resources
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable columns={operationsColumns} data={operationsData} pageSize={3} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
