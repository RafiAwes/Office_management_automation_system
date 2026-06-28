"use client"

import * as React from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { useRbac } from "@/hooks/use-rbac"
import { PERMISSIONS } from "@/lib/rbac/permissions"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Drawer } from "@/components/ui/drawer"
import { DataTable } from "@/components/ui/data-table"
import { SearchBar } from "@/components/ui/search-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { 
  Truck, 
  Plus, 
  Eye, 
  MapPin,
  Mail,
  Phone,
  Layers,
  Star,
  Award
} from "lucide-react"

interface VendorScorecard {
  quality: number // 0-5
  delivery: number // 0-5
  pricing: number // 0-5
}

interface Supplier {
  id: string
  name: string
  contactName: string
  email: string
  phone: string
  location: string
  itemsSupplied: string
  scorecard: VendorScorecard
}

export default function ProcurementSuppliersPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  // RBAC checks
  const { isAllowed: canView } = useRbac({ requiredPermissions: [PERMISSIONS.INVENTORY_VIEW] })
  const { isAllowed: canManage } = useRbac({ requiredPermissions: [PERMISSIONS.INVENTORY_MANAGE] })

  // State
  const [suppliers, setSuppliers] = React.useState<Supplier[]>([
    {
      id: "SUP-001",
      name: "Apex Logistics Suppliers",
      contactName: "James Apex",
      email: "james@apexlogistics.com",
      phone: "+1 (555) 304-9811",
      location: "Austin, TX",
      itemsSupplied: "Logistics Pallets, Cargo Staging Equipment",
      scorecard: { quality: 4.8, delivery: 4.5, pricing: 4.2 },
    },
    {
      id: "SUP-002",
      name: "Global Server Co",
      contactName: "Elena Rostova",
      email: "elena@globalservers.net",
      phone: "+1 (555) 773-1029",
      location: "San Jose, CA",
      itemsSupplied: "High-Capacity Server Nodes, Rackmount Units",
      scorecard: { quality: 4.9, delivery: 4.7, pricing: 3.8 },
    },
    {
      id: "SUP-003",
      name: "Ironclad Security",
      contactName: "Robert Iron",
      email: "robert@ironcladsec.com",
      phone: "+1 (555) 231-1022",
      location: "Chicago, IL",
      itemsSupplied: "Steel Access Lockers, Warehouse Cages",
      scorecard: { quality: 4.2, delivery: 4.0, pricing: 4.5 },
    },
  ])

  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedSup, setSelectedSup] = React.useState<Supplier | null>(null)
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)

  // Form State
  const [formData, setFormData] = React.useState({
    name: "",
    contactName: "",
    email: "",
    phone: "",
    location: "",
    itemsSupplied: "",
    quality: 5,
    delivery: 5,
    pricing: 5,
  })

  // Enforce Access Gating
  React.useEffect(() => {
    if (!canView && user) {
      router.push("/unauthorized")
    }
  }, [canView, user])

  if (!canView) return null

  // Filters
  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.itemsSupplied.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Actions
  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canManage) return

    const newSup: Supplier = {
      id: `SUP-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name,
      contactName: formData.contactName,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      itemsSupplied: formData.itemsSupplied,
      scorecard: {
        quality: Number(formData.quality) || 5,
        delivery: Number(formData.delivery) || 5,
        pricing: Number(formData.pricing) || 5,
      },
    }

    setSuppliers([newSup, ...suppliers])
    setIsCreateOpen(false)
    setFormData({ name: "", contactName: "", email: "", phone: "", location: "", itemsSupplied: "", quality: 5, delivery: 5, pricing: 5 })
  }

  const columns = [
    { header: "Supplier Code", accessorKey: "id" },
    { header: "Supplier Name", accessorKey: "name" },
    { header: "Location Area", accessorKey: "location" },
    { header: "Contracted Items", accessorKey: "itemsSupplied" },
    {
      header: "Avg Score",
      accessorKey: "scorecard",
      render: (row: Supplier) => {
        const avg = ((row.scorecard.quality + row.scorecard.delivery + row.scorecard.pricing) / 3).toFixed(1)
        return (
          <span className="font-bold text-foreground/80 flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            {avg} / 5
          </span>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Supplier Directory</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit GlowHaat supplier accounts, review pricing performance, and manage vendor details.
          </p>
        </div>

        {canManage && (
          <Button onClick={() => setIsCreateOpen(true)} size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Supplier
          </Button>
        )}
      </div>

      {/* Roster list */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-base font-semibold">Vendor Accounts Registry</CardTitle>
            <SearchBar
              placeholder="Search suppliers by name, items, or area..."
              onSearch={(val) => setSearchQuery(val)}
              className="max-w-xs"
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredSuppliers}
            pageSize={5}
            onRowClick={(row) => setSelectedSup(row)}
            actions={(row) => (
              <Button size="xs" variant="outline" onClick={() => setSelectedSup(row)}>
                <Eye className="h-3.5 w-3.5" />
              </Button>
            )}
          />
        </CardContent>
      </Card>

      {/* Supplier Drawer & Scorecard */}
      <Drawer
        isOpen={!!selectedSup}
        onClose={() => setSelectedSup(null)}
        title={selectedSup?.name}
        description={selectedSup?.id}
      >
        {selectedSup && (
          <div className="space-y-6 text-xs leading-normal">
            {/* Meta */}
            <div className="space-y-3 bg-muted/20 p-4 border border-border/50 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider">Contact Records</span>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${selectedSup.email}`} className="text-foreground hover:underline">
                    {selectedSup.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${selectedSup.phone}`} className="text-foreground hover:underline">
                    {selectedSup.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{selectedSup.location}</span>
                </div>
              </div>
            </div>

            {/* Scorecard ratings */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider block">Vendor Performance Scorecard</span>
              <div className="grid gap-3.5">
                <div className="p-3 border border-border/40 bg-card rounded-xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-foreground/80">Quality Rating</p>
                    <p className="text-[10px] text-muted-foreground">Standard audits of product defects.</p>
                  </div>
                  <span className="text-sm font-black text-foreground flex items-center gap-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    {selectedSup.scorecard.quality} / 5
                  </span>
                </div>

                <div className="p-3 border border-border/40 bg-card rounded-xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-foreground/80">Delivery Speed Rating</p>
                    <p className="text-[10px] text-muted-foreground">Timing and transit delays checks.</p>
                  </div>
                  <span className="text-sm font-black text-foreground flex items-center gap-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    {selectedSup.scorecard.delivery} / 5
                  </span>
                </div>

                <div className="p-3 border border-border/40 bg-card rounded-xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-foreground/80">Pricing Ratios Score</p>
                    <p className="text-[10px] text-muted-foreground">Competitiveness compared to market costs.</p>
                  </div>
                  <span className="text-sm font-black text-foreground flex items-center gap-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    {selectedSup.scorecard.pricing} / 5
                  </span>
                </div>
              </div>
            </div>

            {/* SLA items */}
            <div className="space-y-2.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider block">Contract Scope</span>
              <p className="text-muted-foreground bg-muted/20 p-2.5 rounded-lg border border-border/40 leading-relaxed text-xs">
                Supplied items: {selectedSup.itemsSupplied}
              </p>
            </div>
          </div>
        )}
      </Drawer>

      {/* Add Supplier Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsCreateOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-foreground">Add Supplier Account</h3>
            <form onSubmit={handleCreateSupplier} className="space-y-4 text-xs">
              <Input
                label="Supplier Name"
                placeholder="e.g. Globex Inc"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Account Manager Contact"
                placeholder="e.g. John Doe"
                required
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Email Address"
                  placeholder="contact@supplier.com"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Input
                  label="Phone Number"
                  placeholder="+1 (555) 123-4567"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Location Area"
                  placeholder="e.g. Boston, MA"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
                <Input
                  label="Supplied Scope Items"
                  placeholder="e.g. Ethernet Reels, Cable ties"
                  required
                  value={formData.itemsSupplied}
                  onChange={(e) => setFormData({ ...formData, itemsSupplied: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-3 border-t border-border/50 pt-3">
                <Input
                  label="Quality Score"
                  type="number"
                  placeholder="1-5"
                  required
                  value={formData.quality}
                  onChange={(e) => setFormData({ ...formData, quality: Number(e.target.value) })}
                />
                <Input
                  label="Delivery Score"
                  type="number"
                  placeholder="1-5"
                  required
                  value={formData.delivery}
                  onChange={(e) => setFormData({ ...formData, delivery: Number(e.target.value) })}
                />
                <Input
                  label="Pricing Score"
                  type="number"
                  placeholder="1-5"
                  required
                  value={formData.pricing}
                  onChange={(e) => setFormData({ ...formData, pricing: Number(e.target.value) })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Vendor
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
