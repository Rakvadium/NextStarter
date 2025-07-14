'use client'

import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { useUser } from '@clerk/nextjs'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import Link from 'next/link'
import { Plus, MoreHorizontal, Edit, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

export default function ItemsPage() {
  const { user } = useUser()
  const items = useQuery(api.items.list, user ? { clerkId: user.id } : 'skip')
  const deleteItem = useMutation(api.items.remove)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(itemId: string) {
    if (!user || !confirm('Are you sure you want to delete this item?')) return

    setDeletingId(itemId)
    try {
      await deleteItem({ itemId: itemId as Id<'items'>, clerkId: user.id })
    } catch (error) {
      console.error('Failed to delete item:', error)
    } finally {
      setDeletingId(null)
    }
  }

  if (!items) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Items</h1>
          <p className="text-muted-foreground">Manage your items and content</p>
        </div>
        <Link href="/items/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Item
          </Button>
        </Link>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No items yet</CardTitle>
            <CardDescription>Create your first item to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Items are a demo feature showing how to implement CRUD operations with user-specific
              permissions.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/items/new">
              <Button>Create your first item</Button>
            </Link>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="line-clamp-1">{item.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {item.description || 'No description'}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={deletingId === item._id}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/items/${item._id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(item._id)}
                        className="text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardFooter>
                <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                  {item.status}
                </Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
