"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
              <WifiOff className="w-6 h-6 text-gray-600" />
            </div>
            <CardTitle className="text-2xl font-bold">You're Offline</CardTitle>
            <CardDescription>No internet connection detected</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Some features may be limited while offline. Your data will be synced when you reconnect.
            </p>
            <Button
              className="w-full"
              onClick={() => {
                window.location.reload()
              }}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
