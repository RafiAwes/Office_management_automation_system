"use client"

import * as React from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { ROLES } from "@/lib/rbac/roles"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { SearchBar } from "@/components/ui/search-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { 
  ClipboardList, 
  Plus, 
  Check, 
  UserCheck, 
  Calendar,
  Layers,
  CheckCircle,
  HelpCircle,
  AlertCircle
} from "lucide-react"

interface Task {
  id: string
  title: string
  project: string
  assignee: string
  assigneeEmail: string
  dueDate: string
  priority: "High" | "Medium" | "Low"
  status: "Completed" | "Pending"
}

export default function ProjectTasksPage() {
  const { user } = useAuthStore()

  // Role Checks
  const isEmployee = user?.role === ROLES.EMPLOYEE
  const isPm = user?.role === ROLES.PROJECT_MANAGER || user?.role === ROLES.SUPER_ADMIN
  const isPmOrCeo = user?.role === ROLES.PROJECT_MANAGER || user?.role === ROLES.CEO || user?.role === ROLES.SUPER_ADMIN

  // Mock global tasks
  const [tasks, setTasks] = React.useState<Task[]>([
    { id: "TSK-01", title: "Establish API integration routes", project: "OAuth Integration Gateway", assignee: "David Miller", assigneeEmail: "david@glowhaat.com", dueDate: "2026-07-02", priority: "High", status: "Pending" },
    { id: "TSK-02", title: "Draft Procurement schema diagrams", project: "Procurement Workflow API", assignee: "Alice Johnson", assigneeEmail: "alice@glowhaat.com", dueDate: "2026-07-10", priority: "Medium", status: "Pending" },
    { id: "TSK-03", title: "Formulate unit testing frameworks", project: "OAuth Integration Gateway", assignee: "David Miller", assigneeEmail: "david@glowhaat.com", dueDate: "2026-06-30", priority: "High", status: "Completed" },
    { id: "TSK-04", title: "Conduct vendor performance analysis", project: "Procurement Workflow API", assignee: "Alice Johnson", assigneeEmail: "alice@glowhaat.com", dueDate: "2026-07-05", priority: "Low", status: "Pending" },
  ])

  const [searchQuery, setSearchQuery] = React.useState("")
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)

  // Form State
  const [formData, setFormData] = React.useState({
    title: "",
    project: "OAuth Integration Gateway",
    assignee: "David Miller",
    assigneeEmail: "david@glowhaat.com",
    dueDate: "",
    priority: "Medium" as Task["priority"],
  })

  // Filter tasks: Employee only sees their own assigned tasks
  const visibleTasks = React.useMemo(() => {
    if (isEmployee && user?.email) {
      return tasks.filter((t) => t.assigneeEmail === user.email)
    }
    return tasks
  }, [tasks, isEmployee, user])

  const filteredTasks = visibleTasks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.project.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isPm) return

    const emailMap: Record<string, string> = {
      "David Miller": "david@glowhaat.com",
      "Alice Johnson": "alice@glowhaat.com",
      "Sarah Jenkins": "sarah@glowhaat.com",
    }

    const newT: Task = {
      id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
      title: formData.title,
      project: formData.project,
      assignee: formData.assignee,
      assigneeEmail: emailMap[formData.assignee] || "employee@glowhaat.com",
      dueDate: formData.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      priority: formData.priority,
      status: "Pending",
    }

    setTasks([newT, ...tasks])
    setIsCreateOpen(false)
    setFormData({ title: "", project: "OAuth Integration Gateway", assignee: "David Miller", assigneeEmail: "david@glowhaat.com", dueDate: "", priority: "Medium" })
  }

  const handleToggleComplete = (id: string) => {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        return { ...t, status: t.status === "Completed" ? "Pending" as const : "Completed" as const }
      }
      return t
    })
    setTasks(updated)
  }

  const columns = [
    { header: "Task Code", accessorKey: "id" },
    { header: "Task Description", accessorKey: "title" },
    { header: "Target Project", accessorKey: "project" },
    { header: "Assignee Partner", accessorKey: "assignee" },
    { header: "Due Date", accessorKey: "dueDate" },
    {
      header: "Priority",
      accessorKey: "priority",
      render: (row: Task) => (
        <span
          className={`font-semibold ${
            row.priority === "High"
              ? "text-danger"
              : row.priority === "Medium"
              ? "text-warning"
              : "text-info"
          }`}
        >
          {row.priority}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      render: (row: Task) => (
        <span className={`font-semibold ${row.status === "Completed" ? "text-success" : "text-muted-foreground"}`}>
          {row.status}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Task Management</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isEmployee ? "Track and mark off your assigned timesheet deliverables." : "Assign priorities, manage timelines, and audit team tasks."}
          </p>
        </div>

        {isPm && (
          <Button onClick={() => setIsCreateOpen(true)} size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Task Request
          </Button>
        )}
      </div>

      {/* Task List table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold">
                {isEmployee ? "My Active Sprint Checklist" : "Corporate Task Ledger"}
              </CardTitle>
              <CardDescription className="text-xs font-semibold text-muted-foreground">
                {isEmployee ? "Complete tasks to update sprint logs instantly." : "Click checkboxes to toggle task completion states."}
              </CardDescription>
            </div>
            <SearchBar
              placeholder="Search tasks..."
              onSearch={(val) => setSearchQuery(val)}
              className="max-w-xs"
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredTasks}
            pageSize={5}
            actions={(row) => (
              <div className="flex items-center justify-end">
                {/* Employee toggles completed status of own tasks; PM toggles all */}
                {(isPm || (isEmployee && row.assigneeEmail === user?.email)) && (
                  <Button 
                    size="xs" 
                    variant={row.status === "Completed" ? "outline" : "default"} 
                    onClick={() => handleToggleComplete(row.id)}
                  >
                    <Check className="mr-1 h-3.5 w-3.5" />
                    {row.status === "Completed" ? "Mark Pending" : "Mark Done"}
                  </Button>
                )}
              </div>
            )}
          />
        </CardContent>
      </Card>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsCreateOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-foreground">Add Task Request</h3>
            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <Input
                label="Task Title"
                placeholder="e.g. Conduct vendor performance analysis"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <Select
                label="Target Project Module"
                options={[
                  { label: "OAuth Integration Gateway", value: "OAuth Integration Gateway" },
                  { label: "GlowHaat CRM Automation", value: "GlowHaat CRM Automation" },
                  { label: "Procurement Workflow API", value: "Procurement Workflow API" },
                ]}
                value={formData.project}
                onChange={(e: any) => setFormData({ ...formData, project: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Assignee Staff"
                  options={[
                    { label: "David Miller", value: "David Miller" },
                    { label: "Alice Johnson", value: "Alice Johnson" },
                    { label: "Sarah Jenkins", value: "Sarah Jenkins" },
                  ]}
                  value={formData.assignee}
                  onChange={(e: any) => setFormData({ ...formData, assignee: e.target.value })}
                />
                <Select
                  label="Priority Level"
                  options={[
                    { label: "High Priority", value: "High" },
                    { label: "Medium Priority", value: "Medium" },
                    { label: "Low Priority", value: "Low" },
                  ]}
                  value={formData.priority}
                  onChange={(e: any) => setFormData({ ...formData, priority: e.target.value as Task["priority"] })}
                />
              </div>
              <Input
                label="Target Due Date"
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
