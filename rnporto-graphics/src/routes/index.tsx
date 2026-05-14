import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import GraphicCanvas from '../components/GraphicCanvas'
import TemplateEditor from '../components/TemplateEditor'
import TemplatePicker from '../components/TemplatePicker'
import ThemeControls from '../components/ThemeControls'
import { resolveTheme, type ThemeMode } from '../system/tokens'
import { templates, templatesById } from '../templates'
import type { TemplateValues } from '../templates/types'

export const Route = createFileRoute('/')({ component: GraphicsStudio })

const DEFAULT_MODE: ThemeMode = 'light'
const DEFAULT_ACCENT = '#2B6CA8' // tile

// Templates that share the same draft — edits to one mirror to the others.
// Used so the same speaker photo / talk title / meta carries between the
// square and portrait speaker variants without re-uploading.
const LINKED_IDS: Record<string, Array<string>> = {
  'banner-speaker-square': ['banner-speaker-portrait', 'banner-speaker-landscape'],
  'banner-speaker-portrait': ['banner-speaker-square', 'banner-speaker-landscape'],
  'banner-speaker-landscape': ['banner-speaker-square', 'banner-speaker-portrait'],
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

function GraphicsStudio() {
  const [activeId, setActiveId] = useState(templates[0].id)
  const [mode, setMode] = useState<ThemeMode>(DEFAULT_MODE)
  const [accent, setAccent] = useState(DEFAULT_ACCENT)
  const [valuesById, setValuesById] = useState<Record<string, TemplateValues>>(
    () => Object.fromEntries(templates.map((t) => [t.id, { ...t.defaults }])),
  )
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState<PreviewMode>('live')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewing, setPreviewing] = useState(false)
  const canvasRef = useRef<HTMLDivElement | null>(null)

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
    try {
      const dataUrl = await rasterise(node, template.width, template.height)
      const link = document.createElement('a')
      link.download = `${template.id}-${slug}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Export failed')
    } finally {
      setExporting(false)
    }
  }, [template, slug])

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

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleExport}
              disabled={exporting}
              className="rounded-md border border-[var(--rnp-accent)] bg-[var(--rnp-accent)] px-5 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rnp-accent-ink)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {exporting ? 'Rendering…' : 'Download PNG'}
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
