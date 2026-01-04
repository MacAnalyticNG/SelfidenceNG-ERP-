"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Truck, Clock, CheckCircle, AlertCircle, Phone } from "lucide-react"

const deliveries = [
  {
    id: "DEL-001",
    orderId: "ORD-001",
    customer: "Alice Johnson",
    address: "123 Main St, City, State 12345",
    phone: "+1 (555) 123-4567",
    driver: "Mike Rodriguez",
    status: "In Transit",
    scheduledTime: "2024-01-15 14:00",
    estimatedArrival: "2024-01-15 14:30",
    actualDelivery: null,
    priority: "Normal",
    items: 5,
    notes: "Ring doorbell twice",
  },
  {
    id: "DEL-002",
    orderId: "ORD-002",
    customer: "Bob Smith",
    address: "456 Oak Ave, City, State 12345",
    phone: "+1 (555) 234-5678",
    driver: "Sarah Chen",
    status: "Delivered",
    scheduledTime: "2024-01-15 10:00",
    estimatedArrival: "2024-01-15 10:15",
    actualDelivery: "2024-01-15 10:12",
    priority: "Normal",
    items: 12,
    notes: "Leave at front door if no answer",
  },
  {
    id: "DEL-003",
    orderId: "ORD-003",
    customer: "Carol Davis",
    address: "789 Pine Rd, City, State 12345",
    phone: "+1 (555) 345-6789",
    driver: "David Kim",
    status: "Scheduled",
    scheduledTime: "2024-01-15 16:00",
    estimatedArrival: "2024-01-15 16:15",
    actualDelivery: null,
    priority: "High",
    items: 8,
    notes: "VIP customer - handle with care",
  },
]

const drivers = [
  {
    id: "DRV-001",
    name: "Mike Rodriguez",
    phone: "+1 (555) 111-2222",
    status: "Active",
    currentDeliveries: 3,
    completedToday: 8,
    vehicle: "Van #1",
  },
  {
    id: "DRV-002",
    name: "Sarah Chen",
    phone: "+1 (555) 333-4444",
    status: "Active",
    currentDeliveries: 2,
    completedToday: 12,
    vehicle: "Van #2",
  },
  {
    id: "DRV-003",
    name: "David Kim",
    phone: "+1 (555) 555-6666",
    status: "Off Duty",
    currentDeliveries: 0,
    completedToday: 6,
    vehicle: "Van #3",
  },
]

export function DeliveryTracking() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || delivery.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "default"
      case "in transit":
        return "secondary"
      case "scheduled":
        return "outline"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "in transit":
        return <Truck className="w-4 h-4 text-blue-500" />
      case "scheduled":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "normal":
        return "bg-blue-100 text-blue-800"
      case "low":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalDeliveries = deliveries.length
  const inTransit = deliveries.filter((d) => d.status === "In Transit").length
  const completed = deliveries.filter((d) => d.status === "Delivered").length
  const scheduled = deliveries.filter((d) => d.status === "Scheduled").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Delivery Tracking</h2>
          <p className="text-gray-600">Track deliveries and manage driver assignments</p>
        </div>
        <Button className="bg-blue-500 hover:bg-blue-600">
          <Truck className="w-4 h-4 mr-2" />
          Schedule Delivery
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Deliveries</p>
                <p className="text-2xl font-bold text-blue-600">{totalDeliveries}</p>
              </div>
              <Truck className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-yellow-600">{inTransit}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-purple-600">{scheduled}</p>
              </div>
              <MapPin className="w-8 h-8 text-purple-500" />
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
                placeholder="Search deliveries by ID, customer, or order..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deliveries Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Deliveries ({filteredDeliveries.length})</CardTitle>
            <CardDescription>Track delivery status and manage routes</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{delivery.id}</div>
                        <div className="text-sm text-gray-500">{delivery.orderId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{delivery.customer}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {delivery.address.split(",")[0]}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{delivery.driver}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(delivery.status)}
                        <Badge variant={getStatusColor(delivery.status)}>{delivery.status}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(delivery.priority)}`}
                      >
                        {delivery.priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{delivery.scheduledTime.split(" ")[1]}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <MapPin className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Drivers Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Active Drivers</CardTitle>
            <CardDescription>Current driver status and assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {drivers.map((driver) => (
                <div key={driver.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{driver.name}</div>
                    <Badge variant={driver.status === "Active" ? "secondary" : "outline"}>{driver.status}</Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Vehicle:</span>
                      <span>{driver.vehicle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current:</span>
                      <span>{driver.currentDeliveries} deliveries</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed:</span>
                      <span>{driver.completedToday} today</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Phone className="w-3 h-3 mr-1" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <MapPin className="w-3 h-3 mr-1" />
                      Track
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
