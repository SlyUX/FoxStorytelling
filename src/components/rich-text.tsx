import Image from 'next/image'
import { PortableText, type PortableTextComponents } from '@portabletext/react'

import { externalHref } from '@/lib/utils'
import type { RichText as RichTextValue, SanityImage } from '@/lib/types'
import { urlFor } from '@/sanity/image'

/**
 * Long-form reading: book descriptions, posts, pages. Set in the serif, at a
 * size and measure for reading. Every block style allowed in
 * `schemaTypes/objects.ts → richText` has a renderer here.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <h2 className="pt-6 text-3xl leading-tight font-semibold">{children}</h2>,
    h3: ({ children }) => <h3 className="pt-3 text-2xl leading-snug font-semibold">{children}</h3>,
    blockquote: ({ children }) => <blockquote className="border-fox border-l-2 pl-5 text-2xl leading-snug italic">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc space-y-2 pl-6">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal space-y-2 pl-6">{children}</ol>,
  },
  marks: {
    link: ({ value, children }: { value?: { href?: string }; children: React.ReactNode }) => {
      const href = externalHref(value?.href)
      if (!href) return <>{children}</>
      return (
        <a
          href={href}
          className="text-link visited:text-visited decoration-link/50 hover:decoration-link underline underline-offset-4"
          {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      )
    },
  },
  types: {
    imageWithAlt: ({ value }: { value: SanityImage }) => {
      if (!value?.asset?._ref) return null
      // Asset IDs carry the source size ("image-<hash>-1200x800-jpg"). Never
      // request more pixels than that, so small images stay crisp.
      const [w, h] = (value.asset._ref.match(/-(\d+)x(\d+)-/)?.slice(1) ?? ['1600', '1000']).map(Number)
      const width = Math.min(1600, w)
      return (
        <figure className="my-2" style={{ maxWidth: w }}>
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

export function RichText({ value }: { value: RichTextValue | null | undefined }) {
  if (!value?.length) return null
  return (
    <div className="space-y-5 font-serif text-xl leading-relaxed">
      <PortableText value={value} components={components} />
    </div>
  )
}
