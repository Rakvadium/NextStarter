'use client'

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useConvexAuth, useAction, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export function useStripeCustomer() {
  const { user, isLoaded } = useUser()
  const { isAuthenticated } = useConvexAuth()
  const createStripeCustomer = useAction(api.stripeActions.createStripeCustomer)

  const convexUser = useQuery(
    api.auth.getUserByClerkId,
    isAuthenticated && user ? { clerkId: user.id } : 'skip'
  )

  useEffect(() => {
    if (isLoaded && isAuthenticated && user && convexUser && !convexUser.stripeCustomerId) {
      const email = user.emailAddresses[0]?.emailAddress
      if (email) {
        createStripeCustomer({
          userId: convexUser._id,
          email,
        }).catch(console.error)
      }
    }
  }, [isLoaded, isAuthenticated, user, convexUser, createStripeCustomer])

  return {
    stripeCustomerId: convexUser?.stripeCustomerId,
    isLoading: !isLoaded || !convexUser,
  }
}
