import { BannerHalftone } from '../system/Halftone'
import { MotifAtom } from '../system/MotifAtom'
import type { ThemeTokens } from '../system/tokens'
import { eventDefaults, eventFields } from './_eventFields'
import type { GraphicTemplate, TemplateValues } from './types'

function BannerGlance({ values, t }: { values: TemplateValues; t: ThemeTokens }) {
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
        gridTemplateColumns: '1fr 1fr',
      }}
    >
      <div style={{ position: 'relative', padding: '28px 28px 28px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <MotifAtom color={t.accent} size={42} strokeWidth={1.5} />
          <div
            style={{
              fontFamily: t.fonts.mono, fontSize: 22, fontWeight: 700,
              letterSpacing: '0.06em', color: t.fg.primary, textTransform: 'uppercase',
              lineHeight: 1, whiteSpace: 'nowrap',
            }}
          >
            {values.brand}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: 56, fontWeight: 700, lineHeight: 0.95, color: t.fg.primary,
              letterSpacing: '-0.04em', whiteSpace: 'nowrap',
            }}
          >
            {values.titleLine1}
            <br />
            <span style={{ color: t.accent }}>{values.titleLine2}</span>
          </div>
        </div>

        <div
          style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 20, rowGap: 14,
            paddingTop: 16, borderTop: `2px solid ${t.fg.primary}`,
          }}
        >
          {[
            { k: 'When', v: values.date },
            { k: 'Doors', v: values.doors },
            { k: 'Where', v: values.venue, span: 2 as const },
          ].map(({ k, v, span }) => (
            <div key={k} style={{ gridColumn: span ? `span ${span}` : 'auto' }}>
              <div style={{ fontFamily: t.fonts.mono, fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', color: t.accent, textTransform: 'uppercase' }}>
                {k}
              </div>
              <div
                style={{
                  fontFamily: t.fonts.sans, fontSize: 28, fontWeight: 700,
                  color: t.fg.primary, marginTop: 4, letterSpacing: '-0.025em', lineHeight: 1.02,
                }}
              >
                {v}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', background: t.accent, color: t.accentInk, overflow: 'hidden' }}>
        <BannerHalftone color={t.accentInk} cols={36} rows={28} dot={1.1} direction="horizontal" minOpacity={0.02} maxOpacity={0.22} />

        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>
          <div style={{ gridArea: '1/1', opacity: 0.32, lineHeight: 0 }}>
            <MotifAtom color={t.accentInk} size={340} strokeWidth={1.3} />
          </div>
          <div
            style={{
              gridArea: '1/1', fontFamily: t.fonts.mono, fontSize: 240, fontWeight: 700,
              color: t.accentInk, letterSpacing: '-0.08em', lineHeight: 1,
              whiteSpace: 'nowrap',
            }}
          >
            {values.editionMark}
          </div>
        </div>

        <div style={{ position: 'absolute', top: 24, left: 24, right: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontFamily: t.fonts.mono, fontSize: 13, fontWeight: 700, letterSpacing: '0.22em',
              color: t.accentInk, textTransform: 'uppercase', opacity: 0.92, whiteSpace: 'nowrap',
            }}
          >
            {values.hashTag}
          </span>
          <span
            style={{
              fontFamily: t.fonts.mono, fontSize: 12, fontWeight: 700, letterSpacing: '0.18em',
              color: t.accentInk, textTransform: 'uppercase', padding: '5px 12px',
              border: `2px solid ${t.accentInk}`, borderRadius: 999, whiteSpace: 'nowrap',
            }}
          >
            Free
          </span>
        </div>

        <div
          style={{
            position: 'absolute', left: 24, right: 24, bottom: 24,
            fontFamily: t.fonts.mono, fontSize: 12, fontWeight: 700,
            letterSpacing: '0.06em', color: t.accentInk, opacity: 0.85, textAlign: 'center',
          }}
        >
          {values.url}
        </div>
      </div>
    </div>
  )
}

export const bannerGlance: GraphicTemplate = {
  id: 'banner-glance',
  name: 'Glance · 900×506',
  description: 'Two-column poster, readable from across the room. No body copy.',
  aspect: '16:9',
  width: 900,
  height: 506,
  fields: [
    eventFields.brand,
    eventFields.titleLine1,
    eventFields.titleLine2,
    eventFields.editionMark,
    eventFields.hashTag,
    eventFields.date,
    eventFields.doors,
    eventFields.venue,
    eventFields.url,
  ],
  defaults: eventDefaults,
  Component: BannerGlance,
}
