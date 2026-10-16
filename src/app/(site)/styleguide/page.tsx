import type { Metadata } from 'next'

import { BookBadges, BookCard, BookCover, BookGrid } from '@/components/book-card'
import { BuyLinks } from '@/components/buy-links'
import { HomeSplit } from '@/components/home-split'
import { Newsletter } from '@/components/newsletter'
import { PalettePicker } from '@/components/palette-preview'
import { PostBecame } from '@/components/post-became'
import { PostCard, PostList } from '@/components/post-list'
import { RichText } from '@/components/rich-text'
import { Screenplay } from '@/components/screenplay'
import { SocialLinks } from '@/components/social-links'
import { ColorTokens, ContrastTable, type ContrastPair, type TokenGroup } from '@/components/styleguide/color-tokens'
import { Specimen } from '@/components/styleguide/specimen'
import { Badge } from '@/components/ui/badge'
import { Button, ButtonLink } from '@/components/ui/button'
import { EmptyState, Eyebrow, PageHeader, Section, SectionHeading } from '@/components/ui/section'
import { BOOKS_QUERY, HOME_SPOTLIGHT_QUERY, POSTS_QUERY, safeFetch } from '@/lib/queries'
import { getSiteSettings, type SiteSettings } from '@/lib/site-settings'
import type { BookCardData, CmsBuyLink, PostCardData, RichText as RichTextValue, Screenplay as ScreenplayValue, SpotlightBook } from '@/lib/types'

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
      { token: 'chrome', use: 'Black: the header and footer, a shade deeper than the page.' },
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
      { token: 'visited', use: 'Visited links in prose and post titles: near-white, always underlined, since its color barely differs from bone. Navigation and buttons don’t change.' },
      { token: 'destructive', use: 'Errors and destructive actions, as text and outlines. Never a fill: a filled red is the call to action.' },
      { token: 'white', use: 'Pure white: secondary buttons, tertiary links, and block headings like Home’s featured series. Body text stays bone.' },
    ],
  },
  {
    name: 'Accents',
    tokens: [
      { token: 'primary', use: 'The call-to-action red: primary buttons, live-Kickstarter badges, with white text. A ground, never a text color on night.' },
      { token: 'fox', use: 'The brand file’s red. Decoration and large display only: spines, rules, the nav underline, the browser-tab icon. The logo’s badge wears the primary red.' },
      { token: 'ember', use: 'The light in the dark: page titles, links, the focus ring, text selection, things on their way, and the second action beside a red one.' },
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
  { fg: 'link', bg: 'background', use: 'Links, eyebrows, ember buttons, page titles (as --ember)', need: 'text' },
  { fg: 'background', bg: 'ember', use: 'Text selection', need: 'text' },
  { fg: 'foreground', bg: 'chrome', use: 'The header, its social marks', need: 'text' },
  { fg: 'muted-foreground', bg: 'chrome', use: 'The footer’s line', need: 'text' },
  { fg: 'link', bg: 'chrome', use: 'The current page in the nav', need: 'text' },
  { fg: 'white', bg: 'chrome', use: 'The logo’s letters, the menu button', need: 'text' },
  { fg: 'primary', bg: 'chrome', use: 'The logo’s badge: a logo, so exempt', need: 'decorative' },
  { fg: 'link', bg: 'surface', use: 'Links on bands', need: 'text' },
  { fg: 'link', bg: 'card', use: 'Links on cards', need: 'text' },
  { fg: 'visited', bg: 'background', use: 'Visited links', need: 'text' },
  { fg: 'visited', bg: 'card', use: 'Visited links on cards', need: 'text' },
  { fg: 'destructive', bg: 'background', use: 'Errors, destructive buttons (outlined)', need: 'text' },
  { fg: 'destructive', bg: 'surface', use: 'Errors on bands', need: 'text' },
  { fg: 'destructive', bg: 'card', use: 'Errors on cards', need: 'text' },
  { fg: 'white', bg: 'primary', use: 'Primary buttons', need: 'text' },
  { fg: 'white', bg: 'background', use: 'Secondary buttons, tertiary links', need: 'text' },
  { fg: 'background', bg: 'white', use: 'Secondary button, hovered', need: 'text' },
  { fg: 'white', bg: 'primary', bgAlpha: 0.85, under: 'background', use: 'Primary button, hovered', need: 'text' },
  { fg: 'foreground', bg: 'primary', use: 'Bone on red', need: 'text' },
  { fg: 'background', bg: 'ember', use: 'Selected text', need: 'text' },
  { fg: 'input', bg: 'background', use: 'Form field edges', need: 'nontext' },
  { fg: 'input', bg: 'card', use: 'Form field edges on cards', need: 'nontext' },
  { fg: 'input', bg: 'muted', use: 'Form field edges in the sign-up bar', need: 'nontext' },
  { fg: 'fox', bg: 'background', use: 'Spines, rules, underlines: never body text', need: 'large' },
  { fg: 'fox', bg: 'white', use: 'A series’ stamp (REJECTED) on post covers', need: 'large' },
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
    spec: 'Montserrat, the brand’s typeface: FOX in Black, STORYTELLING in Regular, run together in capitals beside the badge in fox red.',
  },
  { role: 'Home headline', className: 'font-display text-ember text-5xl leading-[1.05] uppercase', sample: 'Redemptive horror.', spec: 'Special Gothic Condensed, in capitals and ember, in its one weight: never bold. Fluid 40–64px. The home page’s h1.' },
  { role: 'Page title', className: 'font-display text-ember text-4xl leading-[1.05] uppercase md:text-5xl', sample: 'The Rejection Files', spec: 'Special Gothic Condensed, in capitals and ember: fluid 32–64px. Every h1, one per page, except a story’s own.' },
  { role: 'Story title', className: 'font-display text-4xl leading-[1.1]', sample: 'The Path: Rae’s Crusade', spec: 'Special Gothic Condensed, in the story’s own case: its page’s h1 (in ember, like every h1; fluid 32–64px), over its art on Home (32–50px), and on cards (24px).' },
  { role: 'Section heading', className: 'font-heading text-3xl font-semibold', sample: 'Latest from the Rejection Files', spec: 'Roboto, semibold: fluid 26–38px. Every band and section; h2 through h6 are Roboto.' },
  { role: 'Post title', className: 'font-heading text-xl leading-snug font-semibold', sample: 'A Rejection Files post', spec: 'Roboto, semibold: 20px on cards, 24px in lists.' },
  { role: 'Eyebrow', className: 'font-heading text-link text-xs font-semibold tracking-[0.14em] uppercase', sample: 'Rejection Files', spec: 'Roboto, 12px tracked capitals in ember: a category or series above a title.' },
  { role: 'Prose', className: 'text-xl leading-relaxed', sample: 'Long-form reading is set in Roboto too, at a size and measure for reading.', spec: 'Roboto, 20px, relaxed leading, 672px measure: posts, pages, story descriptions.' },
  { role: 'Interface', className: 'leading-relaxed', sample: 'Navigation, buttons, intros, and blurbs are set in the sans.', spec: 'Roboto, 16px. Page intros run 18px in the muted gray.' },
  { role: 'Meta', className: 'text-muted-foreground text-sm', sample: 'October 12, 2026', spec: 'Roboto, 14px, muted: dates, series names, captions.' },
]

const RULES: [string, string][] = [
  ['Tokens only.', 'Colors come from the tokens above, through Tailwind; no raw hex values or palette classes in components. A new color pair must pass WCAG AA, and its ratio goes in globals.css and the table above.'],
  ['Red is for action, ember is for light.', 'One red button per view: the thing we most want done, like All stories on Home or the first store on a story’s page. A second action in the same view is ember text, underlined. Light red text and outlines mean something went wrong. Ember is the light: page titles, links, focus, and what’s on its way. The brand file’s red (--fox) is decoration and large display only; the logo’s badge wears the primary red. Never ember on red.'],
  ['Two faces, plus the logo.', 'Titles are Special Gothic Condensed, never bold: it has one weight. Page titles (h1) are capitals, set by CSS, so they’re typed and read aloud as written; a story’s title keeps its own case wherever it’s a heading. Everything else is Roboto, with true italics: headings, reading, the interface. Montserrat sets the logo’s letters and nothing else; scripts are set in Courier Prime, as scripts are.'],
  ['Corners are 2px.', 'Nearly square, like a book’s edge. Every element uses rounded-ui; shadcn’s radius scale derives from the same value. The exceptions: the author’s portrait is round, and a series’ stamp has a rubber stamp’s rounded corners.'],
  ['One page title.', 'Each page has one h1, and headings never skip a level.'],
  ['Every card is one click target.', 'The title’s link stretches over the card, so the cover, title, and blurb all open it, with one focus ring around the whole card.'],
  ['Covers never break.', 'A book without cover art shows its title on a card with the fox-red spine, so it can be listed before the art is final.'],
  ['The site never sells or collects emails.', 'Buying hands off to retailers in a new tab; the sign-up form sends the address from the reader’s browser straight to MailerLite. Until its form address is set, the sign-up stays hidden.'],
  ['Every list has an empty state.', 'It’s written for readers, not editors.'],
  ['Content lives in Sanity.', 'Display copy is edited in the Studio, with defaults in src/lib/site-settings.ts. Exceptions are text only assistive technology hears, and this page.'],
  ['Behavior comes from shadcn.', 'Need a dialog or a menu? npx shadcn@latest add it, then restyle to the tokens. Button and badge here are ours: don’t let the CLI overwrite them.'],
  ['The header holds still.', 'It’s sticky, pinned to the top as you scroll, and stays put while pages rise and lower beneath it. Jump links and keyboard focus land just below it. On phones the pages fold into a menu that rolls down from under it, full width; Escape or a press outside rolls it back up.'],
  ['Motion is slow, and it stops.', 'The home art breathes on a 20-second cycle, swelling past its frame and settling back, never shrinking enough to show an edge, and brightening from 50% to full opacity as it swells. A dark cloud that’s never the same twice fades with it, black unless the Studio picks a color. Books change only as a breath ends, at the art’s dimmest, by crossfade; the rotation holds while someone is reading. As the first screen scrolls away, the art fades into the night. Pages stack like sheets: a new page rises from the bottom over the one you’re on, which dims; going back up a level, the page lowers away to reveal the one beneath. The header holds still; reduced motion crossfades. A pause button stops the breath, the cloud, and the rotation; reduced motion holds the art still and drops the cloud, but keeps the fade, which isn’t motion. Hover lifts a cover 4px.'],
]

const VOICE: [string, React.ReactNode][] = [
  ['Sentence case for headings.', 'Book and series titles keep their capitals: “Latest from the Rejection Files.”'],
  ['Titles in italics, or quotation marks: never both.', <>Italics in body text (<em>The Path: Rae’s Crusade</em>); quotation marks where italics can’t go, like alt text and summaries.</>],
  ['Spell out “and.”', 'Keep “&” only where it’s part of a name.'],
  ['Numbers follow AP style.', 'Spell out one through nine, numerals from 10. Percentages and money are always numerals.'],
  ['Ranges and separators.', 'An unspaced en dash for ranges (2024–2026), and a middle dot between items on a meta line (Series · Available).'],
  ['Empty states speak to readers.', '“New books are on the way,” not “Add a book in the Studio.”'],
  ['Alt text is usually one sentence.', 'It says what the image shows and why it matters, for someone listening. When the image is mostly words (an ad, a sign, a page of lettering), it carries the words. Leave it blank for a cover beside its own title.'],
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

/** Stands in for the MailerLite form until Site settings has one: shaped right, so it fails the way a real one would, with the error. */
const SAMPLE_FORM = 'https://assets.mailerlite.com/jsonp/0/forms/0/subscribe'

const SAMPLE_BUY_LINKS: CmsBuyLink[] = [
  { _key: 'a', _type: 'buyLink', store: 'Bookshop.org', url: 'https://bookshop.org' },
  { _key: 'b', _type: 'buyLink', store: 'Amazon', url: 'https://www.amazon.com' },
  { _key: 'c', _type: 'buyLink', store: 'Other', storeName: 'IngramSpark', url: 'https://www.ingramspark.com' },
]

const SAMPLE_SOCIALS: NonNullable<SiteSettings['socials']> = [
  { _key: 'n', _type: 'socialLink', platform: 'ND Riot', url: 'https://ndriot.com' },
  { _key: 'i', _type: 'socialLink', platform: 'Instagram', url: 'https://www.instagram.com' },
  { _key: 'f', _type: 'socialLink', platform: 'Facebook', url: 'https://www.facebook.com' },
  { _key: 'y', _type: 'socialLink', platform: 'YouTube', url: 'https://www.youtube.com' },
  { _key: 'b', _type: 'socialLink', platform: 'Bluesky', url: 'https://bsky.app' },
]

const SAMPLE_POSTS: PostCardData[] = [
  { _id: 'sample-post', title: 'A post title', slug: 'sample', series: { title: 'The Rejection Files', slug: 'rejection-files', form: 'prose', stamp: null }, excerpt: 'An excerpt: a sentence or two that sets up the post.', publishedAt: '2026-10-12T12:00:00Z', cover: null },
]

const span = (key: string, text: string, marks: string[] = []) => ({ _type: 'span' as const, _key: key, text, marks })
const SAMPLE_PROSE: RichTextValue = [
  { _type: 'block', _key: 'p1', style: 'normal', markDefs: [{ _type: 'link', _key: 'l1', href: 'https://www.sanity.io/docs' }], children: [span('s1', 'Body text is set for reading. Links are ember and underlined, '), span('s2', 'like this one', ['l1']), span('s3', ', and turn near-white once visited.')] },
  { _type: 'block', _key: 'h2', style: 'h2', markDefs: [], children: [span('s4', 'A heading')] },
  { _type: 'block', _key: 'p2', style: 'normal', markDefs: [], children: [span('s5', 'Headings break a long piece into parts. Subheadings go one level deeper.')] },
  { _type: 'block', _key: 'q1', style: 'blockquote', markDefs: [], children: [span('s6', 'A pull quote sits on the fox-red rule.')] },
  { _type: 'block', _key: 'b1', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [span('s7', 'Lists are bulleted')] },
  { _type: 'block', _key: 'b2', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [span('s8', 'or numbered')] },
]

// Placeholder lines, not a poem: they show how one is set. Each line ends in a typed line break (Shift+Enter in the Studio).
const SAMPLE_POEM: RichTextValue = [
  { _type: 'block', _key: 'v1', style: 'normal', markDefs: [], children: [span('t1', 'A poem keeps its lines\nexactly where they break,\nhowever short the line.')] },
  { _type: 'block', _key: 'v2', style: 'normal', markDefs: [], children: [span('t2', 'Each stanza is a paragraph,\nwith room above it.')] },
]

type ScriptStyle = NonNullable<Extract<ScreenplayValue[number], { _type: 'block' }>['style']>
const line = (key: string, style: ScriptStyle, text: string) => ({ _type: 'block' as const, _key: key, style, children: [span(`${key}s`, text)] })
// From the NEX pilot (The Rejection Files): one of each element.
const SAMPLE_SCRIPT = [
  line('c1', 'scene', 'SCENE 1: Bobby’s Wings & Auto Repair'),
  line('c2', 'normal', 'Int. Bobby’s Wings n’ Fries. Camera begins tight on several mugs... beer fills the mugs, the foamy head flows over the sides.'),
  line('c3', 'character', 'BRITNEY'),
  line('c4', 'parenthetical', '(pointing at Virgil)'),
  line('c5', 'dialogue', 'Gotcha there, hun.'),
  line('c6', 'transition', 'Fade to black.'),
] satisfies ScreenplayValue

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
        <div className="mb-12">
          <PalettePicker />
        </div>
        <ColorTokens groups={TOKENS} />
        <h3 className="mt-14 mb-2 font-semibold">Contrast</h3>
        <p className="text-muted-foreground mb-6 max-w-3xl">
          Every pair the site uses, measured live against WCAG 2.x: 4.5 for text, 3 for large text and the edges of controls. A few fail on purpose; they’re listed so no one uses them for text.
        </p>
        <ContrastTable pairs={PAIRS} />
      </Section>

      <Section id="type" aria-labelledby="type-heading">
        <SectionHeading id="type-heading" intro="Two faces: Special Gothic Condensed for titles (page titles in capitals, story titles in their own case), and Roboto for everything else, from headings to long-form reading to the interface. Montserrat, the brand’s typeface, sets only the logo’s letters.">
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
        <SectionHeading id="corners-heading" intro="Corners are 2px on nearly everything (the author’s portrait and a series’ stamp are the exceptions). Spacing follows an 8px rhythm.">
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
              ['Page edges', '16px on phones, 24px from small tablets, 48px on desktops. Page content stops at 1152px; Home, the header, and the footer at 1920px, the header lined up with Home’s edges.'],
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
              'default (primary): the call-to-action red, white text at 8.5:1. One per view.',
              'ember: ember text, underlined, white on hover. The second action where a red one already leads the view, like a story’s first store beside All stories on Home. 10.30:1 on night.',
              'outline (secondary): white text and edge on a clear ground, inverting to white on hover. Everything else that’s a button.',
              'link (tertiary): white, underlined, ember on hover: About the book, All posts. secondary, ghost, and destructive exist for shadcn components and dense UI.',
              'Sizes: sm, default, lg, and icon. ButtonLink renders a link as a button: internal paths stay in the tab, full URLs open a new one.',
              'Variant and size names match shadcn’s, so added components that import buttonVariants pick these up.',
            ]}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-3">
                <Button>Primary</Button>
                <Button variant="ember">Ember</Button>
                <Button variant="outline">Secondary</Button>
                <Button variant="link">Tertiary</Button>
              </div>
              {/* shadcn's other variants, for added components and dense UI. */}
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="secondary">Filled</Button>
                <Button variant="ghost">Ghost</Button>
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
            notes={[
              'The first store is the red action, the rest outlined. Each opens the retailer in a new tab, marked with the external-link icon.',
              'Where another red button already leads the view, as All stories does on Home, the first store is ember (second row).',
              'The button text comes from Site settings: "Buy on {store}". Another store takes the name it’s given in the Studio (IngramSpark, here).',
            ]}
          >
            <div className="flex flex-col gap-4">
              <BuyLinks label={s.buyLabel} links={SAMPLE_BUY_LINKS} />
              <BuyLinks label={s.buyLabel} links={SAMPLE_BUY_LINKS} lead="ember" />
            </div>
          </Specimen>
          <Specimen
            name="Social links"
            file="src/components/social-links.tsx"
            notes={[
              'In the header: at its right edge on desktops, ending where the text does; beneath the links in the phone menu. In the order set in Site settings → Social links: ND Riot, Instagram, Facebook, YouTube, Bluesky.',
              'In the text’s color rather than each brand’s, ember on hover: Simple Icons’ marks, and ND Riot’s own lockup as a stencil. Each opens in a new tab, and its name is read to screen readers. Targets are 40px tall.',
            ]}
          >
            <SocialLinks links={s.socials?.length ? s.socials : SAMPLE_SOCIALS} className="text-muted-foreground -mx-2.5" />
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
            notes={['The page’s only h1, with an optional eyebrow above (a series, or the way back to Short Form) and intro below.']}
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
          <Specimen
            name="Newsletter"
            file="src/components/newsletter.tsx"
            stage="background"
            notes={[
              'An email field and a button, sending the address from the reader’s browser straight to the MailerLite form set in Site settings: the site never sees it. Hidden until that address is set; shown here with a stand-in, which turns any address away, so it shows the error.',
              'On success the thank-you replaces the form and takes focus, so it’s heard; an error is announced and the address stays to fix. The browser checks the address first. Without JavaScript, the form still posts to MailerLite in a new tab.',
              'Two layouts: the panel, with the red button, for a band of its own; and the bar, with an outlined button, pinned under Home’s right column on a band of --muted, where All stories holds the red. The bar sets the form beside its words when there’s room, beneath them when there isn’t.',
            ]}
          >
            <div className="grid gap-10">
              <Newsletter settings={{ ...s, newsletterForm: s.newsletterForm ?? SAMPLE_FORM }} headingLevel="h4" />
              <Newsletter settings={{ ...s, newsletterForm: s.newsletterForm ?? SAMPLE_FORM }} layout="bar" id="newsletter-bar-heading" headingLevel="h4" />
            </div>
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
            'The showing book sits over the foot of its art, on night at 85% so its text holds over any image: status, title, series, blurb, where to buy, and About the book. Its first store is an ember link, since All stories is the view’s red button. The rotation’s controls tuck behind one toggle in the art’s top corner: open, pause, previous, and next slide out. On split screens the markers wait beside them, a quiet sign there’s more than one book until it opens; stacked, they slide out too. Escape closes it. Left and right arrow keys step through the books while focus is on the art, or nothing has focus.',
            'The art breathes every 20 seconds, swelling and brightening from 50% to full opacity, under a cloud drawn from noise that moves through time, from a new seed on each visit. The cloud is black unless Site settings or the book picks a color, and it eases into a new book’s color as the book changes. A book can turn its cloud off; it fades out, and back in for the next book that has one. The hotspot set in the Studio stays in view and is where the breath grows from.',
            'The other column, centered while it fits: the description, with All stories in red and Stephen’s Bio (once there’s an About page); then the featured series’ previews under its name (white, set like an h3; Site settings → Home page → Featured series: The Rejection Files), featured posts first, up to seven. On split screens the column, edged on its left in --border, scrolls, with the sign-up bar pinned beneath it on a band of --muted; the column fades out above the bar, so what scrolls seems to pass under it. Stacked, three posts show, then the bar, full width.',
            'On split screens, scrolling away, the art and its cloud fade into the night, gone after scrolling about a third of the screen; the book and controls stay. Stacked, the art doesn’t fade. CSS scroll-driven: browsers without it just scroll.',
            'The rotation holds while the pointer or keyboard focus is in it; pause stops it and the motion; previous, next, and a marker per book step through by hand. Reduced motion stills the art and never advances on its own.',
          ]}
        >
          {/* Shorter than the real thing, which fills the screen under the header and doesn't pin here. */}
          <HomeSplit
            settings={{ ...s, newsletterForm: s.newsletterForm ?? SAMPLE_FORM }}
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
            notes={[posts.length ? 'The latest posts from the Studio.' : 'A sample post; real ones show here once there are some.', 'Series, title, date, and excerpt (never a poem’s), divided by rules; a series’ own page leaves out its name. Visited titles turn near-white and underlined.']}
          >
            <PostList posts={rows} headingLevel="h4" />
          </Specimen>
          <Specimen
            name="Post card"
            file="src/components/post-list.tsx · PostCard"
            notes={[
              'A compact preview for tight spaces, like the home page’s first screen and the Short Form page: the post’s cover in a square flush to the card’s top, left, and bottom edges, then the meta line (series and date; just the date where the series goes without saying), title, and two lines of excerpt (none on phones, and never a poem’s). One click target.',
              'Pointing at the card or focusing it draws the cover in a little; not with reduced motion. Without a cover, the square holds the fox badge.',
              'A featured post says so, in ember, and leads its list.',
              'A series can stamp its posts’ covers (Series → Stamp): REJECTED, for The Rejection Files, in fox red capitals on white, tilted like a rubber stamp. Decorative; it holds still as the cover scales.',
            ]}
          >
            <div className="grid max-w-xl gap-3">
              {rows.slice(0, 1).map((post) => (
                <PostCard key={post._id} post={{ ...post, pinned: true }} featuredLabel={s.featuredLabel} headingLevel="h4" />
              ))}
              <PostCard post={{ ...SAMPLE_POSTS[0], _id: 'sample-no-cover', title: 'A post without a cover' }} headingLevel="h4" />
              <PostCard post={{ ...SAMPLE_POSTS[0], _id: 'sample-stamped', title: 'A Rejection File', series: { ...SAMPLE_POSTS[0].series, stamp: 'Rejected' } }} headingLevel="h4" />
            </div>
          </Specimen>
          <Specimen
            name="What it became"
            file="src/components/post-became.tsx · PostBecame"
            notes={[
              'A Rejection File’s epilogue, after the story: the story it became, linked as a small card, and the author’s words about it, in rich text (either, or both). Below it, the pitch itself, in a band of its own, its headings a level under “The pitch.”',
              'The headings (“What it became,” “The pitch”) are in Site settings → Short Form.',
            ]}
          >
            <div className="max-w-2xl">
              <PostBecame
                became={{ note: [{ _type: 'block', _key: 'n1', style: 'normal', markDefs: [], children: [span('n1s', 'A sentence or two on what happened to it after the rejections: here, it became a book.')] }], story: cards[0] ?? null }}
                heading={s.becameHeading}
                linkLabel={s.bookDetailsLabel}
                buyLabel={s.buyLabel}
                headingLevel="h4"
              />
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
          notes={[
            'Every style the Studio allows: paragraphs, headings, quotes, lists, links, and images with alt text and an optional caption.',
            'Set at 20px in Roboto, at a 672px measure. Pull quotes are italic, on the fox-red rule.',
            'An image can sit beside the text (Placement → Beside the text): floated right, up to 416px tall and 40% of the column, centered above the text on phones; headings start below it. For character designs and other tall art.',
            'A link to a page on this site (“/stories/monster”) opens in place, with the page transition; other sites open in a new tab.',
          ]}
        >
          <div className="max-w-2xl">
            <RichText value={SAMPLE_PROSE} />
          </div>
        </Specimen>
        <Specimen
          name="Poetry"
          file='src/components/rich-text.tsx · form="poetry"'
          notes={[
            'Posts in a series whose form is Poetry. Every line break is kept as typed (Shift+Enter in the Studio); each stanza is a paragraph, with more air between lines and stanzas.',
            'Cards and lists give no excerpt of a poem: it’s read whole. A series whose form is Comics lets its images run to the wide measure instead.',
          ]}
        >
          <div className="max-w-2xl">
            <RichText value={SAMPLE_POEM} form="poetry" />
          </div>
        </Specimen>
        <Specimen
          name="Script"
          file="src/components/screenplay.tsx · Screenplay"
          notes={[
            'A Rejection File’s script (Post → The script), set as a script page is, in Courier Prime: scene headings in bold capitals, action across the column, the character’s name, a parenthetical, and dialogue indented beneath, transitions to the right. Each paragraph’s style in the Studio picks its element.',
            'Storyboard images sit centered between elements, never wider than they were drawn. Courier Prime loads only where a script is shown.',
          ]}
        >
          <div className="max-w-2xl">
            <Screenplay value={SAMPLE_SCRIPT} />
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
