import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { stripe } from '@/lib/stripe/server'
import { api } from '@/convex/_generated/api'
import { ConvexHttpClient } from 'convex/browser'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount, currency, productName, productDescription, successUrl, cancelUrl } =
      await req.json()

    const user = await convex.query(api.auth.getUserByClerkId, { clerkId: userId })
    if (!user || !user.stripeCustomerId) {
      return NextResponse.json({ error: 'No Stripe customer found' }, { status: 404 })
    }

    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: productName,
              description: productDescription,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: {
          userId: user._id,
          productName,
          productDescription: productDescription || '',
        },
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Error creating purchase session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
