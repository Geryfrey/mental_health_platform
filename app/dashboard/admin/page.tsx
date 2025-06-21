"use client"

import { useState } from "react"
import { Brain } from "lucide-react"
import { UserManagement } from "@/components/admin/user-management"
import { AnalyticsOverview } from "@/components/admin/analytics-overview"
import { Reports } from "@/components/admin/reports"
import { LogoutButton } from "@/components/layout/logout-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfessionalManagement } from "@/components/admin/professional-management"
import { ResourceManagement } from "@/components/admin/resource-management"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-teal-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">System administration and management</p>
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
            <button
              onClick={() => setActiveTab("overview")}
              className={`border-b-2 py-4 px-1 text-sm font-medium ${
                activeTab === "overview"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Overview & Analytics
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`border-b-2 py-4 px-1 text-sm font-medium ${
                activeTab === "users"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab("professionals")}
              className={`border-b-2 py-4 px-1 text-sm font-medium ${
                activeTab === "professionals"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Professionals
            </button>
            <button
              onClick={() => setActiveTab("resources")}
              className={`border-b-2 py-4 px-1 text-sm font-medium ${
                activeTab === "resources"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Resources
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`border-b-2 py-4 px-1 text-sm font-medium ${
                activeTab === "reports"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Reports
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && <AnalyticsOverview />}
        {activeTab === "users" && <UserManagement />}
        {activeTab === "professionals" && (
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Professional Management</CardTitle>
                <CardDescription>Manage mental health professionals and their verification status</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfessionalManagement />
              </CardContent>
            </Card>
          </div>
        )}
        {activeTab === "resources" && (
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Resource Management</CardTitle>
                    <CardDescription>Manage mental health resources and articles</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResourceManagement />
              </CardContent>
            </Card>
          </div>
        )}
        {activeTab === "reports" && <Reports />}
      </div>
    </div>
  )
}
