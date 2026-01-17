"use client"

import { useFormState } from "react-dom"
import { useFormStatus } from "react-dom"
import { updateInventoryItem } from "@/lib/actions/inventory"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface InventoryItem {
    id: string
    name: string
    quantity: number
    unit: string
    minLevel: number
    pricePerUnit: number
}

const initialState = {
    success: false,
    message: "",
    errors: {},
}

export function EditInventoryForm({ item, onSuccess }: { item: InventoryItem; onSuccess: () => void }) {
    const updateItemWithId = updateInventoryItem.bind(null, item.id)
    const [state, dispatch] = useFormState(updateItemWithId, initialState)

    if (state.success) {
        setTimeout(() => onSuccess(), 1000)
        return (
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
                <p className="text-green-600 font-medium">Item updated successfully!</p>
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
                    <Label htmlFor="name">Item Name</Label>
                    <Input id="name" name="name" defaultValue={item.name} required />
                    {state.errors?.name && <p className="text-xs text-red-500">{state.errors.name[0]}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input id="unit" name="unit" defaultValue={item.unit} required />
                    {state.errors?.unit && <p className="text-xs text-red-500">{state.errors.unit[0]}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity (Stock)</Label>
                    <Input id="quantity" name="quantity" type="number" step="0.01" defaultValue={item.quantity} required />
                    {state.errors?.quantity && <p className="text-xs text-red-500">{state.errors.quantity[0]}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="minLevel">Low Stock Alert Level</Label>
                    <Input id="minLevel" name="minLevel" type="number" step="0.01" defaultValue={item.minLevel} />
                    {state.errors?.minLevel && <p className="text-xs text-red-500">{state.errors.minLevel[0]}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="pricePerUnit">Cost Per Unit ($)</Label>
                    <Input id="pricePerUnit" name="pricePerUnit" type="number" step="0.01" defaultValue={item.pricePerUnit} />
                    {state.errors?.pricePerUnit && <p className="text-xs text-red-500">{state.errors.pricePerUnit[0]}</p>}
                </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
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
                "Save Changes"
            )}
        </Button>
    )
}
