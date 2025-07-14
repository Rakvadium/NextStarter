import { SignIn } from '@clerk/nextjs'

export default function LoginPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'shadow-none border',
          },
        }}
      />
    </div>
  )
}
