"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Plus, Search, Calendar, Smile, TrendingUp } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { LogoutButton } from "@/components/layout/logout-button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const moodOptions = [
  { value: "excellent", label: "Excellent", icon: "😄", color: "bg-green-100 text-green-800" },
  { value: "good", label: "Good", icon: "😊", color: "bg-blue-100 text-blue-800" },
  { value: "okay", label: "Okay", icon: "😐", color: "bg-yellow-100 text-yellow-800" },
  { value: "bad", label: "Bad", icon: "😔", color: "bg-orange-100 text-orange-800" },
  { value: "terrible", label: "Terrible", icon: "😢", color: "bg-red-100 text-red-800" },
]

export default function JournalPage() {
  const [entries, setEntries] = useState<any[]>([])
  const [filteredEntries, setFilteredEntries] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMood, setSelectedMood] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // New entry form
  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    mood: "",
    tags: "",
  })

  useEffect(() => {
    fetchEntries()
  }, [])

  useEffect(() => {
    filterEntries()
  }, [entries, searchTerm, selectedMood])

  const fetchEntries = async () => {
    try {
      const userData = localStorage.getItem("user")
      if (!userData) return

      const user = JSON.parse(userData)

      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("student_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setEntries(data || [])
    } catch (error) {
      console.error("Error fetching journal entries:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterEntries = () => {
    let filtered = entries

    if (searchTerm) {
      filtered = filtered.filter(
        (entry) =>
          entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedMood) {
      filtered = filtered.filter((entry) => entry.mood === selectedMood)
    }

    setFilteredEntries(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const userData = localStorage.getItem("user")
      if (!userData) return

      const user = JSON.parse(userData)

      const { data, error } = await supabase
        .from("journal_entries")
        .insert([
          {
            student_id: user.id,
            title: newEntry.title,
            content: newEntry.content,
            mood: newEntry.mood,
            tags: newEntry.tags ? newEntry.tags.split(",").map((tag) => tag.trim()) : [],
          },
        ])
        .select()
        .single()

      if (error) throw error

      setEntries([data, ...entries])
      setNewEntry({ title: "", content: "", mood: "", tags: "" })
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error creating journal entry:", error)
    }
  }

  const handleOpenDialog = () => {
    console.log("Opening dialog...")
    setIsDialogOpen(true)
  }

  // Calculate stats
  const totalEntries = entries.length
  const daysActive = new Set(entries.map((entry) => new Date(entry.created_at).toDateString())).size

  const positiveMoods = ["excellent", "good"]
  const negativeMoods = ["bad", "terrible"]

  const positiveDays = entries.filter((entry) => positiveMoods.includes(entry.mood)).length
  const negativeDays = entries.filter((entry) => negativeMoods.includes(entry.mood)).length

  const getMoodIcon = (mood: string) => {
    const moodOption = moodOptions.find((option) => option.value === mood)
    return moodOption ? moodOption.icon : "😐"
  }

  const getMoodColor = (mood: string) => {
    const moodOption = moodOptions.find((option) => option.value === mood)
    return moodOption ? moodOption.color : "bg-gray-100 text-gray-800"
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
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">My Journal</h1>
                <p className="text-sm text-gray-600">Track your thoughts and moods</p>
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
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              My Results
            </a>
            <a
              href="/dashboard/student/journal"
              className="border-b-2 border-teal-500 py-4 px-1 text-sm font-medium text-teal-600"
            >
              Journal
            </a>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Entry Button at Top */}
        <div className="mb-8">
          <Button
            onClick={handleOpenDialog}
            className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Entry
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Entries</p>
                  <p className="text-3xl font-bold text-gray-900">{totalEntries}</p>
                </div>
                <BookOpen className="h-8 w-8 text-teal-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Days Active</p>
                  <p className="text-3xl font-bold text-gray-900">{daysActive}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Positive Days</p>
                  <p className="text-3xl font-bold text-gray-900">{positiveDays}</p>
                </div>
                <Smile className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Challenging Days</p>
                  <p className="text-3xl font-bold text-gray-900">{negativeDays}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Floating Action Button */}

        {/* Search and Filter */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search entries by title, content, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedMood} onValueChange={setSelectedMood}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All moods</SelectItem>
                  {moodOptions.map((mood) => (
                    <SelectItem key={mood.value} value={mood.value}>
                      <span className="flex items-center space-x-2">
                        <span>{mood.icon}</span>
                        <span>{mood.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Journal Entries */}
        <div className="space-y-6">
          {filteredEntries.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No entries found</h3>
                <p className="text-gray-600 mb-4">
                  {entries.length === 0
                    ? "Start your wellness journey by creating your first journal entry."
                    : "Try adjusting your search or filter criteria."}
                </p>
                <Button onClick={handleOpenDialog} className="bg-gradient-to-r from-teal-500 to-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Entry
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredEntries.map((entry) => (
              <Card key={entry.id} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{entry.title}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(entry.created_at).toLocaleDateString()} at{" "}
                        {new Date(entry.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    {entry.mood && (
                      <Badge className={getMoodColor(entry.mood)}>
                        <span className="mr-1">{getMoodIcon(entry.mood)}</span>
                        {moodOptions.find((m) => m.value === entry.mood)?.label}
                      </Badge>
                    )}
                  </div>

                  <p className="text-gray-700 mb-4 whitespace-pre-wrap">{entry.content}</p>

                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Dialog Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Journal Entry</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Give your entry a title..."
                value={newEntry.title}
                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write about your thoughts, feelings, or experiences..."
                value={newEntry.content}
                onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                className="min-h-[120px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mood">How are you feeling?</Label>
              <Select value={newEntry.mood} onValueChange={(value) => setNewEntry({ ...newEntry, mood: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your mood" />
                </SelectTrigger>
                <SelectContent>
                  {moodOptions.map((mood) => (
                    <SelectItem key={mood.value} value={mood.value}>
                      <span className="flex items-center space-x-2">
                        <span>{mood.icon}</span>
                        <span>{mood.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (optional)</Label>
              <Input
                id="tags"
                placeholder="Add tags separated by commas (e.g., study, stress, family)"
                value={newEntry.tags}
                onChange={(e) => setNewEntry({ ...newEntry, tags: e.target.value })}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-teal-500 to-blue-600">
                Save Entry
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
