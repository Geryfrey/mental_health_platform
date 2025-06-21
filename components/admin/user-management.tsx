"use client"

import type React from "react"

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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { supabase } from "@/lib/supabase"
import bcrypt from "bcryptjs"

interface User {
  id: string
  email?: string
  registration_number?: string
  user_type: string
  full_name: string
  phone?: string
  location?: string
  created_at: string
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [userForm, setUserForm] = useState({
    email: "",
    registration_number: "",
    password: "",
    user_type: "student",
    full_name: "",
    phone: "",
    location: "",
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingUser) {
        // Update existing user
        const updateData: any = {
          full_name: userForm.full_name,
          phone: userForm.phone,
          location: userForm.location,
          user_type: userForm.user_type,
        }

        if (userForm.user_type === "student") {
          updateData.registration_number = userForm.registration_number
          updateData.email = null
        } else {
          updateData.email = userForm.email
          updateData.registration_number = null
        }

        if (userForm.password) {
          updateData.password = await bcrypt.hash(userForm.password, 10)
        }

        const { error } = await supabase.from("users").update(updateData).eq("id", editingUser.id)

        if (error) throw error
      } else {
        // Create new user
        const hashedPassword = await bcrypt.hash(userForm.password, 10)
        const userData: any = {
          full_name: userForm.full_name,
          password: hashedPassword,
          user_type: userForm.user_type,
          phone: userForm.phone,
          location: userForm.location,
        }

        if (userForm.user_type === "student") {
          userData.registration_number = userForm.registration_number
        } else {
          userData.email = userForm.email
        }

        const { error } = await supabase.from("users").insert([userData])

        if (error) throw error
      }

      resetForm()
      setIsDialogOpen(false)
      fetchUsers()
    } catch (error) {
      console.error("Error saving user:", error)
      alert("Error saving user. Please try again.")
    }
  }

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const { error } = await supabase.from("users").delete().eq("id", id)

      if (error) throw error
      fetchUsers()
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const editUser = (user: User) => {
    setEditingUser(user)
    setUserForm({
      email: user.email || "",
      registration_number: user.registration_number || "",
      password: "",
      user_type: user.user_type,
      full_name: user.full_name,
      phone: user.phone || "",
      location: user.location || "",
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setUserForm({
      email: "",
      registration_number: "",
      password: "",
      user_type: "student",
      full_name: "",
      phone: "",
      location: "",
    })
    setEditingUser(null)
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage students, professionals, and administrators</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-teal-500 to-blue-600" onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
                <DialogDescription>
                  {editingUser ? "Update user information and role" : "Create a new user account"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user_type">User Type</Label>
                  <Select
                    value={userForm.user_type}
                    onValueChange={(value) => setUserForm({ ...userForm, user_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={userForm.full_name}
                    onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })}
                    required
                  />
                </div>

                {userForm.user_type === "student" ? (
                  <div className="space-y-2">
                    <Label htmlFor="registration_number">Registration Number</Label>
                    <Input
                      id="registration_number"
                      value={userForm.registration_number}
                      onChange={(e) => setUserForm({ ...userForm, registration_number: e.target.value })}
                      required
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Password {editingUser && "(leave blank to keep current)"}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      required={!editingUser}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full w-10"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={userForm.location}
                    onChange={(e) => setUserForm({ ...userForm, location: e.target.value })}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false)
                      resetForm()
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-teal-500 to-blue-600">
                    {editingUser ? "Update" : "Create"} User
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{user.full_name}</h4>
                  <p className="text-sm text-gray-600">
                    {user.user_type === "student" ? `Student ID: ${user.registration_number}` : `Email: ${user.email}`}
                  </p>
                  <p className="text-sm text-gray-600">Phone: {user.phone}</p>
                  <p className="text-sm text-gray-600">Location: {user.location}</p>
                  <p className="text-sm text-gray-600">Joined: {new Date(user.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={
                      user.user_type === "admin"
                        ? "destructive"
                        : user.user_type === "professional"
                          ? "secondary"
                          : "default"
                    }
                  >
                    {user.user_type}
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => editUser(user)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteUser(user.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
