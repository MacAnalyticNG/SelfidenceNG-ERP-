"use client"

import { useState } from "react"
import { useFormState } from "react-dom"
import { useFormStatus } from "react-dom"
import { updateService } from "@/lib/actions/services"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"

interface InventoryItem {
    id: string
    name: string
    unit: string
}

interface ServiceMaterial {
    inventoryItemId: string
    name?: string
    unit?: string
    quantity: number
}

interface Service {
    id: string
    name: string
    description: string | null
    price: number
    category: string
    isActive: boolean
    materials?: ServiceMaterial[]
}

const initialState = {
    success: false,
    message: "",
    errors: {},
}

interface EditServiceFormProps {
    service: Service
    onSuccess: () => void
    inventoryItems?: InventoryItem[]
}

export function EditServiceForm({ service, onSuccess, inventoryItems = [] }: EditServiceFormProps) {
    const updateServiceWithId = updateService.bind(null, service.id)
    const [state, dispatch] = useFormState(updateServiceWithId, initialState)
    const [selectedMaterials, setSelectedMaterials] = useState<{ inventoryItemId: string; quantity: number }[]>(
        service.materials?.map(m => ({ inventoryItemId: m.inventoryItemId, quantity: m.quantity })) || []
    )

    const handleAddMaterial = (itemId: string) => {
        const item = inventoryItems.find((i) => i.id === itemId)
        if (!item) return

        setSelectedMaterials((prev) => {
            const existing = prev.find((m) => m.inventoryItemId === itemId)
            if (existing) return prev // Already added
            return [...prev, { inventoryItemId: itemId, quantity: 1 }]
        })
    }

    const handleRemoveMaterial = (itemId: string) => {
        setSelectedMaterials((prev) => prev.filter((m) => m.inventoryItemId !== itemId))
    }

    const handleUpdateQuantity = (itemId: string, quantity: number) => {
        if (quantity < 0.1) return
        setSelectedMaterials((prev) =>
            prev.map((m) => (m.inventoryItemId === itemId ? { ...m, quantity } : m))
        )
    }

    if (state.success) {
        setTimeout(() => onSuccess(), 1000)
        return (
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
                <p className="text-green-600 font-medium">Service updated successfully!</p>
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

            <input type="hidden" name="materials" value={JSON.stringify(selectedMaterials)} />

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Service Name</Label>
                    <Input id="name" name="name" defaultValue={service.name} placeholder="e.g., Shirt Wash & Iron" />
                    {state.errors?.name && (
                        <p className="text-xs text-red-500">{state.errors.name[0]}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" defaultValue={service.category}>
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
                    <Input id="price" name="price" type="number" step="0.01" defaultValue={service.price} placeholder="0.00" />
                    {state.errors?.price && (
                        <p className="text-xs text-red-500">{state.errors.price[0]}</p>
                    )}
                </div>
                <div className="space-y-2 flex items-center pt-8">
                    <Label htmlFor="isActive" className="mr-2">Active</Label>
                    <Switch id="isActive" name="isActive" defaultChecked={service.isActive} />
                </div>
                <div className="col-span-2 space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea id="description" name="description" defaultValue={service.description || ""} placeholder="Service details..." />
                </div>

                {/* Recipe / Materials Section */}
                <div className="col-span-2 space-y-4 border-t pt-4 mt-2">
                    <Label className="text-base font-semibold">Service Recipe (Inventory Usage)</Label>
                    <p className="text-xs text-gray-500">Define what inventory items are consumed by this service.</p>

                    <div className="flex gap-2">
                        <Select onValueChange={handleAddMaterial}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Add Material (e.g. Detergent)" />
                            </SelectTrigger>
                            <SelectContent>
                                {inventoryItems.map((item) => (
                                    <SelectItem key={item.id} value={item.id}>
                                        {item.name} ({item.unit})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        {selectedMaterials.map((m) => {
                            const item = inventoryItems.find(i => i.id === m.inventoryItemId)
                            // If item not found in current inventory list (maybe deleted?), try to fallback to service data if available or just skip/show warnings. 
                            // Ideally inventoryItems contains all.
                            const name = item?.name || service.materials?.find(x => x.inventoryItemId === m.inventoryItemId)?.name || "Unknown Item"
                            const unit = item?.unit || service.materials?.find(x => x.inventoryItemId === m.inventoryItemId)?.unit || ""

                            return (
                                <div key={m.inventoryItemId} className="flex items-center justify-between bg-gray-50 p-2 rounded border">
                                    <span className="text-sm">{name}</span>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            value={m.quantity}
                                            onChange={(e) => handleUpdateQuantity(m.inventoryItemId, parseFloat(e.target.value))}
                                            className="w-20 h-8 text-right"
                                            step="0.1"
                                        />
                                        <span className="text-xs text-gray-500 w-10">{unit}</span>
                                        <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveMaterial(m.inventoryItemId)} className="text-red-500 h-8 w-8 p-0">
                                            x
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                        {selectedMaterials.length === 0 && <p className="text-sm text-gray-500 italic">No materials selected.</p>}
                    </div>
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
                "Save Changes"
            )}
        </Button>
    )
}
