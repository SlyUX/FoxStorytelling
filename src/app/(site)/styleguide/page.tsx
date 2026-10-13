import type { Metadata } from 'next'

import { BookBadges, BookCard, BookCover, BookGrid } from '@/components/book-card'
import { BuyLinks } from '@/components/buy-links'
import { HomeSplit } from '@/components/home-split'
import { Newsletter } from '@/components/newsletter'
import { PostCard, PostList } from '@/components/post-list'
import { RichText } from '@/components/rich-text'
import { ColorTokens, ContrastTable, type ContrastPair, type TokenGroup } from '@/components/styleguide/color-tokens'
import { Specimen } from '@/components/styleguide/specimen'
import { Badge } from '@/components/ui/badge'
import { Button, ButtonLink } from '@/components/ui/button'
import { EmptyState, Eyebrow, PageHeader, Section, SectionHeading } from '@/components/ui/section'
import { BOOKS_QUERY, HOME_SPOTLIGHT_QUERY, POSTS_QUERY, safeFetch } from '@/lib/queries'
import { getSiteSettings } from '@/lib/site-settings'
import type { BookCardData, PostCardData, RichText as RichTextValue, SpotlightBook } from '@/lib/types'

/*
 * The styleguide documents the code itself, so its text lives here, beside
 * what it describes, rather than in Sanity: a deliberate exception to "display
 * copy lives in Sanity" (see AGENTS.md). Its examples render the real
 * components, with real content once there is some, and its contrast ratios
 * are measured live from the tokens, so it stays true to the site as it changes.
 */

export const metadata: Metadata = {
  title: 'Styleguide',
  description: 'The design system behind Fox Storytelling: foundations, components, and the rules that keep them consistent.',
}

const TOKENS: TokenGroup[] = [
  {
    name: 'Grounds',
    tokens: [
      { token: 'background', use: 'The page: night, with a faint violet from the illustrations.' },
      { token: 'surface', use: 'Alternating bands.' },
      { token: 'card', use: 'Cards, panels, cover placeholders.' },
      { token: 'muted', use: 'Quiet fills: secondary badges and buttons, menu hovers.' },
      { token: 'border', use: 'Dividers and card edges. Decorative, so no contrast floor.' },
      { token: 'input', use: 'Form field edges, and anything else that must be seen as a boundary (3:1).' },
    ],
  },
  {
    name: 'Text',
    tokens: [
      { token: 'foreground', use: 'Bone: body text and every heading.' },
      { token: 'muted-foreground', use: 'Secondary text: intros, meta lines, captions.' },
      { token: 'link', use: 'Links and eyebrows. Ember, so it can diverge later.' },
      { token: 'visited', use: 'Visited links in prose and post titles: dusk violet. Navigation and buttons don’t change.' },
      { token: 'destructive', use: 'Errors. Light enough to read as text on night.' },
    ],
  },
  {
    name: 'Accents',
    tokens: [
      { token: 'primary', use: 'The red action: primary buttons, live-Kickstarter badges. A ground, never a text color on night.' },
      { token: 'fox', use: 'The logo’s exact red. Decoration and large display only: spines, rules, the nav underline.' },
      { token: 'ember', use: 'The light in the dark: links, the focus ring, text selection, things on their way.' },
      { token: 'ring', use: 'The keyboard focus ring.' },
      { token: 'cloud', use: 'The cloud that rolls over the home art: black, unless Site settings or a book picks another color. Decorative only.' },
    ],
  },
]

const PAIRS: ContrastPair[] = [
  { fg: 'foreground', bg: 'background', use: 'Body text on the page', need: 'text' },
  { fg: 'foreground', bg: 'surface', use: 'Body text on bands', need: 'text' },
  { fg: 'foreground', bg: 'card', use: 'Text on cards and panels', need: 'text' },
  { fg: 'foreground', bg: 'muted', use: 'Secondary badges and buttons', need: 'text' },
  { fg: 'muted-foreground', bg: 'background', use: 'Intros, meta lines', need: 'text' },
  { fg: 'muted-foreground', bg: 'surface', use: 'Meta lines on bands', need: 'text' },
  { fg: 'muted-foreground', bg: 'card', use: 'Meta lines on cards', need: 'text' },
  { fg: 'muted-foreground', bg: 'muted', use: 'Secondary text on quiet fills', need: 'text' },
  { fg: 'link', bg: 'background', use: 'Links, eyebrows, the current page in the nav', need: 'text' },
  { fg: 'link', bg: 'surface', use: 'Links on bands', need: 'text' },
  { fg: 'link', bg: 'card', use: 'Links on cards', need: 'text' },
  { fg: 'visited', bg: 'background', use: 'Visited links', need: 'text' },
  { fg: 'visited', bg: 'card', use: 'Visited links on cards', need: 'text' },
  { fg: 'destructive', bg: 'background', use: 'Errors', need: 'text' },
  { fg: 'destructive', bg: 'card', use: 'Errors on cards', need: 'text' },
  { fg: 'white', bg: 'primary', use: 'Primary buttons', need: 'text' },
  { fg: 'white', bg: 'primary', bgAlpha: 0.85, under: 'background', use: 'Primary button, hovered', need: 'text' },
  { fg: 'foreground', bg: 'primary', use: 'Bone on red', need: 'text' },
  { fg: 'background', bg: 'ember', use: 'Selected text', need: 'text' },
  { fg: 'input', bg: 'background', use: 'Form field edges', need: 'nontext' },
  { fg: 'input', bg: 'card', use: 'Form field edges on cards', need: 'nontext' },
  { fg: 'fox', bg: 'background', use: 'Spines, rules, underlines: never body text', need: 'large' },
  { fg: 'primary', bg: 'background', use: 'Never: red is a ground, not a text color', need: 'text' },
  { fg: 'ember', bg: 'primary', use: 'Never: no ember on red', need: 'text' },
]

const TYPE = [
  {
    role: 'Logo',
    className: 'font-brand text-xl uppercase',
    sample: (
      <>
        <span className="font-black">Fox</span>storytelling
      </>
    ),
    spec: 'Montserrat, the brand’s typeface: FOX in Black, STORYTELLING in Regular, run together in capitals beside the badge. The logo only.',
  },
  { role: 'Home headline', className: 'font-serif text-6xl leading-[1.05] font-semibold tracking-tight', sample: 'Redemptive horror.', spec: 'Crimson Pro, semibold: fluid 44–80px. The home page’s h1.' },
  { role: 'Page title', className: 'font-serif text-4xl leading-tight font-semibold tracking-tight md:text-5xl', sample: 'The Rejection Files', spec: 'Crimson Pro, semibold: fluid 32–64px. One per page.' },
  { role: 'Section heading', className: 'font-serif text-3xl font-semibold', sample: 'Latest from the Rejection Files', spec: 'Crimson Pro, semibold: fluid 26–38px. Every band and section.' },
  { role: 'Card title', className: 'font-serif text-xl leading-snug font-semibold', sample: 'A book or post title', spec: 'Crimson Pro, semibold: 20px on book cards, 24px on posts.' },
  { role: 'Eyebrow', className: 'text-link text-xs font-semibold tracking-[0.14em] uppercase', sample: 'Rejection Files', spec: 'Geist, 12px tracked capitals in ember: a category or series above a title.' },
  { role: 'Prose', className: 'font-serif text-xl leading-relaxed', sample: 'Long-form reading is set in the serif, at a size and measure for reading.', spec: 'Crimson Pro, 20px, relaxed leading, 672px measure: posts, pages, book descriptions.' },
  { role: 'Interface', className: 'leading-relaxed', sample: 'Navigation, buttons, intros, and blurbs are set in the sans.', spec: 'Geist, 16px. Page intros run 18px in the muted gray.' },
  { role: 'Meta', className: 'text-muted-foreground text-sm', sample: 'October 12, 2026', spec: 'Geist, 14px, muted: dates, series names, captions.' },
]

const RULES: [string, string][] = [
  ['Tokens only.', 'Colors come from the tokens above, through Tailwind; no raw hex values or palette classes in components. A new color pair must pass WCAG AA, and its ratio goes in globals.css and the table above.'],
  ['Red is for action, ember is for light.', 'One red button per view: the thing we most want done. Ember marks links, focus, and what’s on its way. The logo’s red is decoration and large display only. Never ember on red.'],
  ['Reading is serif, the interface is sans.', 'Titles and long-form prose are Crimson Pro; navigation, buttons, labels, and blurbs are Geist. Montserrat sets the logo and nothing else.'],
  ['Corners are 2px.', 'Nearly square, like a book’s edge. Every element uses rounded-ui; shadcn’s radius scale derives from the same value. The one exception: the author’s portrait is round.'],
  ['One page title.', 'Each page has one h1, and headings never skip a level.'],
  ['Every card is one click target.', 'The title’s link stretches over the card, so the cover, title, and blurb all open it, with one focus ring around the whole card.'],
  ['Covers never break.', 'A book without cover art shows its title on a card with the fox-red spine, so it can be listed before the art is final.'],
  ['The site never sells or collects emails.', 'Buying hands off to retailers in a new tab; the newsletter hands off to MailerLite. Until a sign-up address is set, the newsletter panel stays hidden.'],
  ['Every list has an empty state.', 'It’s written for readers, not editors.'],
  ['Content lives in Sanity.', 'Display copy is edited in the Studio, with defaults in src/lib/site-settings.ts. Exceptions are text only assistive technology hears, and this page.'],
  ['Behavior comes from shadcn.', 'Need a dialog or a menu? npx shadcn@latest add it, then restyle to the tokens. Button and badge here are ours: don’t let the CLI overwrite them.'],
  ['The header holds still.', 'It’s sticky, pinned to the top as you scroll, and stays put while pages rise and lower beneath it. Jump links and keyboard focus land just below it. On phones the pages fold into a menu that rolls down from under it, full width; Escape or a press outside rolls it back up.'],
  ['Motion is slow, and it stops.', 'The home art breathes on a 20-second cycle, swelling past its frame and settling back, never shrinking enough to show an edge, and brightening from 50% to full opacity as it swells. A dark cloud that’s never the same twice fades with it, black unless the Studio picks a color. Books change only as a breath ends, at the art’s dimmest, by crossfade; the rotation holds while someone is reading. As the first screen scrolls away, the art fades into the night. Pages stack like sheets: a new page rises from the bottom over the one you’re on, which dims; going back up a level, the page lowers away to reveal the one beneath. The header holds still; reduced motion crossfades. A pause button stops the breath, the cloud, and the rotation; reduced motion holds the art still and drops the cloud, but keeps the fade, which isn’t motion. Hover lifts a cover 4px.'],
]

const VOICE: [string, React.ReactNode][] = [
  ['Sentence case for headings.', 'Book, series, and blog titles keep their capitals: “Latest from the Rejection Files.”'],
  ['Titles in italics, or quotation marks: never both.', <>Italics in body text (<em>The Path: Rae’s Crusade</em>); quotation marks where italics can’t go, like alt text and summaries.</>],
  ['Spell out “and.”', 'Keep “&” only where it’s part of a name.'],
  ['Numbers follow AP style.', 'Spell out one through nine, numerals from 10. Percentages and money are always numerals.'],
  ['Ranges and separators.', 'An unspaced en dash for ranges (2024–2026), and a middle dot between items on a meta line (Series · Available).'],
  ['Empty states speak to readers.', '“New books are on the way,” not “Add a book in the Studio.”'],
  ['Alt text is one sentence.', 'It says what the image shows and why it matters. Leave it blank for a cover beside its own title.'],
  ['American English.', 'Including Studio labels.'],
]

const SAMPLE_BOOKS: BookCardData[] = [
  {
    _id: 'sample-1',
    title: 'A Title Without Cover Art',
    slug: 'sample',
    series: 'Series name',
    status: 'Available',
    format: 'Novel',
    shortDescription: 'A short description: two or three sentences that make someone want the book.',
    cover: null,
    buyLinks: [
      { _key: 'a', _type: 'buyLink', store: 'Bookshop.org', url: 'https://bookshop.org' },
      { _key: 'b', _type: 'buyLink', store: 'Amazon', url: 'https://www.amazon.com' },
    ],
  },
  { _id: 'sample-2', title: 'An Upcoming Book', slug: 'sample', series: null, status: 'Upcoming', format: 'Comic', shortDescription: null, cover: null, buyLinks: null },
  { _id: 'sample-3', title: 'A Book on Kickstarter', slug: 'sample', series: 'Series name', status: 'On Kickstarter', format: 'Graphic novel', shortDescription: null, cover: null, buyLinks: null },
]

const SAMPLE_POSTS: PostCardData[] = [
  { _id: 'sample-post', title: 'A post title', slug: 'sample', category: 'Rejection Files', excerpt: 'An excerpt: a sentence or two that sets up the post.', publishedAt: '2026-10-12T12:00:00Z' },
]

const span = (key: string, text: string, marks: string[] = []) => ({ _type: 'span' as const, _key: key, text, marks })
const SAMPLE_PROSE: RichTextValue = [
  { _type: 'block', _key: 'p1', style: 'normal', markDefs: [{ _type: 'link', _key: 'l1', href: 'https://www.sanity.io/docs' }], children: [span('s1', 'Body text is set for reading. Links are ember and underlined, '), span('s2', 'like this one', ['l1']), span('s3', ', and turn violet once visited.')] },
  { _type: 'block', _key: 'h2', style: 'h2', markDefs: [], children: [span('s4', 'A heading')] },
  { _type: 'block', _key: 'p2', style: 'normal', markDefs: [], children: [span('s5', 'Headings break a long piece into parts. Subheadings go one level deeper.')] },
  { _type: 'block', _key: 'q1', style: 'blockquote', markDefs: [], children: [span('s6', 'A pull quote sits on the fox-red rule.')] },
  { _type: 'block', _key: 'b1', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [span('s7', 'Lists are bulleted')] },
  { _type: 'block', _key: 'b2', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [span('s8', 'or numbered')] },
]

export default async function StyleguidePage() {
  const [s, books, posts, spotlight] = await Promise.all([
    getSiteSettings(),
    safeFetch<BookCardData[]>(BOOKS_QUERY, {}, []),
    safeFetch<PostCardData[]>(POSTS_QUERY, {}, []),
    safeFetch<SpotlightBook[]>(HOME_SPOTLIGHT_QUERY, {}, []),
  ])
  const cards = books.length ? books.slice(0, 3) : SAMPLE_BOOKS
  const rows = posts.length ? posts.slice(0, 2) : SAMPLE_POSTS

  const toc = [
    ['color', 'Color'],
    ['type', 'Type'],
    ['corners-and-spacing', 'Corners and spacing'],
    ['actions', 'Actions and labels'],
    ['structure', 'Page structure'],
    ['home', 'Home'],
    ['books-and-posts', 'Stories and posts'],
    ['reading', 'Reading'],
    ['rules', 'Rules'],
    ['voice', 'Voice'],
  ]

  return (
    <>
      <Section opener className="pb-10 md:pb-12">
        <PageHeader
          title="Styleguide"
          intro="The design system behind this site: its foundations, its components, and the rules that keep them consistent. Before building anything new, check here for something to reuse or extend."
        />
        <nav aria-label="On this page" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {toc.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="bg-muted hover:text-link rounded-ui inline-flex px-3 py-1.5 text-sm font-medium">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      <Section id="color" tone="surface" aria-labelledby="color-heading">
        <SectionHeading
          id="color-heading"
          intro="Night, bone, the fox’s red, and one ember of light. Provisional, pending art direction. Components use these tokens through Tailwind (bg-card, text-link), never raw hex values. Each value below is read from globals.css as the page loads."
        >
          Color
        </SectionHeading>
        <ColorTokens groups={TOKENS} />
        <h3 className="mt-14 mb-2 font-semibold">Contrast</h3>
        <p className="text-muted-foreground mb-6 max-w-3xl">
          Every pair the site uses, measured live against WCAG 2.x: 4.5 for text, 3 for large text and the edges of controls. A few fail on purpose; they’re listed so no one uses them for text.
        </p>
        <ContrastTable pairs={PAIRS} />
      </Section>

      <Section id="type" aria-labelledby="type-heading">
        <SectionHeading id="type-heading" intro="Two families: Crimson Pro, a book serif sturdy enough to hold up as light type on a dark ground, for titles and reading; Geist for the interface. Montserrat, the brand’s typeface, sets the logo alone.">
          Type
        </SectionHeading>
        <div className="border-border bg-card rounded-ui divide-border divide-y border">
          {TYPE.map((t) => (
            <div key={t.role} className="grid gap-3 p-5 md:grid-cols-[12rem_1fr] md:gap-8">
              <div>
                <p className="font-semibold">{t.role}</p>
                <p className="text-muted-foreground mt-1 text-sm">{t.spec}</p>
              </div>
              <p className={t.className}>{t.sample}</p>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground mt-6 max-w-3xl text-sm">Display sizes are fluid, scaling between phone and desktop widths. Body text stays fixed.</p>
      </Section>

      <Section id="corners-and-spacing" tone="surface" aria-labelledby="corners-heading">
        <SectionHeading id="corners-heading" intro="Corners are 2px on everything. Spacing follows an 8px rhythm.">
          Corners and spacing
        </SectionHeading>
        <div className="grid gap-6 md:grid-cols-[minmax(0,16rem)_1fr]">
          <div className="bg-card border-border rounded-ui grid place-items-center gap-3 border p-8 text-center">
            <span className="bg-muted border-input rounded-ui size-20 border" />
            <p className="text-sm">
              <code className="font-semibold">rounded-ui</code> · 2px
              <br />
              <span className="text-muted-foreground">Cards, buttons, badges, covers, images.</span>
            </p>
          </div>
          <dl className="bg-card border-border rounded-ui divide-border divide-y border text-sm">
            {[
              ['Bands', '48px top and bottom on phones, 64px on wider screens.'],
              ['A page’s first band', 'Starts closer to the header: 32px, then 40px.'],
              ['Section heading to content', '40px.'],
              ['Book grid', '24px between columns, 48px between rows: two across on phones, four on wide screens.'],
              ['Reading measure', '672px (max-w-2xl) for posts and pages.'],
              ['Page edges', '16px on phones, 24px from small tablets up; content stops at 1152px.'],
            ].map(([term, value]) => (
              <div key={term} className="grid gap-1 p-4 sm:grid-cols-[14rem_1fr]">
                <dt className="font-semibold">{term}</dt>
                <dd className="text-muted-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section id="actions" aria-labelledby="actions-heading">
        <SectionHeading id="actions-heading" intro="How readers act, and how things are labeled.">
          Actions and labels
        </SectionHeading>
        <div className="grid gap-8">
          <Specimen
            name="Buttons"
            file="src/components/ui/button.tsx"
            notes={[
              'default: the red action. One per view.',
              'outline: everything else that’s a button; bone, turning ember on hover. secondary, ghost, link, and destructive exist for shadcn components and dense UI.',
              'Sizes: sm, default, lg, and icon. ButtonLink renders a link as a button: internal paths stay in the tab, full URLs open a new one.',
              'Variant and size names match shadcn’s, so added components that import buttonVariants pick these up.',
            ]}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-3">
                <Button>Default</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button>Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
          </Specimen>
          <Specimen
            name="Buy links"
            file="src/components/buy-links.tsx"
            notes={['The first store is the red action, the rest outlined. Each opens the retailer in a new tab, marked with the external-link icon.', 'The button text comes from Site settings: "Buy on {store}".']}
          >
            <BuyLinks
              label={s.buyLabel}
              links={[
                { _key: 'a', _type: 'buyLink', store: 'Bookshop.org', url: 'https://bookshop.org' },
                { _key: 'b', _type: 'buyLink', store: 'Amazon', url: 'https://www.amazon.com' },
              ]}
            />
          </Specimen>
          <Specimen
            name="Badges"
            file="src/components/ui/badge.tsx · book-card.tsx BookBadges"
            notes={[
              'A story’s status says what it asks of the reader: Available is quiet (and only when there’s somewhere to buy it), Upcoming glows ember, On Kickstarter is the red action, In development is an outline.',
              'Its format sits beside it, outlined (Novel, Comic, Series proposal), so readers know what they’d be buying: “Stories” is the brand’s word; the format says “book.”',
              'Variants: default, secondary, outline, ember, destructive.',
            ]}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary">Available</Badge>
                <Badge variant="ember">Upcoming</Badge>
                <Badge variant="default">On Kickstarter</Badge>
                <Badge variant="outline">In development</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
              <BookBadges status="Available" format="Novel" />
            </div>
          </Specimen>
        </div>
      </Section>

      <Section id="structure" tone="surface" aria-labelledby="structure-heading">
        <SectionHeading id="structure-heading" intro="The pieces every page is built from.">
          Page structure
        </SectionHeading>
        <div className="grid gap-8">
          <Specimen
            name="Page header"
            file="src/components/ui/section.tsx · PageHeader"
            notes={['The page’s only h1, with an optional eyebrow above (a series or category) and intro below.']}
            stage="card"
          >
            <p className="text-muted-foreground text-sm">The top of this page is the live example: a page has only one.</p>
          </Specimen>
          <Specimen
            name="Section heading"
            file="src/components/ui/section.tsx · SectionHeading"
            notes={['Heads every band and section: one size, 40px to the content.', 'Takes an optional intro below and an action beside it, such as “See all,” shown only when there’s more than the section previews.']}
          >
            {/* Without its 40px gap to the content, which this frame doesn’t have. */}
            <div className="*:mb-0">
              <SectionHeading
                as="h4"
                intro="An optional intro."
                action={
                  <ButtonLink href="/styleguide" variant="outline" size="sm">
                    {s.viewAllLabel}
                  </ButtonLink>
                }
              >
                A section heading
              </SectionHeading>
            </div>
          </Specimen>
          <Specimen name="Eyebrow" file="src/components/ui/section.tsx · Eyebrow" notes={['Tracked capitals in ember above a title. One per title, a few words at most.']}>
            <Eyebrow>Rejection Files</Eyebrow>
          </Specimen>
          <Specimen name="Empty state" file="src/components/ui/section.tsx · EmptyState" notes={['Every list has one, written for readers. Its text comes from Site settings.']}>
            <EmptyState>{s.booksEmpty}</EmptyState>
          </Specimen>
          <Specimen name="Newsletter" file="src/components/newsletter.tsx" stage="background" notes={['Hands off to the MailerLite form set in Site settings. Hidden until that address is set; shown here with a stand-in.']}>
            <Newsletter settings={{ ...s, newsletterUrl: s.newsletterUrl ?? '/styleguide' }} headingLevel="h4" />
          </Specimen>
        </div>
      </Section>

      <Section id="home" aria-labelledby="home-heading">
        <SectionHeading id="home-heading" intro="The first screen of the home page.">
          Home
        </SectionHeading>
        <Specimen
          name="Home split"
          file="src/components/home-split.tsx · book-spotlight.tsx · breathing-art.tsx"
          stage="card"
          notes={[
            'The art beside a column: two equal columns exactly filling the screen under the header on landscape screens from tablet width and 576px tall. Stacked below that: the description, then the art with its book, then the posts, in reading order too. The header is sticky.',
            'The description can carry the author’s portrait, round, beside the intro (Site settings → Home page → Author photo). The rotation is named by “Featured Stories” (Site settings): shown across from its controls on phones, and read to screen readers everywhere.',
            'Stories with “Show on the home page” on and home page art rotate in Stories order, one per breath: as each breath ends, with the art at its dimmest, the next book crossfades in. With none, the site’s home art (Site settings) stands with the first book, its cover beside the details.',
            'The showing book sits over the foot of its art, on night at 85% so its text holds over any image: status, title, series, blurb, where to buy, and About the book. Its first store is the page’s one red action. The rotation’s controls tuck behind one toggle in the art’s top corner: open, pause, previous, and next slide out. On split screens the markers wait beside them, a quiet sign there’s more than one book until it opens; stacked, they slide out too. Escape closes it. Left and right arrow keys step through the books while focus is on the art, or nothing has focus.',
            'The art breathes every 20 seconds, swelling and brightening from 50% to full opacity, under a cloud drawn from noise that moves through time, from a new seed on each visit. The cloud is black unless Site settings or the book picks a color, and it eases into a new book’s color as the book changes. A book can turn its cloud off; it fades out, and back in for the next book that has one. The hotspot set in the Studio stays in view and is where the breath grows from.',
            'The other column, centered: the description, with Stephen’s Bio (once there’s an About page) and All books; then the Rejection Files previews, featured posts first, as many as fit, never cut in half; what doesn’t fit is inert, so focus skips it (FillColumn). Stacked, three posts show.',
            'On split screens, scrolling away, the art and its cloud fade into the night, gone after scrolling about a third of the screen; the book and controls stay. Stacked, the art doesn’t fade. CSS scroll-driven: browsers without it just scroll.',
            'The rotation holds while the pointer or keyboard focus is in it; pause stops it and the motion; previous, next, and a marker per book step through by hand. Reduced motion stills the art and never advances on its own.',
          ]}
        >
          {/* Shorter than the real thing, which fills the screen under the header and doesn't pin here. */}
          <HomeSplit
            settings={s}
            spotlight={spotlight}
            fallbackBook={cards[0] ?? null}
            posts={rows.map((post) => ({ ...post, pinned: false }))}
            aboutExists={false}
            levels={{ tagline: 'h4', book: 'h5', block: 'h5', item: 'h6' }}
            className="split:h-[44rem]"
          />
        </Specimen>
      </Section>

      <Section id="books-and-posts" tone="surface" aria-labelledby="books-heading">
        <SectionHeading id="books-heading" intro="Every card is one click target.">
          Stories and posts
        </SectionHeading>
        <div className="grid gap-8">
          <Specimen
            name="Book card"
            file="src/components/book-card.tsx · BookCard"
            notes={[
              books.length ? 'The first books from the Studio.' : 'Sample books; once there are books in the Studio, the first ones show here instead.',
              'Cover, status, title, series, and up to three lines of description. Hover lifts the cover; the title turns ember.',
            ]}
          >
            <BookGrid>
              {cards.map((book) => (
                <BookCard key={book._id} book={book} headingLevel="h4" />
              ))}
            </BookGrid>
          </Specimen>
          <Specimen
            name="Cover placeholder"
            file="src/components/book-card.tsx · BookCover"
            notes={['Covers are 2:3. Without art, the title and series are set on a card with the fox-red spine, so covers never break.']}
          >
            <div className="max-w-48">
              <BookCover cover={null} title="A Title Without Cover Art" series="Series name" />
            </div>
          </Specimen>
          <Specimen
            name="Post list"
            file="src/components/post-list.tsx"
            notes={[posts.length ? 'The latest posts from the Studio.' : 'A sample post; real ones show here once there are some.', 'Category, title, date, and excerpt, divided by rules. Visited titles turn violet.']}
          >
            <PostList posts={rows} headingLevel="h4" />
          </Specimen>
          <Specimen
            name="Post card"
            file="src/components/post-list.tsx · PostCard"
            notes={['A compact preview for tight spaces, like the home page’s first screen: meta line, title, two lines of excerpt. One click target.', 'A featured post says so, in ember, and leads its list.']}
          >
            <div className="grid max-w-xl gap-3">
              {rows.slice(0, 1).map((post) => (
                <PostCard key={post._id} post={{ ...post, pinned: true }} featuredLabel={s.featuredLabel} headingLevel="h4" />
              ))}
            </div>
          </Specimen>
        </div>
      </Section>

      <Section id="reading" aria-labelledby="reading-heading">
        <SectionHeading id="reading-heading" intro="Posts, pages, and book descriptions, as edited in the Studio’s Body field.">
          Reading
        </SectionHeading>
        <Specimen
          name="Rich text"
          file="src/components/rich-text.tsx"
          notes={['Every style the Studio allows: paragraphs, headings, quotes, lists, links, and images with alt text and an optional caption.', 'Set at 20px in the serif, at a 672px measure.']}
        >
          <div className="max-w-2xl">
            <RichText value={SAMPLE_PROSE} />
          </div>
        </Specimen>
      </Section>

      <Section id="rules" tone="surface" aria-labelledby="rules-heading">
        <SectionHeading id="rules-heading" intro="The decisions behind the components, so the next one fits.">
          Rules
        </SectionHeading>
        <ul className="grid gap-x-10 gap-y-6 md:grid-cols-2">
          {RULES.map(([lead, rest]) => (
            <li key={lead} className="leading-relaxed">
              <span className="font-semibold">{lead}</span> <span className="text-muted-foreground">{rest}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="voice" aria-labelledby="voice-heading">
        <SectionHeading id="voice-heading" intro="The mechanics of how the site is written.">
          Voice
        </SectionHeading>
        <ul className="grid gap-x-10 gap-y-6 md:grid-cols-2">
          {VOICE.map(([lead, rest]) => (
            <li key={lead} className="leading-relaxed">
              <span className="font-semibold">{lead}</span> <span className="text-muted-foreground">{rest}</span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
