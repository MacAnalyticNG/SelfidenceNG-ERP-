import { createServerClient } from "@/lib/supabase/server"
import { LaundryERPClient } from "@/components/laundry-erp-client"

interface LaundryERPServerProps {
  userId: string
}

export async function LaundryERPServer({ userId }: LaundryERPServerProps) {
  const supabase = await createServerClient()

  const { data: userProfile } = await supabase.from("users").select("*, branches(*)").eq("id", userId).single()

  if (!userProfile) {
    return <div>User profile not found</div>
  }

  return <LaundryERPClient user={userProfile} />
}
