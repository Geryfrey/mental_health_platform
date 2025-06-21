"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { Calendar, Users, Clock, CheckCircle, XCircle, AlertCircle, Phone } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { LogoutButton } from "@/components/layout/logout-button"

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [notes, setNotes] = useState("")

  useEffect(() => {
    fetchAppointments()
  }, [])

  useEffect(() => {
    filterAppointments()
  }, [appointments, statusFilter, searchTerm])

  const fetchAppointments = async () => {
    try {
      const userData = localStorage.getItem("user")
      if (!userData) return

      const user = JSON.parse(userData)

      // Get professional ID
      const { data: professional } = await supabase.from("professionals").select("id").eq("user_id", user.id).single()

      if (!professional) return

      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          users!appointments_student_id_fkey(full_name, phone, registration_number, location)
        `)
        .eq("professional_id", professional.id)
        .order("appointment_date", { ascending: true })

      if (error) throw error
      setAppointments(data || [])
    } catch (error) {
      console.error("Error fetching appointments:", error)
    }
  }

  const filterAppointments = () => {
    let filtered = appointments

    if (statusFilter !== "all") {
      filtered = filtered.filter((appointment) => appointment.status === statusFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (appointment) =>
          appointment.users.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.users.registration_number.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredAppointments(filtered)
  }

  const updateAppointmentStatus = async (appointmentId: string, status: string, notes?: string) => {
    try {
      const updateData: any = { status }
      if (notes) updateData.notes = notes

      const { error } = await supabase.from("appointments").update(updateData).eq("id", appointmentId)

      if (error) throw error

      fetchAppointments()
      setIsDialogOpen(false)
      setSelectedAppointment(null)
      setNotes("")
    } catch (error) {
      console.error("Error updating appointment:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="h-4 w-4" />
      case "confirmed":
        return <Clock className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getUpcomingCount = () =>
    appointments.filter((a) => a.status === "confirmed" && new Date(a.appointment_date) > new Date()).length
  const getPendingCount = () => appointments.filter((a) => a.status === "pending").length
  const getCompletedCount = () => appointments.filter((a) => a.status === "completed").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-teal-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-2 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Appointments</h1>
                <p className="text-sm text-gray-600">Manage your patient appointments</p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <a
              href="/dashboard/professional"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Overview
            </a>
            <a
              href="/dashboard/professional/appointments"
              className="border-b-2 border-teal-500 py-4 px-1 text-sm font-medium text-teal-600"
            >
              Appointments
            </a>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-teal-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-3xl font-bold text-gray-900">{getUpcomingCount()}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-teal-600 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-gray-900">{getPendingCount()}</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-3 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-gray-900">{getCompletedCount()}</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-blue-600 p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-3xl font-bold text-gray-900">{appointments.length}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by student name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Appointments</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Appointment Management</CardTitle>
            <CardDescription>View and manage your patient appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                  <p className="text-gray-600">
                    {appointments.length === 0
                      ? "You don't have any appointments yet."
                      : "No appointments match your current filters."}
                  </p>
                </div>
              ) : (
                filteredAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900">{appointment.users.full_name}</h4>
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusIcon(appointment.status)}
                            <span className="ml-1">{appointment.status}</span>
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                          <p>Student ID: {appointment.users.registration_number}</p>
                          <p>Phone: {appointment.users.phone}</p>
                          <p>Location: {appointment.users.location}</p>
                          <p>
                            Date: {new Date(appointment.appointment_date).toLocaleDateString()} at{" "}
                            {new Date(appointment.appointment_date).toLocaleTimeString()}
                          </p>
                        </div>
                        {appointment.notes && (
                          <div className="mt-2 p-2 bg-gray-50 rounded">
                            <p className="text-sm text-gray-700">
                              <strong>Notes:</strong> {appointment.notes}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`tel:${appointment.users.phone}`, "_self")}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>

                        {appointment.status === "pending" && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => updateAppointmentStatus(appointment.id, "confirmed")}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              Cancel
                            </Button>
                          </div>
                        )}

                        {appointment.status === "confirmed" && new Date(appointment.appointment_date) < new Date() && (
                          <Dialog
                            open={isDialogOpen && selectedAppointment?.id === appointment.id}
                            onOpenChange={setIsDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedAppointment(appointment)
                                  setNotes(appointment.notes || "")
                                  setIsDialogOpen(true)
                                }}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Complete
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Complete Appointment</DialogTitle>
                                <DialogDescription>
                                  Add session notes and mark the appointment as completed
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="notes">Session Notes</Label>
                                  <Textarea
                                    id="notes"
                                    placeholder="Add notes about the session..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="min-h-[100px]"
                                  />
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setIsDialogOpen(false)
                                      setSelectedAppointment(null)
                                      setNotes("")
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() => updateAppointmentStatus(appointment.id, "completed", notes)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Mark Complete
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}

                        {appointment.status === "confirmed" && new Date(appointment.appointment_date) >= new Date() && (
                          <Badge variant="outline" className="text-blue-600 border-blue-200">
                            Upcoming
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
