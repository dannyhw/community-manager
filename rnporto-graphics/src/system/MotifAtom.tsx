// Ported from /tmp/design/react-native-porto/project/motifs.jsx — the React-
// style 3-orbit atom used as the RN Porto brand mark across the banners.

interface Props {
  color?: string
  size?: number
  strokeWidth?: number
  opacity?: number
}

export function MotifAtom({
  color = 'currentColor',
  size = 80,
  strokeWidth = 1,
  opacity = 1,
}: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" style={{ opacity, display: 'block' }}>
      <g fill="none" stroke={color} strokeWidth={strokeWidth}>
        <ellipse cx="40" cy="40" rx="34" ry="13" />
        <ellipse cx="40" cy="40" rx="34" ry="13" transform="rotate(60 40 40)" />
        <ellipse cx="40" cy="40" rx="34" ry="13" transform="rotate(120 40 40)" />
        <circle cx="40" cy="40" r="3" fill={color} />
      </g>
    </svg>
  )
}
