import { MotifAtom } from '../system/MotifAtom'
import type { ThemeTokens } from '../system/tokens'
import type { GraphicTemplate, TemplateValues } from './types'

// Group cover for the Meetup front page. Not tied to an edition — just the
// community wordmark + atom mark + device cluster (laptop / phone / tablet)
// showing the multi-platform story without copy.

interface DotProps {
  W: number
  H: number
  ink: string
}

function HalftoneDots({ W, H, ink }: DotProps) {
  const dotCols = 60
  const dotRows = 32
  const cells = []
  for (let r = 0; r < dotRows; r++) {
    for (let c = 0; c < dotCols; c++) {
      const tval = (c / (dotCols - 1)) * 0.6 + (r / (dotRows - 1)) * 0.4
      const op = Math.max(0, 0.18 - tval * 0.18)
      if (op < 0.015) continue
      cells.push(
        <circle
          key={`${r}-${c}`}
          cx={c * (W / (dotCols - 1))}
          cy={r * (H / (dotRows - 1))}
          r={1}
          fill={ink}
          opacity={op}
        />,
      )
    }
  }
  return <>{cells}</>
}

function AppleMark({ size = 1, color }: { size?: number; color: string }) {
  return (
    <g transform={`scale(${size})`}>
      <path
        d="M 16.5 -4 c 0 -10 8 -15 8.5 -15.3 c -4.6 -6.7 -11.8 -7.6 -14.4 -7.7 c -6.1 -0.6 -11.9 3.6 -15 3.6 c -3.1 0 -7.9 -3.5 -13 -3.4 c -6.7 0.1 -12.9 3.9 -16.3 9.9 c -7 12.1 -1.8 30 5 39.8 c 3.3 4.8 7.3 10.2 12.5 10 c 5 -0.2 6.9 -3.2 13 -3.2 c 6 0 7.7 3.2 13 3.1 c 5.4 -0.1 8.8 -4.9 12.1 -9.7 c 3.8 -5.6 5.4 -11 5.5 -11.3 c -0.1 -0.1 -10.6 -4.1 -10.7 -16.1 z M 6.7 -33.5 c 2.7 -3.3 4.6 -7.9 4.1 -12.5 c -3.9 0.2 -8.8 2.6 -11.6 5.9 c -2.5 2.9 -4.7 7.6 -4.1 12.1 c 4.4 0.3 8.9 -2.2 11.6 -5.5 z"
        fill={color}
      />
    </g>
  )
}

function AndroidMark({ color, screen }: { color: string; screen: string }) {
  return (
    <g>
      <path d="M -30 0 a 30 30 0 0 1 60 0 z" fill={color} />
      <circle cx="-12" cy="-10" r="3" fill={screen} />
      <circle cx="12" cy="-10" r="3" fill={screen} />
      <line x1="-16" y1="-26" x2="-22" y2="-36" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="16" y1="-26" x2="22" y2="-36" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </g>
  )
}

interface DeviceProps {
  x: number
  y: number
  rot?: number
  scale?: number
  ink: string
  screen: string
}

function Phone({ x, y, rot = 0, scale = 1, ink, screen }: DeviceProps) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
      <rect x="-46" y="-92" width="92" height="184" rx="16" ry="16" fill={ink} stroke={ink} strokeWidth="2" />
      <rect x="-38" y="-78" width="76" height="156" rx="6" ry="6" fill={screen} />
      <rect x="-14" y="-78" width="28" height="6" rx="3" ry="3" fill={ink} />
      <rect x="-16" y="84" width="32" height="3" rx="1.5" ry="1.5" fill={ink} opacity="0.5" />
      <g transform="translate(0 0)">
        <AppleMark size={0.7} color={ink} />
      </g>
    </g>
  )
}

function Tablet({ x, y, rot = 0, scale = 1, ink, screen }: DeviceProps) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
      <rect x="-78" y="-110" width="156" height="220" rx="14" ry="14" fill={ink} stroke={ink} strokeWidth="2" />
      <rect x="-70" y="-100" width="140" height="200" rx="4" ry="4" fill={screen} />
      <circle cx="0" cy="-105" r="2" fill={ink} />
      <g transform="translate(0 18) scale(1.6)">
        <AndroidMark color={ink} screen={screen} />
      </g>
    </g>
  )
}

function Laptop({ x, y, scale = 1, ink, screen }: DeviceProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-110" y="-78" width="220" height="138" rx="6" ry="6" fill={ink} stroke={ink} strokeWidth="2" />
      <rect x="-103" y="-71" width="206" height="124" rx="2" ry="2" fill={screen} />
      <path d="M -130 60 L 130 60 L 118 78 L -118 78 Z" fill={ink} stroke={ink} strokeWidth="2" strokeLinejoin="round" />
      <rect x="-22" y="60" width="44" height="3" rx="1.5" ry="1.5" fill={screen} opacity="0.6" />
      <g transform="translate(0 -9)">
        <AppleMark size={0.95} color={ink} />
      </g>
    </g>
  )
}

function BannerCommunity({ values, t }: { values: TemplateValues; t: ThemeTokens }) {
  const W = 900
  const H = 506
  const ink = t.accentInk
  const screen = t.accent

  return (
    <div
      style={{
        width: W,
        height: H,
        position: 'relative',
        overflow: 'hidden',
        background: t.accent,
        color: t.accentInk,
        fontFamily: t.fonts.sans,
      }}
    >
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <HalftoneDots W={W} H={H} ink={t.accentInk} />
      </svg>

      <div
        style={{
          position: 'absolute', right: -120, top: -120,
          width: 560, height: 560, opacity: 0.13,
        }}
      >
        <MotifAtom color={t.accentInk} size={560} strokeWidth={1.2} />
      </div>

      <div
        style={{
          position: 'absolute', top: 28, left: 36,
          fontFamily: t.fonts.mono, fontSize: 12, fontWeight: 700,
          letterSpacing: '0.32em', textTransform: 'uppercase',
          opacity: 0.85, whiteSpace: 'nowrap',
        }}
      >
        {values.tagText}
      </div>

      <div
        style={{
          position: 'absolute', bottom: 26, left: 36,
          fontFamily: t.fonts.mono, fontSize: 12, fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          opacity: 0.85, whiteSpace: 'nowrap',
        }}
      >
        {values.url}
      </div>

      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'grid', gridTemplateColumns: '1.1fr 1fr',
          alignItems: 'center',
        }}
      >
        <div style={{ paddingLeft: 48, paddingRight: 12 }}>
          <div style={{ fontWeight: 700, letterSpacing: '-0.045em', lineHeight: 0.86, fontSize: 132 }}>
            <div style={{ whiteSpace: 'nowrap' }}>{values.brandLine1}</div>
            <div style={{ whiteSpace: 'nowrap' }}>{values.brandLine2}</div>
            <div style={{ whiteSpace: 'nowrap' }}>{values.brandLine3}</div>
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '100%',
          }}
        >
          <svg
            width="460" height="360" viewBox="-230 -180 460 360"
            preserveAspectRatio="xMidYMid meet"
            style={{ overflow: 'visible' }}
          >
            <ellipse cx="0" cy="150" rx="200" ry="12" fill="#000" opacity="0.18" />
            <Laptop x={0} y={70} scale={0.85} ink={ink} screen={screen} />
            <Phone x={-150} y={55} rot={-8} scale={0.78} ink={ink} screen={screen} />
            <Tablet x={150} y={55} rot={6} scale={0.65} ink={ink} screen={screen} />
          </svg>
        </div>
      </div>
    </div>
  )
}

export const bannerCommunity: GraphicTemplate = {
  id: 'banner-community',
  name: 'Community · Cover · 900×506',
  description: 'Group cover — wordmark + multi-platform device cluster on accent flood. No event details.',
  aspect: '16:9',
  width: 900,
  height: 506,
  fields: [
    {
      key: 'brandLine1', label: 'Wordmark — line 1', type: 'text', placeholder: 'React',
    },
    {
      key: 'brandLine2', label: 'Wordmark — line 2', type: 'text', placeholder: 'Native',
    },
    {
      key: 'brandLine3', label: 'Wordmark — line 3', type: 'text', placeholder: 'Porto.',
    },
    {
      key: 'tagText', label: 'Top-left tag', type: 'text', placeholder: 'Community · Porto, PT',
    },
    {
      key: 'url', label: 'Bottom-left URL', type: 'text', placeholder: 'meetup.com/react-native-porto',
    },
  ],
  defaults: {
    brandLine1: 'React',
    brandLine2: 'Native',
    brandLine3: 'Porto.',
    tagText: 'Community · Porto, PT',
    url: 'meetup.com/react-native-porto',
  },
  Component: BannerCommunity,
}
