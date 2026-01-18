import { createServerClient } from "@/lib/supabase/server"
import { InventoryManagement } from "@/components/inventory/inventory-management"

export default async function InventoryPage() {
    const supabase = await createServerClient()

    const { data: rawInventory } = await supabase
        .from('inventory_items')
        .select('*')
        .order('name')

    const inventory = (rawInventory || []).map(item => ({
        id: item.id,
        name: item.name,
        quantity: parseFloat(item.quantity),
        unit: item.unit,
        minLevel: parseFloat(item.min_level),
        pricePerUnit: parseFloat(item.price_per_unit || 0)
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

    return <InventoryManagement initialInventory={inventory} user={user} />
}
