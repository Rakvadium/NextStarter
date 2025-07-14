import { auth } from '@clerk/nextjs/server'
import { convex } from '@/lib/convex'
import { api } from '@/convex/_generated/api'
import { DashboardClient } from './dashboard-client'

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) return null

  const user = await convex.query(api.auth.getUserByClerkId, { clerkId: userId })

  return <DashboardClient user={user} />
}
