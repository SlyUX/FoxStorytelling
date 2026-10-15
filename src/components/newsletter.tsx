import { SubscribeForm } from '@/components/subscribe-form'
import type { SiteSettings } from '@/lib/site-settings'

type NewsletterSettings = Pick<
  SiteSettings,
  'newsletterHeading' | 'newsletterBlurb' | 'newsletterForm' | 'newsletterEmailLabel' | 'newsletterButtonLabel' | 'newsletterSuccess' | 'newsletterError'
>

/**
 * The mailing list sign-up: a heading, a blurb, and the form (SubscribeForm),
 * which sends the address straight to MailerLite. Until Site settings has the
 * MailerLite form's address, it doesn't render, so readers never meet a dead
 * end.
 *
 * Two layouts. The panel (the red button) stands in a band of its own. The bar
 * (an outlined button) is pinned under Home's right column, where All stories
 * already holds the red: the words and the form side by side when there's
 * room, the form beneath them when there isn't.
 */
export function Newsletter({
  settings,
  layout = 'panel',
  id = 'newsletter-heading',
  headingLevel: Heading = 'h2',
}: {
  settings: NewsletterSettings
  layout?: 'panel' | 'bar'
  /** The heading's id, which names the sign-up for screen readers: unique on the page. */
  id?: string
  headingLevel?: 'h2' | 'h3' | 'h4' | 'h5'
}) {
  if (!settings.newsletterForm) return null
  const form = (variant: 'default' | 'outline') => (
    <SubscribeForm
      action={settings.newsletterForm!}
      label={settings.newsletterEmailLabel}
      button={settings.newsletterButtonLabel}
      success={settings.newsletterSuccess}
      error={settings.newsletterError}
      variant={variant}
    />
  )
  if (layout === 'bar') {
    return (
      <aside aria-labelledby={id} className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="min-w-0 grow basis-64">
          <Heading id={id} className="font-heading text-lg leading-snug font-semibold text-white">
            {settings.newsletterHeading}
          </Heading>
          <p className="text-muted-foreground text-sm leading-relaxed">{settings.newsletterBlurb}</p>
        </div>
        <div className="min-w-0 grow basis-80">{form('outline')}</div>
      </aside>
    )
  }
  return (
    <aside aria-labelledby={id} className="bg-card border-border rounded-ui border-t-fox flex flex-col gap-6 border border-t-2 p-6 md:flex-row md:items-center md:justify-between md:p-10">
      <div>
        <Heading id={id} className="font-heading text-3xl font-semibold">
          {settings.newsletterHeading}
        </Heading>
        <p className="text-muted-foreground mt-2 max-w-xl">{settings.newsletterBlurb}</p>
      </div>
      <div className="w-full md:max-w-sm">{form('default')}</div>
    </aside>
  )
}
