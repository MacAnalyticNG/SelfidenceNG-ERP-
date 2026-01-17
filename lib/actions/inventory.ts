"use server"

import { revalidatePath } from "next/cache"
import { createServerClient } from "@/lib/supabase/server"
import { inventoryItemSchema } from "@/lib/validations/inventory"
import type { ActionState } from "@/lib/types/actions"

export async function createInventoryItem(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const validatedFields = inventoryItemSchema.safeParse({
        name: formData.get("name"),
        quantity: formData.get("quantity"),
        unit: formData.get("unit"),
        minLevel: formData.get("minLevel"),
        pricePerUnit: formData.get("pricePerUnit"),
    })

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Validation failed",
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const supabase = await createServerClient()
    const { name, quantity, unit, minLevel, pricePerUnit } = validatedFields.data

    try {
        const { error } = await supabase.from("inventory_items").insert({
            name,
            quantity,
            unit,
            min_level: minLevel,
            price_per_unit: pricePerUnit || 0,
        })

        if (error) {
            console.error("Supabase Error:", error)
            return { success: false, message: "Failed to create inventory item" }
        }

        revalidatePath("/dashboard/inventory")
        return { success: true, message: "Item created successfully" }
    } catch (error) {
        console.error("Server Error:", error)
        return { success: false, message: "An unexpected error occurred" }
    }
}

export async function updateInventoryItem(
    id: string,
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const validatedFields = inventoryItemSchema.safeParse({
        name: formData.get("name"),
        quantity: formData.get("quantity"),
        unit: formData.get("unit"),
        minLevel: formData.get("minLevel"),
        pricePerUnit: formData.get("pricePerUnit"),
    })

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Validation failed",
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const supabase = await createServerClient()
    const { name, quantity, unit, minLevel, pricePerUnit } = validatedFields.data

    try {
        const { error } = await supabase
            .from("inventory_items")
            .update({
                name,
                quantity,
                unit,
                min_level: minLevel,
                price_per_unit: pricePerUnit || 0,
                updated_at: new Date().toISOString(),
            })
            .eq("id", id)

        if (error) {
            console.error("Supabase Error:", error)
            return { success: false, message: "Failed to update item" }
        }

        revalidatePath("/dashboard/inventory")
        return { success: true, message: "Item updated successfully" }
    } catch (error) {
        console.error("Server Error:", error)
        return { success: false, message: "An unexpected error occurred" }
    }
}

export async function deleteInventoryItem(id: string): Promise<ActionState> {
    const supabase = await createServerClient()
    try {
        const { error } = await supabase.from("inventory_items").delete().eq("id", id)
        if (error) {
            console.error("Supabase Error:", error)
            return { success: false, message: "Failed to delete item" }
        }
        revalidatePath("/dashboard/inventory")
        return { success: true, message: "Item deleted successfully" }
    } catch (error) {
        return { success: false, message: "An unexpected error occurred" }
    }
}
