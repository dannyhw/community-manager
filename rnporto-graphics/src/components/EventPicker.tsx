import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useEventsList } from '../lib/events'
import type { EventRecord } from '../server/events'

interface Props {
  onPick: (event: EventRecord) => void
}

export default function EventPicker({ onPick }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const { data: events = [], isLoading } = useEventsList()

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const q = query.trim().toLowerCase()
  const filtered = q
    ? events.filter((e) =>
        [e.name, e.date, e.venue, e.talksTheme, e.editionTag]
          .join(' ')
          .toLowerCase()
          .includes(q),
      )
    : events

  return (
    <div ref={wrapRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full border border-[var(--rnp-chip-line)] bg-[var(--rnp-chip-bg)] px-2.5 py-1 text-[11px] font-semibold text-[var(--rnp-fg)] transition hover:-translate-y-0.5"
        title="Pick from event library"
      >
        Pick event…
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-50 mt-1 w-[min(320px,calc(100vw-2rem))] max-w-[320px] rounded-xl border border-[var(--rnp-line)] bg-[var(--rnp-bg-elevated)] p-3 shadow-lg">
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--rnp-fg-soft)]">
              Apply event
            </span>
            <Link
              to="/events"
              className="text-[11px] text-[var(--rnp-fg-soft)] underline-offset-2 hover:underline"
            >
              Manage
            </Link>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search date, venue, theme…"
            className="mb-2 w-full rounded-md border border-[var(--rnp-line)] bg-[var(--rnp-bg-elevated)] p-2 text-xs text-[var(--rnp-fg)] placeholder:text-[var(--rnp-fg-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--rnp-accent)]"
            autoFocus
          />
          <div className="max-h-72 overflow-y-auto">
            {isLoading ? (
              <p className="m-0 p-2 text-xs text-[var(--rnp-fg-muted)]">Loading…</p>
            ) : filtered.length === 0 ? (
              <p className="m-0 p-2 text-xs text-[var(--rnp-fg-muted)]">
                {events.length === 0
                  ? 'No saved events yet.'
                  : 'No matches.'}{' '}
                <Link
                  to="/events"
                  className="text-[var(--rnp-accent)] underline-offset-2 hover:underline"
                >
                  Add one →
                </Link>
              </p>
            ) : (
              <ul className="m-0 flex list-none flex-col gap-1 p-0">
                {filtered.map((e) => (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onPick(e)
                        setOpen(false)
                      }}
                      className="flex w-full flex-col gap-0.5 rounded-md border border-transparent p-2 text-left transition hover:border-[var(--rnp-line)] hover:bg-[var(--rnp-chip-bg)]"
                    >
                      <div className="truncate text-xs font-semibold text-[var(--rnp-fg)]">
                        {e.name || 'Unnamed event'}
                      </div>
                      <div className="truncate font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--rnp-fg-soft)]">
                        {[e.date, e.venue].filter(Boolean).join(' · ') || '—'}
                      </div>
                      {e.talksTheme || e.editionTag ? (
                        <div className="truncate text-[10px] text-[var(--rnp-fg-soft)]">
                          {[e.talksTheme, e.editionTag].filter(Boolean).join(' · ')}
                        </div>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
