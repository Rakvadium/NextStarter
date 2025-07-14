'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { getStripe } from '@/lib/stripe/client'

interface CheckoutButtonProps {
  priceId: string
  mode?: 'payment' | 'subscription'
  successUrl?: string
  cancelUrl?: string
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

export function CheckoutButton({
  priceId,
  mode = 'subscription',
  successUrl = '/account?success=true',
  cancelUrl = '/pricing',
  children,
  className,
  disabled,
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          mode,
          successUrl: `${window.location.origin}${successUrl}`,
          cancelUrl: `${window.location.origin}${cancelUrl}`,
        }),
      })

      const { sessionId, url } = await response.json()

      if (url) {
        window.location.href = url
      } else if (sessionId) {
        const stripe = await getStripe()
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({ sessionId })

          if (error) {
            console.error('Stripe error:', error)
          }
        }
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={isLoading || disabled} className={className}>
      {isLoading ? 'Loading...' : children}
    </Button>
  )
}
