import { createServerClient } from "@/lib/supabase/server"
import { CustomerManagement } from "@/components/customers/customer-management"

export default async function CustomersPage() {
    const supabase = await createServerClient()

    const { data: rawCustomers } = await supabase
        .from('customers')
        .select(`
      *
    `)
        .order('created_at', { ascending: false })

    // Map DB customers to Component customers
    const customers = (rawCustomers || []).map(c => ({
        id: c.id,
        name: c.full_name,
        email: c.email,
        phone: c.phone,
        address: c.address,
        totalOrders: 0, // Placeholder: requires joining orders table
        totalSpent: 0,  // Placeholder: requires summing orders
        lastOrder: null, // Placeholder
        status: "Active", // Placeholder not in schema yet
        preferences: c.notes
    }))

    // Fetch user profile
    const { data: { user: authUser } } = await supabase.auth.getUser()
    const { data: profile } = await supabase
        .from('profiles')
        .select('*, branches(id, name)')
        .eq('id', authUser?.id)
        .single()

    const user = {
        id: authUser?.id || '',
        email: authUser?.email || '',
        full_name: profile?.full_name || '',
        role: profile?.role || 'staff',
        branch_id: profile?.branch_id || null,
        branches: profile?.branches
    }

    return <CustomerManagement initialCustomers={customers} user={user} />
}
