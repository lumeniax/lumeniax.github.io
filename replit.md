# Lumeniax

A premium digital ecosystem website showcasing two sub-brands: **Lumeniax Studio** (a digital transformation agency) and **Lumeniax Academy** (an editorial and training platform).

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI + shadcn/ui
- **Routing:** Wouter
- **Animations:** Framer Motion
- **State/Data:** TanStack Query (React Query)
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React + React Icons
- **Package Manager:** npm

## Project Structure

```
src/
  components/    # Reusable UI components (including shadcn/ui in components/ui/)
  hooks/         # Custom React hooks
  lib/           # Utility functions, animations
  pages/         # Page components (Home, About, Contact, Studio/*, Academy/*)
  App.tsx        # Main app with routing
  main.tsx       # Entry point
  index.css      # Global styles + Tailwind directives
public/          # Static assets
dist/            # Build output
```

## Development

```bash
npm install
npm run dev      # Starts dev server on port 5000
npm run build    # Production build to dist/
```

## Deployment

Configured as a **static** deployment:
- Build command: `npm run build`
- Public directory: `dist/`

## Configuration Notes

- Dev server runs on `0.0.0.0:5000` with `allowedHosts: true` for Replit proxy compatibility
- Path alias `@` maps to `src/`
