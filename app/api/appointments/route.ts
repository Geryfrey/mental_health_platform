import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

/**
 * POST /api/appointments
 * Body: { studentId: string, professionalId: string, preferredDate: string, preferredTime: string, notes?: string }
 * Response: { success: boolean, appointmentId?: string, error?: string }
 */
export async function POST(req: NextRequest) {
  try {
    console.log("=== Appointment API Called ===")

    const body = await req.json()
    console.log("Request body:", body)

    const {
      studentId,
      professionalId,
      preferredDate, // "YYYY-MM-DD"
      preferredTime, // "HH:MM"
      notes,
    } = body

    // Validate required fields
    if (!studentId || !professionalId || !preferredDate || !preferredTime) {
      console.log("Missing fields:", { studentId, professionalId, preferredDate, preferredTime })
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          details: {
            studentId: !!studentId,
            professionalId: !!professionalId,
            preferredDate: !!preferredDate,
            preferredTime: !!preferredTime,
          },
        },
        { status: 400 },
      )
    }

    // Merge into single ISO timestamp (local timezone)
    const appointmentAt = new Date(`${preferredDate}T${preferredTime}:00`).toISOString()
    console.log("Appointment datetime:", appointmentAt)

    // Check if appointments table exists and what columns it has
    const { data: tableInfo, error: tableError } = await supabase.from("appointments").select("*").limit(1)

    if (tableError) {
      console.error("Table check error:", tableError)
      return NextResponse.json(
        {
          success: false,
          error: "Appointments table not accessible",
          details: tableError.message,
        },
        { status: 500 },
      )
    }

    console.log("Table accessible, sample data:", tableInfo)

    // Prepare insert data
    const insertData = {
      student_id: studentId,
      professional_id: professionalId,
      appointment_at: appointmentAt,
      notes: notes || "",
      status: "pending",
      created_at: new Date().toISOString(),
    }

    console.log("Insert data:", insertData)

    // Insert appointment
    const { data, error } = await supabase.from("appointments").insert([insertData]).select().single()

    if (error) {
      console.error("Insert error:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create appointment",
          details: error.message,
          code: error.code,
        },
        { status: 500 },
      )
    }

    console.log("Appointment created successfully:", data)
    return NextResponse.json({ success: true, appointmentId: data.id })
  } catch (err) {
    console.error("Appointment creation failed:", err)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
