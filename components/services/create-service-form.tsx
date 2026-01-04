"use client"

import { useState } from "react"
import { useFormState } from "react-dom"
import { useFormStatus } from "react-dom"
import { createService } from "@/lib/actions/services"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"

const initialState = {
    success: false,
    message: "",
    errors: {},
}

export function CreateServiceForm({ onSuccess }: { onSuccess: () => void }) {
    const [state, dispatch] = useFormState(createService, initialState)

    if (state.success) {
        setTimeout(() => onSuccess(), 1000)
        return (
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
                <p className="text-green-600 font-medium">Service created successfully!</p>
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
                    <Label htmlFor="name">Service Name</Label>
                    <Input id="name" name="name" placeholder="e.g., Shirt Wash & Iron" />
                    {state.errors?.name && (
                        <p className="text-xs text-red-500">{state.errors.name[0]}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" defaultValue="Laundry">
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Laundry">Laundry</SelectItem>
                            <SelectItem value="Dry Cleaning">Dry Cleaning</SelectItem>
                            <SelectItem value="Ironing">Ironing</SelectItem>
                            <SelectItem value="Alteration">Alteration</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input id="price" name="price" type="number" step="0.01" placeholder="0.00" />
                    {state.errors?.price && (
                        <p className="text-xs text-red-500">{state.errors.price[0]}</p>
                    )}
                </div>
                <div className="space-y-2 flex items-center pt-8">
                    <Label htmlFor="isActive" className="mr-2">Active</Label>
                    <Switch id="isActive" name="isActive" defaultChecked />
                </div>
                <div className="col-span-2 space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea id="description" name="description" placeholder="Service details..." />
                </div>
            </div>
            <div className="flex justify-end space-x-2">
                <SubmitButton />
            </div>
        </form>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                </>
            ) : (
                "Add Service"
            )}
        </Button>
    )
}
