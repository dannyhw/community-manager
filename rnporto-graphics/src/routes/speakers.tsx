import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  deleteSpeaker,
  listSpeakers,
  saveSpeaker,
  type SpeakerRecord,
} from '../server/speakers'

export const Route = createFileRoute('/speakers')({
  component: SpeakersPage,
  loader: async () => ({ speakers: await listSpeakers() }),
})

type DraftMode = { kind: 'closed' } | { kind: 'new' } | { kind: 'edit'; id: string }

interface DraftValues {
  name: string
  title: string
  company: string
  talkTitle: string
  /** Either a `data:` URL (fresh upload) or the persisted `/api/speakers/...` URL. */
  photo: string
}

const EMPTY_DRAFT: DraftValues = {
  name: '',
  title: '',
  company: '',
  talkTitle: '',
  photo: '',
}

function SpeakersPage() {
  const { speakers } = Route.useLoaderData()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [mode, setMode] = useState<DraftMode>({ kind: 'closed' })
  const [draft, setDraft] = useState<DraftValues>(EMPTY_DRAFT)
  const [saving, setSaving] = useState(false)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Seed the draft when switching into edit mode so the form reflects
  // the record. The closed/new states reset to a blank draft.
  useEffect(() => {
    if (mode.kind === 'closed' || mode.kind === 'new') {
      setDraft(EMPTY_DRAFT)
      return
    }
    const target = speakers.find((s) => s.id === mode.id)
    if (target) {
      setDraft({
        name: target.name,
        title: target.title,
        company: target.company,
        talkTitle: target.talkTitle,
        photo: target.photoUrl,
      })
    }
  }, [mode, speakers])

  const handleFile = useCallback((file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setDraft((d) => ({ ...d, photo: reader.result as string }))
      }
    }
    reader.readAsDataURL(file)
  }, [])

  const handleSave = useCallback(async () => {
    if (!draft.name.trim()) {
      setError('Name is required')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await saveSpeaker({
        data: {
          id: mode.kind === 'edit' ? mode.id : undefined,
          name: draft.name,
          title: draft.title,
          company: draft.company,
          talkTitle: draft.talkTitle,
          photo: draft.photo,
        },
      })
      setMode({ kind: 'closed' })
      await router.invalidate()
      // The studio's SpeakerPicker reads speakers via TanStack Query
      // (not the route loader), so invalidate that cache too — otherwise
      // a tab with the studio open keeps showing stale data.
      queryClient.invalidateQueries({ queryKey: ['speakers', 'list'] })
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
        await deleteSpeaker({ data: { id } })
        await router.invalidate()
        queryClient.invalidateQueries({ queryKey: ['speakers', 'list'] })
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
          <p className="island-kicker">Speakers</p>
          <h1 className="m-0 text-2xl font-semibold tracking-tight text-[var(--rnp-fg)]">
            Speaker library
          </h1>
          <p className="m-0 mt-1 text-sm text-[var(--rnp-fg-soft)]">
            Saved speakers populate the studio picker so name, title, company,
            talk and photo fill in with one click.
          </p>
        </div>
        {!isFormOpen ? (
          <button
            type="button"
            onClick={() => setMode({ kind: 'new' })}
            style={{ color: 'var(--rnp-accent-ink)' }}
            className="rounded-md border border-[var(--rnp-accent)] bg-[var(--rnp-accent)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] no-underline transition hover:-translate-y-0.5"
          >
            + Add speaker
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
              {mode.kind === 'edit' ? 'Edit speaker' : 'New speaker'}
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
              label="Name"
              value={draft.name}
              placeholder="Joana Almeida"
              onChange={(v) => setDraft((d) => ({ ...d, name: v }))}
            />
            <Field
              label="Title"
              value={draft.title}
              placeholder="Staff Engineer"
              onChange={(v) => setDraft((d) => ({ ...d, title: v }))}
            />
            <Field
              label="Company"
              value={draft.company}
              placeholder="Callstack"
              onChange={(v) => setDraft((d) => ({ ...d, company: v }))}
            />
            <Field
              label="Talk title"
              value={draft.talkTitle}
              placeholder="Reanimated 4 in production"
              onChange={(v) => setDraft((d) => ({ ...d, talkTitle: v }))}
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--rnp-fg-soft)]">
              Photo
            </span>
            <div className="flex items-center gap-3">
              {draft.photo ? (
                <img
                  src={draft.photo}
                  alt=""
                  className="h-20 w-20 rounded-md border border-[var(--rnp-line)] object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-md border border-dashed border-[var(--rnp-line)] text-[10px] text-[var(--rnp-fg-muted)]">
                  None
                </div>
              )}
              <div className="flex flex-1 flex-col gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                  className="block w-full text-xs text-[var(--rnp-fg)] file:mr-3 file:rounded-full file:border file:border-[var(--rnp-chip-line)] file:bg-[var(--rnp-chip-bg)] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[var(--rnp-fg)] hover:file:-translate-y-0.5"
                />
                {draft.photo ? (
                  <button
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, photo: '' }))}
                    className="self-start rounded-full border border-[var(--rnp-chip-line)] bg-[var(--rnp-chip-bg)] px-3 py-1 text-[11px] font-semibold text-[var(--rnp-fg)] transition hover:-translate-y-0.5"
                  >
                    Clear
                  </button>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{ color: 'var(--rnp-accent-ink)' }}
              className="rounded-md border border-[var(--rnp-accent)] bg-[var(--rnp-accent)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] no-underline transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Saving…' : mode.kind === 'edit' ? 'Save changes' : 'Save speaker'}
            </button>
          </div>
        </section>
      ) : null}

      {speakers.length === 0 ? (
        <div className="island-shell mt-8 flex flex-col items-center gap-3 rounded-2xl p-10 text-center">
          <p className="m-0 text-sm text-[var(--rnp-fg-soft)]">
            No speakers yet — add one to start pre-filling the studio.
          </p>
        </div>
      ) : (
        <ul className="mt-6 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {speakers.map((s) => (
            <SpeakerCard
              key={s.id}
              speaker={s}
              pending={pendingId === s.id}
              onEdit={() => setMode({ kind: 'edit', id: s.id })}
              onDelete={() => handleDelete(s.id, s.name)}
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

function SpeakerCard({
  speaker,
  pending,
  onEdit,
  onDelete,
}: {
  speaker: SpeakerRecord
  pending: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <li className="island-shell flex flex-col gap-3 rounded-2xl p-3">
      <div
        className="overflow-hidden rounded-xl border border-[var(--rnp-line)]"
        style={{ aspectRatio: '4 / 3', background: 'var(--rnp-bg-elevated)' }}
      >
        {speaker.photoUrl ? (
          <img
            src={speaker.photoUrl}
            alt={speaker.name}
            loading="lazy"
            className="block h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-[var(--rnp-fg-muted)]">
            No photo
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 px-1">
        <p className="m-0 text-sm font-semibold text-[var(--rnp-fg)] [overflow-wrap:anywhere]">
          {speaker.name || 'Unnamed'}
        </p>
        <p className="m-0 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--rnp-fg-soft)]">
          {[speaker.title, speaker.company].filter(Boolean).join(' · ') || '—'}
        </p>
        {speaker.talkTitle ? (
          <p className="m-0 text-xs text-[var(--rnp-fg-soft)] [overflow-wrap:anywhere]">
            “{speaker.talkTitle}”
          </p>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-2 px-1 pb-1">
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
