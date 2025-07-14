'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PurchaseButton } from '@/components/billing/purchase-button'
import { Badge } from '@/components/ui/badge'

const products = [
  {
    id: 1,
    name: 'Premium Template Pack',
    description: 'A collection of 50+ premium templates for your projects',
    price: 4900,
    originalPrice: 9900,
    badge: 'Best Seller',
  },
  {
    id: 2,
    name: 'Advanced Analytics Add-on',
    description: 'Unlock advanced analytics and reporting features',
    price: 2900,
  },
  {
    id: 3,
    name: 'Custom Integration Service',
    description: 'One-time setup for custom third-party integrations',
    price: 19900,
    badge: 'Popular',
  },
  {
    id: 4,
    name: 'Priority Support Credit',
    description: '10 hours of priority support from our expert team',
    price: 99900,
  },
  {
    id: 5,
    name: 'White-label License',
    description: 'Remove branding and use your own logo',
    price: 29900,
  },
  {
    id: 6,
    name: 'API Access Token',
    description: 'Lifetime access to our REST API',
    price: 14900,
    badge: 'Developer',
  },
]

export default function ShopPage() {
  return (
    <div className="container max-w-6xl py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Shop</h1>
        <p className="text-muted-foreground text-xl">
          One-time purchases to enhance your experience
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="relative">
            {product.badge && (
              <Badge className="absolute -top-2 -right-2" variant="secondary">
                {product.badge}
              </Badge>
            )}
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">${(product.price / 100).toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-muted-foreground text-sm line-through">
                    ${(product.originalPrice / 100).toFixed(2)}
                  </span>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <PurchaseButton
                amount={product.price}
                productName={product.name}
                productDescription={product.description}
                className="w-full"
              >
                Buy Now
              </PurchaseButton>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="bg-muted mt-16 rounded-lg p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">Test Mode Active</h2>
        <p className="text-muted-foreground mb-4">Use these test card numbers for purchases:</p>
        <div className="mx-auto grid max-w-md gap-2 text-left font-mono text-sm">
          <div>Success: 4242 4242 4242 4242</div>
          <div>Decline: 4000 0000 0000 0002</div>
          <div>3D Secure: 4000 0025 0000 3155</div>
        </div>
        <p className="text-muted-foreground mt-4 text-xs">
          Use any future date for expiry and any 3 digits for CVC
        </p>
      </div>
    </div>
  )
}
