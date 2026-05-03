import { RNP_ACCENT_PRESETS, type ThemeMode } from '../system/tokens'

interface Props {
  mode: ThemeMode
  accent: string
  onMode: (mode: ThemeMode) => void
  onAccent: (hex: string) => void
  onReset: () => void
}

export default function ThemeControls({ mode, accent, onMode, onAccent, onReset }: Props) {
  return (
    <div className="island-shell flex flex-col gap-4 rounded-2xl p-5">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <p className="island-kicker mb-1">Theme</p>
          <h2 className="m-0 text-lg font-semibold text-[var(--rnp-fg)]">
            Atómico
          </h2>
          <p className="m-0 text-xs text-[var(--rnp-fg-soft)]">
            Slate canvas, single accent, atom motif. Dark mode auto-lightens custom accents.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-[var(--rnp-line)] bg-[var(--rnp-chip-bg)] px-3 py-1 text-xs font-semibold text-[var(--rnp-fg)] transition hover:-translate-y-0.5"
        >
          Reset all
        </button>
      </div>

      <div>
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--rnp-fg-soft)]">
          Mode
        </span>
        <div className="inline-flex rounded-full border border-[var(--rnp-line)] bg-[var(--rnp-chip-bg)] p-1">
          {(['light', 'dark'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onMode(m)}
              className={
                'rounded-full px-4 py-1 text-xs font-semibold capitalize transition ' +
                (mode === m
                  ? 'bg-[var(--rnp-accent)] text-[var(--rnp-accent-ink)]'
                  : 'text-[var(--rnp-fg)]')
              }
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--rnp-fg-soft)]">
          Accent presets
        </span>
        <div className="grid grid-cols-4 gap-2">
          {RNP_ACCENT_PRESETS.map((p) => {
            const active = accent.toLowerCase() === p.hex.toLowerCase()
            return (
              <button
                key={p.id}
                type="button"
                title={`${p.label} — ${p.note}`}
                onClick={() => onAccent(p.hex)}
                className={
                  'group relative flex flex-col items-stretch overflow-hidden rounded-xl border text-left transition hover:-translate-y-0.5 ' +
                  (active
                    ? 'border-[var(--rnp-fg)] shadow-md'
                    : 'border-[var(--rnp-line)]')
                }
              >
                <span style={{ background: p.hex }} className="block h-9 w-full" />
                <span className="block bg-[var(--rnp-chip-bg)] px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--rnp-fg)]">
                  {p.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <label className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--rnp-fg-soft)]">
        Custom hex
        <input
          type="color"
          value={accent}
          onChange={(e) => onAccent(e.target.value)}
          className="h-8 w-12 cursor-pointer rounded border border-[var(--rnp-line)] bg-transparent p-0"
        />
        <input
          type="text"
          value={accent}
          onChange={(e) => onAccent(e.target.value)}
          className="flex-1 rounded-md border border-[var(--rnp-line)] bg-[var(--rnp-chip-bg)] px-2 py-1 font-mono text-xs uppercase text-[var(--rnp-fg)] focus:outline-none focus:ring-2 focus:ring-[var(--rnp-accent)]"
        />
      </label>
    </div>
  )
}
