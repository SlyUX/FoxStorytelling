import { ButtonLink } from '@/components/ui/button'
import type { SiteSettings } from '@/lib/site-settings'

/**
 * The mailing list sign-up. The site never collects emails: the button hands
 * off to the MailerLite form set in Site settings. Until that address is set,
 * the panel doesn't render, so readers never meet a dead end.
 */
export function Newsletter({
  settings,
  headingLevel: Heading = 'h2',
}: {
  settings: Pick<SiteSettings, 'newsletterHeading' | 'newsletterBlurb' | 'newsletterUrl' | 'newsletterButtonLabel'>
  headingLevel?: 'h2' | 'h3' | 'h4'
}) {
  if (!settings.newsletterUrl) return null
  return (
    <aside aria-labelledby="newsletter-heading" className="bg-card border-border rounded-ui border-t-fox flex flex-col gap-6 border border-t-2 p-6 md:flex-row md:items-center md:justify-between md:p-10">
      <div>
        <Heading id="newsletter-heading" className="font-heading text-3xl font-semibold">
          {settings.newsletterHeading}
        </Heading>
        <p className="text-muted-foreground mt-2 max-w-xl">{settings.newsletterBlurb}</p>
      </div>
      <ButtonLink href={settings.newsletterUrl} size="lg">
        {settings.newsletterButtonLabel}
      </ButtonLink>
    </aside>
  )
}
