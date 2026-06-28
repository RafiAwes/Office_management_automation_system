"use client"

import * as React from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { useRbac } from "@/hooks/use-rbac"
import { PERMISSIONS } from "@/lib/rbac/permissions"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { SearchBar } from "@/components/ui/search-bar"
import { KpiCard } from "@/components/ui/kpi-card"
import { AnalyticsCard } from "@/components/ui/analytics-card"
import { 
  Warehouse, 
  Layers, 
  DollarSign, 
  Activity, 
  MapPin, 
  Users 
} from "lucide-react"

interface WarehouseProfile {
  id: string
  name: string
  location: string
  manager: string
  utilization: number // 0-100
  skuCount: number
  totalWorth: number
}

export default function InventoryWarehousesPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  // RBAC checks
  const { isAllowed: canView } = useRbac({ requiredPermissions: [PERMISSIONS.INVENTORY_VIEW] })

  // State
  const [warehouses] = React.useState<WarehouseProfile[]>([
    { id: "WH-USA-01", name: "US East Storage Pod", location: "New Jersey, USA", manager: "Marcus Chen", utilization: 78, skuCount: 450, totalWorth: 1800000 },
    { id: "WH-EU-02", name: "EU West Logistics Hub", location: "Amsterdam, NL", manager: "Sarah Jenkins", utilization: 88, skuCount: 380, totalWorth: 2400000 },
    { id: "WH-APAC-03", name: "APAC Fulfilment Node", location: "Singapore", manager: "David Miller", utilization: 45, skuCount: 120, totalWorth: 950000 },
  ])

  const [searchQuery, setSearchQuery] = React.useState("")

  // Enforce Access
  React.useEffect(() => {
    if (!canView && user) {
      router.push("/unauthorized")
    }
  }, [canView, user])

  if (!canView) return null

  // Filters
  const filteredWHs = warehouses.filter(
    (wh) =>
      wh.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wh.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns = [
    { header: "Warehouse ID", accessorKey: "id" },
    { header: "Warehouse Name", accessorKey: "name" },
    { header: "Location Area", accessorKey: "location" },
    { header: "Lead Manager", accessorKey: "manager" },
    {
      header: "Total Worth",
      accessorKey: "totalWorth",
      render: (row: WarehouseProfile) => `$${row.totalWorth.toLocaleString()}`,
    },
    {
      header: "Utilization",
      accessorKey: "utilization",
      render: (row: WarehouseProfile) => (
        <span
          className={`font-semibold ${
            row.utilization >= 80
              ? "text-warning animate-pulse"
              : row.utilization >= 50
              ? "text-success"
              : "text-info"
          }`}
        >
          {row.utilization}% Capacity
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Warehouse Dashboard</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Overview tracking of storage volumes, manager rosters, and capacity statistics.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <KpiCard
          title="Total Inventory Portfolio Worth"
          value={`$${warehouses.reduce((sum, w) => sum + w.totalWorth, 0).toLocaleString()}`}
          icon={DollarSign}
          status="success"
        />
        <KpiCard
          title="Active Warehouse Locations"
          value={`${warehouses.length} Active`}
          icon={Warehouse}
          status="default"
        />
        <KpiCard
          title="Average Storage Utilization"
          value={`${Math.round(warehouses.reduce((sum, w) => sum + w.utilization, 0) / warehouses.length)}%`}
          icon={Activity}
          status="info"
        />
      </div>

      {/* Graphs & Table */}
      <div className="grid gap-6 lg:grid-cols-3">
        <AnalyticsCard
          title="Warehouse Storage Utilization"
          description="Storage capacity rates mapped by regional staging modules."
          className="lg:col-span-2"
        >
          <div className="space-y-4">
            {warehouses.map((wh) => (
              <div key={wh.id} className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">{wh.name} ({wh.location})</span>
                  <span>{wh.utilization}% capacity utilized</span>
                </div>
                <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      wh.utilization >= 80
                        ? "bg-warning"
                        : wh.utilization >= 50
                        ? "bg-success"
                        : "bg-primary"
                    }`}
                    style={{ width: `${wh.utilization}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </AnalyticsCard>

        {/* Warehouse Managers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Regional Leads</CardTitle>
            <CardDescription className="text-xs">Assigned warehouse operators.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs">
            {warehouses.map((wh) => (
              <div key={wh.id} className="flex items-center gap-3 border-b border-border/40 pb-2.5 last:border-0 last:pb-0">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold">
                  {wh.manager[0]}
                </div>
                <div>
                  <p className="font-bold text-foreground">{wh.manager}</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3" />
                    {wh.name}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Warehouse registries table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-base font-semibold">Staging Registry</CardTitle>
            <SearchBar
              placeholder="Search warehouses..."
              onSearch={(val) => setSearchQuery(val)}
              className="max-w-xs"
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredWHs}
            pageSize={5}
          />
        </CardContent>
      </Card>
    </div>
  )
}
