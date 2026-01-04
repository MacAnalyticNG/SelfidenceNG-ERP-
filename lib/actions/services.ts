"use server"

import { revalidatePath } from "next/cache"
import { createServerClient } from "@/lib/supabase/server"
import { serviceSchema } from "@/lib/validations/service"

export type ActionState = {
    success: boolean
    message?: string
    errors?: Record<string, string[]>
}

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

    try {
        const { error } = await supabase.from("services").insert({
            name,
            description,
            price,
            category,
            is_active: isActive,
        })

        if (error) {
            console.error("Supabase Error:", error)
            return { success: false, message: "Failed to create service" }
        }

        revalidatePath("/dashboard/services")
        return { success: true, message: "Service created successfully" }
    } catch (error) {
        console.error("Server Error:", error)
        return { success: false, message: "An unexpected error occurred" }
    }
}
