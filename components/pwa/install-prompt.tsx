"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, X } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setShowPrompt(false)
    }
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <Card className="shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start justify-between space-x-4">
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">Install CleanPro ERP</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Install our app for offline access and better performance
              </p>
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleInstall}>
                  <Download className="w-3 h-3 mr-2" />
                  Install
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowPrompt(false)}>
                  Not now
                </Button>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="p-1" onClick={() => setShowPrompt(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
