"use client"

import * as React from "react"
import { KpiCard } from "@/components/ui/kpi-card"
import { AnalyticsCard } from "@/components/ui/analytics-card"
import { ActivityFeed } from "@/components/ui/activity-feed"
import { NotificationItem } from "@/components/ui/notification-item"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Cpu, Users, Database, ShieldAlert, CheckCircle, RefreshCw } from "lucide-react"

export function SuperAdminDashboard() {
  const kpis = [
    { title: "System CPU Load", value: "24.5%", icon: Cpu, trend: { value: 1.2, isPositive: false }, status: "default" as const },
    { title: "Database Connections", value: "142 Active", icon: Database, trend: { value: 8, isPositive: true }, status: "info" as const },
    { title: "Active Auth Sessions", value: "842 Users", icon: Users, trend: { value: 14.5, isPositive: true }, status: "success" as const },
    { title: "Security Incidents", value: "0 Logged", icon: ShieldAlert, trend: { value: 0, isPositive: true }, status: "success" as const },
  ]

  const recentActivities = [
    {
      id: "sa-1",
      user: { name: "System Cron", role: "Super Admin Agent" },
      action: "executed backup cycle",
      target: "DB-Primary-Cluster",
      timestamp: "12m ago",
      icon: Database,
      iconBg: "bg-emerald-500/10 text-emerald-500",
      details: "Database size: 4.82 GB. Replication lag: 0.1ms.",
    },
    {
      id: "sa-2",
      user: { name: "Root Access", role: "Super Admin Profile" },
      action: "updated route group configuration",
      target: "Gateway Middleware Proxy",
      timestamp: "1h ago",
      icon: ShieldAlert,
      iconBg: "bg-indigo-500/10 text-indigo-500",
    },
  ]

  const tasksData = [
    { id: "SYS-01", task: "Rotate SSL Certificates", service: "Gateway API", priority: "High", status: "Pending" },
    { id: "SYS-02", task: "Optimize Database Indexes", service: "PostgreSQL", priority: "Medium", status: "Scheduled" },
    { id: "SYS-03", task: "Verify Backup Integrity", service: "Cron Daemon", priority: "Low", status: "Completed" },
  ]

  const tasksColumns = [
    { header: "Task Code", accessorKey: "id" },
    { header: "Infrastructure Task", accessorKey: "task" },
    { header: "Target Service", accessorKey: "service" },
    { header: "Priority", accessorKey: "priority" },
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

      {/* Analytics & Tasks */}
      <div className="grid gap-6 lg:grid-cols-3">
        <AnalyticsCard
          title="System Memory Allocation"
          description="Live memory map metrics across microservices."
          filterOptions={["Last 1 hour", "Last 6 hours", "Last 24 hours"]}
          className="lg:col-span-2"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Next.js Staging Pod</span>
                <span>1.4 GB / 4.0 GB (35%)</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "35%" }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Django Backend Pod</span>
                <span>2.8 GB / 4.0 GB (70%)</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div className="bg-accent h-full rounded-full" style={{ width: "70%" }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Redis Cache Memory</span>
                <span>512 MB / 1.0 GB (50%)</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "50%" }} />
              </div>
            </div>
          </div>
        </AnalyticsCard>

        {/* System Notifications */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Infrastructure Alerts</h4>
          <NotificationItem
            id="sa-not-1"
            title="Django Health Warning"
            message="Database pool utilization reached 92% capacity."
            timestamp="15m ago"
            type="warning"
          />
          <NotificationItem
            id="sa-not-2"
            title="Docker Agent Restarted"
            message="Node-03 worker recovered from runtime failure."
            timestamp="1h ago"
            type="info"
          />
        </div>
      </div>

      {/* Roster & Operations */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Log / Audit Trail</CardTitle>
            <CardDescription>Critical backend event recordings.</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFeed items={recentActivities} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle>Maintenance Tasks</CardTitle>
              <CardDescription>Infrastructure upkeep tasks.</CardDescription>
            </div>
            <Button size="xs" variant="outline">
              <RefreshCw className="mr-1.5 h-3 w-3 animate-spin" />
              Sync Cluster
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable columns={tasksColumns} data={tasksData} pageSize={3} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
