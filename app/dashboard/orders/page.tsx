import { createServerClient } from "@/lib/supabase/server"
import { OrderManagement } from "@/components/orders/order-management"

export default async function OrdersPage() {
  const supabase = await createServerClient()

  // Fetch orders from the database
  // Note: The schema for 'orders' table we created has different column names (snake_case)
  // compared to what the component expects (camelCase) and the structure is different.
  // We need to map the data.

  const { data: rawOrders } = await supabase
    .from('orders')
    .select(`
      *,
      customers (
        id,
        full_name
      ),
      order_items (
        quantity,
        unit_price,
        services (
          id,
          name,
          category
        )
      )
    `)
    .order('created_at', { ascending: false })

  // Map DB orders to Component orders
  const orders = (rawOrders || []).map(order => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = (order.order_items || []) as any[]

    return {
      id: order.id,
      customer: order.customers?.full_name || "Unknown",
      customerId: order.customer_id,
      services: items.map((i: any) => i.services?.name).filter(Boolean),
      items: items.reduce((acc: number, i: any) => acc + i.quantity, 0),
      // Detailed items for editing
      orderItems: items.map((i: any) => ({
        serviceId: i.services?.id,
        serviceName: i.services?.name,
        quantity: i.quantity,
        unitPrice: i.unit_price
      })),
      amount: order.total_amount,
      status: order.status,
      priority: "Normal", // Schema doesn't have priority yet, defaulting
      orderDate: new Date(order.created_at).toISOString().split('T')[0],
      dueDate: order.due_date,
      pickupDate: order.pickup_date,
      deliveryDate: order.delivery_date,
      notes: order.notes
    }
  })

  // Fetch customers for the dropdown
  const { data: customerData } = await supabase
    .from('customers')
    .select('id, full_name')
    .order('full_name')

  const customers = (customerData || []).map(c => ({
    id: c.id,
    name: c.full_name
  }))

  // Fetch services for the selection
  const { data: serviceData } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('name')

  const services = (serviceData || []).map(s => ({
    id: s.id,
    name: s.name,
    price: s.price,
    category: s.category
  }))

  return <OrderManagement initialOrders={orders} customers={customers} services={services} />
}
