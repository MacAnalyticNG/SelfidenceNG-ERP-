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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Plus,
  Download,
  CreditCard,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Receipt,
  Banknote,
} from "lucide-react"

const invoices = [
  {
    id: "INV-001",
    orderId: "ORD-001",
    customer: "Mrs. Adebayo Oluwaseun",
    customerId: "CUST-001",
    amount: 45000,
    tax: 3600,
    total: 48600,
    status: "Paid",
    paymentMethod: "Bank Transfer",
    issueDate: "2025-01-15",
    dueDate: "2025-01-22",
    paidDate: "2025-01-16",
    services: ["C-Agbada Buba (Lace)", "Pressing"],
  },
  {
    id: "INV-002",
    orderId: "ORD-002",
    customer: "Chief Okonkwo Emmanuel",
    customerId: "CUST-002",
    amount: 25000,
    tax: 2000,
    total: 27000,
    status: "Pending",
    paymentMethod: null,
    issueDate: "2025-01-12",
    dueDate: "2025-01-19",
    paidDate: null,
    services: ["Standard Laundry", "Folding"],
  },
  {
    id: "INV-003",
    orderId: "ORD-003",
    customer: "Alhaji Musa Ibrahim",
    customerId: "CUST-003",
    amount: 15000,
    tax: 1200,
    total: 16200,
    status: "Overdue",
    paymentMethod: null,
    issueDate: "2024-12-08",
    dueDate: "2024-12-15",
    paidDate: null,
    services: ["Professional Ironing"],
  },
  {
    id: "INV-004",
    orderId: "ORD-004",
    customer: "Dr. Chioma Nwankwo",
    customerId: "CUST-004",
    amount: 32000,
    tax: 2560,
    total: 34560,
    status: "Overdue",
    paymentMethod: null,
    issueDate: "2024-12-20",
    dueDate: "2024-12-27",
    paidDate: null,
    services: ["Aso Oke Complete", "Native Cap"],
  },
]

const payments = [
  {
    id: "PAY-001",
    invoiceId: "INV-001",
    customer: "Mrs. Adebayo Oluwaseun",
    amount: 48600,
    method: "Bank Transfer",
    status: "Completed",
    date: "2025-01-16",
    transactionId: "TXN-12345",
    reference: "GTB-****4567",
  },
  {
    id: "PAY-002",
    invoiceId: "INV-005",
    customer: "Pastor David Adeleke",
    amount: 65000,
    method: "Cash",
    status: "Completed",
    date: "2025-01-14",
    transactionId: "TXN-12346",
    reference: "CASH-001",
  },
  {
    id: "PAY-003",
    invoiceId: "INV-006",
    customer: "Engr. Bello Yakubu",
    amount: 18500,
    method: "POS",
    status: "Completed",
    date: "2025-01-18",
    transactionId: "TXN-12347",
    reference: "POS-****8901",
  },
]

export function BillingPayments() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateInvoiceDialogOpen, setIsCreateInvoiceDialogOpen] = useState(false)
  const [isRecordPaymentDialogOpen, setIsRecordPaymentDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
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

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || invoice.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "default"
      case "pending":
        return "outline"
      case "overdue":
        return "destructive"
      case "cancelled":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method?.toLowerCase()) {
      case "credit card":
      case "debit card":
        return <CreditCard className="w-4 h-4" />
      case "cash":
        return <DollarSign className="w-4 h-4" />
      case "bank transfer":
        return <Banknote className="w-4 h-4" />
      case "pos":
        return <CreditCard className="w-4 h-4" />
      default:
        return <Receipt className="w-4 h-4" />
    }
  }

  const totalRevenue = invoices.filter((inv) => inv.status === "Paid").reduce((sum, inv) => sum + inv.total, 0)
  const pendingAmount = invoices.filter((inv) => inv.status === "Pending").reduce((sum, inv) => sum + inv.total, 0)
  const overdueAmount = invoices.filter((inv) => inv.status === "Overdue").reduce((sum, inv) => sum + inv.total, 0)
  const totalInvoices = invoices.length

  const handleRecordPayment = (invoice: any) => {
    setSelectedInvoice(invoice)
    setIsRecordPaymentDialogOpen(true)
  }

  const processPayment = () => {
    console.log("[v0] Processing payment for invoice:", selectedInvoice?.id)
    console.log("[v0] Amount to deduct:", selectedInvoice?.total)
    console.log("[v0] Customer debt will be reduced by:", formatCurrency(selectedInvoice?.total))
    // Here the system would:
    // 1. Update invoice status to "Paid"
    // 2. Deduct amount from customer's outstanding balance
    // 3. Update customer's account status
    // 4. Generate payment receipt
    setIsRecordPaymentDialogOpen(false)
    setSelectedInvoice(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Billing & Payments</h2>
          <p className="text-gray-600">Manage invoices, payments, and financial transactions</p>
        </div>
        <div className="flex space-x-2">
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
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={isCreateInvoiceDialogOpen} onOpenChange={setIsCreateInvoiceDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
                <DialogDescription>Generate an invoice for completed services.</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="invoice-customer">Customer</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cust-001">Mrs. Adebayo Oluwaseun</SelectItem>
                      <SelectItem value="cust-002">Chief Okonkwo Emmanuel</SelectItem>
                      <SelectItem value="cust-003">Alhaji Musa Ibrahim</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoice-order">Order</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ord-001">ORD-001</SelectItem>
                      <SelectItem value="ord-002">ORD-002</SelectItem>
                      <SelectItem value="ord-003">ORD-003</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoice-amount">Amount ({currency === "NGN" ? "₦" : "$"})</Label>
                  <Input id="invoice-amount" type="number" step="100" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoice-tax">Tax Rate (%)</Label>
                  <Input id="invoice-tax" type="number" step="0.01" placeholder="8.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input id="due-date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-terms">Payment Terms</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="net-7">Net 7 days</SelectItem>
                      <SelectItem value="net-15">Net 15 days</SelectItem>
                      <SelectItem value="net-30">Net 30 days</SelectItem>
                      <SelectItem value="due-on-receipt">Due on receipt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateInvoiceDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-blue-500 hover:bg-blue-600">Create Invoice</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-l-4 border-l-blue-500 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900">Automatic Debt Management</h3>
              <p className="text-sm text-blue-800">
                When you record a payment, the system automatically deducts the amount from the customer's outstanding
                balance. The customer's debt status updates in real-time, and once the full debt is paid, they are
                removed from the debtors list.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingAmount)}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(overdueAmount)}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold text-blue-600">{totalInvoices}</p>
              </div>
              <Receipt className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="reports">Financial Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search invoices by ID or customer..."
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
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Invoices Table */}
          <Card>
            <CardHeader>
              <CardTitle>Invoices ({filteredInvoices.length})</CardTitle>
              <CardDescription>Complete list of invoices with payment status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{invoice.id}</div>
                          <div className="text-sm text-gray-500">{invoice.orderId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{invoice.customer}</div>
                          <div className="text-sm text-gray-500">{invoice.customerId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {invoice.services.map((service, index) => (
                            <Badge key={index} variant="outline" className="mr-1">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{formatCurrency(invoice.total)}</div>
                          <div className="text-sm text-gray-500">
                            {formatCurrency(invoice.amount)} + {formatCurrency(invoice.tax)} tax
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{invoice.dueDate}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {invoice.paymentMethod && getPaymentMethodIcon(invoice.paymentMethod)}
                          <span className="text-sm">{invoice.paymentMethod || "N/A"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          {(invoice.status === "Pending" || invoice.status === "Overdue") && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleRecordPayment(invoice)}
                            >
                              Record Payment
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Record of all payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="font-medium">{payment.id}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{payment.invoiceId}</div>
                      </TableCell>
                      <TableCell>
                        <div>{payment.customer}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{formatCurrency(payment.amount)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getPaymentMethodIcon(payment.method)}
                          <span>{payment.method}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{payment.date}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">{payment.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500">{payment.reference}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Summary</CardTitle>
                <CardDescription>Monthly revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">Revenue chart would be displayed here</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Distribution of payment methods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Payment method distribution chart would be displayed here
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isRecordPaymentDialogOpen} onOpenChange={setIsRecordPaymentDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record payment for invoice {selectedInvoice?.id}. The amount will be automatically deducted from the
              customer's outstanding balance.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Customer:</span>
                <span className="font-medium">{selectedInvoice?.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Invoice Amount:</span>
                <span className="font-bold text-lg">{formatCurrency(selectedInvoice?.total || 0)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="pos">POS</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="mobile-money">Mobile Money</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-reference">Reference Number</Label>
              <Input id="payment-reference" placeholder="Enter transaction reference" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-date">Payment Date</Label>
              <Input id="payment-date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Recording this payment will automatically reduce the customer's outstanding debt
                by {formatCurrency(selectedInvoice?.total || 0)}.
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsRecordPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={processPayment}>
              Confirm Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
