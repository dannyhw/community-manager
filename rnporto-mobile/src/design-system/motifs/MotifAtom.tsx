import React from 'react';
import Svg, { Circle, Ellipse, G } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
};

export function MotifAtom({ size = 80, color = '#000', strokeWidth = 1, opacity = 1 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80" opacity={opacity}>
      <G fill="none" stroke={color} strokeWidth={strokeWidth}>
        <Ellipse cx={40} cy={40} rx={34} ry={13} />
        <Ellipse cx={40} cy={40} rx={34} ry={13} transform="rotate(60 40 40)" />
        <Ellipse cx={40} cy={40} rx={34} ry={13} transform="rotate(120 40 40)" />
        <Circle cx={40} cy={40} r={3} fill={color} />
      </G>
    </Svg>
  );
}
