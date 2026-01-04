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

    return <CustomerManagement initialCustomers={customers} />
}
