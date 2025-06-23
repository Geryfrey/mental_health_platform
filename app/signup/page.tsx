"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Brain, Eye, EyeOff, User, GraduationCap, AlertCircle } from "lucide-react"
import { signUp } from "@/lib/auth"

export default function SignUpPage() {
  const [userType, setUserType] = useState<"student" | "professional">("student")
  const [formData, setFormData] = useState({
    email: "",
    registration_number: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    phone: "",
    location: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [validationErrors, setValidationErrors] = useState({
    registration_number: "",
    password: "",
  })
  const router = useRouter()

  // Validation functions
  const validateRegistrationNumber = (regNumber: string) => {
    if (!regNumber) return ""

    // Check if it's exactly 9 digits
    if (!/^\d{9}$/.test(regNumber)) {
      return "Registration number must be exactly 9 digits"
    }

    // Check if it starts with 2
    if (!regNumber.startsWith("2")) {
      return "Registration number must start with 2"
    }

    return ""
  }

  const validatePassword = (password: string) => {
    if (!password) return ""

    if (password.length < 8) {
      return "Password must be at least 8 characters long"
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
      return "Password must contain at least one number"
    }

    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      return "Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;':\",./<>?)"
    }

    return ""
  }

  // Handle input changes with validation
  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })

    // Real-time validation
    if (field === "registration_number") {
      const error = validateRegistrationNumber(value)
      setValidationErrors((prev) => ({ ...prev, registration_number: error }))
    }

    if (field === "password") {
      const error = validatePassword(value)
      setValidationErrors((prev) => ({ ...prev, password: error }))
    }
  }

  // Handle registration number input (restrict to 9 digits starting with 2)
  const handleRegistrationNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "") // Remove non-digits

    // Limit to 9 digits
    if (value.length > 9) {
      value = value.slice(0, 9)
    }

    // If user types something other than 2 as first digit, replace it with 2
    if (value.length > 0 && !value.startsWith("2")) {
      value = "2" + value.slice(1)
    }

    handleInputChange("registration_number", value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate registration number for students
    if (userType === "student") {
      const regError = validateRegistrationNumber(formData.registration_number)
      if (regError) {
        setError(regError)
        setIsLoading(false)
        return
      }
    }

    // Validate password
    const passwordError = validatePassword(formData.password)
    if (passwordError) {
      setError(passwordError)
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const userData = {
        user_type: userType,
        full_name: formData.full_name,
        password: formData.password,
        phone: formData.phone,
        location: formData.location,
        ...(userType === "student" ? { registration_number: formData.registration_number } : { email: formData.email }),
      }

      await signUp(userData)
      router.push("/login?message=Account created successfully")
    } catch (err: any) {
      setError(err.message || "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center pb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-2 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              SWAP
            </span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
          <CardDescription className="text-gray-600">Join SWAP to start your wellness journey</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">I am a:</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={userType === "student" ? "default" : "outline"}
                  className={`h-12 ${
                    userType === "student"
                      ? "bg-gradient-to-r from-teal-500 to-blue-600"
                      : "bg-white text-gray-700 border-gray-200"
                  }`}
                  onClick={() => setUserType("student")}
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Student
                </Button>
                <Button
                  type="button"
                  variant={userType === "professional" ? "default" : "outline"}
                  className={`h-12 ${
                    userType === "professional"
                      ? "bg-gradient-to-r from-teal-500 to-blue-600"
                      : "bg-white text-gray-700 border-gray-200"
                  }`}
                  onClick={() => setUserType("professional")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Professional
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-sm font-medium text-gray-700">
                Full Name
              </Label>
              <Input
                id="full_name"
                type="text"
                placeholder="Enter your full name"
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                required
                className="h-11"
              />
            </div>

            {userType === "student" ? (
              <div className="space-y-2">
                <Label htmlFor="registration_number" className="text-sm font-medium text-gray-700">
                  Registration Number
                </Label>
                <Input
                  id="registration_number"
                  type="text"
                  placeholder="e.g., 220014748"
                  value={formData.registration_number}
                  onChange={handleRegistrationNumberChange}
                  required
                  className={`h-11 ${validationErrors.registration_number ? "border-red-500" : ""}`}
                  maxLength={9}
                />
                {validationErrors.registration_number && (
                  <div className="flex items-center space-x-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{validationErrors.registration_number}</span>
                  </div>
                )}
                <div className="text-xs text-gray-500">Must be exactly 9 digits starting with 2</div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="h-11"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+250 788 123 456"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                Location
              </Label>
              <Input
                id="location"
                type="text"
                placeholder="City, District"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                  className={`h-11 pr-10 ${validationErrors.password ? "border-red-500" : ""}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-11 w-11 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {validationErrors.password && (
                <div className="flex items-center space-x-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>{validationErrors.password}</span>
                </div>
              )}
              <div className="text-xs text-gray-500">
                Must be 8+ characters with at least one number and one special character
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  required
                  className="h-11 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-11 w-11 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
              disabled={isLoading || validationErrors.registration_number !== "" || validationErrors.password !== ""}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-teal-600 hover:text-teal-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
