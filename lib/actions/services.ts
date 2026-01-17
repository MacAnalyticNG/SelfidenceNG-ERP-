"use server"

import { revalidatePath } from "next/cache"
import { createServerClient } from "@/lib/supabase/server"
import { serviceSchema } from "@/lib/validations/service"
import type { ActionState } from "@/lib/types/actions"

export async function createService(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const validatedFields = serviceSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        price: formData.get("price"),
        category: formData.get("category"),
        isActive: formData.get("isActive") === "on",
    })

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Validation failed",
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const supabase = await createServerClient()
    const { name, description, price, category, isActive } = validatedFields.data
    const materialsJson = formData.get("materials") as string
    let materials: { inventoryItemId: string; quantity: number }[] = []

    try {
        if (materialsJson) materials = JSON.parse(materialsJson)
    } catch (e) {
        // Ignore parse error
    }

    try {
        const { data: service, error } = await supabase.from("services").insert({
            name,
            description,
            price,
            category,
            is_active: isActive,
        }).select().single()

        if (error) {
            console.error("Supabase Error:", error)
            return { success: false, message: "Failed to create service" }
        }

        if (materials.length > 0 && service) {
            const materialRecords = materials.map(m => ({
                service_id: service.id,
                inventory_item_id: m.inventoryItemId,
                quantity_required: m.quantity
            }))

            const { error: matError } = await supabase.from("service_materials").insert(materialRecords)
            if (matError) console.error("Error linking materials:", matError)
        }

        revalidatePath("/dashboard/services")
        return { success: true, message: "Service created successfully" }
    } catch (error) {
        console.error("Server Error:", error)
        return { success: false, message: "An unexpected error occurred" }
    }
}

export async function updateService(
    id: string,
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const validatedFields = serviceSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        price: formData.get("price"),
        category: formData.get("category"),
        isActive: formData.get("isActive") === "on",
    })

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Validation failed",
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const supabase = await createServerClient()
    const { name, description, price, category, isActive } = validatedFields.data
    const materialsJson = formData.get("materials") as string
    let materials: { inventoryItemId: string; quantity: number }[] = []

    try {
        if (materialsJson) materials = JSON.parse(materialsJson)
    } catch (e) {
        // Ignore parse error
    }

    try {
        const { error } = await supabase
            .from("services")
            .update({
                name,
                description,
                price,
                category,
                is_active: isActive,
            })
            .eq("id", id)

        if (error) {
            console.error("Supabase Error:", error)
            return { success: false, message: "Failed to update service" }
        }

        // Update Materials: Delete all existing and re-insert
        await supabase.from("service_materials").delete().eq("service_id", id)

        if (materials.length > 0) {
            const materialRecords = materials.map(m => ({
                service_id: id,
                inventory_item_id: m.inventoryItemId,
                quantity_required: m.quantity
            }))

            const { error: matError } = await supabase.from("service_materials").insert(materialRecords)
            if (matError) console.error("Error linking materials:", matError)
        }

        revalidatePath("/dashboard/services")
        return { success: true, message: "Service updated successfully" }
    } catch (error) {
        console.error("Server Error:", error)
        return { success: false, message: "An unexpected error occurred" }
    }
}

export async function deleteService(id: string): Promise<ActionState> {
    const supabase = await createServerClient()

    try {
        const { error } = await supabase.from("services").delete().eq("id", id)

        if (error) {
            console.error("Supabase Error:", error)
            return { success: false, message: "Failed to delete service" }
        }

        revalidatePath("/dashboard/services")
        return { success: true, message: "Service deleted successfully" }
    } catch (error) {
        console.error("Server Error:", error)
        return { success: false, message: "An unexpected error occurred" }
    }
}
