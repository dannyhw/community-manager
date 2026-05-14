import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useCallback, useState } from 'react'
import { deleteGraphic, listGraphics } from '../server/gallery'
import { templatesById } from '../templates'

export const Route = createFileRoute('/gallery')({
  component: GalleryPage,
  loader: async () => ({ entries: await listGraphics() }),
})

function GalleryPage() {
  const { entries } = Route.useLoaderData()
  const router = useRouter()
  // Track which entry is mid-delete so we can disable its actions and
  // surface a per-row error without blocking the rest of the gallery.
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = useCallback(
    async (id: string, name: string) => {
      const ok = window.confirm(`Delete "${name}"? This can't be undone.`)
      if (!ok) return
      setPendingId(id)
      setError(null)
      try {
        await deleteGraphic({ data: { id } })
        await router.invalidate()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Delete failed')
      } finally {
        setPendingId(null)
      }
    },
    [router],
  )

  return (
    <main className="page-wrap px-4 pb-12 pt-10">
      <section className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="island-kicker">Gallery</p>
          <h1 className="m-0 text-2xl font-semibold tracking-tight text-[var(--rnp-fg)]">
            Saved graphics
          </h1>
          <p className="m-0 mt-1 text-sm text-[var(--rnp-fg-soft)]">
            {entries.length === 0
              ? 'Nothing saved yet — hit “Save to gallery” in the studio to start.'
              : `${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}, newest first.`}
          </p>
        </div>
        <Link
          to="/"
          // Global `a` rule in styles.css colours every link with the accent;
          // call-to-action pills need the accent-ink (white on blue) instead,
          // so we set the colour inline to win on specificity.
          style={{ color: 'var(--rnp-accent-ink)' }}
          className="rounded-md border border-[var(--rnp-accent)] bg-[var(--rnp-accent)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] no-underline transition hover:-translate-y-0.5"
        >
          New graphic
        </Link>
      </section>

      {error ? (
        <p className="mt-4 rounded-md border border-red-300/40 bg-red-100/40 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </p>
      ) : null}

      {entries.length === 0 ? (
        <div className="island-shell mt-8 flex flex-col items-center gap-3 rounded-2xl p-10 text-center">
          <p className="m-0 text-sm text-[var(--rnp-fg-soft)]">
            Your saved graphics will appear here.
          </p>
        </div>
      ) : (
        <ul className="mt-6 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => {
            const template = templatesById[entry.templateId]
            const aspect = `${entry.width} / ${entry.height}`
            const isPending = pendingId === entry.id
            return (
              <li
                key={entry.id}
                className="island-shell flex flex-col gap-3 rounded-2xl p-3"
              >
                <Link
                  to="/"
                  search={{ load: entry.id }}
                  className="block overflow-hidden rounded-xl border border-[var(--rnp-line)] no-underline"
                  title={`Open “${entry.name}” in the studio`}
                >
                  <div
                    style={{
                      aspectRatio: aspect,
                      background: 'var(--rnp-bg-elevated)',
                    }}
                  >
                    <img
                      src={entry.thumbUrl}
                      alt={entry.name}
                      loading="lazy"
                      className="block h-full w-full object-cover"
                      draggable={false}
                    />
                  </div>
                </Link>
                <div className="flex flex-col gap-1 px-1">
                  <p className="m-0 text-sm font-semibold text-[var(--rnp-fg)] [overflow-wrap:anywhere]">
                    {entry.name}
                  </p>
                  <p className="m-0 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--rnp-fg-soft)]">
                    {template?.name ?? entry.templateId} · {entry.width}×
                    {entry.height} · {entry.mode}
                  </p>
                  <p className="m-0 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--rnp-fg-soft)]">
                    Saved {formatRelative(entry.updatedAt)}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2 px-1 pb-1">
                  <Link
                    to="/"
                    search={{ load: entry.id }}
                    // See note above on the global `a` color override.
                    style={{ color: 'var(--rnp-accent-ink)' }}
                    className="rounded-md border border-[var(--rnp-accent)] bg-[var(--rnp-accent)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] no-underline transition hover:-translate-y-0.5"
                  >
                    Open
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id, entry.name)}
                    disabled={isPending}
                    className="rounded-md border border-[var(--rnp-line)] bg-transparent px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--rnp-fg-soft)] transition hover:text-[var(--rnp-fg)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isPending ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}

// Compact "5 min ago" / "2 days ago" style label. Keeps the gallery cards
// readable at a glance without forcing us to ship a date-fns dep.
function formatRelative(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return iso
  const diffMs = Date.now() - then
  const sec = Math.round(diffMs / 1000)
  if (sec < 60) return 'just now'
  const min = Math.round(sec / 60)
  if (min < 60) return `${min} min ago`
  const hr = Math.round(min / 60)
  if (hr < 24) return `${hr} hr ago`
  const day = Math.round(hr / 24)
  if (day < 30) return `${day} day${day === 1 ? '' : 's'} ago`
  return new Date(iso).toLocaleDateString()
}
