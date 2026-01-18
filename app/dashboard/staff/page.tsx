import { createServerClient } from "@/lib/supabase/server"
import { StaffScheduling } from "@/components/staff/staff-scheduling"

export default async function StaffPage() {
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

    return <StaffScheduling user={user} />
}
