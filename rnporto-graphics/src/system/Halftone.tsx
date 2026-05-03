// Ported from /tmp/design/react-native-porto/project/banner.jsx —
// halftone backdrop used inside the accent panels of every event banner.
// A grid of small dots whose opacity ramps along one axis.

interface Props {
  color: string
  cols?: number
  rows?: number
  dot?: number
  direction?: 'horizontal' | 'vertical'
  minOpacity?: number
  maxOpacity?: number
}

export function BannerHalftone({
  color,
  cols = 28,
  rows = 16,
  dot = 2,
  direction = 'horizontal',
  minOpacity = 0.06,
  maxOpacity = 0.5,
}: Props) {
  const cells = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const t = direction === 'horizontal' ? c / (cols - 1) : r / (rows - 1)
      const op = minOpacity + (maxOpacity - minOpacity) * t
      cells.push(
        <div
          key={`${r}-${c}`}
          style={{
            width: dot * 2,
            height: dot * 2,
            borderRadius: '50%',
            background: color,
            opacity: op,
          }}
        />,
      )
    }
  }
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        placeItems: 'center',
      }}
    >
      {cells}
    </div>
  )
}
