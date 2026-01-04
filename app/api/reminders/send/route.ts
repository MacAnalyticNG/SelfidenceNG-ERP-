import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { customerId, type, message, amount, recipient } = await request.json()

    // Validate input
    if (!customerId || !type || !message || !recipient) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Send reminder based on type
    switch (type) {
      case "whatsapp":
        await sendWhatsAppReminder(recipient, message)
        break
      case "sms":
        await sendSMSReminder(recipient, message)
        break
      case "email":
        await sendEmailReminder(recipient, message)
        break
      default:
        return NextResponse.json({ error: "Invalid reminder type" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending reminder:", error)
    return NextResponse.json({ error: "Failed to send reminder" }, { status: 500 })
  }
}

async function sendWhatsAppReminder(phone: string, message: string) {
  // Integration with WhatsApp Business API or third-party service like Twilio
  // For demo purposes, we'll just log it
  console.log(`[v0] WhatsApp reminder to ${phone}: ${message}`)

  // Example with Twilio (uncomment when you have credentials):
  /*
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: `whatsapp:${twilioWhatsAppNumber}`,
        To: `whatsapp:${phone}`,
        Body: message,
      }),
    }
  )

  if (!response.ok) {
    throw new Error('Failed to send WhatsApp message')
  }
  */
}

async function sendSMSReminder(phone: string, message: string) {
  // Integration with SMS service like Twilio, Vonage, or local SMS gateway
  console.log(`[v0] SMS reminder to ${phone}: ${message}`)

  // Example with Twilio (uncomment when you have credentials):
  /*
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: twilioPhoneNumber,
        To: phone,
        Body: message,
      }),
    }
  )

  if (!response.ok) {
    throw new Error('Failed to send SMS')
  }
  */
}

async function sendEmailReminder(email: string, message: string) {
  // Integration with email service like SendGrid, Resend, or SMTP
  console.log(`[v0] Email reminder to ${email}: ${message}`)

  // Example with Resend (uncomment when you have API key):
  /*
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'CleanPro Laundry <noreply@cleanpro.com>',
      to: email,
      subject: 'Payment Reminder',
      text: message,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to send email')
  }
  */
}
