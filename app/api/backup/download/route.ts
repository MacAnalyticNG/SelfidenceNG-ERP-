import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const backupId = request.nextUrl.searchParams.get("id")

    if (!backupId) {
      return NextResponse.json({ error: "Backup ID required" }, { status: 400 })
    }

    // Download backup logic here
    // In production, this would retrieve the backup file from storage

    console.log(`[v0] Downloading backup: ${backupId}`)

    // Simulate backup file
    const backupData = "-- SQL Backup File\n-- Generated at: " + new Date().toISOString()
    const blob = new Blob([backupData], { type: "application/sql" })

    return new NextResponse(blob, {
      headers: {
        "Content-Type": "application/sql",
        "Content-Disposition": `attachment; filename="backup-${backupId}.sql"`,
      },
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Failed to download backup" }, { status: 500 })
  }
}
