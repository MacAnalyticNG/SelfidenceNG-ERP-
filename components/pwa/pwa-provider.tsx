"use client"

import type React from "react"

import { useEffect } from "react"
import { InstallPrompt } from "./install-prompt"
import { OfflineIndicator } from "./offline-indicator"

export function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("[v0] Service Worker registered:", registration)
          })
          .catch((error) => {
            console.error("[v0] Service Worker registration failed:", error)
          })
      })
    }
  }, [])

  return (
    <>
      {children}
      <InstallPrompt />
      <OfflineIndicator />
    </>
  )
}
