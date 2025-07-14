/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { internal } from '@/convex/_generated/api'
import { ConvexHttpClient } from 'convex/browser'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('Stripe-Signature') as string

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error: unknown) {
    console.error(
      'Webhook signature verification failed:',
      error instanceof Error ? error.message : error
    )
    return NextResponse.json(
      { error: `Webhook Error: ${error instanceof Error ? error.message : error}` },
      { status: 400 }
    )
  }

  try {
    const { processed, eventId } = await (convex.mutation as any)(
      internal.stripe.recordWebhookEvent,
      {
        stripeEventId: event.id,
        type: event.type,
        data: event.data,
      }
    )

    if (processed) {
      return NextResponse.json({ received: true })
    }

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Record<string, unknown>
        const customerId = subscription.customer as string

        const user = await convex.query(internal.stripe.getUserByStripeCustomerId, {
          stripeCustomerId: customerId,
        })

        if (user) {
          const tierMap: Record<string, string> = {
            [process.env.STRIPE_PRICE_ID_BASIC!]: 'basic',
            [process.env.STRIPE_PRICE_ID_PRO!]: 'pro',
            [process.env.STRIPE_PRICE_ID_ENTERPRISE!]: 'enterprise',
          }

          const priceId = (subscription.items as any).data[0].price.id
          const tier = tierMap[priceId] || 'free'

          await (convex.mutation as any)(internal.stripe.updateSubscription, {
            userId: user._id,
            subscriptionId: subscription.id,
            subscriptionStatus: subscription.status,
            subscriptionTier: tier,
            subscriptionEndDate: subscription.cancel_at ? subscription.cancel_at * 1000 : undefined,
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Record<string, unknown>
        const customerId = subscription.customer as string

        const user = await convex.query(internal.stripe.getUserByStripeCustomerId, {
          stripeCustomerId: customerId,
        })

        if (user) {
          await (convex.mutation as any)(internal.stripe.updateSubscription, {
            userId: user._id,
            subscriptionId: subscription.id,
            subscriptionStatus: 'canceled',
            subscriptionTier: 'free',
            subscriptionEndDate: Date.now(),
          })
        }
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Record<string, unknown>
        const metadata = paymentIntent.metadata

        if (metadata.productName && metadata.userId) {
          await (convex.mutation as any)(internal.stripe.createPurchase, {
            userId: metadata.userId,
            stripePaymentIntentId: paymentIntent.id,
            stripeCustomerId: paymentIntent.customer,
            productName: metadata.productName,
            productDescription: metadata.productDescription,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            status: 'succeeded',
            metadata: metadata,
          })
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Record<string, unknown>

        await (convex.mutation as any)(internal.stripe.updatePurchaseStatus, {
          stripePaymentIntentId: paymentIntent.id,
          status: 'failed',
        })
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as any

        await (convex.mutation as any)(internal.stripe.updatePurchaseStatus, {
          stripePaymentIntentId: charge.payment_intent,
          status: 'refunded',
        })
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Record<string, unknown>
        const customerId = invoice.customer as string

        const user = await convex.query(internal.stripe.getUserByStripeCustomerId, {
          stripeCustomerId: customerId,
        })

        if (user && invoice.subscription) {
          console.log('Invoice payment succeeded for user:', user._id)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Record<string, unknown>
        const customerId = invoice.customer as string

        const user = await convex.query(internal.stripe.getUserByStripeCustomerId, {
          stripeCustomerId: customerId,
        })

        if (user) {
          console.log('Invoice payment failed for user:', user._id)
        }
        break
      }

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    await (convex.mutation as any)(internal.stripe.markWebhookEventProcessed, { eventId })

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Error processing webhook' }, { status: 500 })
  }
}
