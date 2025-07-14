import { SignUp } from '@clerk/nextjs'

export default function RegisterPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <SignUp
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
