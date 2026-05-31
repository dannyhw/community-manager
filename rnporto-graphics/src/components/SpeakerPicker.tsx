import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useSpeakersList } from '../lib/speakers'
import type { SpeakerRecord } from '../server/speakers'

interface Props {
  /** Speaker slot label (e.g. "Speaker 1") rendered in the popover title. */
  slotLabel: string
  /** Called with the picked record so the caller can apply it to a slot. */
  onPick: (speaker: SpeakerRecord) => void
}

export default function SpeakerPicker({ slotLabel, onPick }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const { data: speakers = [], isLoading } = useSpeakersList()

  // Close on outside click + escape so the popover doesn't trap the
  // user once they've picked or want to back out.
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
    ? speakers.filter((s) =>
        [s.name, s.title, s.company, s.talkTitle]
          .join(' ')
          .toLowerCase()
          .includes(q),
      )
    : speakers

  return (
    <div ref={wrapRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full border border-[var(--rnp-chip-line)] bg-[var(--rnp-chip-bg)] px-2.5 py-1 text-[11px] font-semibold text-[var(--rnp-fg)] transition hover:-translate-y-0.5"
        title="Pick from speaker library"
      >
        Pick speaker…
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-50 mt-1 w-[min(320px,calc(100vw-2rem))] max-w-[320px] rounded-xl border border-[var(--rnp-line)] bg-[var(--rnp-bg-elevated)] p-3 shadow-lg">
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--rnp-fg-soft)]">
              Apply to {slotLabel}
            </span>
            <Link
              to="/speakers"
              className="text-[11px] text-[var(--rnp-fg-soft)] underline-offset-2 hover:underline"
            >
              Manage
            </Link>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, talk, company…"
            className="mb-2 w-full rounded-md border border-[var(--rnp-line)] bg-[var(--rnp-bg-elevated)] p-2 text-xs text-[var(--rnp-fg)] placeholder:text-[var(--rnp-fg-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--rnp-accent)]"
            autoFocus
          />
          <div className="max-h-72 overflow-y-auto">
            {isLoading ? (
              <p className="m-0 p-2 text-xs text-[var(--rnp-fg-muted)]">Loading…</p>
            ) : filtered.length === 0 ? (
              <p className="m-0 p-2 text-xs text-[var(--rnp-fg-muted)]">
                {speakers.length === 0
                  ? 'No saved speakers yet.'
                  : 'No matches.'}{' '}
                <Link
                  to="/speakers"
                  className="text-[var(--rnp-accent)] underline-offset-2 hover:underline"
                >
                  Add one →
                </Link>
              </p>
            ) : (
              <ul className="m-0 flex list-none flex-col gap-1 p-0">
                {filtered.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onPick(s)
                        setOpen(false)
                      }}
                      className="flex w-full items-center gap-2 rounded-md border border-transparent p-2 text-left transition hover:border-[var(--rnp-line)] hover:bg-[var(--rnp-chip-bg)]"
                    >
                      {s.photoUrl ? (
                        <img
                          src={s.photoUrl}
                          alt=""
                          className="h-10 w-10 flex-none rounded-md border border-[var(--rnp-line)] object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-md border border-dashed border-[var(--rnp-line)] text-[9px] text-[var(--rnp-fg-muted)]">
                          —
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-semibold text-[var(--rnp-fg)]">
                          {s.name || 'Unnamed'}
                        </div>
                        <div className="truncate font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--rnp-fg-soft)]">
                          {[s.title, s.company].filter(Boolean).join(' · ') || '—'}
                        </div>
                        {s.talkTitle ? (
                          <div className="truncate text-[10px] text-[var(--rnp-fg-soft)]">
                            “{s.talkTitle}”
                          </div>
                        ) : null}
                      </div>
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
