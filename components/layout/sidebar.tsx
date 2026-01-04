"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Calendar,
  Shirt,
  CreditCard,
  BarChart3,
  Truck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Building2,
} from "lucide-react"

interface SidebarProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  user: {
    full_name: string
    role: string
    branch_id: string | null
    branches?: {
      name: string
    } | null
  }
}

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { href: "/dashboard/inventory", label: "Inventory", icon: Package },
  { href: "/dashboard/staff", label: "Staff", icon: Calendar },
  { href: "/dashboard/services", label: "Services", icon: Shirt },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/delivery", label: "Delivery", icon: Truck },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export function Sidebar({ collapsed, setCollapsed, user }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">CleanPro</h1>
              <p className="text-xs text-gray-500">ERP System</p>
            </div>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="p-1.5">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {!collapsed && user.branches && (
        <div className="p-4 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center space-x-2 mb-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">{user.branches.name}</span>
          </div>
          <Badge variant="secondary" className="text-xs capitalize">
            {user.role.replace("_", " ")}
          </Badge>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          // Check if current path starts with the item href (handling exact match for dashboard)
          const isActive = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href)

          return (
            <Button
              key={item.href}
              asChild
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start transition-all duration-200",
                collapsed ? "px-2" : "px-3",
                isActive ? "bg-blue-500 text-white hover:bg-blue-600" : "text-gray-700 hover:bg-gray-100",
              )}
            >
              <Link href={item.href}>
                <Icon className={cn("w-5 h-5", collapsed ? "mx-auto" : "mr-3")} />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            </Button>
          )
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">© 2025 CleanPro ERP</div>
        </div>
      )}
    </div>
  )
}

