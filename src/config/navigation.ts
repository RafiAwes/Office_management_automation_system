import { Permission, PERMISSIONS } from "@/lib/rbac/permissions"
import { Role, ROLES } from "@/lib/rbac/roles"
import { 
  LayoutDashboard, 
  BarChart3, 
  DollarSign, 
  Target, 
  Users, 
  Calendar, 
  ClipboardList, 
  Wallet, 
  TrendingUp, 
  FolderGit2, 
  Settings,
  Bell,
  HeartHandshake,
  FileText,
  Box,
  Warehouse,
  Truck,
  Sparkles,
  GitFork
} from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon: any
  requiredRoles?: Role[]
  requiredPermissions?: Permission[]
}

export interface NavGroup {
  groupName: string
  items: NavItem[]
}

export const navigationConfig: NavGroup[] = [
  {
    groupName: "General",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        requiredPermissions: [PERMISSIONS.DASHBOARD_VIEW],
      },
      {
        title: "Analytics Center",
        href: "/dashboard/analytics",
        icon: BarChart3,
        requiredRoles: [ROLES.SUPER_ADMIN, ROLES.CEO, ROLES.OPERATIONS_MANAGER, ROLES.FINANCE_MANAGER, ROLES.HR_MANAGER],
      },
      {
        title: "AI Business Copilot",
        href: "/dashboard/copilot",
        icon: Sparkles,
        requiredRoles: [ROLES.SUPER_ADMIN, ROLES.CEO, ROLES.OPERATIONS_MANAGER, ROLES.FINANCE_MANAGER, ROLES.HR_MANAGER, ROLES.PROJECT_MANAGER, ROLES.EMPLOYEE],
      },
      {
        title: "Workflow Automation",
        href: "/dashboard/workflow",
        icon: GitFork,
        requiredRoles: [ROLES.SUPER_ADMIN, ROLES.CEO, ROLES.OPERATIONS_MANAGER],
      },
    ],
  },
  {
    groupName: "Executive & OKRs",
    items: [
      {
        title: "Executive OKR Dashboard",
        href: "/dashboard/okr/dashboard",
        icon: Target,
        requiredRoles: [ROLES.SUPER_ADMIN, ROLES.CEO, ROLES.OPERATIONS_MANAGER, ROLES.HR_MANAGER, ROLES.PROJECT_MANAGER, ROLES.EMPLOYEE],
      },
      {
        title: "Company Objectives",
        href: "/dashboard/okr/objectives",
        icon: Target,
        requiredRoles: [ROLES.SUPER_ADMIN, ROLES.CEO, ROLES.OPERATIONS_MANAGER, ROLES.PROJECT_MANAGER],
      },
      {
        title: "Staff KPIs Scorecard",
        href: "/dashboard/okr/kpis",
        icon: TrendingUp,
        requiredRoles: [ROLES.SUPER_ADMIN, ROLES.CEO, ROLES.OPERATIONS_MANAGER, ROLES.PROJECT_MANAGER, ROLES.EMPLOYEE],
      },
    ],
  },
  {
    groupName: "CRM Hub",
    items: [
      {
        title: "Leads Pipeline",
        href: "/dashboard/crm/leads",
        icon: Users,
        requiredPermissions: [PERMISSIONS.CRM_VIEW],
      },
      {
        title: "Customers 360",
        href: "/dashboard/crm/customers",
        icon: HeartHandshake,
        requiredPermissions: [PERMISSIONS.CRM_VIEW],
      },
      {
        title: "Opportunities Tracker",
        href: "/dashboard/crm/opportunities",
        icon: TrendingUp,
        requiredPermissions: [PERMISSIONS.CRM_VIEW],
      },
    ],
  },
  {
    groupName: "Sales Hub",
    items: [
      {
        title: "Quotations Management",
        href: "/dashboard/sales/quotations",
        icon: FileText,
        requiredPermissions: [PERMISSIONS.SALES_VIEW],
      },
      {
        title: "Order Management",
        href: "/dashboard/sales/orders",
        icon: ClipboardList,
        requiredPermissions: [PERMISSIONS.SALES_VIEW],
      },
      {
        title: "Invoice Dashboard",
        href: "/dashboard/sales/invoices",
        icon: DollarSign,
        requiredPermissions: [PERMISSIONS.SALES_VIEW, PERMISSIONS.FINANCE_VIEW],
      },
    ],
  },
  {
    groupName: "Inventory Hub",
    items: [
      {
        title: "Product Catalog",
        href: "/dashboard/inventory/products",
        icon: Box,
        requiredPermissions: [PERMISSIONS.INVENTORY_VIEW],
      },
      {
        title: "Warehouse Dashboard",
        href: "/dashboard/inventory/warehouses",
        icon: Warehouse,
        requiredPermissions: [PERMISSIONS.INVENTORY_VIEW],
      },
      {
        title: "Stock & Transactions",
        href: "/dashboard/inventory/stock",
        icon: ClipboardList,
        requiredPermissions: [PERMISSIONS.INVENTORY_VIEW],
      },
    ],
  },
  {
    groupName: "Procurement Hub",
    items: [
      {
        title: "Supplier Directory",
        href: "/dashboard/procurement/suppliers",
        icon: Truck,
        requiredPermissions: [PERMISSIONS.INVENTORY_VIEW],
      },
      {
        title: "Purchase Orders",
        href: "/dashboard/procurement/purchase-orders",
        icon: FileText,
        requiredPermissions: [PERMISSIONS.INVENTORY_VIEW],
      },
    ],
  },
  {
    groupName: "HRM Hub",
    items: [
      {
        title: "Employees Directory",
        href: "/dashboard/hrm/employees",
        icon: Users,
        requiredRoles: [ROLES.SUPER_ADMIN, ROLES.CEO, ROLES.HR_MANAGER, ROLES.EMPLOYEE],
      },
      {
        title: "Attendance Tracker",
        href: "/dashboard/hrm/attendance",
        icon: Calendar,
        requiredRoles: [ROLES.SUPER_ADMIN, ROLES.CEO, ROLES.HR_MANAGER, ROLES.EMPLOYEE],
      },
      {
        title: "Leave Management",
        href: "/dashboard/hrm/leave",
        icon: HeartHandshake,
        requiredRoles: [ROLES.SUPER_ADMIN, ROLES.CEO, ROLES.HR_MANAGER, ROLES.EMPLOYEE],
      },
      {
        title: "Payroll Dashboard",
        href: "/dashboard/hrm/payroll",
        icon: Wallet,
        requiredRoles: [ROLES.SUPER_ADMIN, ROLES.CEO, ROLES.HR_MANAGER, ROLES.EMPLOYEE],
      },
    ],
  },
  {
    groupName: "Finance Hub",
    items: [
      {
        title: "Income Ledger",
        href: "/dashboard/finance/income",
        icon: TrendingUp,
        requiredRoles: [ROLES.SUPER_ADMIN, ROLES.FINANCE_MANAGER],
      },
      {
        title: "Expenses Hub",
        href: "/dashboard/finance/expenses",
        icon: DollarSign,
        requiredRoles: [ROLES.SUPER_ADMIN, ROLES.FINANCE_MANAGER],
      },
      {
        title: "Financial Reports",
        href: "/dashboard/finance/reports",
        icon: Wallet,
        requiredRoles: [ROLES.SUPER_ADMIN, ROLES.CEO, ROLES.FINANCE_MANAGER],
      },
    ],
  },
  {
    groupName: "Projects Hub",
    items: [
      {
        title: "Project Dashboard",
        href: "/dashboard/projects",
        icon: FolderGit2,
        requiredRoles: [ROLES.SUPER_ADMIN, ROLES.CEO, ROLES.PROJECT_MANAGER, ROLES.EMPLOYEE],
      },
      {
        title: "Task Management",
        href: "/dashboard/projects/tasks",
        icon: ClipboardList,
        requiredRoles: [ROLES.SUPER_ADMIN, ROLES.CEO, ROLES.PROJECT_MANAGER, ROLES.EMPLOYEE],
      },
      {
        title: "Kanban Board",
        href: "/dashboard/projects/kanban",
        icon: BarChart3,
        requiredRoles: [ROLES.SUPER_ADMIN, ROLES.CEO, ROLES.PROJECT_MANAGER, ROLES.EMPLOYEE],
      },
    ],
  },

  {
    groupName: "Identity & Access (IAM)",
    items: [
      {
        title: "User Management",
        href: "/dashboard/settings/users",
        icon: Users,
        requiredRoles: [ROLES.SUPER_ADMIN],
      },
      {
        title: "Role Configurations",
        href: "/dashboard/settings/roles",
        icon: Settings,
        requiredRoles: [ROLES.SUPER_ADMIN],
      },
      {
        title: "Permission Matrix",
        href: "/dashboard/settings/permissions",
        icon: ClipboardList,
        requiredRoles: [ROLES.SUPER_ADMIN],
      },
    ],
  },
]
