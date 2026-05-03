import { BannerHalftone } from '../system/Halftone'
import { MotifAtom } from '../system/MotifAtom'
import type { ThemeTokens } from '../system/tokens'
import { eventDefaults, eventFields } from './_eventFields'
import type { GraphicTemplate, TemplateValues } from './types'

function BannerWide({ values, t }: { values: TemplateValues; t: ThemeTokens }) {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        position: 'relative',
        overflow: 'hidden',
        background: t.bg.canvas,
        color: t.fg.primary,
        fontFamily: t.fonts.sans,
        display: 'grid',
        gridTemplateColumns: '1.35fr 1fr',
      }}
    >
      <div
        style={{
          position: 'relative',
          padding: '40px 36px 30px 56px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <MotifAtom color={t.accent} size={28} strokeWidth={1.5} />
            <div>
              <div style={{ fontFamily: t.fonts.mono, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: t.fg.tertiary, textTransform: 'uppercase' }}>
                {values.brand}
              </div>
              <div style={{ fontFamily: t.fonts.mono, fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', color: t.fg.tertiary, marginTop: 2 }}>
                hosted at {values.venue}
              </div>
            </div>
          </div>
          <div
            style={{
              fontFamily: t.fonts.mono, fontSize: 10.5, fontWeight: 600,
              letterSpacing: '0.16em', color: t.accent, textTransform: 'uppercase',
              padding: '4px 10px', border: `1px solid ${t.accent}`, borderRadius: 999,
            }}
          >
            {values.pill}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: t.fonts.mono, fontSize: 13, fontWeight: 600, letterSpacing: '0.18em', color: t.accent, textTransform: 'uppercase' }}>
            {values.editionTag}
          </div>
          <div
            style={{
              fontSize: 92, fontWeight: 700, lineHeight: 0.92,
              color: t.fg.primary, marginTop: 14, letterSpacing: '-0.035em',
              textWrap: 'balance', maxWidth: 640,
            }}
          >
            {values.titleLine1}
            <br />
            <span style={{ color: t.accent }}>{values.titleLine2}</span>
          </div>
          <div
            style={{
              fontSize: 18, lineHeight: '24px', fontWeight: 400,
              color: t.fg.secondary, marginTop: 18, maxWidth: 540, textWrap: 'pretty',
            }}
          >
            {values.body}
          </div>
        </div>

        <div
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, auto)', columnGap: 44, rowGap: 4,
            paddingTop: 18, borderTop: `1px solid ${t.line.divider}`,
          }}
        >
          {[
            ['When', values.date],
            ['Doors', values.doors],
            ['Where', values.venue],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontFamily: t.fonts.mono, fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', color: t.fg.tertiary, textTransform: 'uppercase' }}>{k}</div>
              <div style={{ fontFamily: t.fonts.mono, fontSize: 18, fontWeight: 600, color: t.fg.primary, marginTop: 4, letterSpacing: '-0.01em' }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          position: 'relative', background: t.accent, color: t.accentInk,
          padding: '40px 56px 30px 36px', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}
      >
        <BannerHalftone color={t.accentInk} cols={56} rows={32} dot={1} direction="horizontal" minOpacity={0.02} maxOpacity={0.22} />

        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', opacity: 0.32 }}>
            <MotifAtom color={t.accentInk} size={520} strokeWidth={1.4} />
          </div>
          <div
            style={{
              position: 'relative', fontFamily: t.fonts.mono, fontSize: 440, fontWeight: 700,
              color: t.accentInk, letterSpacing: '-0.08em', lineHeight: 0.78,
              whiteSpace: 'nowrap',
            }}
          >
            {values.editionMark}
          </div>
        </div>

        <div
          style={{
            position: 'relative', alignSelf: 'flex-end', fontFamily: t.fonts.mono,
            fontSize: 14, fontWeight: 600, letterSpacing: '0.16em', color: t.accentInk,
            opacity: 0.85, whiteSpace: 'nowrap',
          }}
        >
          {values.hashTag}
        </div>

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontFamily: t.fonts.mono, fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', color: t.accentInk, opacity: 0.85, textTransform: 'uppercase' }}>
            Hosted at
          </div>
          <div style={{ fontFamily: t.fonts.sans, fontSize: 22, fontWeight: 600, color: t.accentInk, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
            {values.hostLine1}
            <br />
            {values.hostLine2}
          </div>
          <div style={{ fontFamily: t.fonts.mono, fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', color: t.accentInk, opacity: 0.85 }}>
            {values.url}
          </div>
        </div>
      </div>
    </div>
  )
}

export const bannerWide: GraphicTemplate = {
  id: 'banner-wide',
  name: 'Wide · 1200×630',
  description: 'Editorial split — body left, accent panel with edition number right. OG / social share size.',
  aspect: '16:9',
  width: 1200,
  height: 630,
  fields: [
    eventFields.editionTag,
    eventFields.editionMark,
    eventFields.hashTag,
    eventFields.brand,
    eventFields.titleLine1,
    eventFields.titleLine2,
    eventFields.body,
    eventFields.date,
    eventFields.doors,
    eventFields.venue,
    eventFields.pill,
    eventFields.hostLine1,
    eventFields.hostLine2,
    eventFields.url,
  ],
  defaults: eventDefaults,
  Component: BannerWide,
}
