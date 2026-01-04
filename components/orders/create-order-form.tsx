"use client"

import { useState } from "react"
import { useFormState } from "react-dom"
import { useFormStatus } from "react-dom"
import { createOrder } from "@/lib/actions/orders"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

const initialState = {
    success: false,
    message: "",
    errors: {},
}

interface Service {
    id: string
    name: string
    price: number
    category: string
}

interface CreateOrderFormProps {
    customers: { id: string; name: string }[]
    services: Service[]
    onSuccess: () => void
}

export function CreateOrderForm({ customers, services, onSuccess }: CreateOrderFormProps) {
    const [state, dispatch] = useFormState(createOrder, initialState)
    const [selectedServices, setSelectedServices] = useState<{ serviceId: string; quantity: number; unitPrice: number }[]>([])

    const handleAddService = (serviceId: string) => {
        const service = services.find((s) => s.id === serviceId)
        if (!service) return

        setSelectedServices((prev) => {
            const existing = prev.find((item) => item.serviceId === serviceId)
            if (existing) {
                return prev.map((item) =>
                    item.serviceId === serviceId ? { ...item, quantity: item.quantity + 1 } : item
                )
            }
            return [...prev, { serviceId, quantity: 1, unitPrice: service.price }]
        })
    }

    const handleRemoveService = (serviceId: string) => {
        setSelectedServices((prev) => prev.filter((item) => item.serviceId !== serviceId))
    }

    const handleUpdateQuantity = (serviceId: string, quantity: number) => {
        if (quantity < 1) return
        setSelectedServices((prev) =>
            prev.map((item) => (item.serviceId === serviceId ? { ...item, quantity } : item))
        )
    }

    const totalAmount = selectedServices.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

    if (state.success) {
        setTimeout(() => onSuccess(), 1000)
        return (
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
                <p className="text-green-600 font-medium">Order created successfully!</p>
            </div>
        )
    }

    return (
        <form action={dispatch} className="space-y-4">
            {state.message && !state.success && (
                <div className="p-3 bg-red-100 text-red-600 rounded-md text-sm">
                    {state.message}
                </div>
            )}

            {/* Hidden input to pass selected items to server action */}
            <input type="hidden" name="items" value={JSON.stringify(selectedServices)} />

            <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">Order Details</TabsTrigger>
                    <TabsTrigger value="services">Services ({selectedServices.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="customerId">Customer</Label>
                            <Select name="customerId" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select customer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {customers.map((c) => (
                                        <SelectItem key={c.id} value={c.id}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select name="priority" defaultValue="normal">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pickupDate">Pickup Date</Label>
                            <Input id="pickupDate" name="pickupDate" type="date" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dueDate">Due Date</Label>
                            <Input id="dueDate" name="dueDate" type="date" required />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Input id="notes" name="notes" placeholder="Order notes..." />
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="services" className="space-y-4 py-4">
                    {/* Service Selector */}
                    <div className="flex gap-2 mb-4">
                        <Select onValueChange={handleAddService}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select service to add..." />
                            </SelectTrigger>
                            <SelectContent>
                                {services.map((s) => (
                                    <SelectItem key={s.id} value={s.id}>
                                        {s.name} - ${s.price.toFixed(2)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Selected Services List */}
                    <div className="space-y-2 border rounded-md p-4 bg-gray-50 max-h-[200px] overflow-y-auto">
                        {selectedServices.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center">No services added yet.</p>
                        ) : (
                            selectedServices.map((item) => {
                                const service = services.find(s => s.id === item.serviceId)
                                if (!service) return null
                                return (
                                    <div key={item.serviceId} className="flex items-center justify-between bg-white p-2 rounded shadow-sm">
                                        <span className="text-sm font-medium">{service.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-500">${service.price.toFixed(2)}</span>
                                            <div className="flex items-center border rounded">
                                                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleUpdateQuantity(item.serviceId, item.quantity - 1)}>-</Button>
                                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleUpdateQuantity(item.serviceId, item.quantity + 1)}>+</Button>
                                            </div>
                                            <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => handleRemoveService(item.serviceId)}>x</Button>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                        <span className="font-bold">Total Estimate:</span>
                        <span className="text-xl font-bold">${totalAmount.toFixed(2)}</span>
                    </div>
                </TabsContent>
            </Tabs>

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
                    Creating...
                </>
            ) : (
                "Create Order"
            )}
        </Button>
    )
}
