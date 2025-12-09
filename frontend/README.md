
# Frontend — Next.js 16 + Tailwind + Apollo

- App Router + React Server Components
- Drag & drop upload (raw fetch)
- Live semantic search with Apollo Client
- Beautiful UI with glassmorphism
- Fully typed

## Environment Variables

### PostHog Analytics (Production)

PostHog is used for tracking page views and visitor metrics in production.

- `NEXT_PUBLIC_POSTHOG_KEY` - Your PostHog project API key
- `NEXT_PUBLIC_POSTHOG_HOST` - Your PostHog instance URL (e.g., `https://app.posthog.com` or your self-hosted URL)

Note: PostHog only initializes in production (`NODE_ENV === "production"`).