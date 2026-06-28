"use client"

import * as React from "react"
import { KpiCard } from "@/components/ui/kpi-card"
import { AnalyticsCard } from "@/components/ui/analytics-card"
import { ActivityFeed } from "@/components/ui/activity-feed"
import { NotificationItem } from "@/components/ui/notification-item"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Users, UserPlus, HeartHandshake, CheckCircle2, UserCheck } from "lucide-react"

export function HrDashboard() {
  const kpis = [
    { title: "Total Employees Count", value: "48 Staff", icon: Users, trend: { value: 6.2, isPositive: true }, status: "default" as const },
    { title: "Attendance Rating", value: "96.4%", icon: UserCheck, trend: { value: 0.5, isPositive: true }, status: "success" as const },
    { title: "Active Leave Requests", value: "3 Pending", icon: HeartHandshake, trend: { value: 33, isPositive: false }, status: "warning" as const },
    { title: "Recruitment Funnel", value: "12 Candidates", icon: UserPlus, trend: { value: 20, isPositive: true }, status: "info" as const },
  ]

  const recentActivities = [
    {
      id: "hr-act-1",
      user: { name: "Sarah Jenkins", role: "HR Manager" },
      action: "reviewed leave request for",
      target: "David Miller",
      timestamp: "10m ago",
      icon: HeartHandshake,
      iconBg: "bg-amber-500/10 text-amber-500",
      details: "PTO request approved: June 28 - June 30.",
    },
    {
      id: "hr-act-2",
      user: { name: "System Recruiter", role: "Applicant Agent" },
      action: "scheduled interview candidate",
      target: "Emily Davis (Frontend Dev)",
      timestamp: "1h ago",
      icon: UserPlus,
      iconBg: "bg-indigo-500/10 text-indigo-500",
    },
  ]

  const leaveRequestsData = [
    { id: "LR-01", name: "David Miller", type: "Annual PTO", dates: "Jun 28 - Jun 30", status: "Approved" },
    { id: "LR-02", name: "John Doe", type: "Sick Leave", dates: "Jul 05 - Jul 06", status: "Pending" },
    { id: "LR-03", name: "Sarah Jenkins", type: "Personal Leave", dates: "Jul 12 - Jul 13", status: "Pending" },
  ]

  const leaveRequestsColumns = [
    { header: "Request ID", accessorKey: "id" },
    { header: "Employee", accessorKey: "name" },
    { header: "Leave Category", accessorKey: "type" },
    { header: "Requested Dates", accessorKey: "dates" },
    { header: "Approval Status", accessorKey: "status" },
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
          title="Recruitment Pipeline Stages"
          description="Roster growth and candidates pipeline metrics."
          filterOptions={["Active Cycle", "Q1 Roster", "Historical"]}
          className="lg:col-span-2"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Resume Reviews</span>
                <span>5 Applicants</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "41%" }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Technical Review Iterations</span>
                <span>4 Candidates</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div className="bg-accent h-full rounded-full" style={{ width: "33%" }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Offer Letters Dispatched</span>
                <span>3 Accepted</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "25%" }} />
              </div>
            </div>
          </div>
        </AnalyticsCard>

        {/* HR Warnings */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">People Ops Alerts</h4>
          <NotificationItem
            id="hr-not-1"
            title="Leave Requests Waiting Approval"
            message="2 new leave requests submitted by Engineering team members."
            timestamp="1h ago"
            type="warning"
          />
          <NotificationItem
            id="hr-not-2"
            title="Compliance Audit Approved"
            message="Quarterly employee insurance forms submitted."
            timestamp="1d ago"
            type="success"
          />
        </div>
      </div>

      {/* Activities & Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>HR Log / Activities</CardTitle>
            <CardDescription>Recent staffing changes and events.</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFeed items={recentActivities} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle>Leave Requests Ledger</CardTitle>
              <CardDescription>Roster time-off logs.</CardDescription>
            </div>
            <Button size="xs" variant="outline">
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-success" />
              Batch Approve
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable columns={leaveRequestsColumns} data={leaveRequestsData} pageSize={3} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
