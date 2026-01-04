import { z } from "zod"

export const serviceSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "Price must be positive"),
    category: z.string().min(1, "Category is required"),
    isActive: z.boolean().default(true),
})

export type ServiceFormValues = z.infer<typeof serviceSchema>
