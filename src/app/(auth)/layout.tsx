import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { StripeCustomerProvider } from '@/components/layout/stripe-customer-provider'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/login')
  }

  return (
    <StripeCustomerProvider>
      <div className="bg-background min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </StripeCustomerProvider>
  )
}
