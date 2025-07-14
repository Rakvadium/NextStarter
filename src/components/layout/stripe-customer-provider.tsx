'use client'

import { useStripeCustomer } from '@/hooks/useStripeCustomer'

export function StripeCustomerProvider({ children }: { children: React.ReactNode }) {
  useStripeCustomer()
  return <>{children}</>
}
