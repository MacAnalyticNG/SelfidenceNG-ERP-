"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Bell, Search, Menu, Plus } from "lucide-react"
import { UserNav } from "@/components/layout/user-nav"
import { usePathname } from "next/navigation"

interface HeaderProps {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  user: {
    email: string
    full_name: string
    role: string
  }
}

const moduleLabels: Record<string, string> = {
  dashboard: "Dashboard",
  customers: "Customer Management",
  orders: "Order Management",
  inventory: "Inventory Management",
  staff: "Staff Scheduling",
  services: "Service Catalog",
  billing: "Billing & Payments",
  reports: "Reports & Analytics",
  delivery: "Delivery Tracking",
  settings: "Settings",
}

export function Header({ sidebarCollapsed, setSidebarCollapsed, user }: HeaderProps) {
  const pathname = usePathname()

  // Extract module from pathname (e.g. /dashboard/orders -> orders)
  const segments = pathname.split('/').filter(Boolean)
  // segments[0] is 'dashboard'. segments[1] is the module. If no second segment, it's dashboard.
  const activeModule = segments[1] || 'dashboard'
  const title = moduleLabels[activeModule] || "Dashboard"

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500">Manage your laundry and cleaning operations</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search..." className="pl-10 w-64" />
          </div>

          {/* Quick Actions */}
          <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <UserNav user={user} />
        </div>
      </div>
    </header>
  )
}

