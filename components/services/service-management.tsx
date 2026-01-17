"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { CreateServiceForm } from "./create-service-form"
import { EditServiceForm } from "./edit-service-form"
import { deleteService } from "@/lib/actions/services"

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

interface ServiceManagementProps {
    initialServices?: Service[]
    inventoryItems?: InventoryItem[]
}

export function ServiceManagement({ initialServices = [], inventoryItems = [] }: ServiceManagementProps) {
    const [services, setServices] = useState<Service[]>(initialServices)
    const [searchTerm, setSearchTerm] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    // Edit State
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null)

    // Delete State
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null)

    const filteredServices = services.filter((service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleDeleteClick = (service: Service) => {
        setServiceToDelete(service)
        setIsDeleteDialogOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!serviceToDelete) return

        try {
            const result = await deleteService(serviceToDelete.id)
            if (result.success) {
                toast.success("Service deleted successfully")
                setIsDeleteDialogOpen(false)
                setServiceToDelete(null)
            } else {
                toast.error(result.message || "Failed to delete service")
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        }
    }

    const handleEditClick = (service: Service) => {
        setServiceToEdit(service)
        setIsEditDialogOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Services Management</h2>
                    <p className="text-gray-600">Manage your product catalog and pricing</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-500 hover:bg-blue-600">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Service
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add New Service</DialogTitle>
                            <DialogDescription>
                                Create a new service offering for your customers.
                            </DialogDescription>
                        </DialogHeader>
                        <CreateServiceForm inventoryItems={inventoryItems} onSuccess={() => setIsAddDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search services..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Services ({filteredServices.length})</CardTitle>
                    <CardDescription>Current service catalog</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredServices.map((service) => (
                                <TableRow key={service.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{service.name}</div>
                                            <div className="text-sm text-gray-500 truncate max-w-[200px]">{service.description}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{service.category}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">${service.price.toFixed(2)}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={service.isActive ? "default" : "secondary"}>
                                            {service.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditClick(service)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600"
                                                onClick={() => handleDeleteClick(service)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Service</DialogTitle>
                        <DialogDescription>
                            Update service details.
                        </DialogDescription>
                    </DialogHeader>
                    {serviceToEdit && (
                        <EditServiceForm
                            service={serviceToEdit}
                            onSuccess={() => {
                                setIsEditDialogOpen(false)
                                setServiceToEdit(null)
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the service
                            "{serviceToDelete?.name}" from the database.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
