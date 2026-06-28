"use client"

import * as React from "react"
import { KpiCard } from "@/components/ui/kpi-card"
import { AnalyticsCard } from "@/components/ui/analytics-card"
import { ActivityFeed } from "@/components/ui/activity-feed"
import { NotificationItem } from "@/components/ui/notification-item"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Users, TrendingUp, DollarSign, Target, Plus } from "lucide-react"

export function SalesDashboard() {
  const kpis = [
    { title: "Active CRM Leads", value: "248 Leads", icon: Users, trend: { value: 8.4, isPositive: true }, status: "info" as const },
    { title: "Total Pipeline ARR", value: "$1,842,000", icon: DollarSign, trend: { value: 14.2, isPositive: true }, status: "success" as const },
    { title: "Sales Win Rate", value: "32.4%", icon: TrendingUp, trend: { value: 1.2, isPositive: true }, status: "default" as const },
    { title: "Quota Progress", value: "85% Met", icon: Target, trend: { value: 4.8, isPositive: true }, status: "success" as const },
  ]

  const recentActivities = [
    {
      id: "sale-act-1",
      user: { name: "Sarah Jenkins", role: "Sales Rep" },
      action: "qualified inbound enterprise lead",
      target: "Initech Systems ($45k)",
      timestamp: "15m ago",
      icon: Users,
      iconBg: "bg-indigo-500/10 text-indigo-500",
    },
    {
      id: "sale-act-2",
      user: { name: "Marcus Chen", role: "Sales Rep" },
      action: "moved pipeline opportunity to negotiation",
      target: "Acme Corp Expansion ($95k)",
      timestamp: "2h ago",
      icon: DollarSign,
      iconBg: "bg-emerald-500/10 text-emerald-500",
    },
  ]

  const crmData = [
    { id: "CRM-201", account: "Initech Systems", value: "$45,000", stage: "Discovery", health: "High" },
    { id: "CRM-202", account: "Dunder Mifflin", value: "$12,800", stage: "Proposal", health: "Medium" },
    { id: "CRM-203", account: "Saber Corp", value: "$88,000", stage: "Negotiation", health: "High" },
  ]

  const crmColumns = [
    { header: "Lead Code", accessorKey: "id" },
    { header: "Corporate Account", accessorKey: "account" },
    { header: "Contract Target", accessorKey: "value" },
    { header: "Pipeline Stage", accessorKey: "stage" },
    { header: "Account Health", accessorKey: "health" },
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
          title="Sales Pipeline Lead Distribution"
          description="Pipeline volumes mapped against lead lifecycle stages."
          filterOptions={["This Month", "Last Month", "This Quarter"]}
          className="lg:col-span-2"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Lead Discovery / Qualification</span>
                <span>$450,000 (24%)</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "24%" }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Proposal & Demos Dispatched</span>
                <span>$880,000 (48%)</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div className="bg-accent h-full rounded-full" style={{ width: "48%" }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Contract Negotiations</span>
                <span>$512,000 (28%)</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "28%" }} />
              </div>
            </div>
          </div>
        </AnalyticsCard>

        {/* Sales Notifications */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CRM Highlights</h4>
          <NotificationItem
            id="sale-not-1"
            title="Inbound Lead Assigned"
            message="Saber Corp expansion lead allocated to your dashboard."
            timestamp="10m ago"
            type="info"
          />
          <NotificationItem
            id="sale-not-2"
            title="Contract Proposal Expiring"
            message="Dunder Mifflin proposal expires in 48 hours."
            timestamp="4h ago"
            type="warning"
          />
        </div>
      </div>

      {/* Activities & Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales CRM Log</CardTitle>
            <CardDescription>Activity updates for current leads pipeline.</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFeed items={recentActivities} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle>Key Account Pipelines</CardTitle>
              <CardDescription>Enterprise deals awaiting review.</CardDescription>
            </div>
            <Button size="xs" variant="outline">
              <Plus className="mr-1 h-3.5 w-3.5" />
              Add Pipeline Lead
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable columns={crmColumns} data={crmData} pageSize={3} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
