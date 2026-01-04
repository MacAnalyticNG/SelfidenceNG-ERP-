import { z } from "zod"

export const orderItemSchema = z.object({
    serviceId: z.string().uuid(),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
})

export const orderSchema = z.object({
    customerId: z.string().uuid("Customer is required"),
    priority: z.enum(["low", "normal", "high"]).default("normal"),
    pickupDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid pickup date",
    }),
    dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid due date",
    }),
    notes: z.string().optional(),
    // For the simplified version, we might not pass items immediately from the dialog if the UI isn't ready,
    // but let's strictly define it.
    items: z.array(orderItemSchema).default([]),
})

export type OrderFormValues = z.infer<typeof orderSchema>
