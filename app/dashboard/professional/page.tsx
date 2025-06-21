"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { LogoutButton } from "@/components/layout/logout-button"

export default function ProfessionalDashboard() {
  const [user, setUser] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [stats, setStats] = useState({
    upcoming: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
      fetchAppointments()
    }
  }, [])

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
          users!appointments_student_id_fkey(full_name, phone, registration_number)
        `)
        .eq("professional_id", professional.id)
        .order("appointment_date", { ascending: true })

      if (error) throw error

      setAppointments(data || [])

      // Calculate stats
      const stats = {
        upcoming:
          data?.filter((a) => a.status === "confirmed" && new Date(a.appointment_date) > new Date()).length || 0,
        pending: data?.filter((a) => a.status === "pending").length || 0,
        completed: data?.filter((a) => a.status === "completed").length || 0,
        cancelled: data?.filter((a) => a.status === "cancelled").length || 0,
      }
      setStats(stats)
    } catch (error) {
      console.error("Error fetching appointments:", error)
    }
  }

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      const { error } = await supabase.from("appointments").update({ status }).eq("id", appointmentId)

      if (error) throw error

      fetchAppointments() // Refresh data
    } catch (error) {
      console.error("Error updating appointment:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-teal-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-2 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Professional Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user.full_name}</p>
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
              className="border-b-2 border-teal-500 py-4 px-1 text-sm font-medium text-teal-600"
            >
              Overview
            </a>
            <a
              href="/dashboard/professional/appointments"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Appointments
            </a>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-teal-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.upcoming}</p>
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
                  <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
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
                  <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-blue-600 p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cancelled</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.cancelled}</p>
                </div>
                <div className="bg-gradient-to-r from-red-500 to-pink-600 p-3 rounded-lg">
                  <XCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Appointments */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
            <CardDescription>Manage your upcoming and recent appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.slice(0, 10).map((appointment) => (
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
                      <p className="text-sm text-gray-600">Student ID: {appointment.users.registration_number}</p>
                      <p className="text-sm text-gray-600">Phone: {appointment.users.phone}</p>
                      <p className="text-sm text-gray-600">
                        Date: {new Date(appointment.appointment_date).toLocaleDateString()} at{" "}
                        {new Date(appointment.appointment_date).toLocaleTimeString()}
                      </p>
                      {appointment.notes && <p className="text-sm text-gray-600 mt-2">Notes: {appointment.notes}</p>}
                    </div>

                    <div className="flex space-x-2">
                      {appointment.status === "pending" && (
                        <>
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
                        </>
                      )}
                      {appointment.status === "confirmed" && new Date(appointment.appointment_date) < new Date() && (
                        <Button
                          size="sm"
                          onClick={() => updateAppointmentStatus(appointment.id, "completed")}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {appointments.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments yet</h3>
                  <p className="text-gray-600">Appointments will appear here when students book sessions with you.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
