'use client'

import { useEffect, useId, useRef, useState } from 'react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Status = 'idle' | 'sending' | 'done' | 'error'

/**
 * The sign-up form: an email field and a button, posting from the reader's
 * browser straight to the MailerLite form set in Site settings, so the site
 * never sees the address. MailerLite answers in JSON (`{ success, errors }`);
 * what the reader sees is ours, from Site settings. The browser checks the
 * address first (`type="email"`, required). On success the form gives way to
 * the thank-you, and focus follows it so a keyboard or screen reader user
 * hears it; an error is announced and the address stays to fix. Without
 * JavaScript the form still posts to MailerLite, in a new tab.
 */
export function SubscribeForm({
  action,
  label,
  button,
  success,
  error,
  variant = 'default',
  className,
}: {
  action: string
  /** The field's name for screen readers, and its placeholder. */
  label: string
  button: string
  success: string
  error: string
  variant?: 'default' | 'outline'
  className?: string
}) {
  const [status, setStatus] = useState<Status>('idle')
  const id = useId()
  const thanks = useRef<HTMLParagraphElement>(null)

  // MailerLite counts the form's views (its own embed does this too), so its sign-up rate stays true. No cookies.
  useEffect(() => {
    fetch(action.replace(/\/subscribe$/, '/takel'), { mode: 'no-cors', credentials: 'omit' }).catch(() => {})
  }, [action])

  useEffect(() => {
    if (status === 'done') thanks.current?.focus()
  }, [status])

  if (status === 'done') {
    return (
      <p ref={thanks} tabIndex={-1} role="status" className={cn('text-foreground leading-relaxed outline-none', className)}>
        {success}
      </p>
    )
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setStatus('sending')
    try {
      const response = await fetch(action, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      const result = (await response.json()) as { success?: boolean }
      setStatus(result.success ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form action={action} method="post" target="_blank" onSubmit={submit} className={className}>
      <div className="flex gap-2">
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        <input
          id={id}
          type="email"
          name="fields[email]"
          required
          autoComplete="email"
          placeholder={label}
          aria-invalid={status === 'error' || undefined}
          aria-describedby={status === 'error' ? `${id}-error` : undefined}
          className="bg-card border-input text-foreground placeholder:text-muted-foreground rounded-ui h-11 w-full min-w-0 border px-3 text-sm aria-invalid:border-destructive"
        />
        {/* MailerLite's own form sends these. */}
        <input type="hidden" name="ml-submit" value="1" />
        <input type="hidden" name="anticsrf" value="true" />
        <button type="submit" disabled={status === 'sending'} aria-busy={status === 'sending'} className={cn(buttonVariants({ variant }), 'shrink-0')}>
          {button}
        </button>
      </div>
      {/* Always present, so the error is announced when it arrives. */}
      <p id={`${id}-error`} aria-live="polite" className="text-destructive empty:hidden mt-2 text-sm">
        {status === 'error' ? error : ''}
      </p>
    </form>
  )
}
