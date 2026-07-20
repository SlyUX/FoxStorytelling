type BuyLink = { store: string; url: string }
export default function BuyLinks({ links }: { links?: BuyLink[] }) {
  if (!links?.length) return null
  return (
    <div className="flex flex-wrap gap-3">
      {links.map((l) => (
        <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
          className="rounded-md border border-neutral-700 px-4 py-2 text-sm font-medium hover:bg-neutral-800 transition">
          Buy on {l.store}
        </a>
      ))}
    </div>
  )
}
