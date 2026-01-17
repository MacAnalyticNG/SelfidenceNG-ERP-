import { format } from "date-fns"
import { Printer } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InvoiceProps {
    order: {
        id: string
        created_at: string
        due_date: string
        status: string
        total_amount: number
        customer: {
            full_name: string
            email: string | null
            phone: string | null
            address: string | null
        }
        items: {
            quantity: number
            unit_price: number
            total_price: number
            service: {
                name: string
                category: string
            }
        }[]
    }
}

export function InvoiceTemplate({ order }: InvoiceProps) {
    return (
        <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg print:shadow-none print:p-0">
            {/* Header / Actions */}
            <div className="flex justify-between items-start mb-8 print:hidden">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Invoice #{order.id}</h1>
                    <p className="text-sm text-gray-500">View and print invoice</p>
                </div>
                <Button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700">
                    <Printer className="w-4 h-4 mr-2" />
                    Print Invoice
                </Button>
            </div>

            {/* Invoice Content */}
            <div className="border rounded-lg p-8 print:border-none print:p-0">
                {/* Company Info */}
                <div className="flex justify-between items-center mb-8 pb-8 border-b">
                    <div>
                        <h2 className="text-2xl font-bold text-blue-600">Laundry ERP</h2>
                        <p className="text-gray-500 text-sm mt-1">Premium Laundry Services</p>
                        <p className="text-gray-500 text-sm">123 Clean Street, Wash City</p>
                        <p className="text-gray-500 text-sm">contact@laundryerp.com</p>
                    </div>
                    <div className="text-right">
                        <h3 className="text-xl font-semibold text-gray-900">INVOICE</h3>
                        <p className="text-gray-500 font-medium">#{order.id}</p>
                        <div className="mt-2">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ${order.status === 'paid' ? 'bg-green-100 text-green-800' :
                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                {order.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bill To & Dates */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Bill To</h4>
                        <p className="font-bold text-gray-900">{order.customer.full_name}</p>
                        {order.customer.email && <p className="text-gray-600 text-sm">{order.customer.email}</p>}
                        {order.customer.phone && <p className="text-gray-600 text-sm">{order.customer.phone}</p>}
                        {order.customer.address && <p className="text-gray-600 text-sm mt-1 max-w-xs">{order.customer.address}</p>}
                    </div>
                    <div className="text-right space-y-2">
                        <div className="flex justify-between md:justify-end md:space-x-8">
                            <span className="text-gray-500 text-sm">Invoice Date:</span>
                            <span className="font-medium text-gray-900">{format(new Date(order.created_at), "MMM dd, yyyy")}</span>
                        </div>
                        <div className="flex justify-between md:justify-end md:space-x-8">
                            <span className="text-gray-500 text-sm">Due Date:</span>
                            <span className="font-medium text-gray-900">{format(new Date(order.due_date), "MMM dd, yyyy")}</span>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="text-left py-3 text-sm font-semibold text-gray-600">Item / Service</th>
                                <th className="text-center py-3 text-sm font-semibold text-gray-600">Qty</th>
                                <th className="text-right py-3 text-sm font-semibold text-gray-600">Unit Price</th>
                                <th className="text-right py-3 text-sm font-semibold text-gray-600">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {order.items.map((item, index) => (
                                <tr key={index}>
                                    <td className="py-4">
                                        <p className="font-medium text-gray-900">{item.service.name}</p>
                                        <p className="text-xs text-gray-500">{item.service.category}</p>
                                    </td>
                                    <td className="text-center py-4 text-gray-600">{item.quantity}</td>
                                    <td className="text-right py-4 text-gray-600">${item.unit_price.toFixed(2)}</td>
                                    <td className="text-right py-4 font-medium text-gray-900">${item.total_price.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end border-t pt-8">
                    <div className="w-64 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-medium text-gray-900">${order.total_amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Tax (0%)</span>
                            <span className="font-medium text-gray-900">$0.00</span>
                        </div>
                        <div className="flex justify-between border-t pt-3">
                            <span className="text-base font-bold text-gray-900">Total</span>
                            <span className="text-Base font-bold text-blue-600">${order.total_amount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t text-center text-sm text-gray-500">
                    <p>Thank you for your business!</p>
                    <p className="mt-1">For questions concerning this invoice, please contact support.</p>
                </div>
            </div>
        </div>
    )
}
