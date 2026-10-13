'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * The site's internal link. Pages stack like sheets:
 *
 *  - Going anywhere else (a story from Stories, Stories from the home page, one
 *    section to another): the new page rises from the bottom over the one
 *    you're on, which dims.
 *  - Going back up a level (a story back to Stories, any page back home): the
 *    page you're on lowers away, revealing the one beneath.
 *
 * The motion travels as a view-transition type; `globals.css` turns it into
 * movement (RouteTransition applies it). Browser back and forward carry no
 * type, so they swap instantly: the documented Next.js behavior.
 */
type Motion = 'page-rise' | 'page-lower' | 'none'

/** Home is above every page; otherwise it's the path prefix. */
const isAncestor = (parent: string, child: string) => (parent === '/' ? child !== '/' : child.startsWith(`${parent}/`))

function motionFor(from: string, to: string): Motion {
  if (from === to) return 'none'
  return isAncestor(to, from) ? 'page-lower' : 'page-rise'
}

export function TransitionLink({ href, ...rest }: Omit<React.ComponentProps<typeof Link>, 'href'> & { href: string }) {
  const pathname = usePathname()
  return <Link href={href} transitionTypes={[motionFor(pathname, href.split(/[?#]/)[0])]} {...rest} />
}
