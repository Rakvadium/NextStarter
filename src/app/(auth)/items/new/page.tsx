'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from 'convex/react'
import { useUser } from '@clerk/nextjs'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
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

export default function NewItemPage() {
  const router = useRouter()
  const { user } = useUser()
  const createItem = useMutation(api.items.create)
  const companies = useQuery(api.companies.list, user ? { clerkId: user.id } : 'skip')
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const companyId = formData.get('companyId') as string

    try {
      await createItem({
        title,
        description: description || undefined,
        companyId: companyId !== 'personal' ? (companyId as Id<'companies'>) : undefined,
        clerkId: user.id,
      })
      router.push('/items')
    } catch (error) {
      console.error('Failed to create item:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create a new item</CardTitle>
          <CardDescription>
            Items are a demo feature showing how to implement CRUD operations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="My awesome item"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your item..."
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyId">Company (optional)</Label>
              <Select name="companyId" defaultValue="personal" disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  {companies?.map((company) => {
                    if (!company) return null
                    return (
                      <SelectItem key={company._id} value={company._id}>
                        {company.name}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Item'}
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
