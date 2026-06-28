"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useRbac, RbacProps } from "@/hooks/use-rbac"
import { ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react"

export interface Column<T> {
  header: string
  accessorKey: keyof T | string
  render?: (row: T) => React.ReactNode
  sortable?: boolean
}

export interface DataTableProps<T> extends RbacProps {
  columns: Column<T>[]
  data: T[]
  pageSize?: number
  onRowClick?: (row: T) => void
  actions?: (row: T) => React.ReactNode
  className?: string
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  pageSize = 5,
  onRowClick,
  actions,
  requiredPermissions,
  requiredRoles,
  fallbackAction = "hidden",
  className,
}: DataTableProps<T>) {
  const { action } = useRbac({ requiredPermissions, requiredRoles, fallbackAction })
  
  const [currentPage, setCurrentPage] = React.useState(1)
  const [sortKey, setSortKey] = React.useState<string | null>(null)
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc")

  if (action === "hidden") return null

  const isDisabled = action === "disabled"
  const isReadOnly = action === "read-only"

  // Sorting logic
  const handleSort = (key: string) => {
    if (isDisabled) return
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("asc")
    }
  }

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data
    return [...data].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal
      }
      return sortOrder === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal))
    })
  }, [data, sortKey, sortOrder])

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize)

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className={cn(
        "rounded-xl border border-border bg-card overflow-hidden shadow-sm transition-opacity",
        isDisabled && "opacity-50 pointer-events-none select-none"
      )}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-muted-foreground/90 font-medium">
                {columns.map((col, index) => (
                  <th
                    key={index}
                    onClick={() => col.sortable && handleSort(col.accessorKey as string)}
                    className={cn(
                      "px-6 py-3.5 select-none",
                      col.sortable && "cursor-pointer hover:text-foreground transition-colors"
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.header}
                      {col.sortable && <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground/60" />}
                    </div>
                  </th>
                ))}
                {actions && <th className="px-6 py-3.5 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-10 text-center text-muted-foreground">
                    No data available
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rIndex) => (
                  <tr
                    key={rIndex}
                    onClick={() => !isDisabled && onRowClick?.(row)}
                    className={cn(
                      "border-b border-border/50 hover:bg-muted/10 transition-colors",
                      onRowClick && !isDisabled && "cursor-pointer"
                    )}
                  >
                    {columns.map((col, cIndex) => {
                      const value = col.render ? col.render(row) : row[col.accessorKey as string]
                      return (
                        <td key={cIndex} className="px-6 py-3 text-foreground/80 font-medium">
                          {value}
                        </td>
                      )
                    })}
                    {actions && (
                      <td className="px-6 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        {isReadOnly ? (
                          <span className="text-xs text-muted-foreground italic">Read-Only</span>
                        ) : (
                          actions(row)
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className={cn(
          "flex items-center justify-between px-2 text-sm text-muted-foreground",
          isDisabled && "opacity-40"
        )}>
          <span>
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, data.length)} of {data.length} entries
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1 || isDisabled}
              className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-semibold text-foreground px-1">{currentPage}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || isDisabled}
              className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
