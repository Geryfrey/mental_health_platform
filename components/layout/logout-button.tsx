"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user")

    // Redirect to home page
    router.push("/")
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-600 border-red-200 hover:bg-red-50">
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  )
}
