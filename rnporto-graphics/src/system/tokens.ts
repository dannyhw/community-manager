// Ported from /tmp/design/react-native-porto/project/tokens.jsx — Atómico
// direction only (Ribeira was retired in the design chat). Keeps the same
// resolution semantics: direction × mode + optional accent override, with
// dark-mode auto-lightening so user-picked accents stay legible on slate.

export type ThemeMode = 'light' | 'dark'

export interface ThemeTokens {
  mode: ThemeMode
  bg: { canvas: string; surface: string; elevated: string; sunken: string }
  fg: {
    primary: string
    secondary: string
    tertiary: string
    inverse: string
    muted: string
  }
  line: { hairline: string; divider: string; strong: string }
  accent: string
  accentInk: string
  accentRaw: string
  success: string
  warn: string
  danger: string
  fonts: { sans: string; display: string; mono: string }
  space: Record<number, number>
  radius: Record<string, number>
  type: Record<string, { size: number; line: number; weight: number; tracking: number }>
  shadow: { e1: string; e2: string; e3: string }
}

export const RNP_FONTS = {
  sans: '"General Sans", "Inter", -apple-system, system-ui, sans-serif',
  display: '"General Sans", "Inter", -apple-system, system-ui, sans-serif',
  mono: '"JetBrains Mono", "SF Mono", ui-monospace, Menlo, monospace',
}

const ATOMICO = {
  light: {
    bg: { canvas: '#F4F6F8', surface: '#FFFFFF', elevated: '#FFFFFF', sunken: '#EBEEF2' },
    fg: { primary: '#0E141B', secondary: '#4B5563', tertiary: '#7C8794', inverse: '#FFFFFF' },
    line: {
      hairline: 'rgba(14,20,27,0.08)',
      divider: 'rgba(14,20,27,0.12)',
      strong: 'rgba(14,20,27,0.24)',
    },
    accent: '#1F4FD6',
    accentInk: '#FFFFFF',
    success: '#16794D',
    warn: '#A66A14',
    danger: '#B22A2A',
  },
  dark: {
    bg: { canvas: '#0A0E14', surface: '#10151D', elevated: '#171D26', sunken: '#06080C' },
    fg: { primary: '#E7ECF2', secondary: '#9AA5B4', tertiary: '#65707E', inverse: '#0A0E14' },
    line: {
      hairline: 'rgba(231,236,242,0.08)',
      divider: 'rgba(231,236,242,0.14)',
      strong: 'rgba(231,236,242,0.28)',
    },
    accent: '#5E84F2',
    accentInk: '#0A0E14',
    success: '#5BC494',
    warn: '#E1B664',
    danger: '#EA7575',
  },
} as const

export const RNP_SPACE: Record<number, number> = {
  0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64,
}

export const RNP_RADIUS: Record<string, number> = {
  none: 0, xs: 4, sm: 6, md: 10, lg: 14, xl: 20, pill: 9999,
}

export const RNP_TYPE = {
  display: { size: 36, line: 40, weight: 600, tracking: -0.02 },
  title1: { size: 28, line: 32, weight: 600, tracking: -0.015 },
  title2: { size: 22, line: 28, weight: 600, tracking: -0.01 },
  title3: { size: 18, line: 24, weight: 600, tracking: -0.005 },
  body: { size: 15, line: 22, weight: 400, tracking: 0 },
  bodyMed: { size: 15, line: 22, weight: 500, tracking: 0 },
  callout: { size: 14, line: 20, weight: 500, tracking: 0 },
  caption: { size: 12, line: 16, weight: 500, tracking: 0.01 },
  micro: { size: 11, line: 14, weight: 600, tracking: 0.06 },
  mono: { size: 12, line: 16, weight: 500, tracking: 0 },
}

const SHADOW = (mode: ThemeMode) =>
  mode === 'dark'
    ? {
        e1: '0 1px 2px rgba(0,0,0,0.4)',
        e2: '0 4px 14px rgba(0,0,0,0.5)',
        e3: '0 14px 40px rgba(0,0,0,0.55)',
      }
    : {
        e1: '0 1px 2px rgba(20,16,12,0.06)',
        e2: '0 4px 14px rgba(20,16,12,0.08), 0 1px 2px rgba(20,16,12,0.04)',
        e3: '0 18px 50px rgba(20,16,12,0.14), 0 2px 6px rgba(20,16,12,0.06)',
      }

function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  return {
    r: parseInt(v.slice(0, 2), 16),
    g: parseInt(v.slice(2, 4), 16),
    b: parseInt(v.slice(4, 6), 16),
  }
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (mx + mn) / 2
  if (mx !== mn) {
    const d = mx - mn
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn)
    switch (mx) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      default: h = (r - g) / d + 4
    }
    h *= 60
  }
  return { h, s, l }
}

function hslToHex(h: number, s: number, l: number) {
  s = Math.max(0, Math.min(1, s))
  l = Math.max(0, Math.min(1, l))
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0, g = 0, b = 0
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  const to = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0')
  return `#${to(r)}${to(g)}${to(b)}`
}

function adaptAccent(hex: string, mode: ThemeMode) {
  if (!hex || hex[0] !== '#') return hex
  try {
    const { r, g, b } = hexToRgb(hex)
    const { h, s, l } = rgbToHsl(r, g, b)
    if (mode === 'dark') {
      const targetL = Math.max(l, 0.6)
      const targetS = Math.min(s, 0.7)
      return hslToHex(h, targetS, targetL)
    }
    if (l > 0.65) return hslToHex(h, s, 0.45)
    return hex
  } catch {
    return hex
  }
}

function pickAccentInk(hex: string) {
  try {
    const { r, g, b } = hexToRgb(hex)
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return lum > 0.62 ? '#0A0E14' : '#FFFFFF'
  } catch {
    return '#FFFFFF'
  }
}

export function resolveTheme(mode: ThemeMode, accentOverride?: string): ThemeTokens {
  const base = ATOMICO[mode]
  const rawAccent = accentOverride || base.accent
  const accent = accentOverride ? adaptAccent(rawAccent, mode) : rawAccent
  const accentInk = accentOverride ? pickAccentInk(accent) : base.accentInk
  return {
    mode,
    bg: { ...base.bg },
    fg: { ...base.fg, muted: base.fg.tertiary },
    line: { ...base.line },
    accent,
    accentInk,
    accentRaw: rawAccent,
    success: base.success,
    warn: base.warn,
    danger: base.danger,
    fonts: RNP_FONTS,
    space: RNP_SPACE,
    radius: RNP_RADIUS,
    type: RNP_TYPE,
    shadow: SHADOW(mode),
  }
}

// Curated accent presets pulled from the original design (each maps to a
// real Porto reference: cobalt azulejo, Douro wine, Cais granite, etc.).
export const RNP_ACCENT_PRESETS: Array<{
  id: string
  label: string
  hex: string
  note: string
}> = [
  { id: 'cobalto', label: 'Cobalto', hex: '#1F4FD6', note: 'azulejo cobalt' },
  { id: 'douro', label: 'Douro', hex: '#7B2D3A', note: 'wine red' },
  { id: 'gaia', label: 'Gaia', hex: '#0E7A6B', note: 'river teal' },
  { id: 'tile', label: 'Tile', hex: '#2B6CA8', note: 'tile blue' },
  { id: 'tinta', label: 'Tinta', hex: '#1B2742', note: 'ink' },
  { id: 'tram', label: 'Tram', hex: '#C2502A', note: 'terracotta' },
  { id: 'pedra', label: 'Pedra', hex: '#475569', note: 'granite' },
  { id: 'limao', label: 'Limão', hex: '#B58A1A', note: 'mustard' },
]
