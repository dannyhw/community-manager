import React from 'react';
import { StyleProp, Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';

import { Theme } from '../theme/tokens';
import { useTheme } from '../theme/ThemeProvider';

export type TextVariant =
  | 'display' | 'title1' | 'title2' | 'title3'
  | 'body' | 'bodyMed' | 'callout' | 'caption' | 'micro' | 'mono';

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  color?: string;
  mono?: boolean;
};

export function typeStyle(t: Theme, key: TextVariant, mono = false): TextStyle {
  const s = t.type[key];
  return {
    fontFamily: mono || key === 'mono' ? t.fonts.mono : t.fonts.sans,
    fontSize: s.size,
    lineHeight: s.line,
    fontWeight: s.weight,
    letterSpacing: s.tracking,
  };
}

export function Text({ variant = 'body', color, mono, style, ...rest }: TextProps) {
  const t = useTheme();
  const base = typeStyle(t, variant, mono);
  return (
    <RNText
      {...rest}
      style={[
        base,
        { color: color ?? t.fg.primary },
        style as StyleProp<TextStyle>,
      ]}
    />
  );
}
