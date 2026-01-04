import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { DashboardLayoutClient } from "@/components/layout/dashboard-layout-client"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createServerClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/auth/login")
    }

    // Fetch additional user details including branch info if needed
    // For now, we'll mock the structure or perform a DB fetch if the table exists

    // Try to fetch profile/branch info. 
    // Since we might not have the table yet, we'll construct a safe user object.
    // Ideally this would be: 
    // const { data: profile } = await supabase.from('profiles').select('*, branches(*)').eq('id', user.id).single()

    const userWithProfile = {
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || "User",
        role: "admin", // Defaulting for now until profile table is confirmed
        branch_id: null,
        branches: null
    }

    return (
        <DashboardLayoutClient user={userWithProfile}>
            {children}
        </DashboardLayoutClient>
    )
}
