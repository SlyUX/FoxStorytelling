# Fox Storytelling — scaffold setup

A working Next.js 16 + Sanity 6 site. Your old static site is preserved in `legacy/`.

## 1. Install
```bash
npm install
```

## 2. Create your Sanity project
- Go to https://www.sanity.io/manage → **Create project** (dataset name: `production`, public read).
- Copy the **Project ID**.
- In manage → API → **CORS origins**, add `http://localhost:3000` and (later) your Vercel URL.

```bash
cp .env.local.example .env.local
# edit .env.local → set NEXT_PUBLIC_SANITY_PROJECT_ID to your Project ID
```

## 3. Run it
```bash
npm run dev
```
- Site: http://localhost:3000
- Studio (CMS): http://localhost:3000/studio  → sign in, add a Book and a Post, watch them appear on the site.

## 4. Ship it
```bash
git add -A && git commit -m "feat: Next.js + Sanity scaffold" && git push
```
Then in Vercel: **Add New Project** → import this repo → add the three `NEXT_PUBLIC_SANITY_*` env vars → Deploy. Every push auto-deploys.

## 5. Domain (last, when ready)
Point foxstorytelling.com at Vercel in HostGator Zone Editor — **leave MX + the MailerLite SPF/DKIM records untouched**. See the site runbook for exact records.

## What's here
- `AGENTS.md`: how this project is built: stack, design system, process, and rules. Read it first.
- `/styleguide`: the design system, live: tokens, contrast, type, components, rules, and voice.
- `src/app/globals.css`: design tokens (provisional palette, fonts, radius, fluid type).
- `src/components/ui/`: shadcn-style primitives (`button`, `badge`, `section`). Add more with `npx shadcn@latest add <name>`.
- `src/components/`: site components: `book-card`, `post-list`, `buy-links` (retail links out, no checkout), `newsletter`, `rich-text`, header and footer.
- `src/sanity/schemaTypes/`: content model: `book`, `post` (Rejection Files), `page`, `siteSettings` (singleton: all site copy), plus `link`, `imageWithAlt`, `richText`, `buyLink`.
- `src/app/`: routes: `/`, `/books`, `/books/[slug]`, `/blog`, `/blog/[slug]`, `/[slug]` (About and other pages), `/styleguide`, `/studio`.
- `npm run typegen`: regenerates `sanity.types.ts` from the schema and queries (also runs before every build).

## Content to add in the Studio
- **Site settings:** every field has a sensible default, so fill in only what you want to change.
- **Newsletter:** paste your MailerLite hosted form address into Site settings → Newsletter. The site never collects emails; the sign-up panel stays hidden until this is set.
- **About:** create a Page with the slug `about`. Its preview on the home page is Site settings → Home page → **About preview**, which starts as placeholder copy: replace it. The preview links to the page once it exists.
- **Rejection Files on the home page:** the newest posts preview beside the art, as many as fit; mark a post **Featured** to pin it first.
- **Home page rotation:** on a book, turn on **Show on the home page** and add its **Home page art** (tall, on black, at least 2000px tall), with the hotspot on what must stay in view. Those books rotate through the home page's first screen, one per breath, in your Books order. Each can turn its **Cloud** off (for art that's better left clear) or pick a **Cloud color** for the cloud that rolls over its art; Site settings → Home page → Cloud color sets the default (blank is black).
- **Home page art (fallback):** Site settings → Home page → Art is shown when no book is set to show on the home page, beside the first book.
