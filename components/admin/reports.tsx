"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Download, FileText } from "lucide-react"
import { supabase } from "@/lib/supabase"

export function Reports() {
  const [reportPeriod, setReportPeriod] = useState("weekly")
  const [reportData, setReportData] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    generateReport()
  }, [reportPeriod])

  const generateReport = async () => {
    setIsGenerating(true)
    try {
      const { data: assessments } = await supabase.from("assessments").select(`
        *,
        users!inner(full_name, registration_number, user_type)
      `)

      const { data: users } = await supabase.from("users").select("*")
      const { data: professionals } = await supabase.from("professionals").select("*")

      const now = new Date()
      const startDate = new Date()

      switch (reportPeriod) {
        case "daily":
          startDate.setDate(now.getDate() - 1)
          break
        case "weekly":
          startDate.setDate(now.getDate() - 7)
          break
        case "monthly":
          startDate.setMonth(now.getMonth() - 1)
          break
        case "yearly":
          startDate.setFullYear(now.getFullYear() - 1)
          break
      }

      const filteredAssessments = assessments?.filter((a) => new Date(a.created_at) >= startDate) || []

      const report = {
        period: reportPeriod,
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
        totalAssessments: filteredAssessments.length,
        totalUsers: users?.length || 0,
        totalProfessionals: professionals?.length || 0,
        riskLevels: {
          low: filteredAssessments.filter((a) => a.risk_level === "low").length,
          moderate: filteredAssessments.filter((a) => a.risk_level === "moderate").length,
          high: filteredAssessments.filter((a) => a.risk_level === "high").length,
          critical: filteredAssessments.filter((a) => a.risk_level === "critical").length,
        },
        sentiments: {
          positive: filteredAssessments.filter((a) => a.sentiment === "positive").length,
          neutral: filteredAssessments.filter((a) => a.sentiment === "neutral").length,
          negative: filteredAssessments.filter((a) => a.sentiment === "negative").length,
        },
        averageWellnessScore:
          filteredAssessments.length > 0
            ? Math.round(filteredAssessments.reduce((sum, a) => sum + a.wellness_score, 0) / filteredAssessments.length)
            : 0,
        criticalCases: filteredAssessments.filter((a) => a.risk_level === "critical"),
        topConditions: getTopConditions(filteredAssessments),
        assessments: filteredAssessments,
      }

      setReportData(report)
    } catch (error) {
      console.error("Error generating report:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const getTopConditions = (assessments: any[]) => {
    const allConditions = assessments.flatMap((a) => a.detected_conditions || [])
    const conditionCounts = allConditions.reduce((acc: any, condition) => {
      acc[condition] = (acc[condition] || 0) + 1
      return acc
    }, {})

    return Object.entries(conditionCounts)
      .map(([name, count]) => ({ name: name.replace("_", " "), count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 5)
  }

  const downloadReport = () => {
    if (!reportData) return

    const reportContent = `
SWAP Mental Health Platform Report
Generated: ${new Date().toLocaleString()}
Period: ${reportData.period.toUpperCase()}
Date Range: ${new Date(reportData.startDate).toLocaleDateString()} - ${new Date(reportData.endDate).toLocaleDateString()}

=== SUMMARY ===
Total Assessments: ${reportData.totalAssessments}
Total Users: ${reportData.totalUsers}
Total Professionals: ${reportData.totalProfessionals}
Average Wellness Score: ${reportData.averageWellnessScore}/100

=== RISK LEVELS ===
Low Risk: ${reportData.riskLevels.low}
Moderate Risk: ${reportData.riskLevels.moderate}
High Risk: ${reportData.riskLevels.high}
Critical Risk: ${reportData.riskLevels.critical}

=== SENTIMENT ANALYSIS ===
Positive: ${reportData.sentiments.positive}
Neutral: ${reportData.sentiments.neutral}
Negative: ${reportData.sentiments.negative}

=== TOP CONDITIONS ===
${reportData.topConditions.map((c: any) => `${c.name}: ${c.count}`).join("\n")}

=== CRITICAL CASES ===
${reportData.criticalCases
  .map(
    (c: any) =>
      `Student: ${c.users.full_name} (${c.users.registration_number}) - Wellness Score: ${c.wellness_score} - Date: ${new Date(c.created_at).toLocaleDateString()}`,
  )
  .join("\n")}

=== DETAILED ASSESSMENTS ===
${reportData.assessments
  .map(
    (a: any) =>
      `Date: ${new Date(a.created_at).toLocaleDateString()}
Student: ${a.users.full_name} (${a.users.registration_number})
Risk Level: ${a.risk_level}
Wellness Score: ${a.wellness_score}
Sentiment: ${a.sentiment}
Conditions: ${a.detected_conditions?.join(", ") || "None"}
---`,
  )
  .join("\n")}
    `

    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `SWAP_Report_${reportData.period}_${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-teal-600" />
                <span>System Reports</span>
              </CardTitle>
              <CardDescription>Generate and download comprehensive platform reports</CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={reportPeriod} onValueChange={setReportPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={downloadReport}
                disabled={!reportData || isGenerating}
                className="bg-gradient-to-r from-teal-500 to-blue-600"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {reportData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Report Summary */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Report Summary</CardTitle>
              <CardDescription>
                {reportData.period.charAt(0).toUpperCase() + reportData.period.slice(1)} report from{" "}
                {new Date(reportData.startDate).toLocaleDateString()} to{" "}
                {new Date(reportData.endDate).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Assessments</p>
                  <p className="text-2xl font-bold text-blue-600">{reportData.totalAssessments}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Avg Wellness Score</p>
                  <p className="text-2xl font-bold text-green-600">{reportData.averageWellnessScore}/100</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-purple-600">{reportData.totalUsers}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600">Professionals</p>
                  <p className="text-2xl font-bold text-orange-600">{reportData.totalProfessionals}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Level Breakdown */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Risk Level Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Low Risk</span>
                <Badge className="bg-green-100 text-green-800">{reportData.riskLevels.low}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Moderate Risk</span>
                <Badge className="bg-yellow-100 text-yellow-800">{reportData.riskLevels.moderate}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">High Risk</span>
                <Badge className="bg-orange-100 text-orange-800">{reportData.riskLevels.high}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Critical Risk</span>
                <Badge className="bg-red-100 text-red-800">{reportData.riskLevels.critical}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Sentiment Analysis */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Sentiment Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Positive</span>
                <Badge className="bg-green-100 text-green-800">{reportData.sentiments.positive}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Neutral</span>
                <Badge className="bg-gray-100 text-gray-800">{reportData.sentiments.neutral}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Negative</span>
                <Badge className="bg-red-100 text-red-800">{reportData.sentiments.negative}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Top Conditions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Most Common Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {reportData.topConditions.map((condition: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 capitalize">{condition.name}</span>
                  <Badge variant="secondary">{condition.count}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Critical Cases Alert */}
      {reportData && reportData.criticalCases.length > 0 && (
        <Card className="border-0 shadow-lg border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="text-red-700">Critical Cases in This Period</CardTitle>
            <CardDescription>Students requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reportData.criticalCases.slice(0, 5).map((case_: any, index: number) => (
                <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-red-900">{case_.users.full_name}</p>
                      <p className="text-sm text-red-700">ID: {case_.users.registration_number}</p>
                      <p className="text-sm text-red-700">Wellness Score: {case_.wellness_score}/100</p>
                    </div>
                    <Badge variant="destructive">Critical</Badge>
                  </div>
                </div>
              ))}
              {reportData.criticalCases.length > 5 && (
                <p className="text-sm text-gray-600">
                  And {reportData.criticalCases.length - 5} more critical cases...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
