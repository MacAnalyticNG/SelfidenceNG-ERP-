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
      )
    `)
    .order('created_at', { ascending: false })

  // Map DB orders to Component orders
  // Since we haven't implemented order_items fetching in this query yet, we'll mock services/items count for now
  // or fetch them properly. For speed, let's just map the basics.

  const orders = (rawOrders || []).map(order => ({
    id: order.id,
    customer: order.customers?.full_name || "Unknown",
    customerId: order.customer_id, // This is a UUID now, not 'CUST-001'
    services: [], // Placeholder until we fetch order_items
    items: 0,     // Placeholder
    amount: order.total_amount,
    status: order.status,
    priority: "Normal", // Schema doesn't have priority yet, defaulting
    orderDate: new Date(order.created_at).toISOString().split('T')[0],
    dueDate: order.due_date,
    pickupDate: order.pickup_date,
    deliveryDate: order.delivery_date,
    notes: order.notes
  }))

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
