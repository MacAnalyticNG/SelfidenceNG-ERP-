"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Mail, Phone } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface OrderNotificationProps {
  orderId: string
  customerName: string
  customerPhone: string
  customerEmail: string
  status: string
}

export function OrderNotification({
  orderId,
  customerName,
  customerPhone,
  customerEmail,
  status,
}: OrderNotificationProps) {
  const [notificationSent, setNotificationSent] = useState(false)
  const [sendingType, setSendingType] = useState<"whatsapp" | "sms" | "email" | null>(null)

  const sendNotification = async (type: "whatsapp" | "sms" | "email") => {
    setSendingType(type)
    try {
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          orderId,
          customerName,
          customerPhone,
          customerEmail,
          status,
        }),
      })

      if (response.ok) {
        setNotificationSent(true)
        setTimeout(() => setNotificationSent(false), 3000)
      }
    } catch (error) {
      console.error("[v0] Notification error:", error)
    } finally {
      setSendingType(null)
    }
  }

  const statusMessages = {
    pending: "Your order has been received and is pending processing.",
    in_progress: "Your order is currently being processed. Thank you for your patience.",
    ready: "Your order is ready for pickup!",
    delivered: "Your order has been delivered. Thank you for using our service!",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Status Update</CardTitle>
        <CardDescription>Notify customer about order {orderId}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm font-medium mb-2">Message Preview:</p>
          <p className="text-sm text-gray-700">
            {statusMessages[status as keyof typeof statusMessages] || "Order status update"}
          </p>
        </div>

        <Tabs defaultValue="whatsapp" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>

          <TabsContent value="whatsapp" className="space-y-3 mt-4">
            <p className="text-sm text-gray-600">Send via WhatsApp to {customerPhone}</p>
            <Button
              onClick={() => sendNotification("whatsapp")}
              disabled={sendingType !== null}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              {sendingType === "whatsapp" ? "Sending..." : "Send via WhatsApp"}
            </Button>
          </TabsContent>

          <TabsContent value="sms" className="space-y-3 mt-4">
            <p className="text-sm text-gray-600">Send SMS to {customerPhone}</p>
            <Button
              onClick={() => sendNotification("sms")}
              disabled={sendingType !== null}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              <Phone className="w-4 h-4 mr-2" />
              {sendingType === "sms" ? "Sending..." : "Send via SMS"}
            </Button>
          </TabsContent>

          <TabsContent value="email" className="space-y-3 mt-4">
            <p className="text-sm text-gray-600">Send to {customerEmail}</p>
            <Button
              onClick={() => sendNotification("email")}
              disabled={sendingType !== null}
              className="w-full bg-purple-500 hover:bg-purple-600"
            >
              <Mail className="w-4 h-4 mr-2" />
              {sendingType === "email" ? "Sending..." : "Send via Email"}
            </Button>
          </TabsContent>
        </Tabs>

        {notificationSent && (
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg flex items-center gap-2">
            <Badge className="bg-green-600">Sent</Badge>
            <span className="text-sm text-green-800">Notification sent successfully!</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
