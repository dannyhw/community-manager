import { forwardRef, useEffect, useRef, useState } from 'react'
import type { ThemeTokens } from '../system/tokens'
import type { GraphicTemplate, TemplateValues } from '../templates/types'

interface Props {
  template: GraphicTemplate
  values: TemplateValues
  theme: ThemeTokens
}

const GraphicCanvas = forwardRef<HTMLDivElement, Props>(function GraphicCanvas(
  { template, values, theme },
  forwardedRef,
) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const update = () => {
      const available = wrapper.clientWidth
      if (!available) return
      setScale(Math.min(1, available / template.width))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(wrapper)
    return () => ro.disconnect()
  }, [template.width])

  const Body = template.Component

  return (
    <div ref={wrapperRef} className="w-full">
      {/* Two-layer wrapper: the OUTER div carries the rounded corners and
          drop shadow purely for in-studio polish, while the INNER div is
          the `html-to-image` capture node and stays flush-rectangular.
          Earlier the radius + shadow lived on the capture node, which
          baked transparent corners into the exported PNG — fine for our
          page, terrible against any non-matching background on Instagram
          / LinkedIn / Twitter. Keep the radius here, not down there. */}
      <div
        style={{
          width: '100%',
          height: template.height * scale,
          position: 'relative',
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: theme.shadow.e3,
        }}
      >
        <div
          ref={forwardedRef}
          data-graphic-canvas
          style={{
            width: template.width,
            height: template.height,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          <Body values={values} t={theme} />
        </div>
      </div>
    </div>
  )
})

export default GraphicCanvas
