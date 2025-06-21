"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, Activity, BookOpen, MessageCircle, Shield, Target, Clock } from "lucide-react"
import Link from "next/link"
import { LogoutButton } from "@/components/layout/logout-button"

interface User {
  id: string
  full_name: string
  registration_number: string
  user_type: string
}

interface Assessment {
  id: string
  created_at: string
  detected_conditions: string[]
  sentiment: string
  risk_level: string
  wellness_score: number
}

export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [recentAssessment, setRecentAssessment] = useState<Assessment | null>(null)
  const [stats, setStats] = useState({
    totalAssessments: 12,
    currentRiskLevel: "low",
    wellnessScore: 78,
    lastAssessmentDate: "2024-01-15",
  })

  useEffect(() => {
    // Get user from localStorage (in production, use proper session management)
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Mock recent assessment data
    setRecentAssessment({
      id: "1",
      created_at: "2024-01-15T10:30:00Z",
      detected_conditions: ["mild_anxiety", "academic_stress"],
      sentiment: "neutral",
      risk_level: "low",
      wellness_score: 78,
    })
  }, [])

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-800"
      case "moderate":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800"
      case "neutral":
        return "bg-blue-100 text-blue-800"
      case "negative":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Welcome back, {user.full_name}</h1>
                <p className="text-sm text-gray-600">Student ID: {user.registration_number}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/student/assessment">
                <Button className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  New Assessment
                </Button>
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <Link
              href="/dashboard/student"
              className="border-b-2 border-teal-500 py-4 px-1 text-sm font-medium text-teal-600"
            >
              Dashboard Home
            </Link>
            <Link
              href="/dashboard/student/assessment"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Assessment
            </Link>
            <Link
              href="/dashboard/student/results"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              My Results
            </Link>
            <Link
              href="/dashboard/student/journal"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Journal
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-teal-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalAssessments}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-teal-600 p-3 rounded-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Risk Level</p>
                  <Badge className={`mt-2 ${getRiskLevelColor(stats.currentRiskLevel)}`}>
                    {stats.currentRiskLevel.toUpperCase()}
                  </Badge>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-blue-600 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-green-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Wellness Score</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <p className="text-3xl font-bold text-gray-900">{stats.wellnessScore}</p>
                    <p className="text-sm text-gray-500">/100</p>
                  </div>
                  <Progress value={stats.wellnessScore} className="mt-2" />
                </div>
                <div className="bg-gradient-to-r from-teal-500 to-green-600 p-3 rounded-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Assessment</p>
                  <p className="text-lg font-semibold text-gray-900">Jan 15, 2024</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Assessment Preview */}
        {recentAssessment && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-teal-600" />
                  <span>Recent Assessment Results</span>
                </CardTitle>
                <CardDescription>
                  Your latest mental health assessment from {new Date(recentAssessment.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Detected Conditions</p>
                  <div className="flex flex-wrap gap-2">
                    {recentAssessment.detected_conditions.map((condition, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                        {condition.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Sentiment</p>
                    <Badge className={getSentimentColor(recentAssessment.sentiment)}>
                      {recentAssessment.sentiment}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Risk Level</p>
                    <Badge className={getRiskLevelColor(recentAssessment.risk_level)}>
                      {recentAssessment.risk_level}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Wellness Score</p>
                  <div className="flex items-center space-x-2">
                    <Progress value={recentAssessment.wellness_score} className="flex-1" />
                    <span className="text-sm font-medium">{recentAssessment.wellness_score}/100</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <span>Recommended Resources</span>
                </CardTitle>
                <CardDescription>Based on your recent assessment results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-900">Understanding Anxiety in Students</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Comprehensive guide on managing anxiety during academic life
                    </p>
                    <Button variant="link" className="text-green-600 p-0 h-auto mt-2">
                      Read Article →
                    </Button>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900">Stress Management Techniques</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Evidence-based stress management techniques for students
                    </p>
                    <Button variant="link" className="text-blue-600 p-0 h-auto mt-2">
                      Read Article →\
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
