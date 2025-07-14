'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation } from 'convex/react'
import { useUser } from '@clerk/nextjs'
import { api } from '@/convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Id } from '@/convex/_generated/dataModel'

export default function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { user } = useUser()
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)

  useEffect(() => {
    params.then(setResolvedParams)
  }, [params])

  const item = useQuery(
    api.items.get,
    user && resolvedParams ? { itemId: resolvedParams.id as Id<'items'>, clerkId: user.id } : 'skip'
  )
  const updateItem = useMutation(api.items.update)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
  })

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description || '',
        status: item.status,
      })
    }
  }, [item])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user || !resolvedParams) return

    setIsLoading(true)
    try {
      await updateItem({
        itemId: resolvedParams.id as Id<'items'>,
        title: formData.title,
        description: formData.description || undefined,
        status: formData.status,
        clerkId: user.id,
      })
      router.push('/items')
    } catch (error) {
      console.error('Failed to update item:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!item) {
    return <div>Loading...</div>
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit item</CardTitle>
          <CardDescription>Make changes to your item</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                name="status"
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as 'draft' | 'published' | 'archived' })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
