import { createServerClient } from "@/lib/supabase/server"
import { Dashboard } from "@/components/dashboard/dashboard"

export default async function DashboardPage() {
    const supabase = await createServerClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    // Pass necessary user props.
    // Note: The Dashboard component expects user with branch_id.
    const dashboardUser = {
        id: user.id,
        branch_id: null // Placeholder
    }

    // Fetch dashboard stats
    const { count: customerCount } = await supabase.from('customers').select('*', { count: 'exact', head: true })
    const { count: activeOrderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).neq('status', 'delivered').neq('status', 'cancelled')

    // Sum total revenue (this is expensive in large DBs, consider creating a trigger/stats table)
    const { data: revenueData } = await supabase.from('orders').select('total_amount')
    const totalRevenue = revenueData?.reduce((sum: number, order: { total_amount: number | null }) => sum + (order.total_amount || 0), 0) || 0

    // Fetch recent orders
    const { data: recentOrdersData } = await supabase
        .from('orders')
        .select(`
            id,
            status,
            total_amount,
            customers (full_name),
            order_items (
                services (name)
            )
        `)
        .order('created_at', { ascending: false })
        .limit(5)

    const recentOrders = recentOrdersData?.map((order: any) => ({
        id: order.id,
        customer: order.customers?.full_name || 'Unknown',
        service: order.order_items?.[0]?.services?.name || 'Multiple Services',
        status: order.status,
        amount: order.total_amount || 0
    })) || []

    const stats = {
        totalRevenue,
        activeOrders: activeOrderCount || 0,
        totalCustomers: customerCount || 0,
        recentOrders
    }

    return <Dashboard user={dashboardUser} stats={stats} />
}
