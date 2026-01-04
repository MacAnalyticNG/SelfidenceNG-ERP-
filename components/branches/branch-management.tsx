"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building2, Plus, Edit, Users, Phone, Mail, MapPin } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface Branch {
  id: string
  name: string
  address: string | null
  phone: string | null
  email: string | null
  is_active: boolean
  created_at: string
}

interface BranchUser {
  id: string
  full_name: string
  email: string
  role: string
}

interface BranchManagementProps {
  currentUser: {
    role: string
    branch_id: string | null
  }
}

export function BranchManagement({ currentUser }: BranchManagementProps) {
  const [branches, setBranches] = useState<Branch[]>([])
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [branchUsers, setBranchUsers] = useState<BranchUser[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isUsersDialogOpen, setIsUsersDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  })

  const supabase = createClient()
  const isSuperAdmin = currentUser.role === "super_admin"

  useEffect(() => {
    loadBranches()
  }, [])

  const loadBranches = async () => {
    try {
      const { data, error } = await supabase.from("branches").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setBranches(data || [])
    } catch (error) {
      console.error("Error loading branches:", error)
      toast.error("Failed to load branches")
    }
  }

  const loadBranchUsers = async (branchId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, full_name, email, role")
        .eq("branch_id", branchId)

      if (error) throw error
      setBranchUsers(data || [])
    } catch (error) {
      console.error("Error loading branch users:", error)
      toast.error("Failed to load branch users")
    }
  }

  const handleAddBranch = async () => {
    if (!formData.name.trim()) {
      toast.error("Branch name is required")
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.from("branches").insert([
        {
          name: formData.name,
          address: formData.address || null,
          phone: formData.phone || null,
          email: formData.email || null,
        },
      ])

      if (error) throw error

      toast.success("Branch added successfully")
      setIsAddDialogOpen(false)
      setFormData({ name: "", address: "", phone: "", email: "" })
      loadBranches()
    } catch (error) {
      console.error("Error adding branch:", error)
      toast.error("Failed to add branch")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateBranch = async () => {
    if (!selectedBranch || !formData.name.trim()) {
      toast.error("Branch name is required")
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from("branches")
        .update({
          name: formData.name,
          address: formData.address || null,
          phone: formData.phone || null,
          email: formData.email || null,
        })
        .eq("id", selectedBranch.id)

      if (error) throw error

      toast.success("Branch updated successfully")
      setIsEditDialogOpen(false)
      setSelectedBranch(null)
      setFormData({ name: "", address: "", phone: "", email: "" })
      loadBranches()
    } catch (error) {
      console.error("Error updating branch:", error)
      toast.error("Failed to update branch")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleBranchStatus = async (branchId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("branches").update({ is_active: !currentStatus }).eq("id", branchId)

      if (error) throw error

      toast.success(`Branch ${!currentStatus ? "activated" : "deactivated"} successfully`)
      loadBranches()
    } catch (error) {
      console.error("Error toggling branch status:", error)
      toast.error("Failed to update branch status")
    }
  }

  const openEditDialog = (branch: Branch) => {
    setSelectedBranch(branch)
    setFormData({
      name: branch.name,
      address: branch.address || "",
      phone: branch.phone || "",
      email: branch.email || "",
    })
    setIsEditDialogOpen(true)
  }

  const openUsersDialog = (branch: Branch) => {
    setSelectedBranch(branch)
    loadBranchUsers(branch.id)
    setIsUsersDialogOpen(true)
  }

  if (!isSuperAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Branch Information</CardTitle>
          <CardDescription>You don't have permission to manage branches</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="w-5 h-5" />
                <span>Branch Management</span>
              </CardTitle>
              <CardDescription>Manage multiple branches and assign admins</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Branch
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Branch</DialogTitle>
                  <DialogDescription>Create a new branch location for your business</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="branch-name">Branch Name *</Label>
                    <Input
                      id="branch-name"
                      placeholder="Main Branch"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="branch-address">Address</Label>
                    <Input
                      id="branch-address"
                      placeholder="123 Main Street"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="branch-phone">Phone</Label>
                    <Input
                      id="branch-phone"
                      placeholder="+234 800 000 0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="branch-email">Email</Label>
                    <Input
                      id="branch-email"
                      type="email"
                      placeholder="branch@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddBranch} disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add Branch"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Branch Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell className="font-medium">{branch.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      {branch.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span>{branch.phone}</span>
                        </div>
                      )}
                      {branch.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span>{branch.email}</span>
                        </div>
                      )}
                      {branch.address && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-xs">{branch.address}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={branch.is_active ? "default" : "secondary"}>
                      {branch.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(branch.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => openUsersDialog(branch)}>
                        <Users className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(branch)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toggleBranchStatus(branch.id, branch.is_active)}>
                        {branch.is_active ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Branch Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Branch</DialogTitle>
            <DialogDescription>Update branch information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-branch-name">Branch Name *</Label>
              <Input
                id="edit-branch-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-branch-address">Address</Label>
              <Input
                id="edit-branch-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-branch-phone">Phone</Label>
              <Input
                id="edit-branch-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-branch-email">Email</Label>
              <Input
                id="edit-branch-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBranch} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Branch"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Branch Users Dialog */}
      <Dialog open={isUsersDialogOpen} onOpenChange={setIsUsersDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Branch Users - {selectedBranch?.name}</DialogTitle>
            <DialogDescription>View and manage users assigned to this branch</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {branchUsers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {branchUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {user.role.replace("_", " ")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">No users assigned to this branch</div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUsersDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
