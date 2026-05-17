# INFACT SOLUTIONS - Agent Handoff

Last reviewed: 2026-05-17

## 1. What This Project Is

This repository is a Next.js marketing and project showcase site for **INFACT SOLUTIONS**, positioned as a global IT, cybersecurity, and software development partner.

It is no longer only a one-page landing site. The current app includes:

- A home page with marketing sections
- A `/projects` listing page
- Static project detail routes at `/projects/[id]`
- SEO route handlers for robots and sitemap
- Local brand/media assets in `public/`
- A lightweight investment-style presentation for internal products

The site is visually developed, but several business workflows are still mocked or incomplete.

## 2. Current Stack

- Framework: Next.js `15.3.3` with App Router
- UI runtime: React `18.3.1`
- Language: TypeScript
- Styling: Tailwind CSS `3.4.1`
- UI primitives: local shadcn-style component set
- Icons: `lucide-react`
- Forms: `react-hook-form` + `zod`
- AI/runtime scaffolding: `genkit`, `@genkit-ai/googleai`
- Hosting hint: Firebase App Hosting config in `apphosting.yaml`
- Package manager: npm

Available scripts:

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run genkit:dev
npm run genkit:watch
```

## 3. Current Route Map

### `/`

Source: `src/app/page.tsx`

Rendered order:

1. `Header`
2. `HeroSection`
3. `AboutSection`
4. `ServicesSection`
5. `PastWorksSection`
6. `TestimonialsSection`
7. `ContactSection`
8. `Footer`

### `/projects`

Source: `src/app/projects/page.tsx`

- Reuses shared header/footer
- Renders `ProjectsSection`
- Shows project cards linked to detail pages

### `/projects/[id]`

Source: `src/app/projects/[id]/page.tsx`

- Uses `generateStaticParams()` from the local `projects` dataset
- Calls `notFound()` for invalid ids
- Renders `ProjectDetail`

### SEO routes

- `src/app/robots.ts`
- `src/app/sitemap.ts`

These generate dynamic metadata route outputs for `https://infactsolutions.net`.

## 4. Repository Shape

```text
src/
  ai/
    dev.ts
    genkit.ts
    flows/
      google-reviews-flow.ts
  app/
    actions.ts
    globals.css
    layout.tsx
    page.tsx
    robots.ts
    sitemap.ts
    projects/
      page.tsx
      [id]/
        page.tsx
  components/
    project-detail.tsx
    landing/
      about-section.tsx
      contact-section.tsx
      footer.tsx
      header.tsx
      hero-section.tsx
      past-works-section.tsx
      projects-section.tsx
      services-section.tsx
      testimonials-section.tsx
    ui/
      ... reusable primitives
  hooks/
    use-mobile.tsx
    use-toast.ts
  lib/
    client-works-data.ts
    projects-data.ts
    utils.ts

public/
  logo.png
  home.jpg
  aboutinfact.jpg
  parallaxbk.jpg
  contactus.jpg
  pastwork/
  projects/
  robots.txt
  sitemap.xml

docs/
  blueprint.md
  agent-handoff.md
```

## 5. Main Functional Areas

### Shared Layout

Files:

- `src/app/layout.tsx`
- `src/app/globals.css`
- `tailwind.config.ts`

Behavior:

- Loads Inter with `next/font/google`
- Forces dark mode via `className="dark"` on `<html>`
- Mounts the toast system globally
- Defines CSS variable-driven theme tokens
- Uses a red primary palette despite older docs calling it blue

### Header and Navigation

File: `src/components/landing/header.tsx`

Implemented:

- Sticky header with scroll-state styling
- Logo image from `/logo.png`
- Desktop navigation using route links
- Mobile sheet menu
- Cross-page anchors such as `/#about`, `/#services`, and `/#contact`

### Hero and About

Files:

- `hero-section.tsx`
- `about-section.tsx`

Implemented:

- Real local imagery from `public/`
- Messaging focused on IT outsourcing, cybersecurity, networking, and software development
- About copy naming Colombo, Sri Lanka as headquarters
- CTA button that smooth-scrolls to contact when already on the home page

### Services

File: `services-section.tsx`

Implemented:

- Six hard-coded services
- Responsive card grid
- Lucide iconography

Known issue:

- Uses `<CardTitle as="h3">`, but the local `CardTitle` type does not accept an `as` prop. This currently breaks TypeScript checking.

### Past Client Work

Files:

- `past-works-section.tsx`
- `src/lib/client-works-data.ts`

Implemented:

- Horizontal repeating client-work reel
- Local work images from `public/pastwork/`
- Tag badges per item

### Projects and Investment Showcase

Files:

- `projects-section.tsx`
- `project-detail.tsx`
- `src/lib/projects-data.ts`

Implemented:

- Project cards with progress bars and raised/target amounts
- Local project images, screenshots, pitch decks, and optional external website links
- Static detail pages with:
  - Screenshot carousel
  - Investment slot grid
  - Funding progress
  - Pitch deck link
  - Website link when present
  - "Express Interest" button

Important business shape:

- `projects-data.ts` is the main structured content source for product/investment projects
- Currency is formatted as `LKR`
- The project model includes `expectedInvestment`, `currentInvestment`, `screenshots`, `pitchDeckUrl`, `websiteUrl`, and `investmentSlots`

Current project entries:

1. LearnLabz
2. Meraic
3. Momento
4. Travel Wish

### Testimonials / Google Reviews

Files:

- `testimonials-section.tsx`
- `src/ai/flows/google-reviews-flow.ts`
- `src/ai/genkit.ts`

Implemented:

- Testimonials section now fetches reviews through `getGoogleReviews()`
- Displays avatar, rating stars, reviewer name, relative time, and rotating review text
- Auto-advances when there is more than one review

Current reality:

- The flow is Genkit-backed in shape only
- It returns hard-coded `mockReviews`
- No real Google Reviews API call exists yet

### Contact Form

Files:

- `contact-section.tsx`
- `src/app/actions.ts`

Implemented:

- Client-side validation with `react-hook-form` + `zod`
- Toast feedback
- Submit loading state

Current reality:

- Submission is mocked
- The server action logs the payload, waits 1 second, and fails only when the email contains `"error"`
- No email, CRM, persistence, or webhook integration exists

### Footer

File: `footer.tsx`

Implemented:

- Logo
- Dynamic year
- Social buttons

Current reality:

- Twitter, LinkedIn, and GitHub links still point to `#`

## 6. Data Ownership

Structured local content now lives in data modules rather than entirely inside components:

- `src/lib/projects-data.ts`: project/investment content
- `src/lib/client-works-data.ts`: past-client reel content

Still component-local:

- Service definitions in `services-section.tsx`
- Header nav links in `header.tsx`

There is still:

- No database
- No CMS
- No admin UI

## 7. Assets and SEO

### Assets

The site now uses real local media assets under `public/`:

- Brand logo
- Home/about/contact imagery
- Client work images
- Project logos/screenshots
- PDF pitch decks

### SEO

Dynamic App Router metadata files exist:

- `src/app/robots.ts`
- `src/app/sitemap.ts`

There are also older static files:

- `public/robots.txt`
- `public/sitemap.xml`

`next.config.ts` redirects `/robots.txt` to `/robots` and `/sitemap.xml` to `/sitemap`, so the dynamic route handlers are intended to win. The static files appear stale and still reference `your-domain.com`.

## 8. AI / Genkit Status

Files:

- `src/ai/genkit.ts`
- `src/ai/dev.ts`
- `src/ai/flows/google-reviews-flow.ts`

Current state:

- Genkit is configured with `googleai/gemini-2.0-flash`
- `google-reviews-flow.ts` defines schemas and a flow
- That flow currently returns local mock data
- `src/ai/dev.ts` does not import flows yet, so the local Genkit dev workflow is not fully wired for discovery

Conclusion:

- AI infrastructure is partially scaffolded and lightly used as an abstraction layer, but there is no real AI or Google Reviews integration yet

## 9. Current Code Health

### `npm run typecheck`

Fails currently:

1. `src/components/landing/services-section.tsx`
   - `CardTitle` receives unsupported prop `as`
2. `src/components/ui/carousel.tsx`
   - `embla-carousel-react` is imported but not installed

### `npm run lint`

Does not complete because ESLint has not been configured yet. Running the script opens the interactive Next.js ESLint setup prompt.

### `npm run build`

Fails currently because:

1. `embla-carousel-react` is missing
2. `next/font/google` cannot fetch Inter in the restricted environment used during review
3. The sandbox could not open `.next/trace` after the build failure

Notes:

- `next.config.ts` currently suppresses TypeScript and ESLint failures during builds
- That does not help with missing dependencies

## 10. Known Defects and Risks

1. Missing dependency: `embla-carousel-react`
2. Type error in `services-section.tsx` from unsupported `CardTitle as`
3. ESLint is not configured
4. Build quality gates are disabled in `next.config.ts`
5. Contact workflow is mocked
6. Google review workflow is mocked
7. Social links are placeholders
8. `public/robots.txt` and `public/sitemap.xml` are stale relative to dynamic route handlers
9. Some user-visible text is mojibake/encoding-damaged in:
   - `projects-data.ts`
   - `google-reviews-flow.ts`
   - `testimonials-section.tsx`
10. Several visible CTA actions are not implemented:
   - Services "Learn More"
   - Project "Express Interest"
11. `use-mobile.tsx` exists but is not used in the reviewed feature flow

## 11. What Has Already Been Done

Completed so far:

- Next.js app scaffold and dark theme system
- Shared component library setup
- Home page marketing layout
- Route-based project system
- Structured project/client-work datasets
- Local visual asset integration
- Responsive header and mobile menu
- Project listing and static detail pages
- Investment progress presentation
- Screenshot carousel UI
- Client work reel
- Contact form validation and toast feedback
- SEO route handlers for robots and sitemap
- Genkit configuration and mock Google review flow

## 12. Recommended Next Work

Suggested order:

1. Fix build blockers:
   - install `embla-carousel-react`
   - remove or correctly support `CardTitle as`
2. Configure ESLint and re-enable build enforcement in `next.config.ts`
3. Clean encoding issues in user-visible text
4. Decide whether to keep the static `public/robots.txt` and `public/sitemap.xml`; if not, remove or align them with dynamic handlers
5. Replace mock contact submission with a real workflow
6. Replace mock reviews with a real Google Reviews integration or rename the feature honestly
7. Wire social links and unfinished CTAs
8. Add tests for:
   - project route generation
   - project detail rendering
   - contact submit behavior
   - testimonials empty/loading states
9. Review accessibility, mobile layout, and SEO metadata before production release

## 13. Useful Commands

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
```

Local dev server:

- `npm run dev` starts Next.js on port `9002`

## 14. Quick File Guide

- `src/app/page.tsx`: home page composition
- `src/app/projects/page.tsx`: projects listing route
- `src/app/projects/[id]/page.tsx`: static project detail route
- `src/components/project-detail.tsx`: project detail presentation
- `src/lib/projects-data.ts`: project dataset
- `src/lib/client-works-data.ts`: client work dataset
- `src/components/landing/past-works-section.tsx`: repeating client reel
- `src/components/landing/testimonials-section.tsx`: client-side review display
- `src/ai/flows/google-reviews-flow.ts`: mocked review source
- `src/app/actions.ts`: mocked contact submission
- `src/app/robots.ts`: dynamic robots metadata
- `src/app/sitemap.ts`: dynamic sitemap metadata
- `next.config.ts`: build leniency, image hosts, metadata redirects
- `apphosting.yaml`: Firebase App Hosting scaling config

## 15. High-Level Assessment

This is a **marketing site plus project/investment showcase**, with better real content coverage than the initial scaffold suggests. The presentation layer is fairly developed, but the codebase is not production-ready yet because core integrations are mocked and the current branch does not typecheck or build cleanly.
