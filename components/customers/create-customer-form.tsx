"use client"

import { useState } from "react"
// Note: In Next.js 14/React 18 use useFormState. If React 19 use useActionState
import { useFormState } from "react-dom"
import { createCustomer } from "@/lib/actions/customers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

const initialState = {
    success: false,
    message: "",
    errors: {},
}

export function CreateCustomerForm({ onSuccess }: { onSuccess: () => void }) {
    const [state, dispatch] = useFormState(createCustomer, initialState)

    if (state.success) {
        // Reset or close dialog
        // We call onSuccess in useEffect effectively, but here we can just show a success message
        // or rely on the parent to close it if we want.
        // However, usually we want to close the dialog.
        // For simplicity, let's call onSuccess on the next render or use a side effect.
        // Better yet, let's just observe the state in the parent or handle it here.
        // Let's rely on a small effect or just button click.
        setTimeout(() => onSuccess(), 1000)
        return (
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
                <p className="text-green-600 font-medium">Customer created successfully!</p>
            </div>
        )
    }

    return (
        <form action={dispatch} className="grid gap-4 py-4">
            {state.message && !state.success && (
                <div className="p-3 bg-red-100 text-red-600 rounded-md text-sm">
                    {state.message}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="fullName" className={state.errors?.fullName ? "text-red-500" : ""}>
                        Full Name
                    </Label>
                    <Input id="fullName" name="fullName" placeholder="Enter customer name" />
                    {state.errors?.fullName && (
                        <p className="text-xs text-red-500">{state.errors.fullName[0]}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email" className={state.errors?.email ? "text-red-500" : ""}>
                        Email
                    </Label>
                    <Input id="email" name="email" type="email" placeholder="customer@email.com" />
                    {state.errors?.email && (
                        <p className="text-xs text-red-500">{state.errors.email[0]}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" placeholder="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue="active">
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="vip">VIP</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="col-span-2 space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" placeholder="Street address, City, State, ZIP" />
                </div>
                <div className="col-span-2 space-y-2">
                    <Label htmlFor="notes">Preferences & Notes</Label>
                    <Textarea id="notes" name="notes" placeholder="Special instructions, preferences, allergies, etc." />
                </div>
            </div>
            <div className="flex justify-end space-x-2">
                <SubmitButton />
            </div>
        </form>
    )
}

import { useFormStatus } from "react-dom"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                </>
            ) : (
                "Add Customer"
            )}
        </Button>
    )
}
