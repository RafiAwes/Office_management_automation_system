"use client"

import * as React from "react"
import { KpiCard } from "@/components/ui/kpi-card"
import { AnalyticsCard } from "@/components/ui/analytics-card"
import { ActivityFeed } from "@/components/ui/activity-feed"
import { NotificationItem } from "@/components/ui/notification-item"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Calendar, ClipboardList, HeartHandshake, CheckCircle } from "lucide-react"

export function EmployeeDashboard() {
  const kpis = [
    { title: "My Attendance Rate", value: "98.2%", icon: Calendar, trend: { value: 0.2, isPositive: true }, status: "success" as const },
    { title: "My Assigned Tasks", value: "4 Open Tasks", icon: ClipboardList, trend: { value: 1, isPositive: false }, status: "info" as const },
    { title: "Remaining Leave Balance", value: "14 Days", icon: HeartHandshake, trend: { value: 0, isPositive: true }, status: "default" as const },
    { title: "Task Completion Index", value: "92.5%", icon: CheckCircle, trend: { value: 1.4, isPositive: true }, status: "success" as const },
  ]

  const recentActivities = [
    {
      id: "emp-act-1",
      user: { name: "David Miller", role: "Senior Developer" },
      action: "resolved sprint task",
      target: "SYS-01 (SSL Certificates)",
      timestamp: "10m ago",
      icon: CheckCircle,
      iconBg: "bg-emerald-500/10 text-emerald-500",
    },
    {
      id: "emp-act-2",
      user: { name: "Sarah Jenkins", role: "HR Manager" },
      action: "approved leave request of",
      target: "David Miller",
      timestamp: "1d ago",
      icon: HeartHandshake,
      iconBg: "bg-indigo-500/10 text-indigo-500",
    },
  ]

  const tasksData = [
    { id: "SYS-01", task: "Rotate SSL Certificates", due: "Jun 28", priority: "High", stage: "In Dev" },
    { id: "SYS-02", task: "Optimize Database Indexes", due: "Jul 05", priority: "Medium", stage: "Open" },
    { id: "SYS-04", task: "Document OAuth Setup", due: "Jul 10", priority: "Low", stage: "Open" },
  ]

  const tasksColumns = [
    { header: "Task Code", accessorKey: "id" },
    { header: "Assigned Work Item", accessorKey: "task" },
    { header: "Due Date", accessorKey: "due" },
    { header: "Priority", accessorKey: "priority" },
    { header: "Status Stage", accessorKey: "stage" },
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
          title="My Sprint Goals Progression"
          description="Assigned tasks and sprint completions."
          filterOptions={["Sprint 14 (Current)", "Sprint 13"]}
          className="lg:col-span-2"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">My Completed Tasks</span>
                <span>4 / 6 Tasks (66%)</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "66%" }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Peer Review Contributions</span>
                <span>2 / 3 Approvals (66%)</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div className="bg-accent h-full rounded-full" style={{ width: "66%" }} />
              </div>
            </div>
          </div>
        </AnalyticsCard>

        {/* Employee Notifications */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">My Workspace Notifications</h4>
          <NotificationItem
            id="emp-not-1"
            title="Leave Request Approved"
            message="Your PTO request for June 28 - June 30 has been approved."
            timestamp="1h ago"
            type="success"
          />
          <NotificationItem
            id="emp-not-2"
            title="Task Deadline Warning"
            message="Task SYS-01 (SSL Certificates) is due tomorrow."
            timestamp="4h ago"
            type="warning"
          />
        </div>
      </div>

      {/* Activities & Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Workspace Log</CardTitle>
            <CardDescription>Recent changes in my assigned projects.</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFeed items={recentActivities} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle>My Open Work Items</CardTitle>
              <CardDescription>Assigned task checklist.</CardDescription>
            </div>
            <Button size="xs" variant="outline" onClick={() => alert("Leave request portal coming soon!")}>
              Request Leave
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
