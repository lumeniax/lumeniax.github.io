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
public/
  articles/      # SOURCE + built article files
    *.html       # Full HTML article files (edit/add/remove here)
    articles.json        # Auto-generated manifest (do not edit manually)
    content/     # Auto-generated article body files (do not edit)
scripts/
  generate-manifest.js   # Reads public/articles/*.html → builds manifest + content files
dist/            # Build output
```

## Article System

Articles are managed via HTML files in `public/articles/`:

1. **Add** a new article: drop a `.html` file in `public/articles/`
2. **Remove** an article: delete its `.html` file
3. **Edit** an article: modify its `.html` file

The manifest (`articles.json`) and extracted content (`content/`) are **auto-generated** on every `npm run dev` and `npm run build`. You can also run it manually:

```bash
npm run manifest
```

### HTML Article Format

Add these meta tags to your HTML file's `<head>`:
```html
<meta name="lumenia:title" content="Your Article Title"/>
<meta name="lumenia:category" content="Category Name"/>
<meta name="lumenia:date" content="15 avril 2026"/>
<meta name="lumenia:icon" content="✦"/>
<meta name="description" content="Short description for the card..."/>
```

Article content should be wrapped in:
```html
<div class="article-body">
  <p>Your content here...</p>
  <h2>Section heading</h2>
  <p>More content...</p>
</div>
```

## Development

```bash
npm install
npm run dev      # Generates manifest + starts dev server on port 5000
npm run build    # Generates manifest + production build to dist/
npm run manifest # Only regenerate articles.json and content files
```

## Deployment

Configured as a **static** deployment:
- Build command: `npm run build`
- Public directory: `dist/`

## Configuration Notes

- Dev server runs on `0.0.0.0:5000` with `allowedHosts: true` for Replit proxy compatibility
- Path alias `@` maps to `src/`
- The `articles/` folder in `public/` is the single source of truth for articles
