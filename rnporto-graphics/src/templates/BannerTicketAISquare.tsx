import { MotifAtom } from '../system/MotifAtom'
import type { ThemeTokens } from '../system/tokens'
import { buildBars, eventDefaults, eventFields } from './_eventFields'
import type { GraphicTemplate, TemplateValues } from './types'

function BannerTicketAISquare({ values, t }: { values: TemplateValues; t: ThemeTokens }) {
  const W = 720
  const H = 720
  const barcodeW = 360
  const barcodeH = 56
  const bars = buildBars(barcodeW, barcodeH)

  return (
    <div
      style={{
        width: W,
        height: H,
        position: 'relative',
        overflow: 'hidden',
        background: t.bg.canvas,
        color: t.fg.primary,
        fontFamily: t.fonts.sans,
        padding: 28,
        boxSizing: 'border-box',
      }}
    >
      <svg
        width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}
        style={{ position: 'absolute', inset: 0 }}
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="tk-hatch-sq" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
            <line x1="0" y1="0" x2="0" y2="14" stroke={t.fg.primary} strokeWidth="0.6" opacity="0.06" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#tk-hatch-sq)" />
      </svg>

      <div
        style={{
          position: 'absolute', left: 28, top: 28, right: 28, bottom: 28,
          background: t.bg.elevated, color: t.fg.primary,
          boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 24px 40px -20px rgba(15,23,42,0.18)',
          display: 'grid', gridTemplateRows: '1fr 240px', gridTemplateColumns: 'minmax(0, 1fr)',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', padding: '32px 36px 28px 36px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <MotifAtom color={t.accent} size={30} strokeWidth={1.5} />
              <div
                style={{
                  fontFamily: t.fonts.mono, fontWeight: 700, textTransform: 'uppercase',
                  whiteSpace: 'nowrap', fontSize: 22, letterSpacing: '0.22em',
                }}
              >
                {values.brand}
              </div>
            </div>
            <div
              style={{
                fontFamily: t.fonts.mono, fontSize: 11, fontWeight: 700,
                letterSpacing: '0.28em', textTransform: 'uppercase', padding: '6px 11px',
                border: `1.5px solid ${t.fg.primary}`, whiteSpace: 'nowrap',
              }}
            >
              Admit one
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingTop: 12, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 700, lineHeight: 0.92, letterSpacing: '-0.05em',
                whiteSpace: 'nowrap', fontSize: 92,
              }}
            >
              {values.titleLine1}
              <br />
              <span style={{ color: t.accent }}>{values.titleLine2}</span>
            </div>
          </div>

          <div
            style={{
              display: 'grid', gridTemplateColumns: 'auto auto minmax(0, 1fr)',
              columnGap: 28, alignItems: 'end', paddingTop: 18,
              borderTop: `1.5px dashed ${t.fg.primary}`,
            }}
          >
            {[
              { k: 'Date', v: values.date },
              { k: 'Doors', v: values.doors },
              { k: 'Venue', v: values.venue },
            ].map(({ k, v }) => (
              <div key={k} style={{ minWidth: 0 }}>
                <div style={{ fontFamily: t.fonts.mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', color: t.fg.muted, textTransform: 'uppercase' }}>
                  {k}
                </div>
                <div
                  style={{
                    fontFamily: t.fonts.sans, fontSize: 22, fontWeight: 700,
                    letterSpacing: '-0.02em', lineHeight: 1.05, marginTop: 4,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 14, right: 14, top: 0, borderTop: `2px dashed ${t.fg.primary}`, opacity: 0.55 }} />
          <div style={{ position: 'absolute', top: -10, left: -10, width: 20, height: 20, borderRadius: '50%', background: t.bg.canvas, boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.18)' }} />
          <div style={{ position: 'absolute', top: -10, right: -10, width: 20, height: 20, borderRadius: '50%', background: t.bg.canvas, boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.18)' }} />

          <div
            style={{
              position: 'absolute', inset: 0, background: t.accent, color: t.accentInk,
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) 200px',
              gap: 24, padding: '24px 32px 22px 32px', alignItems: 'stretch',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
              <div style={{ fontFamily: t.fonts.mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.95, whiteSpace: 'nowrap' }}>
                Pass · {values.hashTag}
              </div>
              <div>
                <svg width="100%" height={barcodeH} viewBox={`0 0 ${barcodeW} ${barcodeH}`} preserveAspectRatio="none" style={{ display: 'block' }}>
                  <rect width={barcodeW} height={barcodeH} fill={t.accent} />
                  {bars.map((b, idx) => (
                    <rect key={idx} x={b.x} y={0} width={b.w} height={b.h} fill={t.accentInk} />
                  ))}
                </svg>
                <div
                  style={{
                    fontFamily: t.fonts.mono, fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.32em', textTransform: 'uppercase',
                    opacity: 0.9, marginTop: 8,
                  }}
                >
                  {values.barcodeCaption}
                </div>
              </div>
            </div>

            <div
              style={{
                textAlign: 'center',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                minWidth: 0,
              }}
            >
              <div
                style={{
                  fontFamily: t.fonts.mono, fontSize: 12, fontWeight: 700,
                  letterSpacing: '0.32em', textTransform: 'uppercase', opacity: 0.9,
                  whiteSpace: 'nowrap',
                }}
              >
                Edition
              </div>
              <div
                style={{
                  fontFamily: t.fonts.mono, fontSize: 140, fontWeight: 700,
                  letterSpacing: '-0.06em', lineHeight: 1, marginTop: 4,
                  whiteSpace: 'nowrap',
                }}
              >
                {values.editionMark}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const bannerTicketAISquare: GraphicTemplate = {
  id: 'banner-ticket-ai-square',
  name: 'Ticket · AI · Square 720×720',
  description: 'Square reinterpretation of the ticket — body up top, perforated stub band across the bottom.',
  aspect: '1:1',
  width: 720,
  height: 720,
  fields: [
    eventFields.brand,
    eventFields.titleLine1,
    eventFields.titleLine2,
    eventFields.editionMark,
    eventFields.hashTag,
    eventFields.date,
    eventFields.doors,
    eventFields.venue,
    eventFields.barcodeCaption,
  ],
  defaults: {
    ...eventDefaults,
    titleLine1: 'React Native',
    titleLine2: 'AI Native',
  },
  Component: BannerTicketAISquare,
}
