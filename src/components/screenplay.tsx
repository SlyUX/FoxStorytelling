import Image from 'next/image'
import { Courier_Prime } from 'next/font/google'
import { PortableText, type PortableTextComponents } from '@portabletext/react'

import type { SanityImage, Screenplay as ScreenplayValue } from '@/lib/types'
import { cn } from '@/lib/utils'
import { urlFor } from '@/sanity/image'

// Scripts are set in Courier, as scripts are; Courier Prime is the version drawn for screenplays. Loaded only where a
// script is shown (not preloaded on every post).
const courier = Courier_Prime({ weight: ['400', '700'], style: ['normal', 'italic'], subsets: ['latin'], preload: false })

/**
 * A script, set the way a script page is: scene headings in bold capitals,
 * action across the column, a character's name indented in capitals, a
 * parenthetical and dialogue indented beneath it, transitions to the right.
 * Indents are proportions of the column, narrower on phones. Storyboard images
 * sit centered between elements, never wider than they were drawn.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-5">{children}</p>,
    // Under the script's own heading ("The script", an h2); in the script's Courier, not the headings' face.
    scene: ({ children }) => <h3 className="mt-12 font-bold uppercase [font-family:inherit] first:mt-0">{children}</h3>,
    character: ({ children }) => <p className="mt-5 ml-[22%] uppercase sm:ml-[38%]">{children}</p>,
    parenthetical: ({ children }) => <p className="ml-[16%] sm:ml-[28%] sm:max-w-[40%]">{children}</p>,
    dialogue: ({ children }) => <p className="ml-[10%] sm:ml-[17%] sm:max-w-[62%]">{children}</p>,
    transition: ({ children }) => <p className="mt-5 text-right uppercase">{children}</p>,
  },
  types: {
    imageWithAlt: ({ value }: { value: SanityImage }) => {
      if (!value?.asset?._ref) return null
      const [w, h] = (value.asset._ref.match(/-(\d+)x(\d+)-/)?.slice(1) ?? ['1600', '1000']).map(Number)
      const width = Math.min(1600, w)
      return (
        <figure className="mx-auto my-10" style={{ maxWidth: Math.min(w, 672) }}>
          <Image
            src={urlFor(value).width(width).url()}
            alt={value.alt ?? ''}
            width={width}
            height={Math.round((width * h) / w)}
            sizes={`(max-width: 768px) 100vw, ${Math.min(672, w)}px`}
            className="rounded-ui h-auto w-full"
          />
          {value.caption && <figcaption className="text-muted-foreground mt-2 text-center font-sans text-sm">{value.caption}</figcaption>}
        </figure>
      )
    },
  },
}

export function Screenplay({ value, className }: { value: ScreenplayValue | null | undefined; className?: string }) {
  if (!value?.length) return null
  return (
    <div className={cn(courier.className, 'text-base leading-relaxed sm:text-lg', className)}>
      <PortableText value={value} components={components} />
    </div>
  )
}
