"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ShieldCheck } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        // If user not found, offer to create account
        if (signInError.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Try the Quick Login button below.")
        } else {
          setError(signInError.message)
        }
        return
      }

      if (data?.session) {
        router.push("/")
        router.refresh()
      }
    } catch (error: unknown) {
      console.error("[v0] Login error:", error)
      setError(error instanceof Error ? error.message : "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAdminLogin = async () => {
    setIsLoading(true)
    setError(null)
    const supabase = createClient()

    try {
      const adminEmail = "admin@laundry.com"
      const adminPassword = "Admin@123456"

      // Try to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword,
      })

      // If user doesn't exist, create the account first
      if (signInError && signInError.message.includes("Invalid login credentials")) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: adminEmail,
          password: adminPassword,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              role: "super_admin",
              first_name: "Super",
              last_name: "Admin",
            },
          },
        })

        if (signUpError) {
          setError(signUpError.message)
          return
        }

        // Now try to sign in
        const { data: retrySignIn, error: retryError } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: adminPassword,
        })

        if (retryError) {
          setError("Account created but login failed. Please try again.")
          return
        }

        if (retrySignIn?.session) {
          router.push("/")
          router.refresh()
        }
      } else if (signInError) {
        setError(signInError.message)
      } else if (signInData?.session) {
        router.push("/")
        router.refresh()
      }
    } catch (error: unknown) {
      console.error("[v0] Admin login error:", error)
      setError(error instanceof Error ? error.message : "Failed to login as super admin")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold">Laundry ERP</CardTitle>
            <CardDescription>Sign in to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Quick Access</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={handleQuickAdminLogin}
                  disabled={isLoading}
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  {isLoading ? "Creating account..." : "Login as Super Admin"}
                </Button>

                <div className="text-xs text-center text-muted-foreground bg-blue-50 p-2 rounded-md">
                  Quick login will auto-create super admin account if needed
                </div>
              </div>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-primary underline underline-offset-4 hover:text-primary/80">
                  Create account
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
