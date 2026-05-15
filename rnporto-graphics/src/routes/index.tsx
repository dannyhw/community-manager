import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toBlob, toPng } from 'html-to-image'
import GraphicCanvas from '../components/GraphicCanvas'
import TemplateEditor from '../components/TemplateEditor'
import TemplatePicker from '../components/TemplatePicker'
import ThemeControls from '../components/ThemeControls'
import { resolveTheme, type ThemeMode } from '../system/tokens'
import { templates, templatesById } from '../templates'
import type { TemplateValues } from '../templates/types'
import { getGraphic, saveGraphic } from '../server/gallery'

interface StudioSearch {
  /** When present, the studio fetches that gallery entry and restores its state. */
  load?: string
}

export const Route = createFileRoute('/')({
  component: GraphicsStudio,
  validateSearch: (search: Record<string, unknown>): StudioSearch => ({
    load: typeof search.load === 'string' ? search.load : undefined,
  }),
  loaderDeps: ({ search }) => ({ load: search.load }),
  loader: async ({ deps }) => {
    if (!deps.load) return { loaded: null }
    try {
      const entry = await getGraphic({ data: { id: deps.load } })
      return { loaded: entry }
    } catch {
      return { loaded: null }
    }
  },
})

const DEFAULT_MODE: ThemeMode = 'light'
const DEFAULT_ACCENT = '#2B6CA8' // tile

// Templates that share the same draft — edits to one mirror to the others.
// Used so the same speaker photo / talk title / meta carries between the
// square and portrait speaker variants without re-uploading.
const LINKED_IDS: Record<string, Array<string>> = {
  'banner-speaker-square': ['banner-speaker-portrait', 'banner-speaker-landscape'],
  'banner-speaker-portrait': ['banner-speaker-square', 'banner-speaker-landscape'],
  'banner-speaker-landscape': ['banner-speaker-square', 'banner-speaker-portrait'],
  'banner-speakers-3': ['banner-speakers-3-square', 'banner-speakers-3-landscape'],
  'banner-speakers-3-square': ['banner-speakers-3', 'banner-speakers-3-landscape'],
  'banner-speakers-3-landscape': ['banner-speakers-3', 'banner-speakers-3-square'],
}

type PreviewMode = 'live' | 'export'

// Shared between the in-UI preview and the download — guarantees the rasterised
// PNG you download matches what the export-preview shows.
function rasterise(node: HTMLElement, width: number, height: number) {
  return toPng(node, {
    cacheBust: true,
    pixelRatio: 2,
    width,
    height,
    canvasWidth: width,
    canvasHeight: height,
    style: { transform: 'scale(1)', transformOrigin: 'top left' },
  })
}

// Blob variant used by the Download button. We can't keep using the data
// URL for downloads — Chrome silently no-ops `anchor.click()` when the
// href data URL is over ~2 MB, which the bigger speaker templates
// (1280×720 with a photo) easily exceed once rasterised at pixelRatio 2.
// An object URL backed by a Blob has no such limit.
function rasteriseToBlob(node: HTMLElement, width: number, height: number) {
  return toBlob(node, {
    cacheBust: true,
    pixelRatio: 2,
    width,
    height,
    canvasWidth: width,
    canvasHeight: height,
    style: { transform: 'scale(1)', transformOrigin: 'top left' },
  })
}

// Downscaled thumbnail used by the gallery cards. We render the source DOM
// at its native dimensions but ask `html-to-image` to size the output
// canvas to ~480px on the long edge — cheap on disk and quick to ship over
// the wire while still legible at card size.
const THUMB_LONG_EDGE = 480
function rasteriseThumb(node: HTMLElement, width: number, height: number) {
  const scale = Math.min(1, THUMB_LONG_EDGE / Math.max(width, height))
  const outW = Math.round(width * scale)
  const outH = Math.round(height * scale)
  return toPng(node, {
    cacheBust: true,
    pixelRatio: 1,
    width,
    height,
    canvasWidth: outW,
    canvasHeight: outH,
    style: { transform: 'scale(1)', transformOrigin: 'top left' },
  })
}

function GraphicsStudio() {
  const navigate = useNavigate()
  const { loaded } = Route.useLoaderData()
  // When the loader returned an entry (?load=<id>), seed initial state from
  // it. We only honour the loaded entry on first mount; subsequent edits in
  // the studio shouldn't be clobbered if the URL stays the same.
  const [activeId, setActiveId] = useState(loaded?.templateId ?? templates[0].id)
  const [mode, setMode] = useState<ThemeMode>(loaded?.mode ?? DEFAULT_MODE)
  const [accent, setAccent] = useState(loaded?.accent ?? DEFAULT_ACCENT)
  const [valuesById, setValuesById] = useState<Record<string, TemplateValues>>(
    () => {
      const seeded: Record<string, TemplateValues> = Object.fromEntries(
        templates.map((t) => [t.id, { ...t.defaults }]),
      )
      if (loaded && seeded[loaded.templateId]) {
        seeded[loaded.templateId] = { ...seeded[loaded.templateId], ...loaded.values }
      }
      return seeded
    },
  )
  // Track which gallery entry (if any) the current state is associated with —
  // lets the Save button offer "Save changes" vs "Save as new" without
  // re-prompting for the name on every edit. We also track the template id
  // the bound entry was saved against: switching to a different template
  // means the in-memory values no longer belong to that entry, and the
  // overwrite affordance should disappear until the user switches back.
  const [galleryEntryId, setGalleryEntryId] = useState<string | null>(
    loaded?.id ?? null,
  )
  const [galleryEntryName, setGalleryEntryName] = useState<string | null>(
    loaded?.name ?? null,
  )
  const [galleryEntryTemplateId, setGalleryEntryTemplateId] = useState<
    string | null
  >(loaded?.templateId ?? null)
  // True when the active template still matches the loaded entry — only
  // then is "Save changes" semantically correct.
  const boundToEntry =
    galleryEntryId !== null && galleryEntryTemplateId === activeId
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState<PreviewMode>('live')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewing, setPreviewing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveToast, setSaveToast] = useState<string | null>(null)
  // `null` → buttons; `{ mode }` → inline name form is open. Tracking the
  // intent ("new" vs "overwrite") lets a single form handle both flows
  // without re-rendering the buttons.
  const [savePromptIntent, setSavePromptIntent] = useState<
    null | { mode: 'new' | 'overwrite' }
  >(null)
  const [saveNameInput, setSaveNameInput] = useState('')
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const saveNameRef = useRef<HTMLInputElement | null>(null)

  const template = templatesById[activeId]
  const values = valuesById[activeId]
  const theme = useMemo(() => resolveTheme(mode, accent), [mode, accent])

  // Reflect the resolved accent + mode onto the document root so the studio
  // chrome (header, cards, buttons) tracks the same design tokens the
  // banners use. The studio drives mode explicitly — we ignore the auto
  // theme-toggle for now so the preview always matches the export.
  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    root.setAttribute('data-theme', mode)
    root.style.colorScheme = mode
    root.style.setProperty('--rnp-accent', theme.accent)
    root.style.setProperty('--rnp-accent-ink', theme.accentInk)
    return () => {
      root.style.removeProperty('--rnp-accent')
      root.style.removeProperty('--rnp-accent-ink')
    }
  }, [mode, theme.accent, theme.accentInk])

  // Auto-rasterise when the user is in Export-preview mode and the inputs
  // change. Debounced so we don't burn CPU on every keystroke. We always
  // keep the live canvas mounted (it's the capture source) and just toggle
  // visibility between it and the rasterised <img>.
  useEffect(() => {
    if (previewMode !== 'export') {
      setPreviewUrl(null)
      return
    }
    let cancelled = false
    setPreviewing(true)
    const handle = window.setTimeout(async () => {
      const node = canvasRef.current
      if (!node) return
      try {
        const url = await rasterise(node, template.width, template.height)
        if (!cancelled) setPreviewUrl(url)
      } catch (err) {
        if (!cancelled)
          setExportError(err instanceof Error ? err.message : 'Preview failed')
      } finally {
        if (!cancelled) setPreviewing(false)
      }
    }, 350)
    return () => {
      cancelled = true
      window.clearTimeout(handle)
    }
  }, [previewMode, template, values, theme])

  const updateField = useCallback(
    (key: string, value: string) => {
      setValuesById((prev) => {
        const next = {
          ...prev,
          [activeId]: { ...prev[activeId], [key]: value },
        }
        for (const linkedId of LINKED_IDS[activeId] ?? []) {
          next[linkedId] = { ...prev[linkedId], [key]: value }
        }
        return next
      })
    },
    [activeId],
  )

  const resetTemplate = useCallback(() => {
    setValuesById((prev) => {
      const next = {
        ...prev,
        [activeId]: { ...templatesById[activeId].defaults },
      }
      for (const linkedId of LINKED_IDS[activeId] ?? []) {
        next[linkedId] = { ...templatesById[linkedId].defaults }
      }
      return next
    })
  }, [activeId])

  const resetTheme = useCallback(() => {
    setMode(DEFAULT_MODE)
    setAccent(DEFAULT_ACCENT)
  }, [])

  const slug = useMemo(() => {
    const seed =
      values.titleLine1 ||
      values.titleLine2 ||
      values.brandLine1 ||
      values.tagText ||
      template.name
    return (
      seed
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 60) || template.id
    )
  }, [values, template])

  const handleExport = useCallback(async () => {
    const node = canvasRef.current
    if (!node) return
    setExporting(true)
    setExportError(null)
    let objectUrl: string | null = null
    try {
      const blob = await rasteriseToBlob(node, template.width, template.height)
      if (!blob) throw new Error('Export produced no image')
      // Object URL — unlimited size, unlike a data URL in href.
      objectUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = `${template.id}-${slug}.png`
      link.href = objectUrl
      // Some browsers ignore programmatic clicks on detached anchors, so
      // briefly attach to the document before clicking.
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Export failed')
    } finally {
      // Free the blob once the browser has had a chance to start the
      // download. Revoking immediately can cancel slow saves on some
      // browsers, so we give it a tick.
      if (objectUrl) window.setTimeout(() => URL.revokeObjectURL(objectUrl!), 1000)
      setExporting(false)
    }
  }, [template, slug])

  // Open the inline save form. Pre-fills the name field: when overwriting,
  // reuse the existing entry's name; otherwise seed from the template name
  // + the export-filename slug so the user usually only has to hit Enter.
  const openSavePrompt = useCallback(
    (mode: 'new' | 'overwrite') => {
      const fallbackName = `${template.name} · ${slug}`
      const seed =
        mode === 'overwrite' && galleryEntryName ? galleryEntryName : fallbackName
      setSaveNameInput(seed)
      setSaveError(null)
      setSaveToast(null)
      setSavePromptIntent({ mode })
      // Focus + select on next tick so the user can either accept or type
      // a replacement immediately.
      window.setTimeout(() => {
        saveNameRef.current?.focus()
        saveNameRef.current?.select()
      }, 0)
    },
    [template.name, slug, galleryEntryName],
  )

  const cancelSavePrompt = useCallback(() => {
    setSavePromptIntent(null)
    setSaveNameInput('')
  }, [])

  // Commit the save. We always re-rasterise the thumbnail at save time so
  // the gallery card reflects the latest state, not the state at load time.
  const confirmSave = useCallback(async () => {
    if (!savePromptIntent) return
    const node = canvasRef.current
    if (!node) return
    const overwrite = savePromptIntent.mode === 'overwrite'
    const fallbackName = `${template.name} · ${slug}`
    const name = saveNameInput.trim() || fallbackName
    setSaving(true)
    setSaveError(null)
    try {
      const thumbDataUrl = await rasteriseThumb(node, template.width, template.height)
      const entry = await saveGraphic({
        data: {
          id: overwrite ? galleryEntryId ?? undefined : undefined,
          templateId: template.id,
          name,
          values,
          mode,
          accent,
          width: template.width,
          height: template.height,
          thumbDataUrl,
        },
      })
      setGalleryEntryId(entry.id)
      setGalleryEntryName(entry.name)
      setGalleryEntryTemplateId(entry.templateId)
      // The server peels base64 uploads out of `values` into asset
      // files and rewrites those keys to URLs. Mirror that back into
      // local state so the in-memory representation matches what's on
      // disk (and subsequent saves don't keep re-uploading the same
      // blob). The template renders both `data:` URLs and same-origin
      // URLs through the same `<img src>`, so the swap is invisible.
      setValuesById((prev) => ({
        ...prev,
        [template.id]: { ...prev[template.id], ...entry.values },
      }))
      setSavePromptIntent(null)
      setSaveNameInput('')
      setSaveToast(overwrite ? `Saved changes to “${entry.name}”.` : `Saved “${entry.name}” to gallery.`)
      window.setTimeout(() => setSaveToast(null), 3500)
      // Keep the URL in sync so reload / share preserves the loaded entry.
      navigate({ to: '/', search: { load: entry.id }, replace: true })
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }, [
    savePromptIntent,
    saveNameInput,
    template,
    slug,
    values,
    mode,
    accent,
    galleryEntryId,
    navigate,
  ])

  return (
    <main className="page-wrap px-4 pb-12 pt-10">
      <section className="flex flex-col gap-3">
        <p className="island-kicker">Templates</p>
        <TemplatePicker
          templates={templates}
          activeId={activeId}
          onSelect={setActiveId}
        />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <ThemeControls
            mode={mode}
            accent={accent}
            onMode={setMode}
            onAccent={setAccent}
            onReset={resetTheme}
          />
          <TemplateEditor
            template={template}
            values={values}
            onChange={updateField}
            onReset={resetTemplate}
          />
        </div>

        <div className="island-shell flex flex-col gap-4 rounded-2xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="island-kicker mb-1">Preview</p>
              <p className="m-0 text-xs text-[var(--rnp-fg-soft)]">
                Exports at full {template.width}×{template.height}. Mode: {mode}.
              </p>
            </div>
            <div className="inline-flex rounded-full border border-[var(--rnp-line)] bg-[var(--rnp-chip-bg)] p-1 text-xs font-semibold">
              {(['live', 'export'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPreviewMode(m)}
                  className={
                    'rounded-full px-3 py-1 capitalize transition ' +
                    (previewMode === m
                      ? 'bg-[var(--rnp-accent)] text-[var(--rnp-accent-ink)]'
                      : 'text-[var(--rnp-fg)]')
                  }
                  title={
                    m === 'live'
                      ? 'Show the live DOM render'
                      : 'Show the rasterised PNG (matches the download exactly)'
                  }
                >
                  {m === 'live' ? 'Live' : 'Export preview'}
                </button>
              ))}
            </div>
          </div>

          {/* The live canvas is the capture source — keep it fully painted
              at all times. In export-preview mode we *overlay* the
              rasterised PNG on top so the user sees what will download,
              while html-to-image still has a clean DOM to capture. Earlier
              versions hid the canvas via `visibility: hidden`, which
              propagates to descendants and made the captured PNG come back
              blank. */}
          <div className="relative">
            <GraphicCanvas
              ref={canvasRef}
              template={template}
              values={values}
              theme={theme}
            />

            {previewMode === 'export' ? (
              <div
                className="absolute inset-0 overflow-hidden rounded-[14px]"
                style={{
                  background: theme.bg.canvas,
                  boxShadow: theme.shadow.e3,
                }}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={`${template.name} export preview`}
                    className="block h-full w-full object-contain"
                    draggable={false}
                  />
                ) : null}
                {previewing ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--rnp-bg)]/40 backdrop-blur-sm">
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--rnp-fg-soft)]">
                      Rendering preview…
                    </span>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          {exportError ? (
            <p className="m-0 rounded-md border border-red-300/40 bg-red-100/40 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
              {exportError}
            </p>
          ) : null}
          {saveError ? (
            <p className="m-0 rounded-md border border-red-300/40 bg-red-100/40 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
              {saveError}
            </p>
          ) : null}
          {saveToast ? (
            <p className="m-0 rounded-md border border-[var(--rnp-line)] bg-[var(--rnp-chip-bg)] p-3 text-xs font-mono uppercase tracking-[0.16em] text-[var(--rnp-fg-soft)]">
              {saveToast}
            </p>
          ) : null}

          {savePromptIntent ? (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                void confirmSave()
              }}
              className="flex flex-wrap items-end gap-2 rounded-md border border-[var(--rnp-line)] bg-[var(--rnp-chip-bg)] p-3"
            >
              <label className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="island-kicker">
                  {savePromptIntent.mode === 'overwrite'
                    ? 'Save changes as'
                    : 'Save to gallery — name'}
                </span>
                <input
                  ref={saveNameRef}
                  type="text"
                  value={saveNameInput}
                  onChange={(e) => setSaveNameInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      e.preventDefault()
                      cancelSavePrompt()
                    }
                  }}
                  disabled={saving}
                  placeholder={`${template.name} · ${slug}`}
                  className="w-full rounded-md border border-[var(--rnp-line)] bg-[var(--rnp-bg)] px-3 py-2 text-sm text-[var(--rnp-fg)] outline-none focus:border-[var(--rnp-accent)]"
                />
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={cancelSavePrompt}
                  disabled={saving}
                  className="rounded-md border border-[var(--rnp-line)] bg-transparent px-3 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rnp-fg-soft)] transition hover:text-[var(--rnp-fg)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ color: 'var(--rnp-accent-ink)' }}
                  className="rounded-md border border-[var(--rnp-accent)] bg-[var(--rnp-accent)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? 'Saving…'
                    : savePromptIntent.mode === 'overwrite'
                      ? 'Save changes'
                      : 'Save'}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-wrap items-center justify-end gap-2">
              {boundToEntry ? (
                <button
                  type="button"
                  onClick={() => openSavePrompt('overwrite')}
                  className="rounded-md border border-[var(--rnp-line)] bg-transparent px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rnp-fg)] transition hover:bg-[var(--rnp-chip-bg)]"
                  title={`Overwrite "${galleryEntryName ?? galleryEntryId}"`}
                >
                  Save changes
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => openSavePrompt('new')}
                className="rounded-md border border-[var(--rnp-line)] bg-[var(--rnp-chip-bg)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rnp-fg)] transition hover:-translate-y-0.5"
              >
                {boundToEntry ? 'Save as new' : 'Save to gallery'}
              </button>
              <button
                type="button"
                onClick={handleExport}
                disabled={exporting}
                style={{ color: 'var(--rnp-accent-ink)' }}
                className="rounded-md border border-[var(--rnp-accent)] bg-[var(--rnp-accent)] px-5 py-2 text-sm font-semibold uppercase tracking-[0.16em] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {exporting ? 'Rendering…' : 'Download PNG'}
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
