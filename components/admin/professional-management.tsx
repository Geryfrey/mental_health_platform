"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"

interface Professional {
  id: string
  clinic_name: string
  specialization: string
  license_number: string
  is_verified: boolean
  created_at: string
  users: {
    full_name: string
    email: string
    phone?: string
    location?: string
  }
}

export function ProfessionalManagement() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfessionals()
  }, [])

  const fetchProfessionals = async () => {
    try {
      const { data, error } = await supabase
        .from("professionals")
        .select(`
          *,
          users!inner(full_name, email, phone, location)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setProfessionals(data || [])
    } catch (error) {
      console.error("Error fetching professionals:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleProfessionalVerification = async (professionalId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("professionals")
        .update({ is_verified: !currentStatus })
        .eq("id", professionalId)

      if (error) throw error
      fetchProfessionals()
    } catch (error) {
      console.error("Error updating verification:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading professionals...</div>
  }

  return (
    <div className="space-y-4">
      {professionals.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No professionals found in the system.</div>
      ) : (
        professionals.map((professional) => (
          <div key={professional.id} className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">{professional.users.full_name}</h4>
                <p className="text-sm text-gray-600">Clinic: {professional.clinic_name}</p>
                <p className="text-sm text-gray-600">Specialization: {professional.specialization}</p>
                <p className="text-sm text-gray-600">License: {professional.license_number}</p>
                <p className="text-sm text-gray-600">Location: {professional.users.location}</p>
                <p className="text-sm text-gray-600">Email: {professional.users.email}</p>
                <p className="text-sm text-gray-600">Phone: {professional.users.phone}</p>
                <p className="text-sm text-gray-600">
                  Joined: {new Date(professional.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={professional.is_verified ? "default" : "secondary"}>
                  {professional.is_verified ? "Verified" : "Unverified"}
                </Badge>
                <Button
                  size="sm"
                  onClick={() => toggleProfessionalVerification(professional.id, professional.is_verified)}
                  className={
                    professional.is_verified ? "bg-orange-600 hover:bg-orange-700" : "bg-green-600 hover:bg-green-700"
                  }
                >
                  {professional.is_verified ? "Unverify" : "Verify"}
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
