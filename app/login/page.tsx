"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Brain, Eye, EyeOff, User, Stethoscope, Shield, AlertCircle } from "lucide-react"
import { signIn } from "@/lib/auth"

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("student")
  const [validationErrors, setValidationErrors] = useState({
    identifier: "",
    password: "",
  })
  const router = useRouter()

  // Validation functions
  const validateRegistrationNumber = (regNumber: string) => {
    if (!regNumber) return "Registration number is required"
    if (!/^\d+$/.test(regNumber)) return "Registration number must contain only digits"
    if (regNumber.length !== 9) return "Registration number must be exactly 9 digits"
    if (!regNumber.startsWith("2")) return "Registration number must start with 2"
    return ""
  }

  const validateEmail = (email: string) => {
    if (!email) return "Email is required"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return "Please enter a valid email address"
    return ""
  }

  const validatePassword = (password: string) => {
    if (!password) return "Password is required"
    if (password.length < 8) return "Password must be at least 8 characters long"
    if (!/\d/.test(password)) return "Password must contain at least one number"
    if (!/[!@#$%^&*()_+\-=[\]{}|;':",./<>?]/.test(password))
      return "Password must contain at least one special character"
    return ""
  }

  const handleIdentifierChange = (value: string) => {
    if (activeTab === "student") {
      // Check if it's an email or registration number
      if (value.includes("@")) {
        // It's an email
        setIdentifier(value)
        setValidationErrors((prev) => ({
          ...prev,
          identifier: validateEmail(value),
        }))
      } else {
        // It's a registration number - only allow digits and limit to 9
        const digitsOnly = value.replace(/\D/g, "")
        let formattedValue = digitsOnly

        // Auto-correct first digit to 2 if user enters something else
        if (formattedValue.length > 0 && !formattedValue.startsWith("2")) {
          formattedValue = "2" + formattedValue.slice(1)
        }

        // Limit to 9 digits
        if (formattedValue.length > 9) {
          formattedValue = formattedValue.slice(0, 9)
        }

        setIdentifier(formattedValue)
        setValidationErrors((prev) => ({
          ...prev,
          identifier: validateRegistrationNumber(formattedValue),
        }))
      }
    } else {
      // For professional and admin, it's always email
      setIdentifier(value)
      setValidationErrors((prev) => ({
        ...prev,
        identifier: validateEmail(value),
      }))
    }
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    setValidationErrors((prev) => ({
      ...prev,
      password: validatePassword(value),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields before submission
    const identifierError =
      activeTab === "student" && !identifier.includes("@")
        ? validateRegistrationNumber(identifier)
        : validateEmail(identifier)
    const passwordError = validatePassword(password)

    setValidationErrors({
      identifier: identifierError,
      password: passwordError,
    })

    // Don't submit if there are validation errors
    if (identifierError || passwordError) {
      setError("Please fix the validation errors above")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const user = await signIn(identifier, password)

      // Store user in localStorage (in production, use proper session management)
      localStorage.setItem("user", JSON.stringify(user))

      // Redirect based on user type
      switch (user.user_type) {
        case "student":
          router.push("/dashboard/student")
          break
        case "professional":
          router.push("/dashboard/professional")
          break
        case "admin":
          router.push("/dashboard/admin")
          break
        default:
          router.push("/dashboard")
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getPlaceholder = () => {
    switch (activeTab) {
      case "student":
        return "Enter email or registration number (2xxxxxxxx)"
      case "professional":
        return "Enter professional email"
      case "admin":
        return "admin@swap.rw"
      default:
        return "Enter email"
    }
  }

  const getButtonText = () => {
    switch (activeTab) {
      case "student":
        return "Sign In as Student"
      case "professional":
        return "Sign In as Professional"
      case "admin":
        return "Sign In as Admin"
      default:
        return "Sign In"
    }
  }

  const getButtonColor = () => {
    switch (activeTab) {
      case "student":
        return "bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
      case "professional":
        return "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
      case "admin":
        return "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
      default:
        return "bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
    }
  }

  const isFormValid = () => {
    return !validationErrors.identifier && !validationErrors.password && identifier && password
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-2 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              SWAP
            </span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
          <CardDescription className="text-gray-600">Sign in to access your wellness dashboard</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="student" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Student
              </TabsTrigger>
              <TabsTrigger value="professional" className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Professional
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier" className="text-sm font-medium text-gray-700">
                    Email or Registration Number
                  </Label>
                  <div className="relative">
                    <Input
                      id="identifier"
                      type="text"
                      placeholder={getPlaceholder()}
                      value={identifier}
                      onChange={(e) => handleIdentifierChange(e.target.value)}
                      required
                      className={`h-11 ${validationErrors.identifier ? "border-red-500 focus:border-red-500" : ""}`}
                    />
                    {validationErrors.identifier && (
                      <AlertCircle className="absolute right-3 top-3 h-5 w-5 text-red-500" />
                    )}
                  </div>
                  {validationErrors.identifier && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {validationErrors.identifier}
                    </p>
                  )}
                  {activeTab === "student" && !identifier.includes("@") && (
                    <p className="text-xs text-gray-500">
                      Registration number: 9 digits starting with 2 (e.g., 220014748)
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      required
                      className={`h-11 pr-10 ${validationErrors.password ? "border-red-500 focus:border-red-500" : ""}`}
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
                    {validationErrors.password && (
                      <AlertCircle className="absolute right-12 top-3 h-5 w-5 text-red-500" />
                    )}
                  </div>
                  {validationErrors.password && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {validationErrors.password}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">Password: 8+ characters, include number and special character</p>
                </div>

                {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}

                <Button
                  type="submit"
                  className={`w-full h-11 ${getButtonColor()}`}
                  disabled={isLoading || !isFormValid()}
                >
                  {isLoading ? "Signing in..." : getButtonText()}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="professional">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier" className="text-sm font-medium text-gray-700">
                    Professional Email
                  </Label>
                  <div className="relative">
                    <Input
                      id="identifier"
                      type="email"
                      placeholder={getPlaceholder()}
                      value={identifier}
                      onChange={(e) => handleIdentifierChange(e.target.value)}
                      required
                      className={`h-11 ${validationErrors.identifier ? "border-red-500 focus:border-red-500" : ""}`}
                    />
                    {validationErrors.identifier && (
                      <AlertCircle className="absolute right-3 top-3 h-5 w-5 text-red-500" />
                    )}
                  </div>
                  {validationErrors.identifier && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {validationErrors.identifier}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      required
                      className={`h-11 pr-10 ${validationErrors.password ? "border-red-500 focus:border-red-500" : ""}`}
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
                    {validationErrors.password && (
                      <AlertCircle className="absolute right-12 top-3 h-5 w-5 text-red-500" />
                    )}
                  </div>
                  {validationErrors.password && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {validationErrors.password}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">Password: 8+ characters, include number and special character</p>
                </div>

                {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}

                <Button
                  type="submit"
                  className={`w-full h-11 ${getButtonColor()}`}
                  disabled={isLoading || !isFormValid()}
                >
                  {isLoading ? "Signing in..." : getButtonText()}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="admin">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier" className="text-sm font-medium text-gray-700">
                    Admin Email
                  </Label>
                  <div className="relative">
                    <Input
                      id="identifier"
                      type="email"
                      placeholder={getPlaceholder()}
                      value={identifier}
                      onChange={(e) => handleIdentifierChange(e.target.value)}
                      required
                      className={`h-11 ${validationErrors.identifier ? "border-red-500 focus:border-red-500" : ""}`}
                    />
                    {validationErrors.identifier && (
                      <AlertCircle className="absolute right-3 top-3 h-5 w-5 text-red-500" />
                    )}
                  </div>
                  {validationErrors.identifier && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {validationErrors.identifier}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      required
                      className={`h-11 pr-10 ${validationErrors.password ? "border-red-500 focus:border-red-500" : ""}`}
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
                    {validationErrors.password && (
                      <AlertCircle className="absolute right-12 top-3 h-5 w-5 text-red-500" />
                    )}
                  </div>
                  {validationErrors.password && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {validationErrors.password}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">Password: 8+ characters, include number and special character</p>
                </div>

                {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}

                <Button
                  type="submit"
                  className={`w-full h-11 ${getButtonColor()}`}
                  disabled={isLoading || !isFormValid()}
                >
                  {isLoading ? "Signing in..." : getButtonText()}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-teal-600 hover:text-teal-700 font-medium">
                Sign up here
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-teal-600 hover:text-teal-700">
              ← Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
