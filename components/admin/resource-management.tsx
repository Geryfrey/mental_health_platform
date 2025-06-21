"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Resource {
  id: string
  title: string
  content?: string
  url?: string
  resource_type: string
  conditions?: string[]
  author?: string
  created_at: string
}

export function ResourceManagement() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [resourceForm, setResourceForm] = useState({
    title: "",
    content: "",
    url: "",
    resource_type: "article",
    conditions: "",
    author: "",
  })

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase.from("resources").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setResources(data || [])
    } catch (error) {
      console.error("Error fetching resources:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const resourceData = {
        ...resourceForm,
        conditions: resourceForm.conditions
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c),
      }

      if (editingResource) {
        const { error } = await supabase.from("resources").update(resourceData).eq("id", editingResource.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("resources").insert([resourceData])

        if (error) throw error
      }

      setResourceForm({
        title: "",
        content: "",
        url: "",
        resource_type: "article",
        conditions: "",
        author: "",
      })
      setIsResourceDialogOpen(false)
      setEditingResource(null)
      fetchResources()
    } catch (error) {
      console.error("Error saving resource:", error)
    }
  }

  const deleteResource = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return

    try {
      const { error } = await supabase.from("resources").delete().eq("id", id)

      if (error) throw error
      fetchResources()
    } catch (error) {
      console.error("Error deleting resource:", error)
    }
  }

  const editResource = (resource: Resource) => {
    setResourceForm({
      title: resource.title,
      content: resource.content || "",
      url: resource.url || "",
      resource_type: resource.resource_type,
      conditions: resource.conditions?.join(", ") || "",
      author: resource.author || "",
    })
    setEditingResource(resource)
    setIsResourceDialogOpen(true)
  }

  if (loading) {
    return <div className="text-center py-8">Loading resources...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={isResourceDialogOpen} onOpenChange={setIsResourceDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-teal-500 to-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingResource ? "Edit Resource" : "Add New Resource"}</DialogTitle>
              <DialogDescription>Create or edit mental health resources for students</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleResourceSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={resourceForm.title}
                  onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={resourceForm.content}
                  onChange={(e) => setResourceForm({ ...resourceForm, content: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={resourceForm.url}
                  onChange={(e) => setResourceForm({ ...resourceForm, url: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resource_type">Type</Label>
                <Select
                  value={resourceForm.resource_type}
                  onValueChange={(value) => setResourceForm({ ...resourceForm, resource_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="guide">Guide</SelectItem>
                    <SelectItem value="tool">Tool</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conditions">Conditions (comma separated)</Label>
                <Input
                  id="conditions"
                  placeholder="anxiety, depression, stress"
                  value={resourceForm.conditions}
                  onChange={(e) => setResourceForm({ ...resourceForm, conditions: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={resourceForm.author}
                  onChange={(e) => setResourceForm({ ...resourceForm, author: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsResourceDialogOpen(false)
                    setEditingResource(null)
                    setResourceForm({
                      title: "",
                      content: "",
                      url: "",
                      resource_type: "article",
                      conditions: "",
                      author: "",
                    })
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-teal-500 to-blue-600">
                  {editingResource ? "Update" : "Create"} Resource
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {resources.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No resources found. Add your first resource to get started.
          </div>
        ) : (
          resources.map((resource) => (
            <div key={resource.id} className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{resource.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{resource.content?.substring(0, 100)}...</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="secondary">{resource.resource_type}</Badge>
                    <span className="text-sm text-gray-600">By: {resource.author}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {resource.conditions?.map((condition: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Created: {new Date(resource.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" onClick={() => editResource(resource)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteResource(resource.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
