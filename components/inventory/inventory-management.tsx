"use client"

import { useState } from "react"
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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Edit, AlertTriangle, Package, Droplets, Zap } from "lucide-react"

const inventoryItems = [
  {
    id: "INV-001",
    name: "Premium Detergent",
    category: "Cleaning Supplies",
    currentStock: 25,
    minStock: 10,
    maxStock: 100,
    unit: "bottles",
    costPerUnit: 12.5,
    supplier: "CleanCorp",
    lastRestocked: "2024-01-10",
    status: "In Stock",
  },
  {
    id: "INV-002",
    name: "Fabric Softener",
    category: "Cleaning Supplies",
    currentStock: 8,
    minStock: 15,
    maxStock: 80,
    unit: "bottles",
    costPerUnit: 8.75,
    supplier: "SoftTouch Inc",
    lastRestocked: "2024-01-05",
    status: "Low Stock",
  },
  {
    id: "INV-003",
    name: "Dry Cleaning Solvent",
    category: "Dry Cleaning",
    currentStock: 45,
    minStock: 20,
    maxStock: 60,
    unit: "gallons",
    costPerUnit: 25.0,
    supplier: "ChemClean Ltd",
    lastRestocked: "2024-01-12",
    status: "In Stock",
  },
  {
    id: "INV-004",
    name: "Hangers - Wire",
    category: "Equipment",
    currentStock: 150,
    minStock: 100,
    maxStock: 500,
    unit: "pieces",
    costPerUnit: 0.25,
    supplier: "HangerWorld",
    lastRestocked: "2024-01-08",
    status: "In Stock",
  },
  {
    id: "INV-005",
    name: "Starch Spray",
    category: "Finishing",
    currentStock: 3,
    minStock: 12,
    maxStock: 50,
    unit: "cans",
    costPerUnit: 6.5,
    supplier: "StarchPro",
    lastRestocked: "2023-12-28",
    status: "Critical",
  },
]

export function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "critical":
        return "destructive"
      case "low stock":
        return "outline"
      case "in stock":
        return "secondary"
      case "overstocked":
        return "default"
      default:
        return "outline"
    }
  }

  const getStockStatus = (current: number, min: number, max: number) => {
    if (current <= min * 0.5) return "Critical"
    if (current <= min) return "Low Stock"
    if (current >= max * 0.9) return "Overstocked"
    return "In Stock"
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Cleaning Supplies":
        return <Droplets className="w-4 h-4" />
      case "Equipment":
        return <Package className="w-4 h-4" />
      case "Dry Cleaning":
        return <Zap className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const lowStockItems = inventoryItems.filter((item) => item.currentStock <= item.minStock).length

  const totalValue = inventoryItems.reduce((sum, item) => sum + item.currentStock * item.costPerUnit, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
          <p className="text-gray-600">Track supplies, equipment, and stock levels</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Inventory Item</DialogTitle>
              <DialogDescription>
                Add a new item to your inventory with stock levels and supplier information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="item-name">Item Name</Label>
                <Input id="item-name" placeholder="Enter item name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cleaning">Cleaning Supplies</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="dry-cleaning">Dry Cleaning</SelectItem>
                    <SelectItem value="finishing">Finishing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-stock">Current Stock</Label>
                <Input id="current-stock" type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input id="unit" placeholder="bottles, pieces, gallons..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min-stock">Minimum Stock</Label>
                <Input id="min-stock" type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-stock">Maximum Stock</Label>
                <Input id="max-stock" type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Cost per Unit</Label>
                <Input id="cost" type="number" step="0.01" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input id="supplier" placeholder="Supplier name" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600">Add Item</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-blue-600">{inventoryItems.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock Alerts</p>
                <p className="text-2xl font-bold text-red-600">{lowStockItems}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-green-600">${totalValue.toFixed(2)}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">$</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-purple-600">4</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Package className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search inventory items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Cleaning Supplies">Cleaning Supplies</SelectItem>
                <SelectItem value="Equipment">Equipment</SelectItem>
                <SelectItem value="Dry Cleaning">Dry Cleaning</SelectItem>
                <SelectItem value="Finishing">Finishing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items ({filteredItems.length})</CardTitle>
          <CardDescription>Complete list of inventory items with stock levels and supplier information</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Min/Max</TableHead>
                <TableHead>Cost per Unit</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => {
                const status = getStockStatus(item.currentStock, item.minStock, item.maxStock)
                const totalValue = item.currentStock * item.costPerUnit

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(item.category)}
                        <span className="text-sm">{item.category}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium">{item.currentStock}</div>
                        <div className="text-sm text-gray-500">{item.unit}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Min: {item.minStock}</div>
                        <div>Max: {item.maxStock}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${item.costPerUnit.toFixed(2)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${totalValue.toFixed(2)}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(status)}>{status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{item.supplier}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          Restock
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
