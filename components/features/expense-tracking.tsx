"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, TrendingUp } from "lucide-react"

interface Expense {
  id: string
  category: "supplies" | "utilities" | "maintenance" | "wages" | "other"
  amount: number
  description: string
  date: string
}

export function ExpenseTracking() {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      category: "supplies",
      amount: 5000,
      description: "Laundry detergent & fabric softener",
      date: "2024-01-15",
    },
    { id: "2", category: "utilities", amount: 15000, description: "Monthly electricity bill", date: "2024-01-01" },
    { id: "3", category: "maintenance", amount: 8000, description: "Machine repair service", date: "2024-01-10" },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ category: "supplies", amount: "", description: "" })

  const handleAddExpense = () => {
    if (formData.amount && formData.description) {
      setExpenses([
        ...expenses,
        {
          id: Date.now().toString(),
          category: formData.category as Expense["category"],
          amount: Number.parseFloat(formData.amount),
          description: formData.description,
          date: new Date().toISOString().split("T")[0],
        },
      ])
      setFormData({ category: "supplies", amount: "", description: "" })
      setIsDialogOpen(false)
    }
  }

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id))
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const categoryTotals = expenses.reduce(
    (acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Expense Tracking
          </CardTitle>
          <CardDescription>Monitor and manage business expenses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600">Total Expenses</p>
              <p className="text-lg font-bold text-red-600">₦{totalExpenses.toLocaleString()}</p>
            </div>
            {Object.entries(categoryTotals).map(([category, total]) => (
              <div key={category} className="bg-blue-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 capitalize">{category}</p>
                <p className="text-lg font-bold text-blue-600">₦{total.toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Add Expense Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>Record a new business expense</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="supplies">Cleaning Supplies</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="wages">Wages</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount (₦)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    placeholder="What is this expense for?"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddExpense} className="w-full">
                  Add Expense
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Expenses Table */}
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="text-sm">{expense.date}</TableCell>
                    <TableCell className="capitalize text-sm">{expense.category}</TableCell>
                    <TableCell className="text-sm">{expense.description}</TableCell>
                    <TableCell className="text-right font-medium">₦{expense.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteExpense(expense.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
