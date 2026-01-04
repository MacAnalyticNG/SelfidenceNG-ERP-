"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Edit, CalendarIcon, Clock, Users, UserCheck } from "lucide-react"

const staff = [
  {
    id: "STAFF-001",
    name: "Sarah Johnson",
    role: "Dry Cleaning Specialist",
    department: "Dry Cleaning",
    email: "sarah@cleanpro.com",
    phone: "+1 (555) 123-4567",
    status: "Active",
    shift: "Morning (8AM - 4PM)",
    hoursThisWeek: 32,
    tasksCompleted: 45,
    efficiency: 92,
  },
  {
    id: "STAFF-002",
    name: "Mike Chen",
    role: "Laundry Attendant",
    department: "Laundry",
    email: "mike@cleanpro.com",
    phone: "+1 (555) 234-5678",
    status: "Active",
    shift: "Evening (4PM - 12AM)",
    hoursThisWeek: 40,
    tasksCompleted: 38,
    efficiency: 88,
  },
  {
    id: "STAFF-003",
    name: "Emily Rodriguez",
    role: "Customer Service",
    department: "Front Desk",
    email: "emily@cleanpro.com",
    phone: "+1 (555) 345-6789",
    status: "Active",
    shift: "Day (9AM - 5PM)",
    hoursThisWeek: 40,
    tasksCompleted: 52,
    efficiency: 95,
  },
  {
    id: "STAFF-004",
    name: "David Kim",
    role: "Delivery Driver",
    department: "Delivery",
    email: "david@cleanpro.com",
    phone: "+1 (555) 456-7890",
    status: "On Leave",
    shift: "Morning (7AM - 3PM)",
    hoursThisWeek: 0,
    tasksCompleted: 0,
    efficiency: 0,
  },
]

const schedules = [
  {
    id: "SCH-001",
    staffId: "STAFF-001",
    staffName: "Sarah Johnson",
    date: "2024-01-15",
    startTime: "08:00",
    endTime: "16:00",
    task: "Dry Cleaning - Suits",
    status: "Scheduled",
  },
  {
    id: "SCH-002",
    staffId: "STAFF-002",
    staffName: "Mike Chen",
    date: "2024-01-15",
    startTime: "16:00",
    endTime: "00:00",
    task: "Laundry Processing",
    status: "In Progress",
  },
  {
    id: "SCH-003",
    staffId: "STAFF-003",
    staffName: "Emily Rodriguez",
    date: "2024-01-15",
    startTime: "09:00",
    endTime: "17:00",
    task: "Customer Service",
    status: "Completed",
  },
]

export function StaffScheduling() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false)
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === "all" || member.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "secondary"
      case "on leave":
        return "outline"
      case "inactive":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "text-green-600"
    if (efficiency >= 80) return "text-blue-600"
    if (efficiency >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const activeStaff = staff.filter((member) => member.status === "Active").length
  const totalHours = staff.reduce((sum, member) => sum + member.hoursThisWeek, 0)
  const avgEfficiency = staff.reduce((sum, member) => sum + member.efficiency, 0) / staff.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Staff Scheduling</h2>
          <p className="text-gray-600">Manage staff schedules, tasks, and performance</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Schedule Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Task</DialogTitle>
                <DialogDescription>Assign a task to a staff member with specific time and details.</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="staff-member">Staff Member</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {staff
                        .filter((member) => member.status === "Active")
                        .map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name} - {member.role}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-type">Task Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select task type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dry-cleaning">Dry Cleaning</SelectItem>
                      <SelectItem value="laundry">Laundry Processing</SelectItem>
                      <SelectItem value="ironing">Ironing & Pressing</SelectItem>
                      <SelectItem value="customer-service">Customer Service</SelectItem>
                      <SelectItem value="delivery">Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input id="start-time" type="time" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <Input id="end-time" type="time" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="task-description">Task Description</Label>
                  <Input id="task-description" placeholder="Detailed task description..." />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-blue-500 hover:bg-blue-600">Schedule Task</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddStaffDialogOpen} onOpenChange={setIsAddStaffDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
                <DialogDescription>Add a new team member with their role and contact information.</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="staff-name">Full Name</Label>
                  <Input id="staff-name" placeholder="Enter staff name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staff-role">Role</Label>
                  <Input id="staff-role" placeholder="Job title/role" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staff-department">Department</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dry-cleaning">Dry Cleaning</SelectItem>
                      <SelectItem value="laundry">Laundry</SelectItem>
                      <SelectItem value="front-desk">Front Desk</SelectItem>
                      <SelectItem value="delivery">Delivery</SelectItem>
                      <SelectItem value="management">Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staff-shift">Default Shift</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select shift" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (8AM - 4PM)</SelectItem>
                      <SelectItem value="day">Day (9AM - 5PM)</SelectItem>
                      <SelectItem value="evening">Evening (4PM - 12AM)</SelectItem>
                      <SelectItem value="night">Night (12AM - 8AM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staff-email">Email</Label>
                  <Input id="staff-email" type="email" placeholder="staff@cleanpro.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staff-phone">Phone</Label>
                  <Input id="staff-phone" placeholder="+1 (555) 123-4567" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddStaffDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-blue-500 hover:bg-blue-600">Add Staff Member</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Staff</p>
                <p className="text-2xl font-bold text-blue-600">{activeStaff}</p>
              </div>
              <UserCheck className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Hours (Week)</p>
                <p className="text-2xl font-bold text-green-600">{totalHours}</p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Efficiency</p>
                <p className="text-2xl font-bold text-purple-600">{avgEfficiency.toFixed(1)}%</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-orange-600">5</p>
              </div>
              <Users className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="staff" className="space-y-4">
        <TabsList>
          <TabsTrigger value="staff">Staff Management</TabsTrigger>
          <TabsTrigger value="schedule">Schedule View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search staff by name or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Dry Cleaning">Dry Cleaning</SelectItem>
                    <SelectItem value="Laundry">Laundry</SelectItem>
                    <SelectItem value="Front Desk">Front Desk</SelectItem>
                    <SelectItem value="Delivery">Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Staff Table */}
          <Card>
            <CardHeader>
              <CardTitle>Staff Members ({filteredStaff.length})</CardTitle>
              <CardDescription>Complete list of staff members with performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Role & Department</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Hours (Week)</TableHead>
                    <TableHead>Efficiency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{member.role}</div>
                          <div className="text-sm text-gray-500">{member.department}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{member.email}</div>
                          <div className="text-sm text-gray-500">{member.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{member.shift}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-medium">{member.hoursThisWeek}</div>
                          <div className="text-sm text-gray-500">hours</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`font-medium ${getEfficiencyColor(member.efficiency)}`}>
                          {member.efficiency}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(member.status)}>{member.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-blue-600">
                            Schedule
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Current day schedule and task assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>
                        <div className="font-medium">{schedule.staffName}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {schedule.startTime} - {schedule.endTime}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{schedule.task}</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            schedule.status === "Completed"
                              ? "default"
                              : schedule.status === "In Progress"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {schedule.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>Select a date to view schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Schedule for {selectedDate?.toLocaleDateString()}</CardTitle>
                <CardDescription>Staff assignments and tasks for the selected date</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">Select a date to view the schedule</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
