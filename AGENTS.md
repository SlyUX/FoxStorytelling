<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project: foxstorytelling.com

Stephen Fox's author site: redemptive horror, books and comics. Readers come to find a book and where to buy it, read the Rejection Files (the blog), and join the mailing list. The site never sells and never collects emails: buying hands off to retailers, sign-up hands off to MailerLite.

## Stack
- Next.js 16.2.10 (App Router, Turbopack, `src/`, alias `@/*`), React 19.2, TypeScript, Tailwind v4 (CSS-first tokens in `src/app/globals.css`)
- Sanity v6, embedded Studio at `/studio`. Same setup as the sibling `../slyux-site` (and `../NDRiot`): check them before inventing a pattern.
- shadcn conventions (`cn`, `cva`, `components.json`, token names), lucide icons.
- Vercel deploy. Once Vercel is connected, **pushing `main` deploys to production**: commit freely, push deliberately.
- **Merge into `main` with a merge commit** (`git merge --no-ff`; this repo's git config makes it the default for `main`). Vercel won't make a production build for a commit it already built as a branch preview, so fast-forwarding `main` to a pushed branch leaves production unchanged. If it happens anyway, push an empty commit to `main`.

## Design system
- **Tokens:** `src/app/globals.css`. Color pairs, their contrast ratios, fonts, radius, fluid type. Palette is PROVISIONAL pending art direction.
- **Primitives:** `src/components/ui/`, shadcn-style (`cva` variants + `cn`). `button.tsx` and `badge.tsx` are ours with shadcn's variant names. When `npx shadcn@latest add <name>` offers to overwrite them, say no.
- **Site components:** `src/components/` (kebab-case files, named exports).
- **Living docs:** `/styleguide` (`src/app/(site)/styleguide/page.tsx`). Real components, contrast measured live from the tokens.
- **Copy defaults:** `src/lib/site-settings.ts`, each matched by a field in `src/sanity/schemaTypes/siteSettings.ts`.

## Content model (`src/sanity/schemaTypes`)
- `siteSettings` (singleton): all chrome copy, navigation, section headings, empty states, newsletter
- `book` → `/books`, `/books/[slug]` · `post` → `/blog`, `/blog/[slug]` (the Rejection Files) · `page` → `/[slug]` (About, and any others)
- Shared types in `objects.ts`: `link`, `imageWithAlt`, `richText` (every style it allows has a renderer in `src/components/rich-text.tsx`)

## Process
1. **Look before building.** Check `/styleguide` and `src/components/ui/` for something to reuse or extend. Need behavior (a dialog, a menu)? Add it with the shadcn CLI and restyle it to the tokens.
2. **Branch per change** off `main`; merge back with `--no-ff`.
3. **One commit carries the whole change:** when you add or change a token, component, or rule, update the styleguide in the same commit.
4. **Before done:** `npm run lint` clean, `npm run build` passes, then smoke-test every route (`next start` + curl) in a separate step from any push.

## Rules (adapted from slyux-site's AGENTS.md)
1. **Verify APIs** in `node_modules/next/dist/docs/` or Context7 before use: never from memory.
2. **Content is Sanity's.** No display copy hardcoded in components; defaults live only in `src/lib/site-settings.ts` and each needs a matching schema field. Exceptions (a11y text) get a comment. The one page-sized exception is `/styleguide`: it documents the code, so its text lives beside what it describes.
3. **Generated types only.** `npm run typegen` (runs on prebuild). Wrap queries in `defineQuery()`; alias results in `src/lib/types.ts`. GROQ returns `null` for absent fields.
4. **All fetches via `safeFetch()`** with a fallback. Every list needs an empty state, written for readers.
5. **Tokens only:** no raw hex or palette classes (`neutral-*`, `red-500`, `black`) in components. New color pairs must clear WCAG AA; record the ratio in `globals.css` and the styleguide's contrast table. On this dark ground `--primary` is a button ground, not a text color: links are `text-link`. Restyle shadcn components that use `text-primary` for text.
6. **Red is for action, ember is for light.** One red (`default`) button per view. Ember marks links, focus, and what's on its way. The logo's red (`--fox`) is decoration and large display only.
7. **Accessibility:** one `<h1>` per page, no skipped heading levels, real alt text from Sanity (blank for covers beside their title), visible focus, reduced motion respected.
8. **American English** in copy and Studio labels.
