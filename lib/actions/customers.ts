"use server"

import { revalidatePath } from "next/cache"
import { createServerClient } from "@/lib/supabase/server"
import { customerSchema, type CustomerFormValues } from "@/lib/validations/customer"

export type ActionState = {
    success: boolean
    message?: string
    errors?: Record<string, string[]>
}

export async function createCustomer(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const validatedFields = customerSchema.safeParse({
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        status: formData.get("status"),
        notes: formData.get("notes"),
    })

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Validation failed",
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const supabase = await createServerClient()
    const { fullName, email, phone, address, notes } = validatedFields.data

    try {
        const { error } = await supabase.from("customers").insert({
            full_name: fullName,
            email: email || null,
            phone: phone || null,
            address: address || null,
            notes: notes || null,
        })

        if (error) {
            console.error("Supabase Error:", error)
            return { success: false, message: "Failed to create customer in database" }
        }

        revalidatePath("/dashboard/customers")
        return { success: true, message: "Customer created successfully" }
    } catch (error) {
        console.error("Server Error:", error)
        return { success: false, message: "An unexpected error occurred" }
    }
}
