import { MotifAtom } from '../system/MotifAtom'
import type { ThemeTokens } from '../system/tokens'
import { eventDefaults, eventFields } from './_eventFields'
import type { GraphicTemplate, TemplateValues } from './types'

function BannerSimple({ values, t }: { values: TemplateValues; t: ThemeTokens }) {
  return (
    <div
      style={{
        width: 900,
        height: 506,
        position: 'relative',
        overflow: 'hidden',
        background: t.bg.canvas,
        color: t.fg.primary,
        fontFamily: t.fonts.sans,
        display: 'grid',
        gridTemplateColumns: '340px 1fr',
      }}
    >
      <div
        style={{
          position: 'relative', background: t.accent, color: t.accentInk,
          display: 'grid', placeItems: 'center', overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', opacity: 0.22, lineHeight: 0 }}>
          <MotifAtom color={t.accentInk} size={300} strokeWidth={1.2} />
        </div>
        <div style={{ position: 'relative', textAlign: 'center', lineHeight: 1 }}>
          <div
            style={{
              fontFamily: t.fonts.mono, fontSize: 13, fontWeight: 700, letterSpacing: '0.28em',
              textTransform: 'uppercase', opacity: 0.9, marginBottom: 14,
            }}
          >
            Edition
          </div>
          <div style={{ fontFamily: t.fonts.mono, fontSize: 240, fontWeight: 700, letterSpacing: '-0.08em', lineHeight: 0.85 }}>
            {values.editionMark}
          </div>
        </div>
        <div
          style={{
            position: 'absolute', left: 0, right: 0, bottom: 24, fontFamily: t.fonts.mono,
            fontSize: 12, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase',
            textAlign: 'center', opacity: 0.95, whiteSpace: 'nowrap',
          }}
        >
          {values.brand}
        </div>
      </div>

      <div style={{ padding: '44px 44px 36px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div
          style={{
            fontSize: 84, fontWeight: 700, lineHeight: 0.92, color: t.fg.primary,
            letterSpacing: '-0.045em', whiteSpace: 'nowrap',
          }}
        >
          {values.titleLine1}
          <br />
          <span style={{ color: t.accent }}>{values.titleLine2}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, paddingTop: 24, borderTop: `2px solid ${t.fg.primary}` }}>
          {[
            { k: values.date, v: `Doors ${values.doors}` },
            { k: values.venue, v: 'Free entry' },
          ].map(({ k, v }) => (
            <div key={k}>
              <div
                style={{
                  fontFamily: t.fonts.sans, fontSize: 30, fontWeight: 700,
                  color: t.fg.primary, letterSpacing: '-0.025em', lineHeight: 1.02,
                  whiteSpace: 'nowrap',
                }}
              >
                {k}
              </div>
              <div
                style={{
                  fontFamily: t.fonts.mono, fontSize: 13, fontWeight: 700,
                  letterSpacing: '0.18em', color: t.fg.muted, textTransform: 'uppercase', marginTop: 6,
                }}
              >
                {v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const bannerSimple: GraphicTemplate = {
  id: 'banner-simple',
  name: 'Simple · 900×506',
  description: 'Stripped to bones — accent slab with the edition number on the left, three facts on the right.',
  aspect: '16:9',
  width: 900,
  height: 506,
  fields: [
    eventFields.brand,
    eventFields.editionMark,
    eventFields.titleLine1,
    eventFields.titleLine2,
    eventFields.date,
    eventFields.doors,
    eventFields.venue,
  ],
  defaults: eventDefaults,
  Component: BannerSimple,
}
