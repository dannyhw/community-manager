import { MotifAtom } from '../system/MotifAtom'
import type { ThemeTokens } from '../system/tokens'
import { buildBars, eventDefaults, eventFields } from './_eventFields'
import type { GraphicTemplate, TemplateValues } from './types'

interface TicketProps {
  values: TemplateValues
  t: ThemeTokens
  hatchId: string
  /** Headline display style — original ticket ends with a period, AI variant does not. */
  withTrailingPeriods: boolean
  /** Brand mono size + tracking — AI variant beefs this up. */
  brandFontSize: number
  brandLetterSpacing: string
  /** Whether the "Admit one" stamp shows up (AI variant drops it). */
  showAdmit: boolean
  /** Barcode caption + hash — different per variant. */
}

function TicketBody({
  values,
  t,
  hatchId,
  brandFontSize,
  brandLetterSpacing,
  showAdmit,
}: TicketProps) {
  const ticketW = 900
  const ticketH = 506
  const bars = buildBars(180, 48)

  return (
    <div
      style={{
        width: ticketW,
        height: ticketH,
        position: 'relative',
        overflow: 'hidden',
        background: t.bg.canvas,
        color: t.fg.primary,
        fontFamily: t.fonts.sans,
        padding: 24,
        boxSizing: 'border-box',
      }}
    >
      <svg
        width="100%" height="100%"
        viewBox={`0 0 ${ticketW} ${ticketH}`}
        style={{ position: 'absolute', inset: 0 }}
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id={hatchId} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
            <line x1="0" y1="0" x2="0" y2="14" stroke={t.fg.primary} strokeWidth="0.6" opacity="0.06" />
          </pattern>
        </defs>
        <rect width={ticketW} height={ticketH} fill={`url(#${hatchId})`} />
      </svg>

      <div
        style={{
          position: 'absolute', left: 24, top: 24, right: 24, bottom: 24,
          background: t.bg.elevated, color: t.fg.primary,
          boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 24px 40px -20px rgba(15,23,42,0.18)',
          display: 'grid', gridTemplateColumns: '1fr 220px',
        }}
      >
        <div style={{ position: 'relative', padding: '26px 28px 24px 28px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <MotifAtom color={t.accent} size={26} strokeWidth={1.5} />
              <div
                style={{
                  fontFamily: t.fonts.mono, fontWeight: 700, textTransform: 'uppercase',
                  whiteSpace: 'nowrap', fontSize: brandFontSize, letterSpacing: brandLetterSpacing,
                }}
              >
                {values.brand}
              </div>
            </div>
            {showAdmit ? (
              <div
                style={{
                  fontFamily: t.fonts.mono, fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.28em', textTransform: 'uppercase', padding: '5px 10px',
                  border: `1.5px solid ${t.fg.primary}`, whiteSpace: 'nowrap',
                }}
              >
                Admit one
              </div>
            ) : null}
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingTop: 8 }}>
            <div
              style={{
                fontWeight: 700, lineHeight: 0.92, letterSpacing: '-0.045em',
                whiteSpace: 'nowrap', fontSize: 102,
              }}
            >
              {values.titleLine1}
              <br />
              <span style={{ color: t.accent, fontSize: 102 }}>{values.titleLine2}</span>
            </div>
          </div>

          <div
            style={{
              display: 'grid', gridTemplateColumns: 'auto auto 1fr', columnGap: 28,
              alignItems: 'end', paddingTop: 16, borderTop: `1.5px dashed ${t.fg.primary}`,
            }}
          >
            {[
              { k: 'Date', v: values.date },
              { k: 'Doors', v: values.doors },
              { k: 'Venue', v: values.venue },
            ].map(({ k, v }) => (
              <div key={k} style={{ minWidth: 0 }}>
                <div style={{ fontFamily: t.fonts.mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', color: t.fg.muted, textTransform: 'uppercase' }}>
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
          <div style={{ position: 'absolute', left: 0, top: 14, bottom: 14, borderLeft: `2px dashed ${t.fg.primary}`, opacity: 0.55 }} />
          <div style={{ position: 'absolute', left: -10, top: -10, width: 20, height: 20, borderRadius: '50%', background: t.bg.canvas, boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.18)' }} />
          <div style={{ position: 'absolute', left: -10, bottom: -10, width: 20, height: 20, borderRadius: '50%', background: t.bg.canvas, boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.18)' }} />

          <div
            style={{
              position: 'absolute', inset: 0, background: t.accent, color: t.accentInk,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              padding: '22px 22px 18px 22px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontFamily: t.fonts.mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', opacity: 0.95, whiteSpace: 'nowrap' }}>
                Pass
              </span>
              <span style={{ fontFamily: t.fonts.mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.95, whiteSpace: 'nowrap' }}>
                {values.hashTag}
              </span>
            </div>

            <div style={{ textAlign: 'center', lineHeight: 1 }}>
              <div
                style={{
                  fontFamily: t.fonts.mono, fontSize: 12, fontWeight: 700,
                  letterSpacing: '0.32em', textTransform: 'uppercase', opacity: 0.9,
                  marginBottom: 6, whiteSpace: 'nowrap',
                }}
              >
                Edition
              </div>
              <div
                style={{
                  fontFamily: t.fonts.mono, fontSize: 168, fontWeight: 700,
                  letterSpacing: '-0.08em', lineHeight: 0.85, whiteSpace: 'nowrap',
                }}
              >
                {values.editionMark}
              </div>
              <div style={{ fontFamily: t.fonts.mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', opacity: 0.9, marginTop: 8 }}>
                Free entry
              </div>
            </div>

            <div>
              <svg width="100%" height="40" viewBox="0 0 180 48" preserveAspectRatio="none" style={{ display: 'block' }}>
                <rect width="180" height="48" fill={t.accent} />
                {bars.map((b, idx) => (
                  <rect key={idx} x={b.x} y={0} width={b.w} height={b.h} fill={t.accentInk} />
                ))}
              </svg>
              <div
                style={{
                  fontFamily: t.fonts.mono, fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.32em', textAlign: 'center', marginTop: 6,
                  textTransform: 'uppercase', opacity: 0.9,
                }}
              >
                {values.barcodeCaption}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const bannerTicket: GraphicTemplate = {
  id: 'banner-ticket',
  name: 'Ticket · 900×506',
  description: 'Physical event pass with a perforated tear-off stub, punch-holes, and a real barcode.',
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
    eventFields.barcodeCaption,
  ],
  defaults: eventDefaults,
  Component: ({ values, t }) => (
    <TicketBody
      values={values}
      t={t}
      hatchId="tk-hatch"
      withTrailingPeriods
      brandFontSize={25}
      brandLetterSpacing="0.22em"
      showAdmit
    />
  ),
}

export const bannerTicketAI: GraphicTemplate = {
  id: 'banner-ticket-ai',
  name: 'Ticket · AI · 900×506',
  description: 'Same ticket frame, headline reads "React Native / AI Native" without the "Admit one" stamp.',
  aspect: '16:9',
  width: 900,
  height: 506,
  fields: bannerTicket.fields,
  defaults: {
    ...eventDefaults,
    titleLine1: 'React Native',
    titleLine2: 'AI Native',
  },
  Component: ({ values, t }) => (
    <TicketBody
      values={values}
      t={t}
      hatchId="tk-hatch-ai"
      withTrailingPeriods={false}
      brandFontSize={33}
      brandLetterSpacing="3.3px"
      showAdmit={false}
    />
  ),
}
