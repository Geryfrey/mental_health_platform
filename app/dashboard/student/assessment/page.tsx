"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Brain, MessageCircle, Lightbulb, Send, Loader2, ExternalLink, BookOpen, User } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { LogoutButton } from "@/components/layout/logout-button"

const assessmentPrompts = [
  "How are you feeling today? Describe your current emotional state.",
  "What challenges have you been facing recently in your studies or personal life?",
  "Have you been experiencing any stress, anxiety, or overwhelming feelings?",
  "How has your sleep and daily routine been lately?",
  "What thoughts have been occupying your mind the most?",
  "Describe any physical symptoms you might be experiencing (headaches, fatigue, etc.)",
  "How would you rate your overall mood and energy levels recently?",
]

export default function AssessmentPage() {
  const [textInput, setTextInput] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [selectedResource, setSelectedResource] = useState<any>(null)
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!textInput.trim()) return
    setIsAnalyzing(true)

    try {
      // 1 – get logged in user (localStorage for demo)
      const userStr = localStorage.getItem("user")
      if (!userStr) return router.push("/login")
      const user = JSON.parse(userStr)

      // 2 – call our server route
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textInput }),
      })

      if (!res.ok) throw new Error("AI analysis failed")
      const { analysis } = await res.json()
      setAnalysis(analysis)

      // 3 – save assessment client-side with Supabase anon key
      await supabase.from("assessments").insert([
        {
          student_id: user.id,
          text_content: textInput,
          ai_analysis: analysis,
          detected_conditions: analysis.conditions,
          sentiment: analysis.sentiment,
          risk_level: analysis.riskLevel,
          wellness_score: analysis.wellnessScore,
        },
      ])

      // 4 – fetch recommendations
      await fetchRecommendations(analysis.riskLevel, analysis.conditions)
    } catch (err) {
      console.error(err)
      alert("Sorry, we couldn't analyse your text right now. Please try again later.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const fetchRecommendations = async (riskLevel: string, conditions: string[]) => {
    if (riskLevel === "critical") {
      // Get nearby mental health professionals
      const { data: professionals } = await supabase
        .from("professionals")
        .select(`
          *,
          users!inner(full_name, phone, location)
        `)
        .eq("is_verified", true)
        .limit(3)

      setRecommendations(professionals || [])
    } else {
      // Get relevant resources based on conditions from the seeded database
      let query = supabase.from("resources").select("*")

      // If we have specific conditions, filter by them, otherwise get general resources
      if (conditions && conditions.length > 0) {
        query = query.overlaps("conditions", conditions)
      }

      const { data: resources } = await query.limit(6)

      // If no condition-specific resources found, get general resources
      if (!resources || resources.length === 0) {
        const { data: generalResources } = await supabase.from("resources").select("*").limit(6)

        setRecommendations(generalResources || [])
      } else {
        setRecommendations(resources)
      }
    }
  }

  const openResourceDialog = (resource: any) => {
    setSelectedResource(resource)
    setIsResourceDialogOpen(true)
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return <BookOpen className="h-4 w-4" />
      case "video":
        return <ExternalLink className="h-4 w-4" />
      case "guide":
        return <BookOpen className="h-4 w-4" />
      case "tool":
        return <Lightbulb className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
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
                <h1 className="text-xl font-bold text-gray-900">Mental Health Assessment</h1>
                <p className="text-sm text-gray-600">Share your feelings for AI-powered analysis</p>
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
              className="border-b-2 border-teal-500 py-4 px-1 text-sm font-medium text-teal-600"
            >
              Assessment
            </a>
            <a
              href="/dashboard/student/results"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700"
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!analysis ? (
          <div className="space-y-8">
            {/* Assessment Input */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-teal-600" />
                  <span>How are you feeling?</span>
                </CardTitle>
                <CardDescription>
                  Take a moment to express your thoughts and feelings. Our AI will provide personalized insights and
                  recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Textarea
                  placeholder="Share what's on your mind... How are you feeling today? What challenges are you facing?"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="min-h-[200px] resize-none"
                />

                <Button
                  onClick={handleSubmit}
                  disabled={!textInput.trim() || isAnalyzing}
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Analyze My Feelings
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Helpful Prompts */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  <span>Need help getting started?</span>
                </CardTitle>
                <CardDescription>Here are some prompts to help you express your feelings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {assessmentPrompts.map((prompt, index) => (
                    <div
                      key={index}
                      className="p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() => setTextInput(prompt)}
                    >
                      <p className="text-sm text-blue-800">{prompt}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Analysis Results */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-teal-600" />
                  <span>Your Assessment Results</span>
                </CardTitle>
                <CardDescription>AI-powered analysis of your mental health and wellbeing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Risk Level</h4>
                    <Badge className={`text-lg px-4 py-2 ${getRiskLevelColor(analysis.riskLevel)}`}>
                      {analysis.riskLevel.toUpperCase()}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Wellness Score</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl font-bold text-teal-600">{analysis.wellnessScore}</span>
                      <span className="text-gray-500">/100</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Detected Conditions</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.conditions.map((condition: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                        {condition.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Summary</h4>
                  <p className="text-gray-700">{analysis.summary}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Recommendations</h4>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-teal-600 mt-1">•</span>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>
                  {analysis.riskLevel === "critical"
                    ? "Recommended Mental Health Professionals"
                    : "Recommended Resources"}
                </CardTitle>
                <CardDescription>
                  {analysis.riskLevel === "critical"
                    ? "We recommend speaking with a mental health professional immediately"
                    : "Helpful resources tailored to your needs"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {recommendations.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      {analysis.riskLevel === "critical" ? (
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <User className="h-4 w-4 text-teal-600" />
                            <h4 className="font-medium text-gray-900">{item.users.full_name}</h4>
                          </div>
                          <p className="text-sm text-gray-600">{item.specialization}</p>
                          <p className="text-sm text-gray-600">{item.clinic_name}</p>
                          <p className="text-sm text-gray-600">{item.users.location}</p>
                          <p className="text-sm text-teal-600 mt-2 font-medium">{item.users.phone}</p>
                          <Button
                            size="sm"
                            className="mt-3 bg-red-600 hover:bg-red-700"
                            onClick={() => window.open(`tel:${item.users.phone}`, "_self")}
                          >
                            Call Now
                          </Button>
                        </div>
                      ) : (
                        <div className="cursor-pointer" onClick={() => openResourceDialog(item)}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {getResourceTypeIcon(item.resource_type)}
                              <h4 className="font-medium text-gray-900 hover:text-teal-600 transition-colors">
                                {item.title}
                              </h4>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {item.resource_type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {item.content ? item.content.substring(0, 120) + "..." : "Click to read more..."}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {item.conditions?.slice(0, 3).map((condition: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                                {condition}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">By {item.author}</p>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-teal-600 border-teal-200 hover:bg-teal-50"
                            >
                              Read More
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {recommendations.length === 0 && (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No specific resources found</h3>
                    <p className="text-gray-600">We're working on adding more resources for your specific needs.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button
                onClick={() => {
                  setAnalysis(null)
                  setTextInput("")
                  setRecommendations([])
                }}
                variant="outline"
                className="bg-white"
              >
                Take Another Assessment
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Resource Detail Dialog */}
      <Dialog open={isResourceDialogOpen} onOpenChange={setIsResourceDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          {selectedResource && (
            <>
              <DialogHeader>
                <div className="flex items-center space-x-2 mb-2">
                  {getResourceTypeIcon(selectedResource.resource_type)}
                  <DialogTitle className="text-xl">{selectedResource.title}</DialogTitle>
                </div>
                <DialogDescription className="flex items-center space-x-4">
                  <span>By {selectedResource.author}</span>
                  <Badge variant="outline">{selectedResource.resource_type}</Badge>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {selectedResource.conditions?.map((condition: string, index: number) => (
                    <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                      {condition}
                    </Badge>
                  ))}
                </div>

                {/* Content */}
                <div className="prose prose-sm max-w-none">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedResource.content ||
                      "This resource contains valuable information about mental health and wellness."}
                  </div>
                </div>

                {/* External URL if available */}
                {selectedResource.url && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-2">Additional resources:</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(selectedResource.url, "_blank")}
                      className="text-teal-600 border-teal-200 hover:bg-teal-50"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View External Resource
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
