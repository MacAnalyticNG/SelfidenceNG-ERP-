"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"

interface QRReceiptProps {
  orderId: string
  customerName: string
  amount: number
  date: string
}

export function QRReceipt({ orderId, customerName, amount, date }: QRReceiptProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const generateQR = async () => {
      const QRCode = (await import("qrcode")).default
      const qrData = `LAUNDRY-${orderId}-${customerName}`

      if (canvasRef.current) {
        QRCode.toCanvas(canvasRef.current, qrData, { width: 200 }, (error) => {
          if (error) console.error("QR Code generation error:", error)
        })
      }
    }
    generateQR()
  }, [orderId, customerName])

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const link = document.createElement("a")
      link.href = canvas.toDataURL("image/png")
      link.download = `receipt-${orderId}.png`
      link.click()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Receipt & Tracking</CardTitle>
        <CardDescription>Share this QR code with the customer for order tracking</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-4 p-6 bg-gray-50 rounded-lg">
          <canvas ref={canvasRef} />
          <div className="text-center space-y-2">
            <p className="text-sm font-medium">Order ID: {orderId}</p>
            <p className="text-sm text-gray-600">{customerName}</p>
            <p className="text-lg font-bold">₦{amount.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{date}</p>
          </div>
        </div>
        <div className="flex gap-2 justify-center">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
