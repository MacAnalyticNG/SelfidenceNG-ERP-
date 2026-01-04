"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Database,
  Cloud,
  Download,
  Upload,
  CheckCircle2,
  Clock,
  HardDrive,
  Server,
  CloudDownload,
  Calendar,
} from "lucide-react"
import { toast } from "sonner"

interface BackupRecord {
  id: string
  name: string
  size: string
  date: string
  type: string
  status: string
}

interface BackupManagerProps {
  currentUser: {
    role: string
  }
}

export function BackupManager({ currentUser }: BackupManagerProps) {
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true)
  const [backupFrequency, setBackupFrequency] = useState("daily")
  const [cloudProvider, setCloudProvider] = useState("none")
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [backupProgress, setBackupProgress] = useState(0)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [exportFormat, setExportFormat] = useState("json")

  const isSuperAdmin = currentUser.role === "super_admin"

  const backupHistory: BackupRecord[] = [
    {
      id: "1",
      name: "Full Database Backup",
      size: "245 MB",
      date: "2025-01-19 02:00 AM",
      type: "Auto",
      status: "Completed",
    },
    {
      id: "2",
      name: "Full Database Backup",
      size: "242 MB",
      date: "2025-01-18 02:00 AM",
      type: "Auto",
      status: "Completed",
    },
    {
      id: "3",
      name: "Manual Backup",
      size: "241 MB",
      date: "2025-01-17 03:45 PM",
      type: "Manual",
      status: "Completed",
    },
    {
      id: "4",
      name: "Full Database Backup",
      size: "238 MB",
      date: "2025-01-17 02:00 AM",
      type: "Auto",
      status: "Completed",
    },
    {
      id: "5",
      name: "Full Database Backup",
      size: "235 MB",
      date: "2025-01-16 02:00 AM",
      type: "Auto",
      status: "Completed",
    },
  ]

  const handleManualBackup = async () => {
    setIsBackingUp(true)
    setBackupProgress(0)

    try {
      // Simulate backup progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 300))
        setBackupProgress(i)
      }

      // Call backup API
      const response = await fetch("/api/backup/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "manual",
          cloudProvider: cloudProvider !== "none" ? cloudProvider : null,
        }),
      })

      if (!response.ok) throw new Error("Backup failed")

      toast.success("Backup completed successfully")
    } catch (error) {
      console.error("Backup error:", error)
      toast.error("Backup failed")
    } finally {
      setIsBackingUp(false)
      setBackupProgress(0)
    }
  }

  const handleExportData = async () => {
    try {
      toast.loading("Preparing export...")

      const response = await fetch("/api/backup/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format: exportFormat }),
      })

      if (!response.ok) throw new Error("Export failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `cleanpro-export-${Date.now()}.${exportFormat}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("Data exported successfully")
      setShowExportDialog(false)
    } catch (error) {
      console.error("Export error:", error)
      toast.error("Export failed")
    }
  }

  const handleRestoreBackup = async (backupId: string) => {
    const confirmed = window.confirm("Are you sure you want to restore this backup? This will replace current data.")
    if (!confirmed) return

    try {
      toast.loading("Restoring backup...")

      const response = await fetch("/api/backup/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ backupId }),
      })

      if (!response.ok) throw new Error("Restore failed")

      toast.success("Backup restored successfully")
      window.location.reload()
    } catch (error) {
      console.error("Restore error:", error)
      toast.error("Restore failed")
    }
  }

  const handleDownloadBackup = async (backupId: string, name: string) => {
    try {
      toast.loading("Downloading backup...")

      const response = await fetch(`/api/backup/download?id=${backupId}`)
      if (!response.ok) throw new Error("Download failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${name}-${backupId}.sql`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("Backup downloaded")
    } catch (error) {
      console.error("Download error:", error)
      toast.error("Download failed")
    }
  }

  if (!isSuperAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Data Backup & Synchronization</CardTitle>
          <CardDescription>You don't have permission to manage backups</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Backup Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Automatic Backup Settings</span>
          </CardTitle>
          <CardDescription>Configure automatic backup schedule and storage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Automatic Backups</Label>
              <p className="text-sm text-muted-foreground">Automatically backup data on schedule</p>
            </div>
            <Switch checked={autoBackupEnabled} onCheckedChange={setAutoBackupEnabled} />
          </div>

          {autoBackupEnabled && (
            <>
              <div className="space-y-2">
                <Label>Backup Frequency</Label>
                <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Every Hour</SelectItem>
                    <SelectItem value="daily">Daily at 2:00 AM</SelectItem>
                    <SelectItem value="weekly">Weekly (Sunday 2:00 AM)</SelectItem>
                    <SelectItem value="monthly">Monthly (1st day 2:00 AM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cloud Storage Provider</Label>
                <Select value={cloudProvider} onValueChange={setCloudProvider}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Local Storage Only</SelectItem>
                    <SelectItem value="google-drive">Google Drive</SelectItem>
                    <SelectItem value="dropbox">Dropbox</SelectItem>
                    <SelectItem value="onedrive">OneDrive</SelectItem>
                    <SelectItem value="aws-s3">AWS S3</SelectItem>
                    <SelectItem value="azure">Azure Blob Storage</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {cloudProvider !== "none"
                    ? `Backups will be automatically synced to ${cloudProvider.replace("-", " ")}`
                    : "Backups will only be stored locally"}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Manual Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HardDrive className="w-5 h-5" />
            <span>Manual Backup</span>
          </CardTitle>
          <CardDescription>Create a backup of your data right now</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isBackingUp && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Backup in progress...</span>
                <span>{backupProgress}%</span>
              </div>
              <Progress value={backupProgress} className="w-full" />
            </div>
          )}

          <div className="flex space-x-3">
            <Button onClick={handleManualBackup} disabled={isBackingUp} className="flex-1">
              <Database className="w-4 h-4 mr-2" />
              {isBackingUp ? "Backing up..." : "Create Backup Now"}
            </Button>
            <Button variant="outline" onClick={() => setShowExportDialog(true)}>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-center">
              <p className="text-xs text-gray-600">Last Backup</p>
              <p className="font-medium text-sm">2 hours ago</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600">Total Backups</p>
              <p className="font-medium text-sm">{backupHistory.length}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600">Storage Used</p>
              <p className="font-medium text-sm">1.2 GB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Backup History</span>
          </CardTitle>
          <CardDescription>View and restore previous backups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {backupHistory.map((backup) => (
              <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Server className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{backup.name}</p>
                    <p className="text-sm text-gray-500">
                      {backup.date} • {backup.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={backup.type === "Auto" ? "secondary" : "default"}>{backup.type}</Badge>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {backup.status}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => handleDownloadBackup(backup.id, backup.name)}>
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleRestoreBackup(backup.id)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Restore
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cloud Sync Status */}
      {cloudProvider !== "none" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Cloud className="w-5 h-5" />
              <span>Cloud Synchronization Status</span>
            </CardTitle>
            <CardDescription>Monitor cloud backup synchronization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium">Connected to {cloudProvider.replace("-", " ")}</p>
                    <p className="text-sm text-gray-600">Last sync: 2 hours ago</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <CloudDownload className="w-4 h-4 mr-2" />
                  Sync Now
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Next Scheduled Sync</span>
                  </div>
                  <p className="text-lg font-bold">Today at 2:00 AM</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Cloud className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Cloud Storage Used</span>
                  </div>
                  <p className="text-lg font-bold">1.2 GB / 15 GB</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Data</DialogTitle>
            <DialogDescription>Choose format and export your data</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON (JavaScript Object Notation)</SelectItem>
                  <SelectItem value="csv">CSV (Comma Separated Values)</SelectItem>
                  <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                  <SelectItem value="sql">SQL Dump</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-4 bg-gray-50 border rounded-lg">
              <p className="text-sm text-gray-600">
                This will export all your data including customers, orders, payments, inventory, and settings.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleExportData}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
