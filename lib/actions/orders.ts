"use server"

import { revalidatePath } from "next/cache"
import { createServerClient } from "@/lib/supabase/server"
import { orderSchema } from "@/lib/validations/order"
import type { ActionState } from "@/lib/types/actions"

export async function createOrder(prevState: ActionState, formData: FormData): Promise<ActionState> {
    // Extract complex data from formData which might be JSON stringified
    const itemsJson = formData.get("items") as string
    const items = itemsJson ? JSON.parse(itemsJson) : []

    const validatedFields = orderSchema.safeParse({
        customerId: formData.get("customerId"),
        priority: formData.get("priority"),
        pickupDate: formData.get("pickupDate"),
        dueDate: formData.get("dueDate"),
        notes: formData.get("notes"),
        items: items,
    })

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Validation failed",
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const supabase = await createServerClient()
    const { customerId, pickupDate, dueDate, notes, priority } = validatedFields.data

    // Generate a simple ID
    const orderId = `ORD-${Date.now().toString().slice(-6)}`

    // Calculate total amount
    const totalAmount = items.reduce((acc: number, item: any) => acc + (item.quantity * item.unitPrice), 0)

    try {
        // 1. Create Order
        const { error: orderError } = await supabase.from("orders").insert({
            id: orderId,
            customer_id: customerId,
            status: "pending",
            pickup_date: pickupDate,
            due_date: dueDate,
            notes: notes || null,
            total_amount: totalAmount,
        })

        if (orderError) {
            console.error("Supabase Order Error:", orderError)
            return { success: false, message: "Failed to create order" }
        }

        // 2. Create Order Items (if any)
        if (items.length > 0) {
            const orderItems = items.map((item: any) => ({
                order_id: orderId,
                service_id: item.serviceId,
                quantity: item.quantity,
                unit_price: item.unitPrice,
                total_price: item.quantity * item.unitPrice
            }))

            const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

            if (itemsError) {
                console.error("Supabase Items Error:", itemsError)
                return { success: false, message: "Order created but failed to save items" }
            }
        }

        revalidatePath("/dashboard/orders")
        return { success: true, message: "Order created successfully" }
    } catch (error) {
        console.error("Server Error:", error)
        return { success: false, message: "An unexpected error occurred" }
    }
}

export async function updateOrderStatus(orderId: string, newStatus: string): Promise<ActionState> {
    const supabase = await createServerClient()

    try {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId)

        if (error) {
            console.error("Supabase Update Error:", error)
            return { success: false, message: "Failed to update order status" }
        }

        revalidatePath("/dashboard/orders")
        return { success: true, message: "Order status updated successfully" }
    } catch (error) {
        console.error("Server Error:", error)
        return { success: false, message: "An unexpected error occurred" }
    }
}

export async function updateOrder(
    orderId: string,
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const itemsJson = formData.get("items") as string
    const items = itemsJson ? JSON.parse(itemsJson) : []

    const validatedFields = orderSchema.safeParse({
        customerId: formData.get("customerId"),
        priority: formData.get("priority"),
        pickupDate: formData.get("pickupDate"),
        dueDate: formData.get("dueDate"),
        notes: formData.get("notes"),
        items: items,
    })

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Validation failed",
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const supabase = await createServerClient()
    const { customerId, pickupDate, dueDate, notes, priority } = validatedFields.data

    // Calculate total amount
    const totalAmount = items.reduce((acc: number, item: any) => acc + (item.quantity * item.unitPrice), 0)

    try {
        // 1. Update Order
        const { error: orderError } = await supabase
            .from("orders")
            .update({
                customer_id: customerId,
                pickup_date: pickupDate,
                due_date: dueDate,
                notes: notes || null,
                total_amount: totalAmount,
            })
            .eq("id", orderId)

        if (orderError) {
            console.error("Supabase Order Error:", orderError)
            return { success: false, message: "Failed to update order" }
        }

        // 2. Delete existing order items and re-insert
        if (items.length > 0) {
            await supabase.from("order_items").delete().eq("order_id", orderId)

            const orderItems = items.map((item: any) => ({
                order_id: orderId,
                service_id: item.serviceId,
                quantity: item.quantity,
                unit_price: item.unitPrice,
                total_price: item.quantity * item.unitPrice
            }))

            const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

            if (itemsError) {
                console.error("Supabase Items Error:", itemsError)
                return { success: false, message: "Order updated but failed to save items" }
            }
        }

        revalidatePath("/dashboard/orders")
        return { success: true, message: "Order updated successfully" }
    } catch (error) {
        console.error("Server Error:", error)
        return { success: false, message: "An unexpected error occurred" }
    }
}

export async function deleteOrder(orderId: string): Promise<ActionState> {
    const supabase = await createServerClient()

    try {
        // Delete order items first (foreign key constraint)
        await supabase.from("order_items").delete().eq("order_id", orderId)

        // Delete the order
        const { error } = await supabase.from("orders").delete().eq("id", orderId)

        if (error) {
            console.error("Supabase Delete Error:", error)
            return { success: false, message: "Failed to delete order" }
        }

        revalidatePath("/dashboard/orders")
        return { success: true, message: "Order deleted successfully" }
    } catch (error) {
        console.error("Server Error:", error)
        return { success: false, message: "An unexpected error occurred" }
    }
}

