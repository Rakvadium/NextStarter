'use client'

import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useConvexAuth } from 'convex/react'

export default function AccountPage() {
  const { user, isLoaded } = useUser()
  const { isAuthenticated } = useConvexAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const convexUser = useQuery(
    api.auth.getUserByClerkId,
    isAuthenticated && user ? { clerkId: user.id } : 'skip'
  )

  const subscription = useQuery(
    api.stripe.getUserSubscription,
    convexUser ? { userId: convexUser._id } : 'skip'
  )

  const purchases = useQuery(
    api.stripe.getUserPurchases,
    convexUser ? { userId: convexUser._id } : 'skip'
  )

  if (!isLoaded || !user) {
    return <div>Loading...</div>
  }

  const handleManageSubscription = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnUrl: window.location.href,
        }),
      })
      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Error creating portal session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSubscriptionBadge = () => {
    const tier = subscription?.tier || 'free'

    const colors = {
      free: 'secondary',
      basic: 'default',
      pro: 'outline',
      enterprise: 'destructive',
    } as const

    return (
      <Badge variant={colors[tier] || 'secondary'}>
        {tier.charAt(0).toUpperCase() + tier.slice(1)}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      canceled: 'destructive',
      past_due: 'outline',
      succeeded: 'default',
      failed: 'destructive',
      refunded: 'secondary',
    }

    const variant = colors[status] || 'secondary'

    return (
      <Badge variant={variant}>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </Badge>
    )
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">Manage your account and billing information</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your account details from Clerk</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-muted-foreground text-sm">
                  {user.emailAddresses[0]?.emailAddress}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-muted-foreground text-sm">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">User ID</p>
                <p className="text-muted-foreground font-mono text-sm">{user.id}</p>
              </div>
              {convexUser?.stripeCustomerId && (
                <div>
                  <p className="text-sm font-medium">Stripe Customer ID</p>
                  <p className="text-muted-foreground font-mono text-sm">
                    {convexUser.stripeCustomerId}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
              <CardDescription>Manage your subscription plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Current Plan</p>
                  <div className="mt-1 flex items-center gap-2">
                    {getSubscriptionBadge()}
                    {subscription?.status && getStatusBadge(subscription.status)}
                  </div>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => router.push('/pricing')}>
                    View Plans
                  </Button>
                  {subscription?.tier !== 'free' && (
                    <Button onClick={handleManageSubscription} disabled={isLoading}>
                      Manage Subscription
                    </Button>
                  )}
                </div>
              </div>

              {subscription?.subscriptionId && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium">Subscription ID</p>
                    <p className="text-muted-foreground font-mono text-sm">
                      {subscription.subscriptionId}
                    </p>
                  </div>
                </>
              )}

              {subscription?.endDate && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium">
                      {subscription.status === 'canceled' ? 'Ends on' : 'Next billing date'}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {format(new Date(subscription.endDate), 'PPP')}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Purchase History</CardTitle>
              <CardDescription>Your one-time purchases</CardDescription>
            </CardHeader>
            <CardContent>
              {purchases && purchases.length > 0 ? (
                <div className="space-y-4">
                  {purchases.map((purchase) => (
                    <div
                      key={purchase._id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <p className="font-medium">{purchase.productName}</p>
                        {purchase.productDescription && (
                          <p className="text-muted-foreground text-sm">
                            {purchase.productDescription}
                          </p>
                        )}
                        <p className="text-muted-foreground text-sm">
                          {format(new Date(purchase.createdAt), 'PPP')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: purchase.currency.toUpperCase(),
                          }).format(purchase.amount / 100)}
                        </p>
                        {getStatusBadge(purchase.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No purchases yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
