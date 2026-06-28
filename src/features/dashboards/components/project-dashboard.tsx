"use client"

import * as React from "react"
import { KpiCard } from "@/components/ui/kpi-card"
import { AnalyticsCard } from "@/components/ui/analytics-card"
import { ActivityFeed } from "@/components/ui/activity-feed"
import { NotificationItem } from "@/components/ui/notification-item"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { FolderGit2, CheckSquare, Users, AlertTriangle, Plus } from "lucide-react"

export function ProjectDashboard() {
  const kpis = [
    { title: "Active Projects Managed", value: "6 Projects", icon: FolderGit2, trend: { value: 1, isPositive: true }, status: "info" as const },
    { title: "Sprint Task Count", value: "32 Tasks", icon: CheckSquare, trend: { value: 12, isPositive: true }, status: "default" as const },
    { title: "Team Capacity Allocation", value: "85% Allocated", icon: Users, trend: { value: 4, isPositive: true }, status: "success" as const },
    { title: "Milestone Delays Alert", value: "1 Delayed", icon: AlertTriangle, trend: { value: 100, isPositive: false }, status: "danger" as const },
  ]

  const recentActivities = [
    {
      id: "proj-act-1",
      user: { name: "David Miller", role: "Senior Developer" },
      action: "resolved critical sprint blocker",
      target: "DB Replication Check",
      timestamp: "10m ago",
      icon: CheckSquare,
      iconBg: "bg-emerald-500/10 text-emerald-500",
    },
    {
      id: "proj-act-2",
      user: { name: "Sarah Jenkins", role: "Project Manager" },
      action: "submitted milestone update forecast",
      target: "Q2 Deliverable Board",
      timestamp: "2h ago",
      icon: FolderGit2,
      iconBg: "bg-indigo-500/10 text-indigo-500",
    },
  ]

  const projectsData = [
    { id: "PROJ-301", name: "ERP Database Sync", lead: "David Miller", deadline: "Jul 15", status: "On Track" },
    { id: "PROJ-302", name: "OAuth Integration", lead: "John Doe", deadline: "Jul 20", status: "In Dev" },
    { id: "PROJ-303", name: "Client Feedback Portal", lead: "Sarah Jenkins", deadline: "Aug 02", status: "Planning" },
  ]

  const projectsColumns = [
    { header: "Project ID", accessorKey: "id" },
    { header: "Milestone Project", accessorKey: "name" },
    { header: "Project Lead", accessorKey: "lead" },
    { header: "Target Deadline", accessorKey: "deadline" },
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

      {/* Analytics & Warnings */}
      <div className="grid gap-6 lg:grid-cols-3">
        <AnalyticsCard
          title="Active Sprint Burn-down"
          description="Sprint task status allocation by developer resources."
          filterOptions={["Sprint 14 (Current)", "Sprint 13", "Sprint 12"]}
          className="lg:col-span-2"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Sprint Completed Tasks</span>
                <span>18 / 32 Tasks (56%)</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "56%" }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Tasks in Code Review</span>
                <span>8 / 32 Tasks (25%)</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div className="bg-accent h-full rounded-full" style={{ width: "25%" }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Backlog & Open Items</span>
                <span>6 / 32 Tasks (19%)</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "19%" }} />
              </div>
            </div>
          </div>
        </AnalyticsCard>

        {/* Project Warnings */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Milestone Alerts</h4>
          <NotificationItem
            id="proj-not-1"
            title="Milestone Delay Threat"
            message="ERP Database Sync deadline is Jul 15. Tasks lagging."
            timestamp="1h ago"
            type="danger"
          />
          <NotificationItem
            id="proj-not-2"
            title="Sprint Goal Updated"
            message="Sprint 14 capacity aligned to client launch dependencies."
            timestamp="4h ago"
            type="info"
          />
        </div>
      </div>

      {/* Activities & Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Milestone Updates</CardTitle>
            <CardDescription>Activity updates for team resources.</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFeed items={recentActivities} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle>Active Milestones</CardTitle>
              <CardDescription>Project timelines awaiting progress.</CardDescription>
            </div>
            <Button size="xs" variant="outline">
              <Plus className="mr-1 h-3.5 w-3.5" />
              Add Project
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable columns={projectsColumns} data={projectsData} pageSize={3} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
