"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Users, ShoppingCart, DollarSign, AlertTriangle, Clock, Package } from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { DebtReminderDialog } from "@/components/debt/debt-reminder-dialog"
import { createClient } from "@/lib/supabase/client"

const weeklySalesData = [
  { week: "Week 1", revenue: 5200, orders: 65, currency: "₦" },
  { week: "Week 2", revenue: 6100, orders: 72, currency: "₦" },
  { week: "Week 3", revenue: 5800, orders: 68, currency: "₦" },
  { week: "Week 4", revenue: 7900, orders: 84, currency: "₦" },
]

const monthlySalesData = [
  { month: "Jan", revenue2024: 18000, revenue2025: 22000, orders: 210 },
  { month: "Feb", revenue2024: 20000, revenue2025: 25000, orders: 245 },
  { month: "Mar", revenue2024: 22000, revenue2025: 28000, orders: 280 },
  { month: "Apr", revenue2024: 19000, revenue2025: 24000, orders: 235 },
  { month: "May", revenue2024: 25000, revenue2025: 31000, orders: 310 },
  { month: "Jun", revenue2024: 28000, revenue2025: 35000, orders: 350 },
]

const yearlySalesData = [
  { year: "2021", revenue: 180000, orders: 2100 },
  { year: "2022", revenue: 245000, orders: 2850 },
  { year: "2023", revenue: 320000, orders: 3600 },
  { year: "2024", revenue: 385000, orders: 4250 },
  { year: "2025", revenue: 450000, orders: 4800 },
]

const topProducts = [
  { name: "C-Agbada Buba & Sokoto (Lace)", orders: 245, revenue: 122500, trend: "+15%" },
  { name: "Standard Laundry", orders: 189, revenue: 47250, trend: "+8%" },
  { name: "Premium Dry Cleaning", orders: 156, revenue: 93600, trend: "+12%" },
  { name: "W-Buba & Sokoto (Ankara)", orders: 134, revenue: 67000, trend: "+10%" },
  { name: "Professional Pressing", orders: 98, revenue: 24500, trend: "+5%" },
  { name: "Aso Oke (Complete)", orders: 87, revenue: 65250, trend: "+18%" },
  { name: "Native Cap", orders: 76, revenue: 11400, trend: "+7%" },
  { name: "Trouser & Igbo Buba", orders: 65, revenue: 26000, trend: "+4%" },
]

const mostOrderedProducts = [
  { rank: 1, name: "Standard Laundry", timesOrdered: 1245, avgPerOrder: 3.2 },
  { rank: 2, name: "Premium Dry Cleaning", timesOrdered: 987, avgPerOrder: 2.8 },
  { rank: 3, name: "C-Agbada Buba & Sokoto (Lace)", timesOrdered: 876, avgPerOrder: 1.5 },
  { rank: 4, name: "Professional Pressing", timesOrdered: 654, avgPerOrder: 4.1 },
  { rank: 5, name: "W-Buba & Sokoto (Ankara)", timesOrdered: 543, avgPerOrder: 1.8 },
]

const topCustomers = [
  {
    name: "Mrs. Adebayo Oluwaseun",
    customerId: "CUST-1045",
    totalSpent: 245000,
    weeklyAvg: 4500,
    monthlyAvg: 18000,
    yearlyTotal: 245000,
    ordersCount: 156,
    memberSince: "2022",
  },
  {
    name: "Chief Okonkwo Emmanuel",
    customerId: "CUST-0789",
    totalSpent: 198000,
    weeklyAvg: 3800,
    monthlyAvg: 15000,
    yearlyTotal: 198000,
    ordersCount: 134,
    memberSince: "2021",
  },
  {
    name: "Alhaji Musa Ibrahim",
    customerId: "CUST-1234",
    totalSpent: 176000,
    weeklyAvg: 3200,
    monthlyAvg: 13500,
    yearlyTotal: 176000,
    ordersCount: 112,
    memberSince: "2023",
  },
  {
    name: "Dr. Chioma Nwankwo",
    customerId: "CUST-0456",
    totalSpent: 165000,
    weeklyAvg: 3100,
    monthlyAvg: 12800,
    yearlyTotal: 165000,
    ordersCount: 98,
    memberSince: "2022",
  },
  {
    name: "Pastor David Adeleke",
    customerId: "CUST-0912",
    totalSpent: 142000,
    weeklyAvg: 2700,
    monthlyAvg: 11000,
    yearlyTotal: 142000,
    ordersCount: 87,
    memberSince: "2023",
  },
]

const serviceData = [
  { name: "Traditional Attire", value: 35, color: "#3B82F6" },
  { name: "Standard Laundry", value: 30, color: "#0EA5E9" },
  { name: "Dry Cleaning", value: 20, color: "#06B6D4" },
  { name: "Pressing", value: 10, color: "#8B5CF6" },
  { name: "Alterations", value: 5, color: "#EC4899" },
]



interface Customer {
  id: string
  customer_code: string
  full_name: string
  email: string | null
  phone: string
  outstanding_debt: number
}

interface DashboardStats {
  totalRevenue: number
  activeOrders: number
  totalCustomers: number
  recentOrders: {
    id: string
    customer: string
    service: string
    status: string
    amount: number
  }[]
}

interface DashboardProps {
  user: {
    id: string
    branch_id: string | null
  }
  stats?: DashboardStats
}

export function Dashboard({ user, stats }: DashboardProps) {
  const [currency, setCurrency] = useState("NGN")
  const [timeframe, setTimeframe] = useState("weekly")
  const [selectedDebtor, setSelectedDebtor] = useState<Customer | null>(null)
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])

  const supabase = createClient()

  useEffect(() => {
    loadCustomersWithDebt()
  }, [])

  const loadCustomersWithDebt = async () => {
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .gt("outstanding_debt", 0)
        .order("outstanding_debt", { ascending: false })
        .limit(5)

      if (error) throw error
      setCustomers(data || [])
    } catch (error) {
      console.error("Error loading customers with debt:", error)
    }
  }

  const handleSendReminder = (customer: Customer) => {
    setSelectedDebtor(customer)
    setIsReminderDialogOpen(true)
  }

  const handleRecordPayment = (customerId: string) => {
    console.log("Record payment for:", customerId)
  }

  const formatCurrency = (amount: number) => {
    const symbols: Record<string, string> = {
      NGN: "₦",
      USD: "$",
      GBP: "£",
      EUR: "€",
    }
    return `${symbols[currency] || "₦"}${amount.toLocaleString()}`
  }

  // Use props or fallbacks
  const totalRevenue = stats?.totalRevenue || 0
  const activeOrders = stats?.activeOrders || 0
  const totalCustomers = stats?.totalCustomers || 0
  const recentOrders = stats?.recentOrders || []
  const avgProcessingTime = 2.4 // Still mock for now
  const totalDebt = customers.reduce((sum, customer) => sum + customer.outstanding_debt, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-600">Welcome back! Here's your business summary</p>
        </div>
        <div className="flex space-x-3">
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
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-teal-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15.3%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Debt</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalDebt)}</div>
            <p className="text-xs text-muted-foreground">{customers.length} customers owing</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Processing Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProcessingTime} days</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">+0.2 days</span> from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="monthly" value={timeframe} onValueChange={setTimeframe}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weekly">Weekly Sales</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Sales</TabsTrigger>
          <TabsTrigger value="yearly">Yearly Sales</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Revenue Breakdown</CardTitle>
              <CardDescription>Current month weekly performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={weeklySalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" />
                  <Bar dataKey="orders" fill="#0EA5E9" name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Comparison</CardTitle>
              <CardDescription>Year-over-year monthly performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlySalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue2024" stroke="#8B5CF6" name="2024 Revenue" strokeWidth={2} />
                  <Line type="monotone" dataKey="revenue2025" stroke="#3B82F6" name="2025 Revenue" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yearly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Yearly Growth Trend</CardTitle>
              <CardDescription>Annual revenue and order volume</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={yearlySalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Ranking Products by Revenue</CardTitle>
            <CardDescription>Best performing services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{formatCurrency(product.revenue)}</p>
                    <p className="text-xs text-green-600">{product.trend}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Ordered Products</CardTitle>
            <CardDescription>Products by order frequency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mostOrderedProducts.map((product) => (
                <div
                  key={product.rank}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary" className="w-8 h-8 flex items-center justify-center">
                      #{product.rank}
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">Avg {product.avgPerOrder} items per order</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-teal-600">{product.timesOrdered}</p>
                    <p className="text-xs text-gray-500">times ordered</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Customers by Patronage</CardTitle>
          <CardDescription>Highest spending customers with detailed patronage patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCustomers.map((customer, index) => (
              <div key={customer.customerId} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{customer.name}</p>
                      <p className="text-sm text-gray-500">
                        {customer.customerId} • Member since {customer.memberSince}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(customer.totalSpent)}</p>
                    <p className="text-xs text-gray-500">{customer.ordersCount} orders</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Weekly Avg</p>
                    <p className="font-medium text-sm">{formatCurrency(customer.weeklyAvg)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Monthly Avg</p>
                    <p className="font-medium text-sm">{formatCurrency(customer.monthlyAvg)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Yearly Total</p>
                    <p className="font-medium text-sm">{formatCurrency(customer.yearlyTotal)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customers with Outstanding Debts Section */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span>Customers with Outstanding Debts</span>
          </CardTitle>
          <CardDescription>Track and manage overdue payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {customers.length > 0 ? (
              customers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-bold">{customer.full_name}</p>
                        <p className="text-sm text-gray-600">{customer.customer_code}</p>
                        <p className="text-xs text-gray-500">
                          Phone: {customer.phone} {customer.email && `• Email: ${customer.email}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-xl font-bold text-red-600">{formatCurrency(customer.outstanding_debt)}</p>
                      <p className="text-xs text-gray-500">Amount owed</p>
                    </div>
                    <Button size="sm" variant="destructive" onClick={() => handleSendReminder(customer)}>
                      Send Reminder
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleRecordPayment(customer.id)}
                    >
                      Record Payment
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">No customers with outstanding debts</div>
            )}
          </div>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> When payment is received, the system will automatically deduct the amount from the
              customer's outstanding balance and update their account status.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Service Distribution</CardTitle>
            <CardDescription>Breakdown of services by volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer orders and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium text-sm">{order.customer}</p>
                      <p className="text-xs text-gray-500">
                        {order.id} • {order.service}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant={
                        order.status === "Delivered"
                          ? "default"
                          : order.status === "Ready"
                            ? "secondary"
                            : order.status === "In Progress"
                              ? "outline"
                              : "destructive"
                      }
                    >
                      {order.status}
                    </Badge>
                    <span className="font-bold text-blue-600">{formatCurrency(order.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <ShoppingCart className="w-4 h-4 mr-2" />
              New Order
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Package className="w-4 h-4 mr-2" />
              Update Inventory
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Debt Reminder Dialog */}
      {selectedDebtor && (
        <DebtReminderDialog
          customer={selectedDebtor}
          isOpen={isReminderDialogOpen}
          onClose={() => {
            setIsReminderDialogOpen(false)
            setSelectedDebtor(null)
            loadCustomersWithDebt() // Refresh the list
          }}
        />
      )}
    </div>
  )
}
