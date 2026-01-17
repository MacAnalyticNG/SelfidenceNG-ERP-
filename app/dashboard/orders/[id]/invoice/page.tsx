import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { InvoiceTemplate } from "@/components/orders/invoice-template"

export default async function InvoicePage({ params }: { params: { id: string } }) {
    const supabase = await createServerClient()

    const { data: rawOrder, error } = await supabase
        .from('orders')
        .select(`
            *,
            customers (
                full_name,
                email,
                phone,
                address
            ),
            order_items (
                quantity,
                unit_price,
                total_price,
                services (
                    name,
                    category
                )
            )
        `)
        .eq('id', params.id)
        .single()

    if (error || !rawOrder) {
        notFound()
    }

    // Map to structure expected by InvoiceTemplate
    const order = {
        id: rawOrder.id,
        created_at: rawOrder.created_at,
        due_date: rawOrder.due_date,
        status: rawOrder.status,
        total_amount: rawOrder.total_amount,
        customer: {
            full_name: rawOrder.customers?.full_name || "Unknown",
            email: rawOrder.customers?.email || null,
            phone: rawOrder.customers?.phone || null,
            address: rawOrder.customers?.address || null,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items: (rawOrder.order_items || []).map((item: any) => ({
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.total_price,
            service: {
                name: item.services?.name || "Unknown Service",
                category: item.services?.category || "General"
            }
        }))
    }

    return (
        <div className="container mx-auto py-10 print:py-0 print:max-w-none">
            <InvoiceTemplate order={order} />
        </div>
    )
}
