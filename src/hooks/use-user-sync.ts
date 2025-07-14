'use client'

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

export function useUserSync() {
  const { user, isLoaded } = useUser()
  const getOrCreateUser = useMutation(api.auth.getOrCreateUser)

  useEffect(() => {
    if (isLoaded && user) {
      getOrCreateUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        imageUrl: user.imageUrl || undefined,
      }).catch(console.error)
    }
  }, [isLoaded, user, getOrCreateUser])
}
