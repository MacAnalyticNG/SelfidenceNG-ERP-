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

    return <InventoryManagement initialInventory={inventory} />
}
