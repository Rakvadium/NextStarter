import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/providers/theme-provider'
import { ConvexProvider } from '@/providers/convex-provider'
import { UserSyncProvider } from '@/providers/user-sync-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NextJS Skeleton App',
  description: 'A modern NextJS skeleton with authentication and multi-tenancy',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <ClerkProvider>
            <ConvexProvider>
              <UserSyncProvider>{children}</UserSyncProvider>
            </ConvexProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
