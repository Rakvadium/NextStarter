import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const { userId } = await auth()

  if (userId) {
    redirect('/dashboard')
  }

  return (
    <div className="bg-background min-h-screen">
      <nav className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">NextJS Skeleton</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-muted-foreground hover:text-foreground text-sm font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Modern NextJS Starter Template
          </h2>
          <p className="text-muted-foreground mt-6 text-lg leading-8">
            A production-ready skeleton application with authentication, multi-tenancy, and
            real-time data sync. Built with Next.js 14, Clerk, Convex, and Tailwind CSS.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/register"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-6 py-3 text-sm font-semibold shadow-sm"
            >
              Get started
            </Link>
            <Link
              href="/login"
              className="hover:text-muted-foreground text-sm leading-6 font-semibold"
            >
              Login <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            <div className="relative pl-16">
              <dt className="text-base leading-7 font-semibold">
                <div className="bg-primary absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg">
                  <svg
                    className="text-primary-foreground h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                </div>
                Secure Authentication
              </dt>
              <dd className="text-muted-foreground mt-2 text-base leading-7">
                Built-in authentication with Clerk. Supports social logins, magic links, and
                traditional email/password.
              </dd>
            </div>

            <div className="relative pl-16">
              <dt className="text-base leading-7 font-semibold">
                <div className="bg-primary absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg">
                  <svg
                    className="text-primary-foreground h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                    />
                  </svg>
                </div>
                Multi-tenancy Ready
              </dt>
              <dd className="text-muted-foreground mt-2 text-base leading-7">
                Support for multiple companies/clients per user with role-based permissions and
                invitation system.
              </dd>
            </div>

            <div className="relative pl-16">
              <dt className="text-base leading-7 font-semibold">
                <div className="bg-primary absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg">
                  <svg
                    className="text-primary-foreground h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                    />
                  </svg>
                </div>
                Real-time Data Sync
              </dt>
              <dd className="text-muted-foreground mt-2 text-base leading-7">
                Powered by Convex for real-time data synchronization across all connected clients.
              </dd>
            </div>

            <div className="relative pl-16">
              <dt className="text-base leading-7 font-semibold">
                <div className="bg-primary absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg">
                  <svg
                    className="text-primary-foreground h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                </div>
                Modern Stack
              </dt>
              <dd className="text-muted-foreground mt-2 text-base leading-7">
                Built with Next.js 14, TypeScript, Tailwind CSS v4, and shadcn/ui components.
              </dd>
            </div>
          </dl>
        </div>
      </main>
    </div>
  )
}
