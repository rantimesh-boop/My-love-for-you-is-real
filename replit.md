# Overview

This is a fun Valentine's Day proposal web app. It presents the recipient (hardcoded as "Oyiza!!!") with a romantic proposal page featuring an evasive "No" button (that moves away when hovered), confetti celebrations when "Yes" is clicked, floating heart animations, background romantic music, a meme carousel, and an optional mini-game challenge. The app tracks "Yes" responses in a PostgreSQL database and sends email notifications via Resend when someone accepts.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend
- **Framework**: React 18 with TypeScript, built with Vite
- **Routing**: Wouter (lightweight client-side router)
- **State Management**: Local React state for UI, TanStack React Query for server communication
- **UI Components**: shadcn/ui (new-york style) with Radix UI primitives, styled with Tailwind CSS
- **Animations**: Framer Motion for the "No" button evasion and page transitions
- **Special Effects**: canvas-confetti for celebration effects, custom FloatingHearts component for ambient hearts
- **Carousel**: Embla Carousel for meme slideshow in success view
- **Audio**: Custom `useBackgroundAudio` hook wrapping HTML5 Audio API for romantic background music
- **Fonts**: 'Architects Daughter' (display/headers), 'DM Sans' (body text)
- **Color Theme**: Romantic red/pink palette using CSS custom properties

## Backend
- **Framework**: Express.js with TypeScript, running on Node.js
- **Server**: HTTP server created with `createServer` from Node's `http` module
- **Development**: Vite dev server middleware integrated with Express for HMR
- **Production**: Static file serving from `dist/public`
- **Build**: Custom build script using esbuild (server) + Vite (client), output to `dist/`

## API Routes
- `POST /api/responses` — Record a proposal response (name + accepted status)
- `GET /api/responses` — Retrieve all recorded responses
- `POST /api/notify-acceptance` — Send email notification when someone says "Yes"

## Database
- **Database**: PostgreSQL (required, via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema validation
- **Schema** (in `shared/schema.ts`):
  - `users` table: `id` (serial PK), `username` (unique text), `password` (text) — exists but currently unused
  - `responses` table: `id` (serial PK), `recipient_name` (text), `accepted` (boolean, default false), `timestamp` (timestamp, default now)
- **Migrations**: Managed via `drizzle-kit push` command (`npm run db:push`)

## Shared Code
- `shared/schema.ts` — Database table definitions, Zod validation schemas, and TypeScript types
- `shared/routes.ts` — API route contract definitions (path, method, input schema)

## Key Pages
- `/` — Main Proposal page (the core interactive Valentine's proposal)
- `Creator.tsx` — Link generator page (exists but not routed) for creating personalized proposal URLs

# External Dependencies

- **PostgreSQL** — Primary database, connected via `DATABASE_URL` env var using `pg` Pool
- **Resend** — Email delivery service for sending "She said YES!" notifications to `rantimesh@gmail.com`, requires `RESEND_API_KEY` env var
- **Pixabay CDN** — Hosts the background romantic piano music MP3
- **Unsplash** — Source for meme carousel images
- **Google Fonts** — Architects Daughter, DM Sans, Fira Code, Geist Mono fonts