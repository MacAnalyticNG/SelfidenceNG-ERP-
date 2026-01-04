"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Dashboard } from "@/components/dashboard/dashboard"
import { CustomerManagement } from "@/components/customers/customer-management"
import { OrderManagement } from "@/components/orders/order-management"
import { InventoryManagement } from "@/components/inventory/inventory-management"
import { StaffScheduling } from "@/components/staff/staff-scheduling"
import { ServiceCatalog } from "@/components/services/service-catalog"
import { BillingPayments } from "@/components/billing/billing-payments"
import { ReportsAnalytics } from "@/components/reports/reports-analytics"
import { DeliveryTracking } from "@/components/delivery/delivery-tracking"
import { Settings } from "@/components/settings/settings"
import { PWAProvider } from "@/components/pwa/pwa-provider"

interface LaundryERPClientProps {
  user: {
    id: string
    email: string
    full_name: string
    role: string
    branch_id: string | null
    branches?: {
      id: string
      name: string
    } | null
  }
}

export function LaundryERPClient({ user }: LaundryERPClientProps) {
  const [activeModule, setActiveModule] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const renderActiveModule = () => {
    switch (activeModule) {
      case "dashboard":
        return <Dashboard user={user} />
      case "customers":
        return <CustomerManagement user={user} />
      case "orders":
        return <OrderManagement user={user} />
      case "inventory":
        return <InventoryManagement user={user} />
      case "staff":
        return <StaffScheduling user={user} />
      case "services":
        return <ServiceCatalog user={user} />
      case "billing":
        return <BillingPayments user={user} />
      case "reports":
        return <ReportsAnalytics user={user} />
      case "delivery":
        return <DeliveryTracking user={user} />
      case "settings":
        return <Settings user={user} />
      default:
        return <Dashboard user={user} />
    }
  }

  return (
    <PWAProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          user={user}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            activeModule={activeModule}
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            user={user}
          />
          <main className="flex-1 overflow-auto p-6">{renderActiveModule()}</main>
        </div>
      </div>
    </PWAProvider>
  )
}
