import Link from 'next/link'
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-neutral-800">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-bold tracking-tight">Fox Storytelling</Link>
          <div className="flex gap-6 text-sm text-neutral-300">
            <Link href="/books" className="hover:text-white">Books</Link>
            <Link href="/blog" className="hover:text-white">Rejection Files</Link>
            <Link href="/about" className="hover:text-white">About</Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
      <footer className="border-t border-neutral-800 py-8 text-center text-xs text-neutral-500">© Fox Storytelling</footer>
    </>
  )
}
