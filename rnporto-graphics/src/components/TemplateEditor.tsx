import { useCallback, useRef, useState } from 'react'
import type {
  GraphicTemplate,
  TemplateField,
  TemplateValues,
} from '../templates/types'
import { buildApplyPatch, slotOfField } from '../lib/speakers'
import { buildEventApplyPatch } from '../lib/events'
import SpeakerPicker from './SpeakerPicker'
import EventPicker from './EventPicker'

interface Props {
  template: GraphicTemplate
  values: TemplateValues
  onChange: (key: string, value: string) => void
  onReset: () => void
}

// Parse a CSS `object-position`-style value into x/y percentages. Accepts
// both the legacy keyword form (`center 20%`) and the normalised numeric
// form (`50% 20%`) so older saved entries keep working.
function parseCrop(value: string): { x: number; y: number } {
  const fallback = { x: 50, y: 20 }
  if (!value) return fallback
  const parts = value.trim().split(/\s+/)
  if (parts.length !== 2) return fallback
  const axis = (token: string, axis: 'x' | 'y'): number => {
    if (token === 'center') return 50
    if (axis === 'x') {
      if (token === 'left') return 0
      if (token === 'right') return 100
    } else {
      if (token === 'top') return 0
      if (token === 'bottom') return 100
    }
    const n = parseFloat(token)
    return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 50
  }
  return { x: axis(parts[0], 'x'), y: axis(parts[1], 'y') }
}

function formatCrop(x: number, y: number): string {
  return `${Math.round(x)}% ${Math.round(y)}%`
}

function CropField({
  field,
  value,
  src,
  onChange,
}: {
  field: TemplateField
  value: string
  src: string
  onChange: (value: string) => void
}) {
  const { x, y } = parseCrop(value)
  const areaRef = useRef<HTMLDivElement | null>(null)
  const [dragging, setDragging] = useState(false)

  const setFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const el = areaRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      const px = ((clientX - rect.left) / rect.width) * 100
      const py = ((clientY - rect.top) / rect.height) * 100
      onChange(formatCrop(Math.max(0, Math.min(100, px)), Math.max(0, Math.min(100, py))))
    },
    [onChange],
  )

  const presets = field.options ?? []
  const currentValue = formatCrop(x, y)
  const matchedPreset = presets.find((p) => p.value === currentValue || p.value === value)

  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--rnp-fg-soft)]">
        {field.label}
      </span>
      {src ? (
        <div
          ref={areaRef}
          onPointerDown={(e) => {
            e.preventDefault()
            ;(e.target as Element).setPointerCapture?.(e.pointerId)
            setDragging(true)
            setFromPointer(e.clientX, e.clientY)
          }}
          onPointerMove={(e) => {
            if (dragging) setFromPointer(e.clientX, e.clientY)
          }}
          onPointerUp={(e) => {
            ;(e.target as Element).releasePointerCapture?.(e.pointerId)
            setDragging(false)
          }}
          onPointerCancel={() => setDragging(false)}
          className="relative w-full overflow-hidden rounded-md border border-[var(--rnp-line)] bg-[var(--rnp-bg-sunken)] select-none"
          style={{
            cursor: dragging ? 'grabbing' : 'crosshair',
            touchAction: 'none',
            aspectRatio: '4 / 3',
          }}
          title="Drag to position the focal point"
        >
          <img
            src={src}
            alt=""
            draggable={false}
            className="pointer-events-none block h-full w-full object-contain"
          />
          <div
            className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              background: 'var(--rnp-accent)',
              boxShadow: '0 0 0 2px var(--rnp-accent), 0 2px 8px rgba(0,0,0,0.45)',
            }}
          />
        </div>
      ) : (
        <div className="flex h-24 items-center justify-center rounded-md border border-dashed border-[var(--rnp-line)] text-[11px] text-[var(--rnp-fg-muted)]">
          Upload an image to drag the focal point.
        </div>
      )}
      <div className="flex flex-wrap items-center gap-1.5">
        {presets.map((opt) => {
          const active = matchedPreset?.value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={
                'rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ' +
                (active
                  ? 'border-[var(--rnp-accent)] bg-[var(--rnp-accent)] text-[var(--rnp-accent-ink)]'
                  : 'border-[var(--rnp-chip-line)] bg-[var(--rnp-chip-bg)] text-[var(--rnp-fg)] hover:-translate-y-0.5')
              }
            >
              {opt.label}
            </button>
          )
        })}
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--rnp-fg-muted)]">
          {currentValue}
        </span>
      </div>
    </div>
  )
}

export default function TemplateEditor({
  template,
  values,
  onChange,
  onReset,
}: Props) {
  return (
    <div className="island-shell flex flex-col gap-4 rounded-2xl p-5">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <p className="island-kicker mb-1">Template</p>
          <h2 className="m-0 text-lg font-semibold text-[var(--rnp-fg)]">
            {template.name}
          </h2>
          <p className="m-0 text-xs text-[var(--rnp-fg-soft)]">
            {template.description}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <EventPicker
            onPick={(event) => {
              const patch = buildEventApplyPatch(event, template)
              for (const [k, v] of Object.entries(patch)) onChange(k, v)
            }}
          />
          <button
            type="button"
            onClick={onReset}
            className="whitespace-nowrap rounded-full border border-[var(--rnp-chip-line)] bg-[var(--rnp-chip-bg)] px-3 py-1 text-xs font-semibold text-[var(--rnp-fg)] transition hover:-translate-y-0.5"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {template.fields.map((field) => {
          const id = `field-${template.id}-${field.key}`
          const value = values[field.key] ?? ''
          if (field.type === 'textarea') {
            return (
              <label key={field.key} htmlFor={id} className="flex flex-col gap-1">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--rnp-fg-soft)]">
                  {field.label}
                </span>
                <textarea
                  id={id}
                  rows={3}
                  value={value}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full rounded-md border border-[var(--rnp-line)] bg-[var(--rnp-bg-elevated)] p-3 text-sm text-[var(--rnp-fg)] placeholder:text-[var(--rnp-fg-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--rnp-accent)]"
                />
              </label>
            )
          }

          if (field.type === 'image') {
            const handleFile = (file: File | undefined) => {
              if (!file) return
              const reader = new FileReader()
              reader.onload = () => {
                if (typeof reader.result === 'string') onChange(field.key, reader.result)
              }
              reader.readAsDataURL(file)
            }
            return (
              <div key={field.key} className="flex flex-col gap-1">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--rnp-fg-soft)]">
                  {field.label}
                </span>
                <div className="flex items-center gap-3">
                  {value ? (
                    <img
                      src={value}
                      alt=""
                      className="h-14 w-14 rounded-md border border-[var(--rnp-line)] object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-md border border-dashed border-[var(--rnp-line)] text-[10px] text-[var(--rnp-fg-muted)]">
                      None
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-2">
                    <input
                      id={id}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFile(e.target.files?.[0])}
                      className="block w-full text-xs text-[var(--rnp-fg)] file:mr-3 file:rounded-full file:border file:border-[var(--rnp-chip-line)] file:bg-[var(--rnp-chip-bg)] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[var(--rnp-fg)] hover:file:-translate-y-0.5"
                    />
                    {value ? (
                      <button
                        type="button"
                        onClick={() => onChange(field.key, '')}
                        className="self-start rounded-full border border-[var(--rnp-chip-line)] bg-[var(--rnp-chip-bg)] px-3 py-1 text-[11px] font-semibold text-[var(--rnp-fg)] transition hover:-translate-y-0.5"
                      >
                        Clear
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            )
          }

          if (field.type === 'crop') {
            return (
              <CropField
                key={field.key}
                field={field}
                value={value}
                src={field.imageKey ? values[field.imageKey] ?? '' : ''}
                onChange={(v) => onChange(field.key, v)}
              />
            )
          }

          if (field.type === 'select') {
            return (
              <label key={field.key} htmlFor={id} className="flex flex-col gap-1">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--rnp-fg-soft)]">
                  {field.label}
                </span>
                <select
                  id={id}
                  value={value}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  className="w-full rounded-md border border-[var(--rnp-line)] bg-[var(--rnp-bg-elevated)] p-3 text-sm text-[var(--rnp-fg)] focus:outline-none focus:ring-2 focus:ring-[var(--rnp-accent)]"
                >
                  {(field.options ?? []).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            )
          }

          // Speaker slot name fields get a "Pick speaker…" button beside
          // their label that applies a saved speaker record across the
          // whole slot (name, role, image, plus talkTitle when present).
          const slot = slotOfField(field.key)
          const isSpeakerNameField =
            slot !== null && field.key === `speaker${slot}Name`
          const slotLabel = isSpeakerNameField
            ? slot
              ? `Speaker ${slot}`
              : 'Speaker'
            : ''
          return (
            <label key={field.key} htmlFor={id} className="flex flex-col gap-1">
              <span className="flex items-center justify-between gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--rnp-fg-soft)]">
                <span>{field.label}</span>
                {isSpeakerNameField ? (
                  <SpeakerPicker
                    slotLabel={slotLabel}
                    onPick={(speaker) => {
                      const patch = buildApplyPatch(speaker, slot ?? '', template)
                      for (const [k, v] of Object.entries(patch)) onChange(k, v)
                    }}
                  />
                ) : null}
              </span>
              <input
                id={id}
                type="text"
                value={value}
                onChange={(e) => onChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full rounded-md border border-[var(--rnp-line)] bg-[var(--rnp-bg-elevated)] p-3 text-sm text-[var(--rnp-fg)] placeholder:text-[var(--rnp-fg-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--rnp-accent)]"
              />
            </label>
          )
        })}
      </div>
    </div>
  )
}
