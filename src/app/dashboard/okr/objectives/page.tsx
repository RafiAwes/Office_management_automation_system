"use client"

import * as React from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { ROLES } from "@/lib/rbac/roles"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { KpiCard } from "@/components/ui/kpi-card"
import { AnalyticsCard } from "@/components/ui/analytics-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { 
  Target, 
  Plus, 
  TrendingUp, 
  Layers, 
  CheckCircle,
  HelpCircle,
  Activity,
  Award
} from "lucide-react"

interface KeyResult {
  id: string
  description: string
  progress: number // 0-100
  target: string
}

interface Objective {
  id: string
  title: string
  category: "Company" | "Operations" | "Engineering" | "Sales"
  progress: number // average of KRs
  owner: string
  keyResults: KeyResult[]
}

export default function OkrObjectivesPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  // Role Checks
  const isEmployee = user?.role === ROLES.EMPLOYEE
  const isCeo = user?.role === ROLES.CEO || user?.role === ROLES.SUPER_ADMIN
  const isOpsManager = user?.role === ROLES.OPERATIONS_MANAGER
  const isPm = user?.role === ROLES.PROJECT_MANAGER

  // Gating check
  React.useEffect(() => {
    if (isEmployee && user) {
      router.push("/unauthorized")
    }
  }, [isEmployee, user])

  // Mock OKR data
  const [objectives, setObjectives] = React.useState<Objective[]>([
    {
      id: "OBJ-101",
      title: "Rebrand and launch GlowHaat Business Suite",
      category: "Company",
      progress: 80,
      owner: "CEO",
      keyResults: [
        { id: "KR-101a", description: "Complete rebranding graphics and UI styling shells", progress: 100, target: "100% complete" },
        { id: "KR-101b", description: "Verify compilation routes for all CRM, Sales, and HRM pages", progress: 80, target: "80% complete" },
        { id: "KR-101c", description: "Finalize deployment staging in corporate logistics pods", progress: 60, target: "60% complete" },
      ],
    },
    {
      id: "OBJ-102",
      title: "Streamline transit logistics pipelines",
      category: "Operations",
      progress: 45,
      owner: "Operations Manager",
      keyResults: [
        { id: "KR-102a", description: "Reduce warehouse staging utilization rate below 80%", progress: 50, target: "< 80% usage" },
        { id: "KR-102b", description: "Confirm supplier performance quality averages above 4.5/5", progress: 40, target: "4.5 average score" },
      ],
    },
    {
      id: "OBJ-103",
      title: "Accelerate software integration sprints",
      category: "Engineering",
      progress: 60,
      owner: "Project Manager",
      keyResults: [
        { id: "KR-103a", description: "Deploy OAuth authentication API gateway", progress: 70, target: "100% complete" },
        { id: "KR-103b", description: "Resolve task checklist completion rate above 90%", progress: 50, target: "> 90% completed" },
      ],
    },
  ])

  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    title: "",
    category: "Operations" as Objective["category"],
    kr1: "",
    kr2: "",
  })

  if (isEmployee) return null

  // Action: Add Objective (CEO / Operations Manager only)
  const handleCreateObjective = (e: React.FormEvent) => {
    e.preventDefault()
    // Operations Manager can only add OKRs for Operations
    if (isOpsManager && formData.category !== "Operations") {
      alert("Operations Managers can only register Operations department OKRs.")
      return
    }

    const newObj: Objective = {
      id: `OBJ-${Math.floor(100 + Math.random() * 900)}`,
      title: formData.title,
      category: formData.category,
      progress: 0,
      owner: formData.category === "Company" ? "CEO" : `${formData.category} Manager`,
      keyResults: [
        { id: `KR-${Math.floor(100 + Math.random() * 900)}`, description: formData.kr1, progress: 0, target: "100% complete" },
        { id: `KR-${Math.floor(100 + Math.random() * 900)}`, description: formData.kr2, progress: 0, target: "100% complete" },
      ],
    }

    setObjectives([...objectives, newObj])
    setIsAddOpen(false)
    setFormData({ title: "", category: "Operations", kr1: "", kr2: "" })
  }

  // Action: Update Key Result Progress (CEO / Ops Manager on their department)
  const handleUpdateKRProgress = (objId: string, krId: string, value: number) => {
    const targetObj = objectives.find((o) => o.id === objId)
    if (!targetObj) return

    // Authorization checks
    if (isPm) return // PM is View-Only
    if (isOpsManager && targetObj.category !== "Operations") {
      alert("Operations Managers can only edit Operations Key Results.")
      return
    }

    // Update progress
    const updated = objectives.map((obj) => {
      if (obj.id === objId) {
        const updatedKRs = obj.keyResults.map((kr) => {
          if (kr.id === krId) {
            return { ...kr, progress: value }
          }
          return kr
        })
        const avg = Math.round(updatedKRs.reduce((sum, k) => sum + k.progress, 0) / updatedKRs.length)
        return { ...obj, keyResults: updatedKRs, progress: avg }
      }
      return obj
    })

    setObjectives(updated)
  }

  // Calculations for Strategy Dashboard
  const companyAvg = Math.round(objectives.reduce((sum, o) => sum + o.progress, 0) / objectives.length)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Objectives & Key Results</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Formulate company goals, update key results, and audit strategy dashboards.
          </p>
        </div>

        {(isCeo || isOpsManager) && (
          <Button onClick={() => setIsAddOpen(true)} size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Objective
          </Button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <KpiCard
          title="Average Corporate OKR Progress"
          value={`${companyAvg}%`}
          icon={Activity}
          status="success"
        />
        <KpiCard
          title="Active Objectives"
          value={`${objectives.length} Goals`}
          icon={Target}
          status="default"
        />
        <KpiCard
          title="Milestones Achieved"
          value={`${objectives.reduce((sum, o) => sum + o.keyResults.filter((kr) => kr.progress === 100).length, 0)} Completed`}
          icon={CheckCircle}
          status="info"
        />
      </div>

      {/* Objectives Accordion / List */}
      <div className="space-y-6">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Corporate & Department OKR Hierarchy</h3>
        
        <div className="grid gap-6 md:grid-cols-2">
          {objectives.map((obj) => (
            <Card key={obj.id} className={obj.category === "Company" ? "border-primary/20 bg-primary/5" : "border-border/60 bg-card"}>
              <CardHeader className="pb-3 flex flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${
                    obj.category === "Company" ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {obj.category} Objective
                  </span>
                  <CardTitle className="text-base font-bold text-foreground leading-normal">{obj.title}</CardTitle>
                  <CardDescription className="text-xs">Owner: {obj.owner}</CardDescription>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-foreground">{obj.progress}%</span>
                  <p className="text-[9px] text-muted-foreground">Completion</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress bar */}
                <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${obj.progress}%` }} />
                </div>

                {/* Key Results nested list */}
                <div className="space-y-3.5 pt-3 border-t border-border/40 text-xs">
                  <p className="font-semibold text-muted-foreground text-[10px] uppercase">Key Results Checklist</p>
                  {obj.keyResults.map((kr) => {
                    // Check if current user has edit permissions for this KR
                    const canEditKR = isCeo || (isOpsManager && obj.category === "Operations")
                    return (
                      <div key={kr.id} className="space-y-2 p-2.5 border border-border/40 bg-card rounded-xl">
                        <div className="flex justify-between items-start text-xs font-semibold">
                          <span className="text-foreground leading-normal">{kr.description}</span>
                          <span className="text-muted-foreground whitespace-nowrap">Target: {kr.target}</span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {canEditKR ? (
                            // Input slider for managers
                            <div className="flex-grow flex items-center gap-3">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={kr.progress}
                                onChange={(e) => handleUpdateKRProgress(obj.id, kr.id, Number(e.target.value))}
                                className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                              />
                              <span className="font-bold text-[10px] min-w-[30px] text-right">{kr.progress}%</span>
                            </div>
                          ) : (
                            // Static display for View-Only (PMs)
                            <div className="flex-grow flex items-center justify-between text-[10px]">
                              <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden mr-3">
                                <div className="bg-primary h-full rounded-full" style={{ width: `${kr.progress}%` }} />
                              </div>
                              <span className="font-bold">{kr.progress}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-foreground">Add Corporate Objective</h3>
            <form onSubmit={handleCreateObjective} className="space-y-4 text-xs">
              <Input
                label="Objective Statement"
                placeholder="e.g. Expand APAC warehouse storage facility"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <Select
                label="Goal Category"
                options={
                  isCeo
                    ? [
                        { label: "Company Goal", value: "Company" },
                        { label: "Operations Goal", value: "Operations" },
                        { label: "Engineering Goal", value: "Engineering" },
                        { label: "Sales Goal", value: "Sales" },
                      ]
                    : [{ label: "Operations Goal", value: "Operations" }]
                }
                value={formData.category}
                onChange={(e: any) => setFormData({ ...formData, category: e.target.value as Objective["category"] })}
              />
              <div className="space-y-3 border-t border-border/50 pt-3">
                <span className="font-bold text-[10px] text-muted-foreground uppercase">Key Deliverables (Min. 2)</span>
                <Input
                  label="Key Result 1"
                  placeholder="e.g. Set up logistics layout diagrams"
                  required
                  value={formData.kr1}
                  onChange={(e) => setFormData({ ...formData, kr1: e.target.value })}
                />
                <Input
                  label="Key Result 2"
                  placeholder="e.g. Complete staff training workshops"
                  required
                  value={formData.kr2}
                  onChange={(e) => setFormData({ ...formData, kr2: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Objective
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
