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

function GraphicsStudio() {
  const [activeId, setActiveId] = useState(templates[0].id)
  const [mode, setMode] = useState<ThemeMode>(DEFAULT_MODE)
  const [accent, setAccent] = useState(DEFAULT_ACCENT)
  const [valuesById, setValuesById] = useState<Record<string, TemplateValues>>(
    () => Object.fromEntries(templates.map((t) => [t.id, { ...t.defaults }])),
  )
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
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

  const updateField = useCallback(
    (key: string, value: string) => {
      setValuesById((prev) => ({
        ...prev,
        [activeId]: { ...prev[activeId], [key]: value },
      }))
    },
    [activeId],
  )

  const resetTemplate = useCallback(() => {
    setValuesById((prev) => ({
      ...prev,
      [activeId]: { ...templatesById[activeId].defaults },
    }))
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
      // The canvas renders at full template dimensions but is CSS-scaled to
      // fit the preview area. Pin the export to the source resolution at 2×
      // pixel density so the atom orbits, dashed lines, and halftone dots
      // stay crisp on retina screens (mirrors the Claude Design downloads
      // panel which also exports at 2×).
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        width: template.width,
        height: template.height,
        canvasWidth: template.width,
        canvasHeight: template.height,
        skipFonts: true, // mirrors the design's html-to-image config — avoids cross-origin font fetches
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        },
      })
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
            <button
              type="button"
              onClick={handleExport}
              disabled={exporting}
              className="rounded-md border border-[var(--rnp-accent)] bg-[var(--rnp-accent)] px-5 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rnp-accent-ink)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {exporting ? 'Rendering…' : 'Download PNG'}
            </button>
          </div>

          <GraphicCanvas
            ref={canvasRef}
            template={template}
            values={values}
            theme={theme}
          />

          {exportError ? (
            <p className="m-0 rounded-md border border-red-300/40 bg-red-100/40 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
              Export failed: {exportError}
            </p>
          ) : null}
        </div>
      </section>
    </main>
  )
}
