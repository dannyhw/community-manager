import { Platform } from 'react-native';

export type Mode = 'light' | 'dark';
export type Direction = 'atomico' | 'ribeira';

export const Fonts = Platform.select({
  ios: { sans: 'System', mono: 'Menlo' },
  android: { sans: 'sans-serif', mono: 'monospace' },
  default: { sans: 'System', mono: 'monospace' },
}) as { sans: string; mono: string };

export const Space = {
  0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64,
} as const;

export const Radius = {
  none: 0, xs: 4, sm: 6, md: 10, lg: 14, xl: 20, pill: 9999,
} as const;

export type TypeKey =
  | 'display' | 'title1' | 'title2' | 'title3'
  | 'body' | 'bodyMed' | 'callout' | 'caption' | 'micro' | 'mono';

export const Type: Record<TypeKey, { size: number; line: number; weight: '400' | '500' | '600' | '700'; tracking: number }> = {
  display: { size: 36, line: 40, weight: '600', tracking: -0.72 },
  title1: { size: 28, line: 32, weight: '600', tracking: -0.42 },
  title2: { size: 22, line: 28, weight: '600', tracking: -0.22 },
  title3: { size: 18, line: 24, weight: '600', tracking: -0.09 },
  body: { size: 15, line: 22, weight: '400', tracking: 0 },
  bodyMed: { size: 15, line: 22, weight: '500', tracking: 0 },
  callout: { size: 14, line: 20, weight: '500', tracking: 0 },
  caption: { size: 12, line: 16, weight: '500', tracking: 0.12 },
  micro: { size: 11, line: 14, weight: '600', tracking: 0.66 },
  mono: { size: 12, line: 16, weight: '500', tracking: 0 },
};

type ThemePalette = {
  bg: { canvas: string; surface: string; elevated: string; sunken: string };
  fg: { primary: string; secondary: string; tertiary: string; inverse: string };
  line: { hairline: string; divider: string; strong: string };
  accent: string;
  accentInk: string;
  success: string;
  warn: string;
  danger: string;
};

const ATOMICO: Record<Mode, ThemePalette> = {
  light: {
    bg: { canvas: '#F4F6F8', surface: '#FFFFFF', elevated: '#FFFFFF', sunken: '#EBEEF2' },
    fg: { primary: '#0E141B', secondary: '#4B5563', tertiary: '#7C8794', inverse: '#FFFFFF' },
    line: { hairline: 'rgba(14,20,27,0.08)', divider: 'rgba(14,20,27,0.12)', strong: 'rgba(14,20,27,0.24)' },
    accent: '#1F4FD6', accentInk: '#FFFFFF',
    success: '#16794D', warn: '#A66A14', danger: '#B22A2A',
  },
  dark: {
    bg: { canvas: '#0A0E14', surface: '#10151D', elevated: '#171D26', sunken: '#06080C' },
    fg: { primary: '#E7ECF2', secondary: '#9AA5B4', tertiary: '#65707E', inverse: '#0A0E14' },
    line: { hairline: 'rgba(231,236,242,0.08)', divider: 'rgba(231,236,242,0.14)', strong: 'rgba(231,236,242,0.28)' },
    accent: '#5E84F2', accentInk: '#0A0E14',
    success: '#5BC494', warn: '#E1B664', danger: '#EA7575',
  },
};

const RIBEIRA: Record<Mode, ThemePalette> = {
  light: {
    bg: { canvas: '#F5F1EA', surface: '#FBF8F2', elevated: '#FFFFFF', sunken: '#EFEAE0' },
    fg: { primary: '#1B1714', secondary: '#5C534A', tertiary: '#8A7F73', inverse: '#FBF8F2' },
    line: { hairline: 'rgba(27,23,20,0.08)', divider: 'rgba(27,23,20,0.12)', strong: 'rgba(27,23,20,0.24)' },
    accent: '#C2502A', accentInk: '#FFFFFF',
    success: '#3F7D4E', warn: '#B98425', danger: '#A93521',
  },
  dark: {
    bg: { canvas: '#15110E', surface: '#1E1915', elevated: '#272019', sunken: '#0F0C0A' },
    fg: { primary: '#F5EFE6', secondary: '#B8AC9D', tertiary: '#7E7264', inverse: '#15110E' },
    line: { hairline: 'rgba(245,239,230,0.08)', divider: 'rgba(245,239,230,0.14)', strong: 'rgba(245,239,230,0.28)' },
    accent: '#E97150', accentInk: '#1A1310',
    success: '#7DC089', warn: '#E0B062', danger: '#E37865',
  },
};

export const AccentPresets = [
  { id: 'cobalto', label: 'Cobalto', hex: '#1F4FD6' },
  { id: 'douro', label: 'Douro', hex: '#7B2D3A' },
  { id: 'gaia', label: 'Gaia', hex: '#0E7A6B' },
  { id: 'tile', label: 'Tile', hex: '#2B6CA8' },
  { id: 'tinta', label: 'Tinta', hex: '#1B2742' },
  { id: 'tram', label: 'Tram', hex: '#C2502A' },
  { id: 'pedra', label: 'Pedra', hex: '#475569' },
  { id: 'limao', label: 'Limão', hex: '#B58A1A' },
] as const;

function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return {
    r: parseInt(v.slice(0, 2), 16),
    g: parseInt(v.slice(2, 4), 16),
    b: parseInt(v.slice(4, 6), 16),
  };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  let h = 0, s = 0; const l = (mx + mn) / 2;
  if (mx !== mn) {
    const d = mx - mn;
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    switch (mx) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h *= 60;
  }
  return { h, s, l };
}

function hslToHex(h: number, s: number, l: number) {
  s = Math.max(0, Math.min(1, s));
  l = Math.max(0, Math.min(1, l));
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const to = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

function adaptAccent(hex: string, mode: Mode) {
  if (!hex || hex[0] !== '#') return hex;
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  if (mode === 'dark') {
    return hslToHex(h, Math.min(s, 0.7), Math.max(l, 0.6));
  }
  if (l > 0.65) return hslToHex(h, s, 0.45);
  return hex;
}

function accentInk(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.62 ? '#0A0E14' : '#FFFFFF';
}

/** Mix `over` color into `under` color at `pct` (0-1). Approximation of color-mix. */
export function mix(over: string, under: string, pct: number): string {
  const a = hexOrRgbToRgb(over);
  const b = hexOrRgbToRgb(under);
  const f = (x: number, y: number) => Math.round(x * pct + y * (1 - pct));
  const r = f(a.r, b.r), g = f(a.g, b.g), bl = f(a.b, b.b);
  const to = (n: number) => n.toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(bl)}`;
}

function hexOrRgbToRgb(c: string) {
  if (c.startsWith('#')) return hexToRgb(c);
  // crude rgba(r,g,b,a) parser
  const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (m) return { r: +m[1], g: +m[2], b: +m[3] };
  return { r: 0, g: 0, b: 0 };
}

/** Apply alpha to a hex color, returning rgba(). */
export function withAlpha(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

export type Shadow = {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
};

function shadowSet(mode: Mode): { e1: Shadow; e2: Shadow; e3: Shadow } {
  const dark = mode === 'dark';
  return {
    e1: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: dark ? 0.4 : 0.06, shadowRadius: 2, elevation: 1 },
    e2: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: dark ? 0.5 : 0.08, shadowRadius: 14, elevation: 4 },
    e3: { shadowColor: '#000', shadowOffset: { width: 0, height: 14 }, shadowOpacity: dark ? 0.55 : 0.14, shadowRadius: 40, elevation: 14 },
  };
}

export type Theme = ThemePalette & {
  mode: Mode;
  direction: Direction;
  fonts: { sans: string; mono: string };
  space: typeof Space;
  radius: typeof Radius;
  type: typeof Type;
  shadow: ReturnType<typeof shadowSet>;
};

export function resolveTheme(direction: Direction, mode: Mode, accentOverride?: string): Theme {
  const map = direction === 'atomico' ? ATOMICO : RIBEIRA;
  const base = map[mode];
  const accent = accentOverride ? adaptAccent(accentOverride, mode) : base.accent;
  const ink = accentOverride ? accentInk(accent) : base.accentInk;
  return {
    direction,
    mode,
    bg: base.bg,
    fg: base.fg,
    line: base.line,
    accent,
    accentInk: ink,
    success: base.success,
    warn: base.warn,
    danger: base.danger,
    fonts: Fonts,
    space: Space,
    radius: Radius,
    type: Type,
    shadow: shadowSet(mode),
  };
}
