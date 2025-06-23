"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  AreaChart,
  Area,
} from "recharts"
import { Users, AlertTriangle, BookOpen, TrendingUp, Activity } from "lucide-react"
import { supabase } from "@/lib/supabase"

const COLORS = ["#0D9488", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#10B981"]

export function AnalyticsOverview() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalProfessionals: 0,
    highRiskCases: 0,
    totalResources: 0,
    totalAssessments: 0,
    verifiedProfessionals: 0,
    totalAppointments: 0,
  })

  const [chartData, setChartData] = useState<{
    riskLevels: any[]
    sentiments: any[]
    conditions: any[]
    weeklyAssessments: any[]
    monthlyTrends: any[]
    wellnessScores: any[]
  }>({
    riskLevels: [],
    sentiments: [],
    conditions: [],
    weeklyAssessments: [],
    monthlyTrends: [],
    wellnessScores: [],
  })

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      console.log("Fetching analytics data...")

      // Fetch basic stats
      const [usersData, resourcesData, assessmentsData, professionalsData, appointmentsData] = await Promise.all([
        supabase.from("users").select("user_type"),
        supabase.from("resources").select("id"),
        supabase.from("assessments").select("*"),
        supabase.from("professionals").select("is_verified"),
        supabase.from("appointments").select("id"),
      ])

      console.log("Raw data:", { usersData, assessmentsData, professionalsData, appointmentsData })

      const users = usersData.data || []
      const assessments = assessmentsData.data || []
      const professionals = professionalsData.data || []
      const appointments = appointmentsData.data || []

      console.log("Processed data:", {
        users: users.length,
        assessments: assessments.length,
        professionals: professionals.length,
        appointments: appointments.length,
      })

      // Calculate basic stats
      const totalStudents = users.filter((u) => u.user_type === "student").length
      const totalProfessionals = users.filter((u) => u.user_type === "professional").length
      const highRiskCases = assessments.filter((a) => a.risk_level === "high").length
      const verifiedProfessionals = professionals.filter((p) => p.is_verified).length

      setStats({
        totalStudents,
        totalProfessionals,
        highRiskCases,
        totalResources: resourcesData.data?.length || 0,
        totalAssessments: assessments.length,
        verifiedProfessionals,
        totalAppointments: appointments.length,
      })

      // Process chart data
      if (assessments.length > 0) {
        processChartData(assessments)
      } else {
        console.log("No assessments found")
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error)
    }
  }

  const processChartData = (assessments: any[]) => {
    console.log("Processing chart data for", assessments.length, "assessments")

    // Risk level distribution (only 3 levels now)
    const riskLevels = [
      { name: "Low", value: assessments.filter((a) => a.risk_level === "low").length, color: "#10B981" },
      { name: "Moderate", value: assessments.filter((a) => a.risk_level === "moderate").length, color: "#F59E0B" },
      { name: "High", value: assessments.filter((a) => a.risk_level === "high").length, color: "#EF4444" },
    ]

    console.log("Risk levels:", riskLevels)

    // Sentiment distribution
    const sentiments = [
      { name: "Positive", value: assessments.filter((a) => a.sentiment === "positive").length, color: "#10B981" },
      { name: "Neutral", value: assessments.filter((a) => a.sentiment === "neutral").length, color: "#6B7280" },
      { name: "Negative", value: assessments.filter((a) => a.sentiment === "negative").length, color: "#EF4444" },
    ]

    console.log("Sentiments:", sentiments)

    // Common conditions
    const allConditions = assessments.flatMap((a) => a.detected_conditions || [])
    const conditionCounts = allConditions.reduce((acc: any, condition) => {
      acc[condition] = (acc[condition] || 0) + 1
      return acc
    }, {})

    const conditions = Object.entries(conditionCounts)
      .map(([name, count]) => ({ name: name.replace("_", " "), count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 8)

    console.log("Conditions:", conditions)

    // Weekly assessments trend
    const weeklyData = getWeeklyTrend(assessments)
    console.log("Weekly data:", weeklyData)

    // Monthly wellness score trend
    const monthlyTrends = getMonthlyWellnessTrend(assessments)
    console.log("Monthly trends:", monthlyTrends)

    // Wellness score distribution
    const wellnessScores = getWellnessScoreDistribution(assessments)
    console.log("Wellness scores:", wellnessScores)

    // Update chart data state
    setChartData({
      riskLevels,
      sentiments,
      conditions,
      weeklyAssessments: weeklyData,
      monthlyTrends,
      wellnessScores,
    })
  }

  const getWeeklyTrend = (assessments: any[]) => {
    const weeks = []
    const now = new Date()

    for (let i = 6; i >= 0; i--) {
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - i * 7)
      weekStart.setHours(0, 0, 0, 0)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      weekEnd.setHours(23, 59, 59, 999)

      const weekAssessments = assessments.filter((a) => {
        const date = new Date(a.created_at)
        return date >= weekStart && date <= weekEnd
      })

      weeks.push({
        week: i === 0 ? "This Week" : `${i} week${i > 1 ? "s" : ""} ago`,
        assessments: weekAssessments.length,
        high: weekAssessments.filter((a) => a.risk_level === "high").length,
        moderate: weekAssessments.filter((a) => a.risk_level === "moderate").length,
      })
    }

    return weeks
  }

  const getMonthlyWellnessTrend = (assessments: any[]) => {
    const months = []
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      monthEnd.setHours(23, 59, 59, 999)

      const monthAssessments = assessments.filter((a) => {
        const date = new Date(a.created_at)
        return date >= monthStart && date <= monthEnd
      })

      const avgWellness =
        monthAssessments.length > 0
          ? Math.round(monthAssessments.reduce((sum, a) => sum + a.wellness_score, 0) / monthAssessments.length)
          : 0

      months.push({
        month: i === 0 ? "This Month" : monthStart.toLocaleDateString("en-US", { month: "short" }),
        wellness: avgWellness,
        assessments: monthAssessments.length,
      })
    }

    return months
  }

  const getWellnessScoreDistribution = (assessments: any[]) => {
    const ranges = [
      { range: "0-20", min: 0, max: 20 },
      { range: "21-40", min: 21, max: 40 },
      { range: "41-60", min: 41, max: 60 },
      { range: "61-80", min: 61, max: 80 },
      { range: "81-100", min: 81, max: 100 },
    ]

    return ranges.map((range) => ({
      range: range.range,
      count: assessments.filter((a) => a.wellness_score >= range.min && a.wellness_score <= range.max).length,
    }))
  }

  console.log("Current chart data state:", chartData)

  return (
    <div className="space-y-8">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-teal-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Students</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-teal-600 p-3 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Professionals</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProfessionals}</p>
                <p className="text-xs text-green-600">{stats.verifiedProfessionals} verified</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-blue-600 p-3 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Risk Cases</p>
                <p className="text-3xl font-bold text-gray-900">{stats.highRiskCases}</p>
              </div>
              <div className="bg-gradient-to-r from-red-500 to-orange-600 p-3 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resources</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalResources}</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assessments</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalAssessments}</p>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Appointments</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalAppointments}</p>
              </div>
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Wellness</p>
                <p className="text-3xl font-bold text-gray-900">
                  {chartData.monthlyTrends.length > 0
                    ? Math.round(
                        chartData.monthlyTrends.reduce((sum: number, month: any) => sum + month.wellness, 0) /
                          chartData.monthlyTrends.length,
                      )
                    : 0}
                </p>
              </div>
              <div className="bg-gradient-to-r from-teal-500 to-green-600 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Level Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Risk Level Distribution</CardTitle>
            <CardDescription>Current risk assessment breakdown (3 levels)</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.riskLevels.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.riskLevels}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {chartData.riskLevels.map((entry: any, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">No data available</div>
            )}
          </CardContent>
        </Card>

        {/* Sentiment Analysis */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Sentiment Analysis</CardTitle>
            <CardDescription>Overall emotional sentiment trends</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.sentiments.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.sentiments}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {chartData.sentiments.map((entry: any, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">No data available</div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Assessment Trends */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Weekly Assessment Activity</CardTitle>
            <CardDescription>Assessment volume and high-risk cases over time</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.weeklyAssessments.some((week) => week.assessments > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData.weeklyAssessments}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="assessments" stackId="1" stroke="#0D9488" fill="#0D9488" />
                  <Area type="monotone" dataKey="high" stackId="2" stroke="#EF4444" fill="#EF4444" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">No data available</div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Wellness Trends */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Monthly Wellness Trends</CardTitle>
            <CardDescription>Average wellness scores over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.monthlyTrends.some((month) => month.assessments > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="wellness" stroke="#0D9488" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">No data available</div>
            )}
          </CardContent>
        </Card>

        {/* Common Conditions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Most Common Conditions</CardTitle>
            <CardDescription>Frequently detected mental health conditions</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.conditions.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.conditions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0D9488" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">No data available</div>
            )}
          </CardContent>
        </Card>

        {/* Wellness Score Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Wellness Score Distribution</CardTitle>
            <CardDescription>Distribution of wellness scores across all assessments</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.wellnessScores.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.wellnessScores}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* High Risk Cases Alert */}
      {stats.highRiskCases > 0 && (
        <Card className="border-0 shadow-lg border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              <span>High Risk Cases Alert</span>
            </CardTitle>
            <CardDescription>
              There are {stats.highRiskCases} students with high risk levels requiring professional attention.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                {stats.highRiskCases} High Risk Cases
              </Badge>
              <Badge variant="outline" className="text-orange-600 border-orange-200">
                Professional Support Recommended
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
