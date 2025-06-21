"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, TrendingUp, Calendar, BarChart3 } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"
import { supabase } from "@/lib/supabase"
import { LogoutButton } from "@/components/layout/logout-button"

export default function ResultsPage() {
  const [assessments, setAssessments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAssessments()
  }, [])

  const fetchAssessments = async () => {
    try {
      const userData = localStorage.getItem("user")
      if (!userData) {
        setLoading(false)
        return
      }

      const user = JSON.parse(userData)
      console.log("Fetching assessments for user:", user.id)

      const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .eq("student_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }

      console.log("Fetched assessments:", data)
      setAssessments(data || [])
    } catch (error) {
      console.error("Error fetching assessments:", error)
    } finally {
      setLoading(false)
    }
  }

  // Process data for charts
  const wellnessData = assessments
    .map((assessment, index) => ({
      date: new Date(assessment.created_at).toLocaleDateString(),
      score: assessment.wellness_score,
      assessment: `Assessment ${index + 1}`,
      timestamp: new Date(assessment.created_at).getTime(),
    }))
    .sort((a, b) => a.timestamp - b.timestamp)

  const riskLevelData = [
    { name: "Low", value: assessments.filter((a) => a.risk_level === "low").length, color: "#10B981" },
    { name: "Moderate", value: assessments.filter((a) => a.risk_level === "moderate").length, color: "#F59E0B" },
    { name: "High", value: assessments.filter((a) => a.risk_level === "high").length, color: "#F97316" },
    { name: "Critical", value: assessments.filter((a) => a.risk_level === "critical").length, color: "#EF4444" },
  ]

  const sentimentData = [
    { name: "Positive", value: assessments.filter((a) => a.sentiment === "positive").length, color: "#10B981" },
    { name: "Neutral", value: assessments.filter((a) => a.sentiment === "neutral").length, color: "#6B7280" },
    { name: "Negative", value: assessments.filter((a) => a.sentiment === "negative").length, color: "#EF4444" },
  ]

  // Get common conditions
  const allConditions = assessments.flatMap((a) => a.detected_conditions || [])
  const conditionCounts = allConditions.reduce((acc: any, condition) => {
    acc[condition] = (acc[condition] || 0) + 1
    return acc
  }, {})

  const conditionsData = Object.entries(conditionCounts)
    .map(([name, count]) => ({ name: name.replace("_", " "), count }))
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 5)

  console.log("Chart data:", { wellnessData, riskLevelData, sentimentData, conditionsData })

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

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-teal-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">My Results</h1>
                <p className="text-sm text-gray-600">Detailed assessment history and analytics</p>
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
              href="/dashboard/student"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Dashboard Home
            </a>
            <a
              href="/dashboard/student/assessment"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Assessment
            </a>
            <a
              href="/dashboard/student/results"
              className="border-b-2 border-teal-500 py-4 px-1 text-sm font-medium text-teal-600"
            >
              My Results
            </a>
            <a
              href="/dashboard/student/journal"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Journal
            </a>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Debug Info */}
        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600">Debug: Found {assessments.length} assessments</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                  <p className="text-3xl font-bold text-gray-900">{assessments.length}</p>
                </div>
                <Brain className="h-8 w-8 text-teal-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Wellness</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {assessments.length > 0
                      ? Math.round(assessments.reduce((sum, a) => sum + a.wellness_score, 0) / assessments.length)
                      : 0}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Latest Score</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {assessments.length > 0 ? assessments[0].wellness_score : 0}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Risk</p>
                  <Badge className={`mt-2 ${getRiskLevelColor(assessments[0]?.risk_level || "low")}`}>
                    {(assessments[0]?.risk_level || "low").toUpperCase()}
                  </Badge>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Wellness Score Trend */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Wellness Score Trend</CardTitle>
              <CardDescription>Your wellness score over time</CardDescription>
            </CardHeader>
            <CardContent>
              {assessments.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={wellnessData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="assessment" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#0D9488" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-gray-500">
                  No assessment data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Risk Level Distribution */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Risk Level Distribution</CardTitle>
              <CardDescription>Breakdown of your risk levels</CardDescription>
            </CardHeader>
            <CardContent>
              {assessments.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={riskLevelData.filter((d) => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {riskLevelData
                        .filter((d) => d.value > 0)
                        .map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-gray-500">
                  No risk level data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Common Conditions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Common Conditions</CardTitle>
              <CardDescription>Most frequently detected conditions</CardDescription>
            </CardHeader>
            <CardContent>
              {conditionsData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={conditionsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0D9488" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-gray-500">
                  No conditions data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sentiment Trends */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Sentiment Distribution</CardTitle>
              <CardDescription>Your emotional sentiment patterns</CardDescription>
            </CardHeader>
            <CardContent>
              {assessments.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sentimentData.filter((d) => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {sentimentData
                        .filter((d) => d.value > 0)
                        .map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-gray-500">
                  No sentiment data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Assessment History */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Assessment History</CardTitle>
            <CardDescription>Detailed history of all your assessments</CardDescription>
          </CardHeader>
          <CardContent>
            {assessments.length > 0 ? (
              <div className="space-y-4">
                {assessments.map((assessment) => (
                  <div key={assessment.id} className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(assessment.created_at).toLocaleDateString()} at{" "}
                          {new Date(assessment.created_at).toLocaleTimeString()}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge className={getRiskLevelColor(assessment.risk_level)}>{assessment.risk_level}</Badge>
                          <span className="text-sm text-gray-600">Wellness Score: {assessment.wellness_score}/100</span>
                        </div>
                      </div>
                      <Progress value={assessment.wellness_score} className="w-24" />
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {assessment.detected_conditions?.map((condition: string, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                          {condition.replace("_", " ")}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">{assessment.text_content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No assessments found. Take your first assessment to see your results here.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
