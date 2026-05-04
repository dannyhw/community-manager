import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type IconName =
  | 'search' | 'calendar' | 'pin' | 'ticket' | 'user' | 'bell'
  | 'home' | 'arrow' | 'play' | 'heart' | 'check' | 'plus'
  | 'close' | 'chev' | 'globe' | 'mic' | 'qr';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function Icon({ name, size = 20, color = '#000', strokeWidth = 1.75 }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
  };
  const stroke = { stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  switch (name) {
    case 'search':
      return (
        <Svg {...common}>
          <Circle cx={11} cy={11} r={7} {...stroke} />
          <Path d="M20 20l-3.5-3.5" {...stroke} />
        </Svg>
      );
    case 'calendar':
      return (
        <Svg {...common}>
          <Rect x={3} y={5} width={18} height={16} rx={2} {...stroke} />
          <Path d="M8 3v4M16 3v4M3 10h18" {...stroke} />
        </Svg>
      );
    case 'pin':
      return (
        <Svg {...common}>
          <Path d="M12 22s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12Z" {...stroke} />
          <Circle cx={12} cy={10} r={2.5} {...stroke} />
        </Svg>
      );
    case 'ticket':
      return (
        <Svg {...common}>
          <Path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V9Z" {...stroke} />
          <Path d="M13 7v10" {...stroke} />
        </Svg>
      );
    case 'user':
      return (
        <Svg {...common}>
          <Circle cx={12} cy={8} r={4} {...stroke} />
          <Path d="M4 21a8 8 0 0 1 16 0" {...stroke} />
        </Svg>
      );
    case 'bell':
      return (
        <Svg {...common}>
          <Path d="M6 8a6 6 0 1 1 12 0c0 6 2 7 2 7H4s2-1 2-7Z" {...stroke} />
          <Path d="M10 19a2 2 0 0 0 4 0" {...stroke} />
        </Svg>
      );
    case 'home':
      return (
        <Svg {...common}>
          <Path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9Z" {...stroke} />
        </Svg>
      );
    case 'arrow':
      return (
        <Svg {...common}>
          <Path d="M5 12h14M13 6l6 6-6 6" {...stroke} />
        </Svg>
      );
    case 'play':
      return (
        <Svg {...common}>
          <Path d="M6 4v16l14-8L6 4Z" fill={color} />
        </Svg>
      );
    case 'heart':
      return (
        <Svg {...common}>
          <Path d="M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 6.5-7 11-7 11Z" {...stroke} />
        </Svg>
      );
    case 'check':
      return (
        <Svg {...common}>
          <Path d="m4 12 5 5L20 6" {...stroke} />
        </Svg>
      );
    case 'plus':
      return (
        <Svg {...common}>
          <Path d="M12 5v14M5 12h14" {...stroke} />
        </Svg>
      );
    case 'close':
      return (
        <Svg {...common}>
          <Path d="m6 6 12 12M18 6 6 18" {...stroke} />
        </Svg>
      );
    case 'chev':
      return (
        <Svg {...common}>
          <Path d="m9 6 6 6-6 6" {...stroke} />
        </Svg>
      );
    case 'globe':
      return (
        <Svg {...common}>
          <Circle cx={12} cy={12} r={9} {...stroke} />
          <Path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" {...stroke} />
        </Svg>
      );
    case 'mic':
      return (
        <Svg {...common}>
          <Rect x={9} y={3} width={6} height={12} rx={3} {...stroke} />
          <Path d="M5 11a7 7 0 0 0 14 0M12 18v3" {...stroke} />
        </Svg>
      );
    case 'qr':
      return (
        <Svg {...common}>
          <Rect x={3} y={3} width={7} height={7} {...stroke} />
          <Rect x={14} y={3} width={7} height={7} {...stroke} />
          <Rect x={3} y={14} width={7} height={7} {...stroke} />
          <Path d="M14 14h3v3M21 14v7M14 21h3" {...stroke} />
        </Svg>
      );
    default:
      return (
        <Svg {...common}>
          <Circle cx={12} cy={12} r={9} {...stroke} />
        </Svg>
      );
  }
}
