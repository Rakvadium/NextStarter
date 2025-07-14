import { stripe } from './server'

export async function createStripeCustomer(email: string, userId: string) {
  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  })
  return customer
}

export async function createCheckoutSession({
  customerId,
  priceId,
  successUrl,
  cancelUrl,
  mode = 'subscription',
  metadata = {},
}: {
  customerId: string
  priceId?: string
  successUrl: string
  cancelUrl: string
  mode?: 'payment' | 'subscription'
  metadata?: Record<string, string>
}) {
  const sessionConfig: Record<string, unknown> = {
    customer: customerId,
    mode,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
  }

  if (mode === 'subscription') {
    sessionConfig.line_items = [
      {
        price: priceId,
        quantity: 1,
      },
    ]
    sessionConfig.subscription_data = {
      metadata,
    }
  }

  const session = await stripe.checkout.sessions.create(sessionConfig)
  return session
}

export async function createPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
  return session
}

export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  })
  return subscription
}

export async function resumeSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  })
  return subscription
}

export async function getSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  return subscription
}

export async function getInvoices(customerId: string, limit = 10) {
  const invoices = await stripe.invoices.list({
    customer: customerId,
    limit,
  })
  return invoices.data
}

export function formatPrice(amount: number, currency = 'usd') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}
