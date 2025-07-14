'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Companies', href: '/companies' },
  { name: 'Items', href: '/items' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Shop', href: '/shop' },
  { name: 'Account', href: '/account' },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-semibold">
              NextJS Skeleton
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium',
                    pathname === item.href
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </nav>
  )
}
