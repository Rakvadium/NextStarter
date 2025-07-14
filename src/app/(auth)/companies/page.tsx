'use client'

import { useQuery } from 'convex/react'
import { useUser } from '@clerk/nextjs'
import { api } from '@/convex/_generated/api'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function CompaniesPage() {
  const { user } = useUser()
  const companies = useQuery(api.companies.list, user ? { clerkId: user.id } : 'skip')

  if (!companies) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Companies</h1>
          <p className="text-muted-foreground">Manage your companies and team members</p>
        </div>
        <Link href="/companies/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Company
          </Button>
        </Link>
      </div>

      {companies.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No companies yet</CardTitle>
            <CardDescription>Create your first company to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Companies allow you to collaborate with team members and organize your work.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/companies/new">
              <Button>Create your first company</Button>
            </Link>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => {
            if (!company) return null
            return (
              <Card key={company._id}>
                <CardHeader>
                  <CardTitle>{company.name}</CardTitle>
                  <CardDescription>{company.description || 'No description'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Role:{' '}
                    <span className="font-medium capitalize">
                      {company.memberRole.replace('company_', '')}
                    </span>
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href={`/companies/${company._id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      View Company
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
