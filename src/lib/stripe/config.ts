// This file contains shared Stripe configuration
// Server-only imports should be in separate files

export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  prices: {
    basic: process.env.STRIPE_PRICE_ID_BASIC || 'price_basic',
    pro: process.env.STRIPE_PRICE_ID_PRO || 'price_pro',
    enterprise: process.env.STRIPE_PRICE_ID_ENTERPRISE || 'price_enterprise',
  },
  subscriptionTiers: {
    free: {
      name: 'Free',
      price: 0,
      features: ['Up to 3 items', 'Basic support', 'Community access'],
    },
    basic: {
      name: 'Basic',
      price: 9,
      priceId: process.env.STRIPE_PRICE_ID_BASIC || 'price_basic',
      features: ['Up to 20 items', 'Email support', 'Advanced features', 'API access'],
    },
    pro: {
      name: 'Pro',
      price: 29,
      priceId: process.env.STRIPE_PRICE_ID_PRO || 'price_pro',
      features: [
        'Unlimited items',
        'Priority support',
        'All features',
        'API access',
        'Custom integrations',
      ],
    },
    enterprise: {
      name: 'Enterprise',
      price: 99,
      priceId: process.env.STRIPE_PRICE_ID_ENTERPRISE || 'price_enterprise',
      features: [
        'Everything in Pro',
        'Dedicated support',
        'Custom features',
        'SLA guarantee',
        'Training sessions',
      ],
    },
  },
}
