import { supabase } from "./supabase"
import bcrypt from "bcryptjs"

export interface User {
  id: string
  email?: string
  registration_number?: string
  user_type: "student" | "professional" | "admin"
  full_name: string
  phone?: string
  location?: string
}

export async function signUp(userData: {
  email?: string
  registration_number?: string
  password: string
  user_type: "student" | "professional"
  full_name: string
  phone?: string
  location?: string
}) {
  const hashedPassword = await bcrypt.hash(userData.password, 10)

  const { data: user, error } = await supabase
    .from("users")
    .insert([
      {
        ...userData,
        password: hashedPassword,
      },
    ])
    .select()
    .single()

  if (error) throw error

  // If user is a professional, create professional record (unverified by default)
  if (userData.user_type === "professional") {
    const { error: profError } = await supabase.from("professionals").insert([
      {
        user_id: user.id,
        is_verified: false, // Professionals start unverified
      },
    ])

    if (profError) {
      // If professional record creation fails, delete the user
      await supabase.from("users").delete().eq("id", user.id)
      throw profError
    }
  }

  return user
}

export async function signIn(identifier: string, password: string) {
  // Check if identifier is email or registration number
  const isEmail = identifier.includes("@")

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq(isEmail ? "email" : "registration_number", identifier)
    .single()

  if (error || !user) {
    throw new Error("Invalid credentials")
  }

  const isValidPassword = await bcrypt.compare(password, user.password) // Changed from password_hash to password
  if (!isValidPassword) {
    throw new Error("Invalid credentials")
  }

  return {
    id: user.id,
    email: user.email,
    registration_number: user.registration_number,
    user_type: user.user_type,
    full_name: user.full_name,
    phone: user.phone,
    location: user.location,
  }
}
