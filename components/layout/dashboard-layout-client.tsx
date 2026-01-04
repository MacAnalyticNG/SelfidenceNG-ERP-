"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { PWAProvider } from "@/components/pwa/pwa-provider"

interface DashboardLayoutClientProps {
  children: React.ReactNode
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

export function DashboardLayoutClient({ children, user }: DashboardLayoutClientProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <PWAProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          user={user}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            user={user}
          />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </PWAProvider>
  )
}
