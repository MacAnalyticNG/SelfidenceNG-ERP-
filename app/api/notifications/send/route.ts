import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, orderId, customerName, customerPhone, customerEmail, status } = body

    switch (type) {
      case "whatsapp":
        // Integration with Twilio or similar WhatsApp API
        console.log(`[v0] Sending WhatsApp to ${customerPhone}`)
        break
      case "sms":
        // Integration with SMS API (e.g., Twilio, AWS SNS)
        console.log(`[v0] Sending SMS to ${customerPhone}`)
        break
      case "email":
        // Integration with email service (e.g., SendGrid, Resend)
        console.log(`[v0] Sending email to ${customerEmail}`)
        break
    }

    // Log notification in database
    const supabase = await createServerClient()
    const { error } = await supabase.from("notification_logs").insert({
      order_id: orderId,
      customer_name: customerName,
      notification_type: type,
      status,
      sent_at: new Date().toISOString(),
    })

    if (error) {
      console.error("[v0] Database error:", error)
      return Response.json({ error: "Failed to log notification" }, { status: 500 })
    }

    return Response.json({ success: true, message: "Notification sent" })
  } catch (error) {
    console.error("[v0] Notification error:", error)
    return Response.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
