"use client"

import * as React from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { ROLES } from "@/lib/rbac/roles"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { SearchBar } from "@/components/ui/search-bar"
import { KpiCard } from "@/components/ui/kpi-card"
import { Button } from "@/components/ui/button"
import { Drawer } from "@/components/ui/drawer"
import { 
  TrendingUp, 
  Eye, 
  Calendar, 
  CheckCircle2, 
  UserCheck, 
  Star,
  Activity,
  HeartHandshake
} from "lucide-react"

interface StaffKpi {
  id: string
  name: string
  role: string
  email: string
  taskCompletionRate: number // 0-100
  attendanceRate: number // 0-100
  rating: number // 0-5
  feedback: string
}

export default function OkrKpisPage() {
  const { user } = useAuthStore()

  // Role Checks
  const isEmployee = user?.role === ROLES.EMPLOYEE
  const isManager = user?.role === ROLES.CEO || user?.role === ROLES.OPERATIONS_MANAGER || user?.role === ROLES.PROJECT_MANAGER || user?.role === ROLES.SUPER_ADMIN

  // Mock global staff KPIs
  const [kpiList] = React.useState<StaffKpi[]>([
    { id: "KPI-201", name: "David Miller", role: "Senior Developer", email: "david@glowhaat.com", taskCompletionRate: 92, attendanceRate: 97, rating: 4.8, feedback: "Exceptional speed on API integration. Keeps schema clean." },
    { id: "KPI-202", name: "Alice Johnson", role: "Sales Rep", email: "alice@glowhaat.com", taskCompletionRate: 85, attendanceRate: 94, rating: 4.5, feedback: "Great leads conversions on CRM pipeline this sprint." },
    { id: "KPI-203", name: "Sarah Jenkins", role: "HR Manager", email: "sarah@glowhaat.com", taskCompletionRate: 88, attendanceRate: 98, rating: 4.7, feedback: "Processed recruitment pipeline milestones on schedule." },
  ])

  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedKpi, setSelectedKpi] = React.useState<StaffKpi | null>(null)

  // Find Employee personal KPI scorecard
  const personalKpi = React.useMemo(() => {
    if (!isEmployee) return null
    return kpiList.find((k) => k.email === user?.email) || {
      id: "KPI-204",
      name: user?.name || "Employee Staff",
      role: "Operations Associate",
      email: user?.email || "employee@glowhaat.com",
      taskCompletionRate: 88,
      attendanceRate: 98,
      rating: 4.6,
      feedback: "Consistent check-ins. Sprints completed on time.",
    }
  }, [isEmployee, user, kpiList])

  const filteredKpiList = kpiList.filter(
    (k) =>
      k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns = [
    { header: "Staff Member", accessorKey: "name" },
    { header: "Designation", accessorKey: "role" },
    {
      header: "Task Completion",
      accessorKey: "taskCompletionRate",
      render: (row: StaffKpi) => (
        <span className="font-bold text-foreground">{row.taskCompletionRate}%</span>
      ),
    },
    {
      header: "Attendance Rate",
      accessorKey: "attendanceRate",
      render: (row: StaffKpi) => (
        <span className="font-bold text-foreground">{row.attendanceRate}%</span>
      ),
    },
    {
      header: "Performance Rating",
      accessorKey: "rating",
      render: (row: StaffKpi) => (
        <span className="font-bold text-foreground flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
          {row.rating} / 5
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Performance Scorecards</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit staff performance, verify task completion rates, and review manager feedback.
          </p>
        </div>
      </div>

      {isEmployee && personalKpi ? (
        // EMPLOYEE VIEW (Personal scorecard only)
        <div className="grid gap-6 md:grid-cols-3">
          {/* Personal Scorecard Cards */}
          <div className="md:col-span-1 space-y-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-black text-xl">
                  {personalKpi.name[0]}
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-bold text-base text-foreground">{personalKpi.name}</h3>
                  <p className="text-[10px] text-muted-foreground">{personalKpi.role}</p>
                </div>
                <div className="flex items-center gap-1 font-black text-sm text-foreground bg-card border border-border px-3 py-1 rounded">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  {personalKpi.rating} / 5.0
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Manager Assessment</CardTitle>
              </CardHeader>
              <CardContent className="text-xs leading-relaxed text-muted-foreground italic">
                "{personalKpi.feedback}"
              </CardContent>
            </Card>
          </div>

          {/* Metric KPIs */}
          <div className="md:col-span-2 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <KpiCard
                title="Task Completion Rate"
                value={`${personalKpi.taskCompletionRate}%`}
                icon={CheckCircle2}
                status="success"
              />
              <KpiCard
                title="Shift Attendance Rate"
                value={`${personalKpi.attendanceRate}%`}
                icon={UserCheck}
                status="info"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold font-bold">Personal KPI Target Metrics</CardTitle>
                <CardDescription className="text-xs">Individual compliance milestones.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="space-y-2">
                  <div className="flex justify-between font-semibold text-muted-foreground">
                    <span>Task Checklist Completion</span>
                    <span>{personalKpi.taskCompletionRate}%</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div className="bg-success h-full rounded-full" style={{ width: `${personalKpi.taskCompletionRate}%` }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between font-semibold text-muted-foreground">
                    <span>Timesheet Attendance Rate</span>
                    <span>{personalKpi.attendanceRate}%</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${personalKpi.attendanceRate}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        // MANAGER VIEW (All staff scorecard list)
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-semibold">Staff Scorecards Directory</CardTitle>
                <CardDescription className="text-xs">Click row to review detailed assessor comments.</CardDescription>
              </div>
              <SearchBar
                placeholder="Search staff scorecards..."
                onSearch={(val) => setSearchQuery(val)}
                className="max-w-xs"
              />
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={filteredKpiList}
              pageSize={5}
              onRowClick={(row) => setSelectedKpi(row)}
              actions={(row) => (
                <Button size="xs" variant="outline" onClick={() => setSelectedKpi(row)}>
                  <Eye className="h-3.5 w-3.5" />
                </Button>
              )}
            />
          </CardContent>
        </Card>
      )}

      {/* KPI Details Drawer */}
      <Drawer
        isOpen={!!selectedKpi}
        onClose={() => setSelectedKpi(null)}
        title={selectedKpi?.name}
        description={selectedKpi?.role}
      >
        {selectedKpi && (
          <div className="space-y-6 text-xs leading-normal">
            {/* Meta score */}
            <div className="space-y-3 bg-muted/20 p-4 border border-border/50 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider">Overall Assessment</span>
                <p className="font-bold text-foreground text-sm mt-0.5">{selectedKpi.name}</p>
                <p className="text-[10px] text-muted-foreground">{selectedKpi.role}</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-foreground flex items-center gap-1 justify-end">
                  <Star className="h-4.5 w-4.5 fill-warning text-warning" />
                  {selectedKpi.rating} / 5
                </span>
                <p className="text-[9px] text-muted-foreground">Performance Score</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-0.5">
                <p className="text-muted-foreground">Task Completion</p>
                <p className="font-bold text-foreground text-sm">{selectedKpi.taskCompletionRate}%</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-muted-foreground">Timesheet Attendance</p>
                <p className="font-bold text-foreground text-sm">{selectedKpi.attendanceRate}%</p>
              </div>
            </div>

            {/* Assessment feedback */}
            <div className="space-y-2 border-t border-border/50 pt-4">
              <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider block">Assessor Review Comments</span>
              <p className="text-muted-foreground bg-muted/20 p-3 rounded-lg border border-border/40 leading-relaxed italic text-xs">
                "{selectedKpi.feedback}"
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
