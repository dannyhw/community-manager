import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  deleteEvent,
  listEvents,
  saveEvent,
  type EventRecord,
} from '../server/events'

export const Route = createFileRoute('/events')({
  component: EventsPage,
  loader: async () => ({ events: await listEvents() }),
})

type DraftMode = { kind: 'closed' } | { kind: 'new' } | { kind: 'edit'; id: string }

type DraftValues = Omit<EventRecord, 'id' | 'createdAt' | 'updatedAt'>

const EMPTY_DRAFT: DraftValues = {
  name: '',
  date: '',
  doors: '',
  venue: '',
  pill: '',
  url: '',
  editionTag: '',
  editionMark: '',
  hashTag: '',
  talksTheme: '',
}

function EventsPage() {
  const { events } = Route.useLoaderData()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [mode, setMode] = useState<DraftMode>({ kind: 'closed' })
  const [draft, setDraft] = useState<DraftValues>(EMPTY_DRAFT)
  const [saving, setSaving] = useState(false)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (mode.kind === 'closed' || mode.kind === 'new') {
      setDraft(EMPTY_DRAFT)
      return
    }
    const target = events.find((e) => e.id === mode.id)
    if (target) {
      const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = target
      setDraft(rest)
    }
  }, [mode, events])

  const handleSave = useCallback(async () => {
    if (!draft.name.trim()) {
      setError('Name is required')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await saveEvent({
        data: {
          id: mode.kind === 'edit' ? mode.id : undefined,
          ...draft,
        },
      })
      setMode({ kind: 'closed' })
      await router.invalidate()
      // The studio's EventPicker reads via TanStack Query, so invalidate
      // that cache too.
      queryClient.invalidateQueries({ queryKey: ['events', 'list'] })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }, [draft, mode, router, queryClient])

  const handleDelete = useCallback(
    async (id: string, name: string) => {
      const ok = window.confirm(`Delete "${name}"? This can't be undone.`)
      if (!ok) return
      setPendingId(id)
      setError(null)
      try {
        await deleteEvent({ data: { id } })
        await router.invalidate()
        queryClient.invalidateQueries({ queryKey: ['events', 'list'] })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Delete failed')
      } finally {
        setPendingId(null)
      }
    },
    [router, queryClient],
  )

  const isFormOpen = mode.kind !== 'closed'

  return (
    <main className="page-wrap px-4 pb-12 pt-10">
      <section className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="island-kicker">Events</p>
          <h1 className="m-0 text-2xl font-semibold tracking-tight text-[var(--rnp-fg)]">
            Event library
          </h1>
          <p className="m-0 mt-1 text-sm text-[var(--rnp-fg-soft)]">
            Saved events populate the studio picker so date, venue, edition
            tag, pill and theme fill in with one click.
          </p>
        </div>
        {!isFormOpen ? (
          <button
            type="button"
            onClick={() => setMode({ kind: 'new' })}
            style={{ color: 'var(--rnp-accent-ink)' }}
            className="rounded-md border border-[var(--rnp-accent)] bg-[var(--rnp-accent)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] no-underline transition hover:-translate-y-0.5"
          >
            + Add event
          </button>
        ) : null}
      </section>

      {error ? (
        <p className="mt-4 rounded-md border border-red-300/40 bg-red-100/40 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </p>
      ) : null}

      {isFormOpen ? (
        <section className="island-shell mt-6 flex flex-col gap-4 rounded-2xl p-5">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="m-0 text-lg font-semibold text-[var(--rnp-fg)]">
              {mode.kind === 'edit' ? 'Edit event' : 'New event'}
            </h2>
            <button
              type="button"
              onClick={() => setMode({ kind: 'closed' })}
              className="rounded-full border border-[var(--rnp-chip-line)] bg-[var(--rnp-chip-bg)] px-3 py-1 text-xs font-semibold text-[var(--rnp-fg)] transition hover:-translate-y-0.5"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field
              label="Name (for the library)"
              value={draft.name}
              placeholder="June 2026 · AI Workflows"
              onChange={(v) => setDraft((d) => ({ ...d, name: v }))}
            />
            <Field
              label="Talks theme"
              value={draft.talksTheme}
              placeholder="AI Workflows"
              onChange={(v) => setDraft((d) => ({ ...d, talksTheme: v }))}
            />
            <Field
              label="Date"
              value={draft.date}
              placeholder="Thu 11 Jun"
              onChange={(v) => setDraft((d) => ({ ...d, date: v }))}
            />
            <Field
              label="Doors"
              value={draft.doors}
              placeholder="18:00"
              onChange={(v) => setDraft((d) => ({ ...d, doors: v }))}
            />
            <Field
              label="Venue"
              value={draft.venue}
              placeholder="Porto Innovation Hub"
              onChange={(v) => setDraft((d) => ({ ...d, venue: v }))}
            />
            <Field
              label="Pill"
              value={draft.pill}
              placeholder="Free · RSVP open"
              onChange={(v) => setDraft((d) => ({ ...d, pill: v }))}
            />
            <Field
              label="URL"
              value={draft.url}
              placeholder="meetup.com/react-native-porto"
              onChange={(v) => setDraft((d) => ({ ...d, url: v }))}
            />
            <Field
              label="Edition tag"
              value={draft.editionTag}
              placeholder="Edition #02 · June meetup"
              onChange={(v) => setDraft((d) => ({ ...d, editionTag: v }))}
            />
            <Field
              label="Edition mark"
              value={draft.editionMark}
              placeholder="02"
              onChange={(v) => setDraft((d) => ({ ...d, editionMark: v }))}
            />
            <Field
              label="Hash tag"
              value={draft.hashTag}
              placeholder="# RNP–002"
              onChange={(v) => setDraft((d) => ({ ...d, hashTag: v }))}
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{ color: 'var(--rnp-accent-ink)' }}
              className="rounded-md border border-[var(--rnp-accent)] bg-[var(--rnp-accent)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] no-underline transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Saving…' : mode.kind === 'edit' ? 'Save changes' : 'Save event'}
            </button>
          </div>
        </section>
      ) : null}

      {events.length === 0 ? (
        <div className="island-shell mt-8 flex flex-col items-center gap-3 rounded-2xl p-10 text-center">
          <p className="m-0 text-sm text-[var(--rnp-fg-soft)]">
            No events yet — add one to start pre-filling the studio.
          </p>
        </div>
      ) : (
        <ul className="mt-6 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <EventCard
              key={e.id}
              event={e}
              pending={pendingId === e.id}
              onEdit={() => setMode({ kind: 'edit', id: e.id })}
              onDelete={() => handleDelete(e.id, e.name)}
            />
          ))}
        </ul>
      )}
    </main>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--rnp-fg-soft)]">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-[var(--rnp-line)] bg-[var(--rnp-bg-elevated)] p-3 text-sm text-[var(--rnp-fg)] placeholder:text-[var(--rnp-fg-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--rnp-accent)]"
      />
    </label>
  )
}

function EventCard({
  event,
  pending,
  onEdit,
  onDelete,
}: {
  event: EventRecord
  pending: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <li className="island-shell flex flex-col gap-3 rounded-2xl p-4">
      <div className="flex flex-col gap-1">
        <p className="m-0 text-sm font-semibold text-[var(--rnp-fg)] [overflow-wrap:anywhere]">
          {event.name || 'Unnamed event'}
        </p>
        <p className="m-0 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--rnp-fg-soft)]">
          {[event.date, event.venue].filter(Boolean).join(' · ') || '—'}
        </p>
        {event.talksTheme || event.editionTag ? (
          <p className="m-0 text-xs text-[var(--rnp-fg-soft)]">
            {[event.talksTheme, event.editionTag].filter(Boolean).join(' · ')}
          </p>
        ) : null}
        {event.pill ? (
          <p className="m-0 mt-1 inline-block self-start rounded-full border border-[var(--rnp-chip-line)] bg-[var(--rnp-chip-bg)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--rnp-fg)]">
            {event.pill}
          </p>
        ) : null}
      </div>
      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
        <button
          type="button"
          onClick={onEdit}
          style={{ color: 'var(--rnp-accent-ink)' }}
          className="rounded-md border border-[var(--rnp-accent)] bg-[var(--rnp-accent)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] no-underline transition hover:-translate-y-0.5"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={pending}
          className="rounded-md border border-[var(--rnp-line)] bg-transparent px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--rnp-fg-soft)] transition hover:text-[var(--rnp-fg)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </li>
  )
}
