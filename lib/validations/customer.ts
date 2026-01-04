import { z } from "zod"

export const customerSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    phone: z.string().min(10, "Phone number must be at least 10 characters").optional().or(z.literal("")),
    address: z.string().optional(),
    status: z.enum(["active", "vip", "inactive"]).default("active"),
    notes: z.string().optional(),
})

export type CustomerFormValues = z.infer<typeof customerSchema>
