import { createServerClient } from "@/lib/supabase/server"
import { ServiceManagement } from "@/components/services/service-management"

export default async function ServicesPage() {
    const supabase = await createServerClient()

    const { data: rawServices } = await supabase
        .from('services')
        .select('*')
        .order('category')

    const services = (rawServices || []).map(s => ({
        id: s.id,
        name: s.name,
        description: s.description,
        price: parseFloat(s.price),
        category: s.category,
        isActive: s.is_active
    }))

    return <ServiceManagement initialServices={services} />
}
