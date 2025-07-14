'use client'

import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building, FileText, Users } from 'lucide-react'
import { Doc } from '@/convex/_generated/dataModel'

export function DashboardClient({ user }: { user: Doc<'users'> | null }) {
  const { user: clerkUser } = useUser()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {clerkUser?.firstName || 'there'}!</h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your account today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-muted-foreground text-xs">You can create or join companies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <FileText className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-muted-foreground text-xs">Items you&apos;ve created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Type</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{user?.role || 'User'}</div>
            <p className="text-muted-foreground text-xs">Your current role</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get you started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <a
                href="/companies/new"
                className="bg-primary text-primary-foreground hover:bg-primary/90 block rounded-md px-3 py-2 text-center text-sm font-medium"
              >
                Create a Company
              </a>
              <a
                href="/items/new"
                className="bg-background hover:bg-muted block rounded-md border px-3 py-2 text-center text-sm font-medium"
              >
                Create an Item
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your profile details</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground font-medium">Email</dt>
                <dd>{clerkUser?.primaryEmailAddress?.emailAddress}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">User ID</dt>
                <dd className="font-mono text-xs">{clerkUser?.id}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">Created</dt>
                <dd>
                  {clerkUser?.createdAt
                    ? new Date(clerkUser.createdAt).toLocaleDateString()
                    : 'N/A'}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
