"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Mail, MessageSquare, Send } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface Customer {
  id: string
  full_name: string
  email: string | null
  phone: string
  outstanding_debt: number
}

interface DebtReminderDialogProps {
  customer: Customer
  isOpen: boolean
  onClose: () => void
}

export function DebtReminderDialog({ customer, isOpen, onClose }: DebtReminderDialogProps) {
  const [reminderType, setReminderType] = useState<"email" | "sms" | "whatsapp">("whatsapp")
  const [message, setMessage] = useState(
    `Hello ${customer.full_name},\n\nThis is a friendly reminder that you have an outstanding balance of ₦${customer.outstanding_debt.toLocaleString()}.\n\nPlease make payment at your earliest convenience.\n\nThank you,\nCleanPro Laundry`,
  )
  const [isSending, setIsSending] = useState(false)

  const supabase = createClient()

  const handleSendReminder = async () => {
    setIsSending(true)

    try {
      // Validate contact info
      if (reminderType === "email" && !customer.email) {
        toast.error("Customer has no email address on file")
        return
      }
      if ((reminderType === "sms" || reminderType === "whatsapp") && !customer.phone) {
        toast.error("Customer has no phone number on file")
        return
      }

      // Send reminder via API
      const response = await fetch("/api/reminders/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customer.id,
          type: reminderType,
          message,
          amount: customer.outstanding_debt,
          recipient: reminderType === "email" ? customer.email : customer.phone,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send reminder")
      }

      // Log reminder in database
      const { error } = await supabase.from("debt_reminders").insert({
        customer_id: customer.id,
        reminder_type: reminderType,
        amount: customer.outstanding_debt,
        message,
      })

      if (error) throw error

      toast.success(`Reminder sent via ${reminderType.toUpperCase()}`)
      onClose()
    } catch (error) {
      console.error("Error sending reminder:", error)
      toast.error("Failed to send reminder")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send Debt Reminder</DialogTitle>
          <DialogDescription>
            Send a payment reminder to {customer.full_name} for ₦{customer.outstanding_debt.toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Reminder Type Selection */}
          <div className="space-y-3">
            <Label>Select Reminder Method</Label>
            <RadioGroup value={reminderType} onValueChange={(value: string) => setReminderType(value as any)}>
              <div className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="whatsapp" id="whatsapp" />
                <Label htmlFor="whatsapp" className="flex items-center space-x-2 cursor-pointer flex-1">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium">WhatsApp</div>
                    <div className="text-xs text-muted-foreground">Send via WhatsApp to {customer.phone}</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="sms" id="sms" />
                <Label htmlFor="sms" className="flex items-center space-x-2 cursor-pointer flex-1">
                  <Send className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium">SMS</div>
                    <div className="text-xs text-muted-foreground">Send text message to {customer.phone}</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email" className="flex items-center space-x-2 cursor-pointer flex-1">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-xs text-muted-foreground">
                      Send email to {customer.email || "No email on file"}
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Message Editor */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your reminder message..."
            />
            <p className="text-xs text-muted-foreground">{message.length} characters</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSending}>
            Cancel
          </Button>
          <Button onClick={handleSendReminder} disabled={isSending}>
            {isSending ? "Sending..." : `Send via ${reminderType.toUpperCase()}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
