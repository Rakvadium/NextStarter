'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { STRIPE_CONFIG } from '@/lib/stripe/config'

interface SubscriptionCardProps {
  tier: keyof typeof STRIPE_CONFIG.subscriptionTiers
  currentTier?: string
  onSelect: () => void
  isLoading?: boolean
}

export function SubscriptionCard({
  tier,
  currentTier,
  onSelect,
  isLoading,
}: SubscriptionCardProps) {
  const plan = STRIPE_CONFIG.subscriptionTiers[tier]
  const isCurrent = currentTier === tier
  const isDowngrade =
    currentTier &&
    Object.keys(STRIPE_CONFIG.subscriptionTiers).indexOf(tier) <
      Object.keys(STRIPE_CONFIG.subscriptionTiers).indexOf(currentTier)

  return (
    <Card className={`relative ${isCurrent ? 'border-primary' : ''}`}>
      {isCurrent && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Current Plan</Badge>
      )}
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>
          <span className="text-3xl font-bold">${plan.price}</span>
          {plan.price > 0 && <span className="text-muted-foreground">/month</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {plan.features.map((feature, i) => (
          <div key={i} className="flex items-start gap-2">
            <Check className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={isCurrent ? 'secondary' : 'default'}
          disabled={isCurrent || isLoading}
          onClick={onSelect}
        >
          {isCurrent
            ? 'Current Plan'
            : isDowngrade
              ? 'Downgrade'
              : tier === 'free'
                ? 'Switch to Free'
                : 'Upgrade'}
        </Button>
      </CardFooter>
    </Card>
  )
}
