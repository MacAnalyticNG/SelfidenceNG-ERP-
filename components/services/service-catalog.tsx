"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Edit, Shirt, Droplets, Icon as Iron, Scissors, Clock } from "lucide-react"

const services = [
  {
    id: "SRV-001",
    name: "C-Agbada, Buba & Sokoto (Ankara)",
    category: "Traditional Attire - Men",
    description: "Complete Agbada set in Ankara fabric for special occasions",
    basePrice: 8500,
    duration: "3-4 days",
    popularity: 92,
    status: "Active",
    requirements: "Ankara fabric, traditional wear",
    icon: "shirt",
  },
  {
    id: "SRV-002",
    name: "C-Agbada Buba & Sokoto (Lace)",
    category: "Traditional Attire - Men",
    description: "Premium Agbada set in delicate lace material",
    basePrice: 12000,
    duration: "4-5 days",
    popularity: 95,
    status: "Active",
    requirements: "Lace fabric, delicate handling required",
    icon: "shirt",
  },
  {
    id: "SRV-003",
    name: "C-Agbada Buba & Sokoto (Kaftan)",
    category: "Traditional Attire - Men",
    description: "Elegant Agbada in Kaftan style for formal events",
    basePrice: 10000,
    duration: "3-4 days",
    popularity: 88,
    status: "Active",
    requirements: "Kaftan fabric, formal wear",
    icon: "shirt",
  },
  {
    id: "SRV-004",
    name: "C-Ankara (Buba & Sokoto)",
    category: "Traditional Attire - Men",
    description: "Classic Ankara Buba and Sokoto combination",
    basePrice: 5500,
    duration: "2-3 days",
    popularity: 85,
    status: "Active",
    requirements: "Ankara fabric",
    icon: "shirt",
  },
  {
    id: "SRV-005",
    name: "C-Buba & Sokoto (Lace)",
    category: "Traditional Attire - Men",
    description: "Traditional Buba and Sokoto in lace",
    basePrice: 7500,
    duration: "3 days",
    popularity: 82,
    status: "Active",
    requirements: "Lace fabric, careful handling",
    icon: "shirt",
  },
  {
    id: "SRV-006",
    name: "C-Buba & Sokoto (Kaftan)",
    category: "Traditional Attire - Men",
    description: "Kaftan-style Buba and Sokoto",
    basePrice: 6500,
    duration: "2-3 days",
    popularity: 78,
    status: "Active",
    requirements: "Kaftan fabric",
    icon: "shirt",
  },
  {
    id: "SRV-007",
    name: "W-Agbada, Buba & Sokoto (Ankara)",
    category: "Traditional Attire - Women",
    description: "Women's Agbada set in beautiful Ankara prints",
    basePrice: 9000,
    duration: "3-4 days",
    popularity: 90,
    status: "Active",
    requirements: "Ankara fabric, women's sizing",
    icon: "shirt",
  },
  {
    id: "SRV-008",
    name: "W-Agbada Buba & Sokoto (Lace)",
    category: "Traditional Attire - Women",
    description: "Elegant women's Agbada in premium lace",
    basePrice: 13000,
    duration: "4-5 days",
    popularity: 93,
    status: "Active",
    requirements: "Premium lace, delicate care",
    icon: "shirt",
  },
  {
    id: "SRV-009",
    name: "W-Agbada Buba & Sokoto (Kaftan)",
    category: "Traditional Attire - Women",
    description: "Women's Kaftan-style Agbada for special occasions",
    basePrice: 11000,
    duration: "3-4 days",
    popularity: 87,
    status: "Active",
    requirements: "Kaftan fabric, women's styling",
    icon: "shirt",
  },
  {
    id: "SRV-010",
    name: "W-Ankara (Buba & Sokoto)",
    category: "Traditional Attire - Women",
    description: "Women's Ankara Buba and Sokoto set",
    basePrice: 6000,
    duration: "2-3 days",
    popularity: 84,
    status: "Active",
    requirements: "Ankara fabric, women's sizing",
    icon: "shirt",
  },
  {
    id: "SRV-011",
    name: "W-Buba & Sokoto (Lace)",
    category: "Traditional Attire - Women",
    description: "Women's Buba and Sokoto in lace material",
    basePrice: 8000,
    duration: "3 days",
    popularity: 81,
    status: "Active",
    requirements: "Lace fabric, women's fit",
    icon: "shirt",
  },
  {
    id: "SRV-012",
    name: "W-Buba & Sokoto (Kaftan)",
    category: "Traditional Attire - Women",
    description: "Women's Kaftan Buba and Sokoto",
    basePrice: 7000,
    duration: "2-3 days",
    popularity: 76,
    status: "Active",
    requirements: "Kaftan material, women's sizing",
    icon: "shirt",
  },
  {
    id: "SRV-013",
    name: "W-Dansiki & Sokoto",
    category: "Traditional Attire - Women",
    description: "Traditional women's Dansiki with Sokoto",
    basePrice: 5000,
    duration: "2 days",
    popularity: 72,
    status: "Active",
    requirements: "Dansiki fabric",
    icon: "shirt",
  },
  {
    id: "SRV-014",
    name: "Trouser & Igbo Buba",
    category: "Traditional Attire - Mixed",
    description: "Modern Igbo Buba with trouser combination",
    basePrice: 6500,
    duration: "2-3 days",
    popularity: 75,
    status: "Active",
    requirements: "Mixed traditional-modern style",
    icon: "shirt",
  },
  {
    id: "SRV-015",
    name: "Aso Oke (Complete)",
    category: "Traditional Attire - Premium",
    description: "Complete Aso Oke outfit with all accessories",
    basePrice: 15000,
    duration: "5-7 days",
    popularity: 96,
    status: "Active",
    requirements: "Premium Aso Oke fabric, complete set",
    icon: "shirt",
  },
  {
    id: "SRV-016",
    name: "Aso Oke (Complete Special)",
    category: "Traditional Attire - Premium",
    description: "Special edition Aso Oke with intricate designs",
    basePrice: 25000,
    duration: "7-10 days",
    popularity: 98,
    status: "Active",
    requirements: "Premium special Aso Oke, VIP handling",
    icon: "shirt",
  },
  {
    id: "SRV-017",
    name: "Native Cap",
    category: "Traditional Accessories",
    description: "Traditional native cap cleaning and maintenance",
    basePrice: 1500,
    duration: "1 day",
    popularity: 65,
    status: "Active",
    requirements: "Traditional cap materials",
    icon: "shirt",
  },
  {
    id: "SRV-018",
    name: "Premium Dry Cleaning",
    category: "Dry Cleaning",
    description: "Professional dry cleaning for delicate fabrics and formal wear",
    basePrice: 3500,
    duration: "2-3 days",
    popularity: 88,
    status: "Active",
    requirements: "Delicate fabrics, suits, dresses",
    icon: "droplets",
  },
  {
    id: "SRV-019",
    name: "Standard Laundry",
    category: "Laundry",
    description: "Regular wash and fold service for everyday clothing",
    basePrice: 1500,
    duration: "1-2 days",
    popularity: 92,
    status: "Active",
    requirements: "Cotton, polyester, casual wear",
    icon: "droplets",
  },
  {
    id: "SRV-020",
    name: "Professional Pressing",
    category: "Pressing",
    description: "Expert pressing and ironing for crisp appearance",
    basePrice: 800,
    duration: "Same day",
    popularity: 78,
    status: "Active",
    requirements: "Shirts, pants, formal wear",
    icon: "iron",
  },
  {
    id: "SRV-021",
    name: "Alterations & Repairs",
    category: "Alterations",
    description: "Professional tailoring and garment repair services",
    basePrice: 4000,
    duration: "3-5 days",
    popularity: 68,
    status: "Active",
    requirements: "Hemming, resizing, repairs",
    icon: "scissors",
  },
  {
    id: "SRV-022",
    name: "Express Service",
    category: "Express",
    description: "Same-day service for urgent cleaning needs",
    basePrice: 5000,
    duration: "Same day",
    popularity: 70,
    status: "Active",
    requirements: "Rush orders, premium surcharge",
    icon: "clock",
  },
]

const pricingTiers = [
  { name: "Basic", multiplier: 1.0, description: "Standard pricing" },
  { name: "Premium", multiplier: 1.5, description: "Enhanced service quality" },
  { name: "VIP", multiplier: 2.0, description: "Priority service with extras" },
]

export function ServiceCatalog() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false)
  const [currency, setCurrency] = useState<string>("NGN")

  const formatCurrency = (amount: number) => {
    const symbols: Record<string, string> = {
      NGN: "₦",
      USD: "$",
      GBP: "£",
      EUR: "€",
    }
    return `${symbols[currency] || "₦"}${amount.toLocaleString()}`
  }

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const getServiceIcon = (iconType: string) => {
    switch (iconType) {
      case "shirt":
        return <Shirt className="w-5 h-5" />
      case "droplets":
        return <Droplets className="w-5 h-5" />
      case "iron":
        return <Iron className="w-5 h-5" />
      case "scissors":
        return <Scissors className="w-5 h-5" />
      case "clock":
        return <Clock className="w-5 h-5" />
      default:
        return <Shirt className="w-5 h-5" />
    }
  }

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 90) return "bg-green-100 text-green-800"
    if (popularity >= 80) return "bg-blue-100 text-blue-800"
    if (popularity >= 70) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const totalServices = services.length
  const avgPrice = services.reduce((sum, service) => sum + service.basePrice, 0) / services.length
  const popularServices = services.filter((service) => service.popularity >= 90).length
  const uniqueCategories = new Set(services.map((s) => s.category)).size

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Service Catalog</h2>
          <p className="text-gray-600">Manage services, pricing, and offerings</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NGN">₦ Naira</SelectItem>
              <SelectItem value="USD">$ USD</SelectItem>
              <SelectItem value="GBP">£ GBP</SelectItem>
              <SelectItem value="EUR">€ EUR</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isAddServiceDialogOpen} onOpenChange={setIsAddServiceDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
                <DialogDescription>Create a new service offering with pricing and details.</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="service-name">Service Name</Label>
                  <Input id="service-name" placeholder="Enter service name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="traditional-men">Traditional Attire - Men</SelectItem>
                      <SelectItem value="traditional-women">Traditional Attire - Women</SelectItem>
                      <SelectItem value="traditional-premium">Traditional Attire - Premium</SelectItem>
                      <SelectItem value="dry-cleaning">Dry Cleaning</SelectItem>
                      <SelectItem value="laundry">Laundry</SelectItem>
                      <SelectItem value="pressing">Pressing</SelectItem>
                      <SelectItem value="alterations">Alterations</SelectItem>
                      <SelectItem value="express">Express</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="base-price">Base Price ({currency === "NGN" ? "₦" : "$"})</Label>
                  <Input id="base-price" type="number" step="100" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input id="duration" placeholder="e.g., 2-3 days" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Detailed service description..." />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="requirements">Requirements & Notes</Label>
                  <Textarea id="requirements" placeholder="Special requirements, fabric types, etc." />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddServiceDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-blue-500 hover:bg-blue-600">Add Service</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Services</p>
                <p className="text-2xl font-bold text-blue-600">{totalServices}</p>
              </div>
              <Shirt className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Popular Services</p>
                <p className="text-2xl font-bold text-green-600">{popularServices}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">★</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Price</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(avgPrice)}</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">₦</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-orange-600">{uniqueCategories}</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold">#</span>
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
                placeholder="Search services by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Traditional Attire - Men">Traditional Attire - Men</SelectItem>
                <SelectItem value="Traditional Attire - Women">Traditional Attire - Women</SelectItem>
                <SelectItem value="Traditional Attire - Premium">Traditional Attire - Premium</SelectItem>
                <SelectItem value="Traditional Accessories">Traditional Accessories</SelectItem>
                <SelectItem value="Dry Cleaning">Dry Cleaning</SelectItem>
                <SelectItem value="Laundry">Laundry</SelectItem>
                <SelectItem value="Pressing">Pressing</SelectItem>
                <SelectItem value="Alterations">Alterations</SelectItem>
                <SelectItem value="Express">Express</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">{getServiceIcon(service.icon)}</div>
                  <div>
                    <CardTitle className="text-base leading-tight">{service.name}</CardTitle>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {service.category}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(service.basePrice)}</div>
                <div className="text-sm text-gray-500">{service.duration}</div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Popularity</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPopularityColor(service.popularity)}`}
                  >
                    {service.popularity}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <Badge variant="secondary">{service.status}</Badge>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-500 mb-1">Requirements:</p>
                <p className="text-xs">{service.requirements}</p>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button size="sm" className="flex-1 bg-blue-500 hover:bg-blue-600">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pricing Tiers */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Tiers</CardTitle>
          <CardDescription>Different pricing levels for enhanced service options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pricingTiers.map((tier) => (
              <Card key={tier.name} className="border-2">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold text-blue-600">{tier.multiplier}x</div>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {services.slice(0, 3).map((service) => (
                      <div key={service.id} className="flex justify-between text-sm">
                        <span className="truncate mr-2">{service.name}</span>
                        <span className="font-medium whitespace-nowrap">
                          {formatCurrency(service.basePrice * tier.multiplier)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
