'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { getStripe } from '@/lib/stripe/client'

interface PurchaseButtonProps {
  amount: number
  currency?: string
  productName: string
  productDescription?: string
  successUrl?: string
  cancelUrl?: string
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

export function PurchaseButton({
  amount,
  currency = 'usd',
  productName,
  productDescription,
  successUrl = '/account?purchase_success=true',
  cancelUrl = window.location.pathname,
  children,
  className,
  disabled,
}: PurchaseButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePurchase = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/stripe/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          productName,
          productDescription,
          successUrl: `${window.location.origin}${successUrl}`,
          cancelUrl: `${window.location.origin}${cancelUrl}`,
        }),
      })

      const { sessionId, url } = await response.json()

      if (url) {
        window.location.href = url
      } else if (sessionId) {
        const stripe = await getStripe()
        if (!stripe) {
          throw new Error('Stripe not loaded')
        }
        const { error } = await stripe.redirectToCheckout({ sessionId })

        if (error) {
          console.error('Stripe error:', error)
        }
      }
    } catch (error) {
      console.error('Purchase error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handlePurchase} disabled={isLoading || disabled} className={className}>
      {isLoading ? 'Loading...' : children}
    </Button>
  )
}
