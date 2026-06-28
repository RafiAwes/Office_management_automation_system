"use client"

import * as React from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { ROLES } from "@/lib/rbac/roles"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { SearchBar } from "@/components/ui/search-bar"
import { DataTable } from "@/components/ui/data-table"
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  HelpCircle,
  Sparkles,
  Users,
  ChevronRight,
  ChevronDown,
  Activity,
  Layers,
  Award,
  Filter,
  RefreshCw,
  Search
} from "lucide-react"

// Types
interface Objective {
  id: string
  title: string
  owner: string
  department: "Sales" | "HR" | "Finance" | "Operations" | "Projects"
  startDate: string
  endDate: string
  progress: number
  status: "Not Started" | "On Track" | "At Risk" | "Delayed" | "Completed"
  parentId?: string
}

interface KeyResult {
  id: string
  name: string
  objectiveId: string
  objectiveTitle: string
  owner: string
  currentVal: number
  targetVal: number
  progress: number
  status: "On Track" | "At Risk" | "Behind" | "Completed"
}

interface EmployeePerformance {
  name: string
  assignedOkrs: number
  progress: number
  kpiScore: number
  trend: "up" | "down" | "stable"
}

export default function ExecutiveOkrDashboard() {
  const { user } = useAuthStore()

  // Gating & Role checks
  const isEmployee = user?.role === ROLES.EMPLOYEE
  const isManager = 
    user?.role === ROLES.SUPER_ADMIN || 
    user?.role === ROLES.CEO || 
    user?.role === ROLES.OPERATIONS_MANAGER || 
    user?.role === ROLES.HR_MANAGER || 
    user?.role === ROLES.PROJECT_MANAGER

  // Filters State
  const [filterDept, setFilterDept] = React.useState<string>("All")
  const [filterStatus, setFilterStatus] = React.useState<string>("All")
  const [filterQuarter, setFilterQuarter] = React.useState<string>("Q2")
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  // Simulation loader effect
  React.useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  // 1. Mock Data: 20 Company-level Objectives
  const companyObjectives: Objective[] = [
    { id: "OBJ-C01", title: "Expand APAC Market footprint and launch Singapore node infrastructure", owner: "GlowHaat CEO", department: "Operations", startDate: "2026-04-01", endDate: "2026-06-30", progress: 85, status: "On Track" },
    { id: "OBJ-C02", title: "Increase corporate net profitability margins to 24% globally", owner: "GlowHaat CEO", department: "Finance", startDate: "2026-04-01", endDate: "2026-06-30", progress: 92, status: "Completed" },
    { id: "OBJ-C03", title: "Automate supply chain logistics routing and reduce lead time by 15%", owner: "Operations Manager", department: "Operations", startDate: "2026-04-01", endDate: "2026-06-30", progress: 68, status: "On Track" },
    { id: "OBJ-C04", title: "Achieve 98% Customer Satisfaction SLA score across all tiers", owner: "Sales Manager", department: "Sales", startDate: "2026-04-01", endDate: "2026-06-30", progress: 40, status: "At Risk" },
    { id: "OBJ-C05", title: "Refactor core ERP monolith services to Next.js and API architecture", owner: "Project Manager", department: "Projects", startDate: "2026-04-01", endDate: "2026-06-30", progress: 30, status: "Delayed" },
    { id: "OBJ-C06", title: "Hire and onboard 15 senior level engineers for core projects", owner: "HR Manager", department: "HR", startDate: "2026-04-01", endDate: "2026-06-30", progress: 90, status: "On Track" },
    { id: "OBJ-C07", title: "Standardize data security and achieve SOC2 Compliance standards", owner: "Super Admin", department: "Operations", startDate: "2026-04-01", endDate: "2026-06-30", progress: 55, status: "On Track" },
    { id: "OBJ-C08", title: "Decrease vendor acquisition costs by 12% in EU region", owner: "Operations Manager", department: "Operations", startDate: "2026-04-01", endDate: "2026-06-30", progress: 10, status: "Not Started" },
  ]

  // 2. Mock Data: Department-level Objectives (representing 100 overall)
  const departmentObjectives: Objective[] = [
    // Operations
    { id: "OBJ-D01", title: "Complete Singapore Node physical rack alignment & fiber connections", owner: "Operations Lead", department: "Operations", startDate: "2026-04-01", endDate: "2026-06-30", progress: 95, status: "On Track", parentId: "OBJ-C01" },
    { id: "OBJ-D02", title: "Deploy automated inventory routing module for warehouse systems", owner: "Warehouse Supervisor", department: "Operations", startDate: "2026-04-01", endDate: "2026-06-30", progress: 75, status: "On Track", parentId: "OBJ-C03" },
    // HR
    { id: "OBJ-D03", title: "Settle engineering vacancy roles and complete technical trials", owner: "Talent Specialist", department: "HR", startDate: "2026-04-01", endDate: "2026-06-30", progress: 85, status: "On Track", parentId: "OBJ-C06" },
    { id: "OBJ-D04", title: "Audit staff compliance and timesheet check-in SLA accuracy", owner: "HR Supervisor", department: "HR", startDate: "2026-04-01", endDate: "2026-06-30", progress: 98, status: "Completed", parentId: "OBJ-C06" },
    // Finance
    { id: "OBJ-D05", title: "Reconcile accrued SaaS vendor balances and opex spreadsheets", owner: "Accounting Lead", department: "Finance", startDate: "2026-04-01", endDate: "2026-06-30", progress: 90, status: "On Track", parentId: "OBJ-C02" },
    { id: "OBJ-D06", title: "Submit Q2 comprehensive tax statement sheets", owner: "Finance Specialist", department: "Finance", startDate: "2026-04-01", endDate: "2026-06-30", progress: 100, status: "Completed", parentId: "OBJ-C02" },
    // Sales
    { id: "OBJ-D07", title: "Onboard 5 key corporate partners and sign logistics contracts", owner: "Sales Representative", department: "Sales", startDate: "2026-04-01", endDate: "2026-06-30", progress: 50, status: "At Risk", parentId: "OBJ-C04" },
    // Projects
    { id: "OBJ-D08", title: "Complete OAuth Gateway integration sprints", owner: "Lead Developer", department: "Projects", startDate: "2026-04-01", endDate: "2026-06-30", progress: 20, status: "Delayed", parentId: "OBJ-C05" },
  ]

  // 3. Mock Data: Key Results (representing 500 overall)
  const [keyResults, setKeyResults] = React.useState<KeyResult[]>([
    { id: "KR-01", name: "Procure and install 4 enterprise APAC server racks", objectiveId: "OBJ-C01", objectiveTitle: "Expand APAC Market footprint", owner: "Operations Specialist", currentVal: 4, targetVal: 4, progress: 100, status: "Completed" },
    { id: "KR-02", name: "Verify 10 Gbps network latency under 40ms SLA tests", objectiveId: "OBJ-C01", objectiveTitle: "Expand APAC Market footprint", owner: "Net Engineer", currentVal: 7, targetVal: 10, progress: 70, status: "On Track" },
    { id: "KR-03", name: "Sign 3 regional distribution client nodes contracts", objectiveId: "OBJ-C04", objectiveTitle: "Achieve 98% Customer Satisfaction", owner: "Sales Manager", currentVal: 1, targetVal: 3, progress: 33, status: "At Risk" },
    { id: "KR-04", name: "Resolve 95% support tickets in less than 2 hours", objectiveId: "OBJ-C04", objectiveTitle: "Achieve 98% Customer Satisfaction", owner: "Customer Rep", currentVal: 45, targetVal: 100, progress: 45, status: "Behind" },
    { id: "KR-05", name: "Submit complete audit records to SOC2 evaluators", objectiveId: "OBJ-C07", objectiveTitle: "Standardize SOC2 Compliance", owner: "Compliance Officer", currentVal: 1, targetVal: 1, progress: 100, status: "Completed" },
    { id: "KR-06", name: "Complete security testing on 8 cloud database nodes", objectiveId: "OBJ-C07", objectiveTitle: "Standardize SOC2 Compliance", owner: "Sec Engineer", currentVal: 4, targetVal: 8, progress: 50, status: "On Track" },
  ])

  // 4. Mock Data: Employee OKRs Leaderboard (representing 300 employees)
  const employeeLeaderboard: EmployeePerformance[] = [
    { name: "Sarah Jenkins (HR Manager)", assignedOkrs: 4, progress: 94, kpiScore: 98, trend: "up" },
    { name: "Marcus Chen (Finance Manager)", assignedOkrs: 3, progress: 92, kpiScore: 95, trend: "up" },
    { name: "David Miller (Operations Lead)", assignedOkrs: 5, progress: 85, kpiScore: 88, trend: "stable" },
    { name: "Alice Johnson (Sales Lead)", assignedOkrs: 4, progress: 68, kpiScore: 72, trend: "down" },
    { name: "Tom Red (Tech PM)", assignedOkrs: 3, progress: 45, kpiScore: 50, trend: "down" },
  ]

  // Expanded Tree Node Toggle state for OKR Hierarchy
  const [expandedNodes, setExpandedNodes] = React.useState<Record<string, boolean>>({
    "OBJ-C01": true,
    "OBJ-C06": true,
  })

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Filtered Objectives based on criteria
  const filteredObjectives = React.useMemo(() => {
    return companyObjectives.filter((obj) => {
      const matchDept = filterDept === "All" || obj.department === filterDept
      const matchStatus = filterStatus === "All" || obj.status === filterStatus
      const matchSearch = obj.title.toLowerCase().includes(searchQuery.toLowerCase()) || obj.owner.toLowerCase().includes(searchQuery.toLowerCase())
      return matchDept && matchStatus && matchSearch
    })
  }, [filterDept, filterStatus, searchQuery])

  // Filtered Key Results
  const filteredKeyResults = React.useMemo(() => {
    return keyResults.filter((kr) => {
      const matchSearch = kr.name.toLowerCase().includes(searchQuery.toLowerCase()) || kr.owner.toLowerCase().includes(searchQuery.toLowerCase())
      return matchSearch
    })
  }, [keyResults, searchQuery])

  return (
    <div className="space-y-6">
      {/* Header & Global Filters */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Executive OKR Dashboard</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Strategic tracking portal modeling company performance, objectives hierarchy alignment, and target analytics.
          </p>
        </div>

        {/* Global Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {!isEmployee && (
            <>
              <Select
                label=""
                options={[
                  { label: "All Departments", value: "All" },
                  { label: "Sales Dept", value: "Sales" },
                  { label: "HR Dept", value: "HR" },
                  { label: "Finance Dept", value: "Finance" },
                  { label: "Operations Dept", value: "Operations" },
                  { label: "Projects Dept", value: "Projects" },
                ]}
                value={filterDept}
                onChange={(e: any) => setFilterDept(e.target.value)}
                className="w-36 text-xs"
              />

              <Select
                label=""
                options={[
                  { label: "All Statuses", value: "All" },
                  { label: "Not Started", value: "Not Started" },
                  { label: "On Track", value: "On Track" },
                  { label: "At Risk", value: "At Risk" },
                  { label: "Delayed", value: "Delayed" },
                  { label: "Completed", value: "Completed" },
                ]}
                value={filterStatus}
                onChange={(e: any) => setFilterStatus(e.target.value)}
                className="w-36 text-xs"
              />
            </>
          )}

          <Select
            label=""
            options={[
              { label: "Q1 - 2026", value: "Q1" },
              { label: "Q2 - 2026", value: "Q2" },
              { label: "Q3 - 2026", value: "Q3" },
              { label: "Q4 - 2026", value: "Q4" },
            ]}
            value={filterQuarter}
            onChange={(e: any) => setFilterQuarter(e.target.value)}
            className="w-32 text-xs"
          />

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setFilterDept("All")
              setFilterStatus("All")
              setFilterQuarter("Q2")
              setSearchQuery("")
            }}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        // Skeleton Loader state
        <div className="grid gap-6 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-10 bg-muted/40 rounded-t-xl" />
              <CardContent className="h-16 bg-muted/20 rounded-b-xl" />
            </Card>
          ))}
        </div>
      ) : isEmployee ? (
        // ====================================================
        // PERSONAL OKR VIEW (For Employee Role Only)
        // ====================================================
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-primary">My Performance KPI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black">72.4%</div>
                <p className="text-[10px] text-muted-foreground mt-1">Average achievement score on personal objectives.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">My Active Objectives</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black">2 Goals</div>
                <p className="text-[10px] text-success font-semibold mt-1">Both currently tracking in active sprints.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">My Key Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black">4 Active KRs</div>
                <p className="text-[10px] text-muted-foreground mt-1">Average completion rate holds at 60.5%.</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* My Objectives */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-semibold">My Personal Objectives</CardTitle>
                <CardDescription className="text-xs">Individual goals assigned for current period.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-border/50 rounded-xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-black uppercase text-primary">Projects Department</span>
                      <h4 className="font-bold text-sm text-foreground mt-0.5">Integrate core OAuth gateway authorization routes</h4>
                    </div>
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-warning/15 text-warning">Delayed</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span>Progress</span>
                      <span className="font-bold">30%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-warning rounded-full" style={{ width: "30%" }} />
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-border/50 rounded-xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-black uppercase text-primary">Projects Department</span>
                      <h4 className="font-bold text-sm text-foreground mt-0.5">Deliver task review check sheets interface</h4>
                    </div>
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-success/15 text-success">On Track</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span>Progress</span>
                      <span className="font-bold">85%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-success rounded-full" style={{ width: "85%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Timeline & Milestones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="border-l border-border pl-4 space-y-4 relative">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                    <p className="font-bold text-foreground">OAuth API Staging deploy</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Target: June 30, 2026</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-muted border border-border" />
                    <p className="font-bold text-muted-foreground">Timesheet compliance check</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Target: July 15, 2026</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        // ====================================================
        // EXECUTIVE / MANAGER VIEW
        // ====================================================
        <div className="space-y-6">
          {/* Top Section: Executive KPI Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-primary">Overall OKR Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black">74.2%</div>
                <div className="flex items-center gap-1 text-[10px] text-success font-semibold mt-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>+4.8% vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Key Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black">58 active</div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                  <span>Target: 100 overall</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Objectives Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black">5 On Track / 1 Delayed</div>
                <div className="flex items-center gap-1 text-[10px] text-danger font-semibold mt-1">
                  <TrendingDown className="h-3 w-3" />
                  <span>-2% performance drop</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dept Performance Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black">88 / 100</div>
                <div className="flex items-center gap-1 text-[10px] text-success font-semibold mt-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>+1.5% higher this period</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Analytics (SVG Custom Charts Panel) */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Chart 1: OKR Completion Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Completion Trend (Area)</CardTitle>
                <CardDescription className="text-[10px]">Monthly progressive OKR completions.</CardDescription>
              </CardHeader>
              <CardContent className="h-48 flex items-end">
                <svg className="w-full h-full" viewBox="0 0 300 150">
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line x1="10" y1="20" x2="290" y2="20" stroke="var(--border)" strokeOpacity={0.3} strokeDasharray="3 3" />
                  <line x1="10" y1="70" x2="290" y2="70" stroke="var(--border)" strokeOpacity={0.3} strokeDasharray="3 3" />
                  <line x1="10" y1="120" x2="290" y2="120" stroke="var(--border)" strokeOpacity={0.3} strokeDasharray="3 3" />
                  {/* Area fill */}
                  <path
                    d="M 10 130 Q 80 90 150 70 T 290 30 L 290 130 Z"
                    fill="url(#areaGrad)"
                  />
                  {/* Curve line */}
                  <path
                    d="M 10 130 Q 80 90 150 70 T 290 30"
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="3"
                  />
                  {/* X Labels */}
                  <text x="10" y="145" fill="var(--muted-foreground)" fontSize="9">Apr</text>
                  <text x="140" y="145" fill="var(--muted-foreground)" fontSize="9">May</text>
                  <text x="270" y="145" fill="var(--muted-foreground)" fontSize="9">Jun</text>
                </svg>
              </CardContent>
            </Card>

            {/* Chart 2: Department Performance Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Department Performance (Bar)</CardTitle>
                <CardDescription className="text-[10px]">Comparative departmental OKR completion rates.</CardDescription>
              </CardHeader>
              <CardContent className="h-48 flex items-end">
                <svg className="w-full h-full" viewBox="0 0 300 150">
                  {/* Y Grid Lines */}
                  <line x1="10" y1="20" x2="290" y2="20" stroke="var(--border)" strokeOpacity={0.3} strokeDasharray="3 3" />
                  <line x1="10" y1="70" x2="290" y2="70" stroke="var(--border)" strokeOpacity={0.3} strokeDasharray="3 3" />
                  <line x1="10" y1="120" x2="290" y2="120" stroke="var(--border)" strokeOpacity={0.3} strokeDasharray="3 3" />
                  {/* Bars (Sales, HR, Finance, Ops, Projects) */}
                  {/* Sales: 80% */}
                  <rect x="25" y="40" width="22" height="90" rx="3" fill="var(--primary)" />
                  <text x="22" y="145" fill="var(--muted-foreground)" fontSize="9">Sales</text>
                  {/* HR: 95% */}
                  <rect x="80" y="20" width="22" height="110" rx="3" fill="var(--primary)" />
                  <text x="82" y="145" fill="var(--muted-foreground)" fontSize="9">HR</text>
                  {/* Finance: 90% */}
                  <rect x="135" y="26" width="22" height="104" rx="3" fill="var(--primary)" />
                  <text x="130" y="145" fill="var(--muted-foreground)" fontSize="9">Finance</text>
                  {/* Ops: 75% */}
                  <rect x="190" y="46" width="22" height="84" rx="3" fill="var(--primary)" />
                  <text x="192" y="145" fill="var(--muted-foreground)" fontSize="9">Ops</text>
                  {/* Projects: 40% */}
                  <rect x="245" y="88" width="22" height="42" rx="3" fill="var(--warning)" />
                  <text x="242" y="145" fill="var(--muted-foreground)" fontSize="9">Proj</text>
                </svg>
              </CardContent>
            </Card>

            {/* Chart 3: Objective Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Objective Distribution (Donut)</CardTitle>
                <CardDescription className="text-[10px]">Corporate goal progress status ratios.</CardDescription>
              </CardHeader>
              <CardContent className="h-48 flex items-center justify-center">
                <svg className="w-40 h-40" viewBox="0 0 100 100">
                  {/* Background base */}
                  <circle cx="50" cy="50" r="35" fill="transparent" stroke="var(--border)" strokeWidth="8" strokeOpacity="0.2" />
                  {/* Done arc: 50% (Completed + On Track) */}
                  <circle cx="50" cy="50" r="35" fill="transparent" stroke="var(--primary)" strokeWidth="8"
                    strokeDasharray="110 220" strokeDashoffset="0" />
                  {/* Warning arc: 30% (At Risk) */}
                  <circle cx="50" cy="50" r="35" fill="transparent" stroke="var(--warning)" strokeWidth="8"
                    strokeDasharray="66 220" strokeDashoffset="-110" />
                  {/* Delayed arc: 20% (Delayed) */}
                  <circle cx="50" cy="50" r="35" fill="transparent" stroke="var(--danger)" strokeWidth="8"
                    strokeDasharray="44 220" strokeDashoffset="-176" />
                  {/* Middle Text */}
                  <text x="50" y="53" textAnchor="middle" fill="var(--foreground)" fontSize="9" fontWeight="bold">Active OKRs</text>
                </svg>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights & Risk Analysis */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* AI Insights Panel */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                  <CardTitle className="text-base font-semibold">Executive Strategy AI Insights</CardTitle>
                </div>
                <CardDescription className="text-xs">Synthesized recommendations based on corporate goal logs.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="p-3 bg-card border border-border/40 rounded-xl flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-success mt-1.5 flex-shrink-0" />
                  <p className="leading-relaxed">
                    <strong>Sales objectives</strong> are currently outperforming initial target trajectories by <strong>12%</strong>. Partner contract conversion stands at optimal velocity.
                  </p>
                </div>
                <div className="p-3 bg-card border border-border/40 rounded-xl flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-warning mt-1.5 flex-shrink-0" />
                  <p className="leading-relaxed">
                    <strong>HR recruitment objectives</strong> are slightly behind schedule due to delayed technical interviews on core senior pipeline developer roles.
                  </p>
                </div>
                <div className="p-3 bg-card border border-border/40 rounded-xl flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-danger mt-1.5 flex-shrink-0" />
                  <p className="leading-relaxed">
                    <strong>Operations Team</strong> holds 3 objectives at risk related to APAC network latency configurations. Immediate hardware calibration is suggested.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* At-Risk Objectives Widget */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">At-Risk Objectives</CardTitle>
                <CardDescription className="text-xs">Immediate action recommended for these pipeline blockers.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="p-3.5 border border-danger/20 bg-danger/5 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <h5 className="font-bold text-foreground truncate">Achieve 98% Customer Satisfaction SLA</h5>
                    <span className="px-2 py-0.5 rounded bg-danger/15 text-danger font-black text-[9px]">CRITICAL RISK</span>
                  </div>
                  <p className="text-muted-foreground leading-normal">
                    <strong>Reason:</strong> Regional tickets latency remains above 2.5 hours average.
                  </p>
                  <p className="text-foreground leading-normal font-semibold">
                    <strong>Suggested Action:</strong> Delegate 2 additional reps from HR onboarding pool to CRM support channels.
                  </p>
                </div>

                <div className="p-3.5 border border-warning/20 bg-warning/5 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <h5 className="font-bold text-foreground truncate">Refactor Core ERP Monolith Services</h5>
                    <span className="px-2 py-0.5 rounded bg-warning/15 text-warning font-black text-[9px]">HIGH RISK</span>
                  </div>
                  <p className="text-muted-foreground leading-normal">
                    <strong>Reason:</strong> OAuth Sprint integration delayed by 3 dev cycles.
                  </p>
                  <p className="text-foreground leading-normal font-semibold">
                    <strong>Suggested Action:</strong> Review sprint velocity scope and push back OAuth gateway release target date.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* OKR Hierarchy Tree View */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Strategic OKR Hierarchy Map</CardTitle>
              <CardDescription className="text-xs">Interactive drilldown illustrating alignment configurations from Company to Teams.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              {companyObjectives.map((companyObj) => {
                const isExpanded = !!expandedNodes[companyObj.id]
                const children = departmentObjectives.filter((d) => d.parentId === companyObj.id)

                return (
                  <div key={companyObj.id} className="border border-border/40 rounded-xl overflow-hidden">
                    {/* Parent Company Objective row */}
                    <div
                      onClick={() => toggleNode(companyObj.id)}
                      className="p-3.5 bg-muted/20 hover:bg-muted/40 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {children.length > 0 ? (
                          isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <div className="w-4" />
                        )}
                        <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[8px] font-black uppercase text-primary tracking-wider">Company Goal</span>
                          <h4 className="font-bold text-foreground truncate mt-0.5">{companyObj.title}</h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 flex-shrink-0">
                        <span className="text-[10px] text-muted-foreground font-semibold">
                          Owner: {companyObj.owner}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <div className="h-1.5 w-20 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${companyObj.progress}%` }} />
                          </div>
                          <span className="font-bold text-[10px] w-8 text-right">{companyObj.progress}%</span>
                        </div>
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                          companyObj.status === "Completed" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
                        }`}>
                          {companyObj.status}
                        </span>
                      </div>
                    </div>

                    {/* Child Department Objectives */}
                    {isExpanded && children.length > 0 && (
                      <div className="bg-card/50 border-t border-border/30 divide-y divide-border/20 pl-8">
                        {children.map((child) => (
                          <div key={child.id} className="p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 flex-shrink-0" />
                              <div className="min-w-0">
                                <span className="text-[8px] font-bold uppercase text-muted-foreground/80 tracking-wider">Department Goal ➔ {child.department}</span>
                                <h5 className="font-semibold text-foreground truncate mt-0.5">{child.title}</h5>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 flex-shrink-0">
                              <span className="text-[10px] text-muted-foreground/60">
                                Owner: {child.owner}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <div className="h-1 w-16 bg-secondary rounded-full overflow-hidden">
                                  <div className="h-full bg-primary rounded-full" style={{ width: `${child.progress}%` }} />
                                </div>
                                <span className="font-bold text-[10px]">{child.progress}%</span>
                              </div>
                              <span className="px-2 py-0.5 text-[8px] font-bold rounded-full bg-success/15 text-success">
                                {child.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Department Performance Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {[
              { name: "Sales Dept", goals: 4, completion: "78%", score: 82, risk: "Low", trend: "up" },
              { name: "HR Dept", goals: 3, completion: "95%", score: 98, risk: "Low", trend: "up" },
              { name: "Finance Dept", goals: 5, completion: "90%", score: 95, risk: "Low", trend: "up" },
              { name: "Operations Dept", goals: 6, completion: "75%", score: 85, risk: "Medium", trend: "stable" },
              { name: "Projects Dept", goals: 4, completion: "40%", score: 48, risk: "High", trend: "down" },
            ].map((dept, idx) => (
              <Card key={idx}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold text-foreground uppercase">{dept.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Goals</span>
                    <span className="font-bold">{dept.goals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completion</span>
                    <span className="font-bold">{dept.completion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk Level</span>
                    <span className={`font-bold ${
                      dept.risk === "High" ? "text-danger" : dept.risk === "Medium" ? "text-warning" : "text-success"
                    }`}>{dept.risk}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Objectives & Key Results panel */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Objectives list */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">Active Corporate Objectives</CardTitle>
                <CardDescription className="text-xs">Live tracking table for corporate milestones.</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={[
                    { header: "Objective Title", accessorKey: "title" },
                    { header: "Owner", accessorKey: "owner" },
                    { header: "Progress", accessorKey: "progress", render: (row: Objective) => `${row.progress}%` },
                    { header: "Status", accessorKey: "status" },
                  ]}
                  data={filteredObjectives}
                  pageSize={5}
                />
              </CardContent>
            </Card>

            {/* Key Results list */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">Key Results Panel</CardTitle>
                <CardDescription className="text-xs">Sub-milestones tracking.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredKeyResults.map((kr) => (
                  <div key={kr.id} className="p-3 border border-border/40 bg-card rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-foreground leading-snug">{kr.name}</p>
                      <span className={`px-2 py-0.5 text-[8px] font-bold rounded-full ${
                        kr.status === "Completed" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
                      }`}>
                        {kr.status}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>Progress ({kr.currentVal} / {kr.targetVal})</span>
                        <span className="font-bold">{kr.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${kr.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Employee Performance Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Staff Performance Leaderboard</CardTitle>
              <CardDescription className="text-xs">Role achievements metrics ranking tracker (Managers & CEO only).</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={[
                  { header: "Employee Name", accessorKey: "name" },
                  { header: "OKR Goals Count", accessorKey: "assignedOkrs" },
                  { header: "OKR Completion %", accessorKey: "progress", render: (row: EmployeePerformance) => `${row.progress}%` },
                  { header: "KPI Score Card", accessorKey: "kpiScore", render: (row: EmployeePerformance) => `${row.kpiScore}/100` },
                ]}
                data={employeeLeaderboard}
                pageSize={5}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
