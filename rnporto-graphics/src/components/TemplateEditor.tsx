import type { GraphicTemplate, TemplateValues } from '../templates/types'

interface Props {
  template: GraphicTemplate
  values: TemplateValues
  onChange: (key: string, value: string) => void
  onReset: () => void
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
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-[var(--rnp-chip-line)] bg-[var(--rnp-chip-bg)] px-3 py-1 text-xs font-semibold text-[var(--rnp-fg)] transition hover:-translate-y-0.5"
        >
          Reset
        </button>
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

          return (
            <label key={field.key} htmlFor={id} className="flex flex-col gap-1">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--rnp-fg-soft)]">
                {field.label}
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
