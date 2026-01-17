import { createServerClient } from "@/lib/supabase/server"
import { ServiceManagement } from "@/components/services/service-management"

export default async function ServicesPage() {
    const supabase = await createServerClient()

    const { data: rawServices } = await supabase
        .from('services')
        .select(`
            *,
            service_materials (
                quantity_required,
                inventory_items (
                    id,
                    name,
                    unit
                )
            )
        `)
        .order('category')

    const services = (rawServices || []).map(s => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const materials = (s.service_materials || []) as any[]
        return {
            id: s.id,
            name: s.name,
            description: s.description,
            price: parseFloat(s.price),
            category: s.category,
            isActive: s.is_active,
            materials: materials.map(m => ({
                inventoryItemId: m.inventory_items?.id,
                name: m.inventory_items?.name,
                unit: m.inventory_items?.unit,
                quantity: parseFloat(m.quantity_required)
            }))
        }
    })

    const { data: rawInventory } = await supabase
        .from('inventory_items')
        .select('id, name, unit')
        .order('name')

    const inventoryItems = (rawInventory || []).map(i => ({
        id: i.id,
        name: i.name,
        unit: i.unit
    }))

    return <ServiceManagement initialServices={services} inventoryItems={inventoryItems} />
}
