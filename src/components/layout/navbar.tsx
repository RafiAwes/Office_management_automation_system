"use client"

import * as React from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { Breadcrumbs } from "./breadcrumbs"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Menu, 
  Search, 
  Bell, 
  User, 
  LogOut, 
  Sun, 
  Moon, 
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react"

interface NavbarProps {
  onToggleMobileNav: () => void
}

export function Navbar({ onToggleMobileNav }: NavbarProps) {
  const { user, logout } = useAuthStore()
  const { theme, setTheme } = useTheme()
  
  const [showProfileMenu, setShowProfileMenu] = React.useState(false)
  const [showNotifications, setShowNotifications] = React.useState(false)
  const [searchFocused, setSearchFocused] = React.useState(false)

  // Ref hooks to handle clicking outside dropdowns
  const profileRef = React.useRef<HTMLDivElement>(null)
  const notifRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Mock Notifications
  const mockNotifications = [
    {
      id: "1",
      title: "Sync Success",
      message: "Django database migration matches frontend schema.",
      type: "success",
      time: "2m ago",
    },
    {
      id: "2",
      title: "Warning Alert",
      message: "Reserves budget balance threshold limit under 10%.",
      type: "warning",
      time: "1h ago",
    },
  ]

  const notifIcons = {
    success: <CheckCircle className="h-4 w-4 text-success" />,
    warning: <AlertTriangle className="h-4 w-4 text-warning" />,
    info: <Info className="h-4 w-4 text-info" />,
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-card/85 backdrop-blur px-4 md:px-6 shadow-sm select-none">
      {/* Left side: Hamburger (Mobile) & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileNav}
          className="md:hidden p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground transition-colors"
        >
          <Menu className="h-4 w-4" />
        </button>
        <div className="hidden sm:block">
          <Breadcrumbs />
        </div>
      </div>

      {/* Center: Command Palette Global Search Placeholder */}
      <div className="flex-1 max-w-sm mx-4 hidden lg:block">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Quick search commands... (Ctrl+K)"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full h-9 rounded-lg border border-border bg-muted/40 hover:bg-muted/60 pl-9 pr-4 text-xs focus:bg-background focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all duration-200"
          />
        </div>
      </div>

      {/* Right side: Themes, Notifications, User Menu */}
      <div className="flex items-center gap-3">
        {/* Toggle Theme */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-card p-2 shadow-lg z-50 text-sm"
              >
                <div className="px-3 py-2 border-b border-border/50 flex justify-between items-center mb-1">
                  <span className="font-semibold text-foreground">Notifications</span>
                  <span className="text-[10px] text-primary hover:underline cursor-pointer">Clear all</span>
                </div>
                <div className="space-y-1">
                  {mockNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="flex gap-3 p-2.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <div className="mt-0.5">{notifIcons[notif.type as "success" | "warning"]}</div>
                      <div className="flex-1 space-y-0.5">
                        <p className="font-medium text-xs text-foreground">{notif.title}</p>
                        <p className="text-[11px] text-muted-foreground leading-normal">{notif.message}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground/60 whitespace-nowrap">{notif.time}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 font-bold text-sm uppercase">
              {user?.name?.slice(0, 2) || "U"}
            </div>
            <div className="hidden md:block text-left pr-1.5 max-w-[120px]">
              <p className="text-xs font-semibold text-foreground truncate">{user?.name}</p>
              <p className="text-[10px] text-muted-foreground truncate uppercase">{user?.role?.replace("_", " ")}</p>
            </div>
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card p-1.5 shadow-lg z-50 text-sm"
              >
                <div className="px-3 py-2 border-b border-border/50 mb-1">
                  <p className="font-semibold text-foreground truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                
                <button
                  type="button"
                  onClick={() => { setShowProfileMenu(false); alert("Opening settings...") }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground w-full text-left transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>My Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => logout()}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-danger/10 text-danger w-full text-left transition-colors mt-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
