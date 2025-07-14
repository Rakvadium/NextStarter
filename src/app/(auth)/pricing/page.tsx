'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { useRouter } from 'next/navigation'
import { api } from '@/convex/_generated/api'
import { SubscriptionCard } from '@/components/billing/subscription-card'
import { STRIPE_CONFIG } from '@/lib/stripe/config'
import { useConvexAuth } from 'convex/react'

export default function PricingPage() {
  const { user } = useUser()
  const { isAuthenticated } = useConvexAuth()
  const router = useRouter()
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const convexUser = useQuery(
    api.auth.getUserByClerkId,
    isAuthenticated && user ? { clerkId: user.id } : 'skip'
  )

  const subscription = useQuery(
    api.stripe.getUserSubscription,
    convexUser ? { userId: convexUser._id } : 'skip'
  )

  const handleSelectPlan = async (tier: string) => {
    if (!user) {
      router.push('/login')
      return
    }

    if (tier === 'free' && subscription?.tier !== 'free') {
      router.push('/account')
      return
    }

    if (tier === 'free') {
      return
    }

    setSelectedTier(tier)
    setIsLoading(true)

    try {
      const tierConfig =
        STRIPE_CONFIG.subscriptionTiers[tier as keyof typeof STRIPE_CONFIG.subscriptionTiers]
      if (!('priceId' in tierConfig)) {
        return
      }
      const priceId = tierConfig.priceId

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          mode: 'subscription',
          successUrl: `${window.location.origin}/account?success=true`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      })

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-6xl py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Choose Your Plan</h1>
        <p className="text-muted-foreground text-xl">
          Select the perfect plan for your needs. Upgrade or downgrade at any time.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(STRIPE_CONFIG.subscriptionTiers).map(([key]) => (
          <SubscriptionCard
            key={key}
            tier={key as keyof typeof STRIPE_CONFIG.subscriptionTiers}
            currentTier={subscription?.tier}
            onSelect={() => handleSelectPlan(key)}
            isLoading={isLoading && selectedTier === key}
          />
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="mb-4 text-2xl font-bold">All Plans Include</h2>
        <div className="mx-auto grid max-w-3xl gap-4 text-left md:grid-cols-3">
          <div className="space-y-2">
            <h3 className="font-semibold">Secure Payment Processing</h3>
            <p className="text-muted-foreground text-sm">
              All payments are processed securely through Stripe
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Cancel Anytime</h3>
            <p className="text-muted-foreground text-sm">
              No long-term contracts. Cancel your subscription at any time
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Instant Access</h3>
            <p className="text-muted-foreground text-sm">
              Get immediate access to features after upgrading
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted mt-16 rounded-lg p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">Test Mode Active</h2>
        <p className="text-muted-foreground mb-4">
          This is a test environment. Use these test card numbers:
        </p>
        <div className="mx-auto grid max-w-md gap-2 text-left font-mono text-sm">
          <div>Success: 4242 4242 4242 4242</div>
          <div>Decline: 4000 0000 0000 0002</div>
          <div>Authentication: 4000 0025 0000 3155</div>
        </div>
        <p className="text-muted-foreground mt-4 text-xs">
          Use any future date for expiry and any 3 digits for CVC
        </p>
      </div>
    </div>
  )
}
