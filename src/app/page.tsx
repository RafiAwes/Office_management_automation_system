"use client"

import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"
import { ROLES, Role } from "@/lib/rbac/roles"
import { Permission, PERMISSIONS } from "@/lib/rbac/permissions"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Shield, 
  Target, 
  Settings, 
  Users, 
  DollarSign, 
  TrendingUp, 
  FolderGit2, 
  Briefcase,
  Layers,
  ArrowRight
} from "lucide-react"

export default function Home() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)

  const rolesConfig = [
    {
      role: ROLES.SUPER_ADMIN,
      title: "Super Admin",
      description: "Manage servers, database pools, authentication logs, and microservice keys.",
      icon: Shield,
      color: "text-red-500 bg-red-500/10",
      hover: "hover:border-red-500/40 hover:bg-red-500/5",
    },
    {
      role: ROLES.CEO,
      title: "CEO & Business Owner",
      description: "Financial performance tracks, OKR dashboards, and executive statistics reviews.",
      icon: Target,
      color: "text-indigo-500 bg-indigo-500/10",
      hover: "hover:border-indigo-500/40 hover:bg-indigo-500/5",
    },
    {
      role: ROLES.OPERATIONS_MANAGER,
      title: "Operations Manager",
      description: "Operational capacity, pipeline blockers warnings, and active system tasks.",
      icon: Settings,
      color: "text-orange-500 bg-orange-500/10",
      hover: "hover:border-orange-500/40 hover:bg-orange-500/5",
    },
    {
      role: ROLES.HR_MANAGER,
      title: "HR Manager",
      description: "Roster directories, candidate funnels, leaves logs, and benefits settings.",
      icon: Users,
      color: "text-pink-500 bg-pink-500/10",
      hover: "hover:border-pink-500/40 hover:bg-pink-500/5",
    },
    {
      role: ROLES.FINANCE_MANAGER,
      title: "Finance Manager",
      description: "Accounts receivable ledgers, operating expense centers, and quarterly tax records.",
      icon: DollarSign,
      color: "text-emerald-500 bg-emerald-500/10",
      hover: "hover:border-emerald-500/40 hover:bg-emerald-500/5",
    },
    {
      role: ROLES.SALES_MANAGER,
      title: "Sales Manager",
      description: "CRM leads pipeline progress, contract targets value, and opportunity tracking.",
      icon: TrendingUp,
      color: "text-sky-500 bg-sky-500/10",
      hover: "hover:border-sky-500/40 hover:bg-sky-500/5",
    },
    {
      role: ROLES.PROJECT_MANAGER,
      title: "Project Manager",
      description: "Sprint velocity graphs, task review checklist, and team resource milestones.",
      icon: FolderGit2,
      color: "text-blue-500 bg-blue-500/10",
      hover: "hover:border-blue-500/40 hover:bg-blue-500/5",
    },
    {
      role: ROLES.EMPLOYEE,
      title: "Staff Employee",
      description: "My open tasks backlog, leaves remaining requests, and personal KPIs checklist.",
      icon: Briefcase,
      color: "text-slate-500 bg-slate-500/10",
      hover: "hover:border-slate-500/40 hover:bg-slate-500/5",
    },
  ]

  const handleRoleSelection = (selectedRole: Role) => {
    // Generate mock permissions for the selected role
    let perms: Permission[] = [PERMISSIONS.DASHBOARD_VIEW]

    if (selectedRole === ROLES.SUPER_ADMIN) {
      perms = Object.values(PERMISSIONS)
    } else if (selectedRole === ROLES.CEO) {
      perms = [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.CRM_VIEW,
        PERMISSIONS.SALES_VIEW,
        PERMISSIONS.INVENTORY_VIEW,
        PERMISSIONS.HR_VIEW,
        PERMISSIONS.FINANCE_VIEW,
        PERMISSIONS.PROJECT_VIEW,
        PERMISSIONS.OKR_VIEW,
      ]
    } else if (selectedRole === ROLES.FINANCE_MANAGER) {
      perms = [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.FINANCE_VIEW,
        PERMISSIONS.FINANCE_MANAGE,
      ]
    } else if (selectedRole === ROLES.HR_MANAGER) {
      perms = [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.HR_VIEW,
        PERMISSIONS.HR_MANAGE,
      ]
    } else if (selectedRole === ROLES.OPERATIONS_MANAGER) {
      perms = [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.CRM_VIEW,
        PERMISSIONS.INVENTORY_VIEW,
        PERMISSIONS.INVENTORY_MANAGE,
        PERMISSIONS.PROJECT_VIEW,
        PERMISSIONS.PROJECT_MANAGE,
        PERMISSIONS.OKR_VIEW,
        PERMISSIONS.OKR_MANAGE,
      ]
    } else if (selectedRole === ROLES.SALES_MANAGER) {
      perms = [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.CRM_VIEW,
        PERMISSIONS.CRM_CREATE,
        PERMISSIONS.CRM_UPDATE,
        PERMISSIONS.SALES_VIEW,
        PERMISSIONS.SALES_CREATE,
      ]
    } else if (selectedRole === ROLES.PROJECT_MANAGER) {
      perms = [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.PROJECT_VIEW,
        PERMISSIONS.PROJECT_MANAGE,
        PERMISSIONS.OKR_VIEW,
      ]
    } else if (selectedRole === ROLES.EMPLOYEE) {
      perms = [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.PROJECT_VIEW,
      ]
    }

    login(
      {
        id: "1",
        name: `Mock ${selectedRole.replace("_", " ")}`,
        email: `${selectedRole.toLowerCase()}@glowhaat.com`,
        role: selectedRole,
        permissions: perms,
      },
      "active-mock-session-token"
    )

    // Redirect to dashboard layout
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background/50 text-foreground selection:bg-primary/20">
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Header Info */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-between border-b border-border/30">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-accent shadow-sm text-primary-foreground font-black text-xl">
            G
          </div>
          <span className="text-xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            GlowHaat
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-card/60">
          <Layers className="h-3.5 w-3.5" />
          Enterprise Gateways Active
        </div>
      </header>

      {/* Roster Grid */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col justify-center gap-12">
        <div className="space-y-3 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-foreground/90">
            Welcome to GlowHaat Business Operations
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Select an operational role profile below to authorize a mock session. This will dynamically direct you to that role's workspace dashboard and configure active system access privileges.
          </p>
        </div>

        {/* Roles Cards List */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {rolesConfig.map((item, index) => {
            const Icon = item.icon
            return (
              <Card
                key={index}
                onClick={() => handleRoleSelection(item.role)}
                className={`group relative overflow-hidden border border-border bg-card cursor-pointer shadow-sm transition-all duration-200 ${item.hover}`}
              >
                <CardContent className="p-6 space-y-4">
                  <div className={`inline-flex rounded-xl p-3 ${item.color} transition-transform group-hover:scale-110`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-foreground/90 flex items-center gap-1 group-hover:text-primary transition-colors">
                      {item.title}
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h3>
                    <p className="text-xs text-muted-foreground leading-normal min-h-[48px]">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 border-t border-border/30 text-center text-xs text-muted-foreground/80">
        Enterprise Session Simulation System &copy; 2026. Ready for Django REST API integrations.
      </footer>
    </div>
  )
}
