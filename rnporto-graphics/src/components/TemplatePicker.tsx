import type { GraphicTemplate } from '../templates/types'

interface Props {
  templates: Array<GraphicTemplate>
  activeId: string
  onSelect: (id: string) => void
}

export default function TemplatePicker({
  templates,
  activeId,
  onSelect,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {templates.map((t) => {
        const active = t.id === activeId
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t.id)}
            className={
              'rounded-md border px-3 py-2 text-left transition hover:-translate-y-0.5 ' +
              (active
                ? 'border-[var(--rnp-fg)] bg-[var(--rnp-bg-elevated)] shadow'
                : 'border-[var(--rnp-line)] bg-[var(--rnp-chip-bg)]')
            }
          >
            <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--rnp-accent)]">
              {t.aspect} · {t.width}×{t.height}
            </span>
            <span className="mt-1 block text-sm font-semibold text-[var(--rnp-fg)]">
              {t.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
