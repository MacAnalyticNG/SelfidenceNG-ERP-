import { createServerClient } from "@/lib/supabase/server"
import { BillingPayments } from "@/components/billing/billing-payments"

export default async function BillingPage() {
    const supabase = await createServerClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    const { data: profile } = await supabase
        .from('profiles')
        .select('*, branches(id, name)')
        .eq('id', authUser?.id)
        .single()

    const user = {
        id: authUser?.id || '',
        email: authUser?.email || '',
        full_name: profile?.full_name || '',
        role: profile?.role || 'staff',
        branch_id: profile?.branch_id || null,
        branches: profile?.branches
    }

    return <BillingPayments user={user} />
}
