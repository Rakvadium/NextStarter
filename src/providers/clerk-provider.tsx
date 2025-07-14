'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

export function ClerkProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: 'hsl(222.2 47.4% 11.2%)',
          colorBackground: 'hsl(0 0% 100%)',
        },
        elements: {
          formButtonPrimary:
            'bg-primary text-primary-foreground hover:bg-primary/90 transition-colors',
          card: 'shadow-none',
        },
      }}
    >
      {children}
    </ClerkProvider>
  )
}
