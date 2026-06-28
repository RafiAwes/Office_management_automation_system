"use client"

import * as React from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { ROLES } from "@/lib/rbac/roles"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { KpiCard } from "@/components/ui/kpi-card"
import { AnalyticsCard } from "@/components/ui/analytics-card"
import { 
  FolderGit2, 
  Layers, 
  Users, 
  Activity, 
  CheckCircle,
  AlertCircle
} from "lucide-react"

interface ProjectItem {
  id: string
  name: string
  client: string
  manager: string
  progress: number // 0-100
  milestonesCount: number
  staff: string[]
}

interface Milestone {
  id: string
  name: string
  project: string
  dueDate: string
  status: "Completed" | "In Dev" | "Upcoming"
}

interface Workload {
  name: string
  role: string
  allocatedPct: number
  activeTasks: number
}

export default function ProjectDashboardPage() {
  const { user } = useAuthStore()

  // Role Checks
  const isEmployee = user?.role === ROLES.EMPLOYEE
  const isPmOrCeo = user?.role === ROLES.PROJECT_MANAGER || user?.role === ROLES.CEO || user?.role === ROLES.SUPER_ADMIN

  // Mock global projects
  const [projects] = React.useState<ProjectItem[]>([
    { id: "PRJ-901", name: "OAuth Integration Gateway", client: "GlowHaat Logistics", manager: "Project Manager", progress: 68, milestonesCount: 5, staff: ["david@glowhaat.com", "alice@glowhaat.com"] },
    { id: "PRJ-902", name: "GlowHaat CRM Automation", client: "GlowHaat Sales", manager: "Project Manager", progress: 90, milestonesCount: 8, staff: ["david@glowhaat.com"] },
    { id: "PRJ-903", name: "Procurement Workflow API", client: "GlowHaat Ops", manager: "Project Manager", progress: 20, milestonesCount: 4, staff: ["alice@glowhaat.com"] },
  ])

  // Mock milestones
  const [milestones] = React.useState<Milestone[]>([
    { id: "MS-01", name: "Database Schema Setup", project: "OAuth Integration Gateway", dueDate: "2026-07-01", status: "Completed" },
    { id: "MS-02", name: "API Endpoint Integration", project: "OAuth Integration Gateway", dueDate: "2026-07-15", status: "In Dev" },
    { id: "MS-03", name: "Vendor Scorecard Panel UI", project: "Procurement Workflow API", dueDate: "2026-07-20", status: "Upcoming" },
  ])

  // Team Workloads (Visible to PM/CEO)
  const [workloads] = React.useState<Workload[]>([
    { name: "David Miller", role: "Senior Developer", allocatedPct: 85, activeTasks: 4 },
    { name: "Alice Johnson", role: "Sales Rep", allocatedPct: 60, activeTasks: 2 },
    { name: "Sarah Jenkins", role: "HR Manager", allocatedPct: 20, activeTasks: 1 },
  ])

  // Filter projects by employee email if logged in as Employee
  const visibleProjects = React.useMemo(() => {
    if (isEmployee && user?.email) {
      return projects.filter((p) => p.staff.includes(user.email))
    }
    return projects
  }, [projects, isEmployee, user])

  const totalProgress = visibleProjects.reduce((sum, p) => sum + p.progress, 0)
  const avgProgress = visibleProjects.length > 0 ? Math.round(totalProgress / visibleProjects.length) : 0

  const columns = [
    { header: "Project ID", accessorKey: "id" },
    { header: "Project Name", accessorKey: "name" },
    { header: "Client Domain", accessorKey: "client" },
    { header: "Lead Manager", accessorKey: "manager" },
    {
      header: "Sprint Progress",
      accessorKey: "progress",
      render: (row: ProjectItem) => (
        <span className="font-bold text-foreground">
          {row.progress}% complete
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Project Dashboard</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit team sprints, monitor active projects, and inspect resource allocations.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <KpiCard
          title="Active Staffed Projects"
          value={`${visibleProjects.length} Active`}
          icon={FolderGit2}
          status="success"
        />
        <KpiCard
          title="Average Sprint Completion"
          value={`${avgProgress}%`}
          icon={Activity}
          status="info"
        />
        <KpiCard
          title="Milestones Achieved"
          value={`${milestones.filter((m) => m.status === "Completed").length} Done`}
          icon={CheckCircle}
          status="default"
        />
      </div>

      {/* Main Grid: Projects + Workloads / Milestones */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              {isEmployee ? "My Assigned Projects" : "GlowHaat Active Projects"}
            </CardTitle>
            <CardDescription className="text-xs">
              {isEmployee ? "Sprint workspaces staffed on." : "All corporate development modules."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={visibleProjects}
              pageSize={5}
            />
          </CardContent>
        </Card>

        {/* Milestones Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Sprint Milestones</CardTitle>
            <CardDescription className="text-xs">Timeline of critical deliverables.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs">
            {milestones.map((m) => (
              <div key={m.id} className="flex items-center justify-between border-b border-border/40 pb-2.5 last:border-0 last:pb-0">
                <div className="space-y-0.5">
                  <p className="font-bold text-foreground">{m.name}</p>
                  <p className="text-[10px] text-muted-foreground">{m.project} (Due: {m.dueDate})</p>
                </div>
                <span
                  className={`font-semibold text-[10px] px-2 py-0.5 rounded border ${
                    m.status === "Completed"
                      ? "bg-success/10 text-success border-success/20"
                      : m.status === "In Dev"
                      ? "bg-warning/10 text-warning border-warning/20 animate-pulse"
                      : "bg-secondary text-muted-foreground border-border"
                  }`}
                >
                  {m.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Resource Allocation & Team Workload (PM/CEO only) */}
      {isPmOrCeo && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Team Workload Utilization</CardTitle>
            <CardDescription className="text-xs font-semibold text-muted-foreground">Resource allocations percentages based on active task loads.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {workloads.map((wl, idx) => (
                <div key={idx} className="p-4 border border-border/40 bg-card rounded-xl space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-foreground">{wl.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{wl.role}</p>
                    </div>
                    <span className="font-semibold text-[10px] px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded">
                      {wl.activeTasks} Tasks
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
                      <span>Allocation Rate</span>
                      <span>{wl.allocatedPct}%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          wl.allocatedPct >= 80
                            ? "bg-danger animate-pulse"
                            : wl.allocatedPct >= 50
                            ? "bg-warning"
                            : "bg-success"
                        }`}
                        style={{ width: `${wl.allocatedPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
