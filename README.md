# NextJS Skeleton Application

A modern, production-ready NextJS skeleton application with authentication, multi-tenancy, and real-time data sync.

## Features

- 🔐 **Authentication**: Secure authentication with Clerk (social logins, magic links, email/password)
- 🏢 **Multi-tenancy**: Support for multiple companies/clients per user with role-based permissions
- 🔄 **Real-time Data**: Powered by Convex for real-time data synchronization
- 🎨 **Modern UI**: Built with Tailwind CSS v4 and shadcn/ui components
- 🌓 **Dark/Light Mode**: Theme toggle with system preference detection
- 📱 **Responsive**: Mobile-first design that works on all devices
- 🔒 **Type-safe**: Full TypeScript coverage with strict mode
- 🧪 **Developer Experience**: ESLint, Prettier, and Husky pre-configured

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: Convex DB
- **Authentication**: Clerk
- **Language**: TypeScript
- **Code Quality**: ESLint, Prettier, Husky

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Clerk account (free tier available)
- A Convex account (free tier available)

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd skeleton
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Configure your environment variables:

#### Clerk Configuration

1. Create a new application at [clerk.com](https://clerk.com)
2. Copy your API keys to `.env.local`
3. Configure allowed redirect URLs in Clerk dashboard

#### Convex Configuration

1. Create a new project at [convex.dev](https://convex.dev)
2. Run `npx convex dev` and follow the prompts to link your project
3. The Convex URL will be automatically added to your `.env.local`

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authenticated routes
│   ├── (public)/          # Public routes
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── layout/           # Layout components
├── convex/               # Convex backend
│   ├── schema.ts         # Database schema
│   └── *.ts              # Convex functions
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── providers/            # React context providers
└── types/                # TypeScript types
```

## Features Guide

### Authentication

The app uses Clerk for authentication. Users can sign up/in using:

- Email and password
- Social providers (Google, GitHub, etc.)
- Magic links

### Multi-tenancy

Users can:

- Create multiple companies
- Invite team members via email
- Assign roles (Owner, Admin, Member)
- Switch between companies

### CRUD Operations

The "Items" feature demonstrates:

- Creating records with user ownership
- Reading only user's own records
- Updating with permission checks
- Deleting with confirmation

### Real-time Updates

All data changes are synchronized in real-time across all connected clients using Convex subscriptions.

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Railway
- Render
- AWS Amplify
- Netlify

## Environment Variables

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/dashboard

# Convex
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Security Considerations

- All API routes are protected by Clerk middleware
- Database queries include user permission checks
- Input validation on all forms
- CSRF protection built-in
- Environment variables for sensitive data

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository.
