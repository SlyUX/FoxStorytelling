export default function Newsletter({ blurb }: { blurb?: string }) {
  return (
    <section className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-6">
      <h2 className="text-lg font-semibold">Join the list</h2>
      <p className="mt-1 text-sm text-neutral-400">{blurb ?? 'Get the free reader magnet and news on new books.'}</p>
      {/* TODO: paste your MailerLite embedded-form snippet here. The site never handles emails itself. */}
      <div className="mt-4 text-xs text-neutral-500">[ MailerLite embedded form goes here ]</div>
    </section>
  )
}
