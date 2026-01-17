import { z } from "zod"

export const inventoryItemSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
    unit: z.string().min(1, "Unit is required (e.g., pcs, kg, ml)"),
    minLevel: z.coerce.number().min(0).default(10),
    pricePerUnit: z.coerce.number().min(0).optional(),
})

export type InventoryItemFormValues = z.infer<typeof inventoryItemSchema>
