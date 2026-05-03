import { BannerHalftone } from '../system/Halftone'
import { MotifAtom } from '../system/MotifAtom'
import type { ThemeTokens } from '../system/tokens'
import { eventDefaults, eventFields } from './_eventFields'
import type { GraphicTemplate, TemplateValues } from './types'

function BannerStory({ values, t }: { values: TemplateValues; t: ThemeTokens }) {
  return (
    <div
      style={{
        width: 540,
        height: 960,
        position: 'relative',
        overflow: 'hidden',
        background: t.bg.canvas,
        color: t.fg.primary,
        fontFamily: t.fonts.sans,
      }}
    >
      <div style={{ position: 'relative', height: 460, background: t.accent, color: t.accentInk, overflow: 'hidden' }}>
        <BannerHalftone color={t.accentInk} cols={44} rows={40} dot={1} direction="vertical" minOpacity={0.02} maxOpacity={0.22} />

        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', opacity: 0.3 }}>
            <MotifAtom color={t.accentInk} size={420} strokeWidth={1.2} />
          </div>
          <div
            style={{
              position: 'relative', fontFamily: t.fonts.mono, fontSize: 360, fontWeight: 700,
              color: t.accentInk, letterSpacing: '-0.08em', lineHeight: 0.78,
            }}
          >
            {values.editionMark}
          </div>
        </div>

        <div style={{ position: 'absolute', top: 28, left: 32, right: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MotifAtom color={t.accentInk} size={24} strokeWidth={1.4} />
            <span style={{ fontFamily: t.fonts.mono, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: t.accentInk, textTransform: 'uppercase' }}>
              {values.brand}
            </span>
          </div>
          <span
            style={{
              fontFamily: t.fonts.mono, fontSize: 11, fontWeight: 600, letterSpacing: '0.16em',
              color: t.accentInk, opacity: 0.85, padding: '4px 9px',
              border: `1px solid ${t.accentInk}`, borderRadius: 999, whiteSpace: 'nowrap',
            }}
          >
            {values.hashTag}
          </span>
        </div>

        <div
          style={{
            position: 'absolute', left: 32, bottom: 24, fontFamily: t.fonts.mono,
            fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
            color: t.accentInk, textTransform: 'uppercase',
          }}
        >
          {values.editionTag}
        </div>
      </div>

      <div style={{ padding: '36px 32px 28px', display: 'flex', flexDirection: 'column', gap: 28, height: 500, boxSizing: 'border-box' }}>
        <div>
          <div
            style={{
              fontSize: 68, fontWeight: 700, lineHeight: 0.96, color: t.fg.primary,
              letterSpacing: '-0.035em', whiteSpace: 'nowrap',
            }}
          >
            {values.titleLine1}
            <br />
            <span style={{ color: t.accent }}>{values.titleLine2}</span>
          </div>
          <div style={{ color: t.fg.secondary, marginTop: 16, maxWidth: 380, textWrap: 'pretty', fontSize: 16, lineHeight: 1.45 }}>
            {values.body}
          </div>
        </div>

        <div
          style={{
            marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 14, paddingTop: 18, borderTop: `1px solid ${t.line.divider}`,
          }}
        >
          {[
            { k: 'When', v: values.date },
            { k: 'Time', v: `Doors ${values.doors}` },
            { k: 'Where', v: values.venue },
            { k: 'Tickets', v: values.pill },
          ].map(({ k, v }) => (
            <div key={k}>
              <div style={{ fontFamily: t.fonts.mono, fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', color: t.fg.tertiary, textTransform: 'uppercase' }}>{k}</div>
              <div style={{ fontFamily: t.fonts.mono, fontSize: 18, fontWeight: 600, color: t.fg.primary, marginTop: 4, letterSpacing: '-0.01em' }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const bannerStory: GraphicTemplate = {
  id: 'banner-story',
  name: 'Story · 540×960',
  description: 'Vertical 9:16 poster — full-bleed accent on top with the edition mark, body and meta below.',
  aspect: '9:16',
  width: 540,
  height: 960,
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
  ],
  defaults: eventDefaults,
  Component: BannerStory,
}
