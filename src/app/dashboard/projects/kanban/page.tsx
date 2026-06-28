"use client"

import * as React from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { ROLES } from "@/lib/rbac/roles"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  CheckCircle,
  Timer,
  AlertTriangle,
  FolderGit2
} from "lucide-react"

interface KanbanCard {
  id: string
  title: string
  project: string
  assignee: string
  assigneeEmail: string
  priority: "High" | "Medium" | "Low"
  column: "Backlog" | "To Do" | "In Progress" | "Review" | "Done"
}

export default function KanbanBoardPage() {
  const { user } = useAuthStore()

  // Role Checks
  const isEmployee = user?.role === ROLES.EMPLOYEE
  const isPm = user?.role === ROLES.PROJECT_MANAGER || user?.role === ROLES.SUPER_ADMIN
  const isPmOrCeo = user?.role === ROLES.PROJECT_MANAGER || user?.role === ROLES.CEO || user?.role === ROLES.SUPER_ADMIN

  // Mock global cards
  const [cards, setCards] = React.useState<KanbanCard[]>([
    { id: "KB-01", title: "Establish API integration routes", project: "OAuth Integration Gateway", assignee: "David Miller", assigneeEmail: "david@glowhaat.com", priority: "High", column: "In Progress" },
    { id: "KB-02", title: "Draft Procurement schema diagrams", project: "Procurement Workflow API", assignee: "Alice Johnson", assigneeEmail: "alice@glowhaat.com", priority: "Medium", column: "To Do" },
    { id: "KB-03", title: "Formulate unit testing frameworks", project: "OAuth Integration Gateway", assignee: "David Miller", assigneeEmail: "david@glowhaat.com", priority: "High", column: "Done" },
    { id: "KB-04", title: "Conduct vendor performance analysis", project: "Procurement Workflow API", assignee: "Alice Johnson", assigneeEmail: "alice@glowhaat.com", priority: "Low", column: "Backlog" },
  ])

  const [isAddCardOpen, setIsAddCardOpen] = React.useState(false)

  // Form State
  const [formData, setFormData] = React.useState({
    title: "",
    project: "OAuth Integration Gateway",
    assignee: "David Miller",
    priority: "Medium" as KanbanCard["priority"],
    column: "To Do" as KanbanCard["column"],
  })

  // Filter cards by employee email if logged in as Employee
  const visibleCards = React.useMemo(() => {
    if (isEmployee && user?.email) {
      return cards.filter((c) => c.assigneeEmail === user.email)
    }
    return cards
  }, [cards, isEmployee, user])

  const columns: KanbanCard["column"][] = ["Backlog", "To Do", "In Progress", "Review", "Done"]

  const handleMoveCard = (id: string, direction: "left" | "right") => {
    const cardToMove = cards.find((c) => c.id === id)
    if (!cardToMove) return

    // If Employee, verify they can only move their own assigned cards
    if (isEmployee && cardToMove.assigneeEmail !== user?.email) return

    const currentIndex = columns.indexOf(cardToMove.column)
    let nextIndex = currentIndex
    if (direction === "left") nextIndex = Math.max(0, currentIndex - 1)
    if (direction === "right") nextIndex = Math.min(columns.length - 1, currentIndex + 1)

    const updated = cards.map((c) => {
      if (c.id === id) {
        return { ...c, column: columns[nextIndex] }
      }
      return c
    })
    setCards(updated)
  }

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isPm) return

    const emailMap: Record<string, string> = {
      "David Miller": "david@glowhaat.com",
      "Alice Johnson": "alice@glowhaat.com",
      "Sarah Jenkins": "sarah@glowhaat.com",
    }

    const newCard: KanbanCard = {
      id: `KB-${Math.floor(100 + Math.random() * 900)}`,
      title: formData.title,
      project: formData.project,
      assignee: formData.assignee,
      assigneeEmail: emailMap[formData.assignee] || "employee@glowhaat.com",
      priority: formData.priority,
      column: formData.column,
    }

    setCards([...cards, newCard])
    setIsAddCardOpen(false)
    setFormData({ title: "", project: "OAuth Integration Gateway", assignee: "David Miller", priority: "Medium", column: "To Do" })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Kanban Board</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isEmployee ? "Organize and move your personal sprint task cards." : "Drag, transition, and audit corporate sprint task cards."}
          </p>
        </div>

        {isPm && (
          <Button onClick={() => setIsAddCardOpen(true)} size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Kanban Card
          </Button>
        )}
      </div>

      {/* Kanban Board Columns Grid */}
      <div className="grid gap-4 md:grid-cols-5 overflow-x-auto pb-4">
        {columns.map((colName) => {
          const colCards = visibleCards.filter((c) => c.column === colName)
          return (
            <Card key={colName} className="min-w-[200px] border-border/60 bg-muted/10">
              <div className="p-3.5 border-b border-border/40 flex justify-between items-center">
                <span className="font-bold text-xs text-foreground uppercase tracking-wide">{colName}</span>
                <span className="text-[10px] font-black bg-secondary px-2 py-0.5 rounded border border-border text-muted-foreground">
                  {colCards.length}
                </span>
              </div>
              <CardContent className="p-3.5 space-y-3.5">
                {colCards.map((card) => (
                  <div key={card.id} className="p-3 border border-border/50 bg-card rounded-xl shadow-sm text-xs space-y-2.5">
                    <div className="space-y-1">
                      <p className="font-bold text-foreground leading-normal">{card.title}</p>
                      <p className="text-[9px] text-muted-foreground flex items-center gap-1">
                        <FolderGit2 className="h-3 w-3" />
                        {card.project}
                      </p>
                    </div>

                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-muted-foreground font-semibold">Assignee: {card.assignee}</span>
                      <span
                        className={`font-semibold text-[9px] px-1.5 py-0.5 rounded border ${
                          card.priority === "High"
                            ? "bg-danger/10 text-danger border-danger/20"
                            : card.priority === "Medium"
                            ? "bg-warning/10 text-warning border-warning/20"
                            : "bg-info/10 text-info border-info/20"
                        }`}
                      >
                        {card.priority}
                      </span>
                    </div>

                    {/* Move controls */}
                    {(isPm || (isEmployee && card.assigneeEmail === user?.email)) && (
                      <div className="flex justify-between gap-1 pt-1.5 border-t border-border/40">
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => handleMoveCard(card.id, "left")}
                          disabled={card.column === "Backlog"}
                          className="px-1.5 h-6"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => handleMoveCard(card.id, "right")}
                          disabled={card.column === "Done"}
                          className="px-1.5 h-6"
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                {colCards.length === 0 && (
                  <p className="text-center text-[10px] text-muted-foreground/60 py-6 italic">No active cards</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Add Card Modal */}
      {isAddCardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsAddCardOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-foreground">Add Kanban Card</h3>
            <form onSubmit={handleCreateCard} className="space-y-4 text-xs">
              <Input
                label="Card Title"
                placeholder="e.g. Establish API integration routes"
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
                  onChange={(e: any) => setFormData({ ...formData, priority: e.target.value as KanbanCard["priority"] })}
                />
              </div>
              <Select
                label="Initial Column Board"
                options={[
                  { label: "Backlog", value: "Backlog" },
                  { label: "To Do", value: "To Do" },
                  { label: "In Progress", value: "In Progress" },
                  { label: "Review", value: "Review" },
                  { label: "Done", value: "Done" },
                ]}
                value={formData.column}
                onChange={(e: any) => setFormData({ ...formData, column: e.target.value as KanbanCard["column"] })}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsAddCardOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Card
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
