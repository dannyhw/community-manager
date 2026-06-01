import { useEffect, useState } from 'react'
import type { TemplateGroup } from '../templates'

interface Props {
  groups: Array<TemplateGroup>
  activeId: string
  onSelect: (id: string) => void
}

export default function TemplatePicker({ groups, activeId, onSelect }: Props) {
  // The family tab that owns the active template — so loading a saved
  // graphic (or switching templates programmatically) lands on its tab.
  const activeGroupId =
    groups.find((g) => g.templates.some((t) => t.id === activeId))?.id ??
    groups[0].id

  // Which tab is open. Local so the user can browse other families without
  // having to select a template first; re-synced when the active template
  // jumps to a different family from outside (e.g. a gallery load).
  const [openGroupId, setOpenGroupId] = useState(activeGroupId)
  useEffect(() => {
    setOpenGroupId(activeGroupId)
  }, [activeGroupId])

  const openGroup = groups.find((g) => g.id === openGroupId) ?? groups[0]

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Template family">
        {groups.map((group) => {
          const isOpen = group.id === openGroup.id
          const hasActive = group.templates.some((t) => t.id === activeId)
          return (
            <button
              key={group.id}
              type="button"
              role="tab"
              aria-selected={isOpen}
              onClick={() => setOpenGroupId(group.id)}
              className={
                'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition hover:-translate-y-0.5 ' +
                (isOpen
                  ? 'border-[var(--rnp-fg)] bg-[var(--rnp-bg-elevated)] text-[var(--rnp-fg)] shadow'
                  : 'border-[var(--rnp-line)] bg-[var(--rnp-chip-bg)] text-[var(--rnp-fg-soft)]')
              }
            >
              <span>{group.label}</span>
              <span className="font-mono text-[10px] tabular-nums text-[var(--rnp-fg-soft)]">
                {group.templates.length}
              </span>
              {hasActive ? (
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-[var(--rnp-accent)]"
                />
              ) : null}
            </button>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-2" role="tabpanel">
        {openGroup.templates.map((t) => {
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
    </div>
  )
}
