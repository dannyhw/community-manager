import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';

export type CardProps = ViewProps & {
  padding?: number;
  elevated?: boolean;
};

export function Card({ padding = 16, elevated = false, style, children, ...rest }: CardProps) {
  const t = useTheme();
  const baseStyle: ViewStyle = {
    backgroundColor: t.bg.elevated,
    borderColor: t.line.hairline,
    borderWidth: 1,
    borderRadius: t.radius.lg,
    padding,
    ...(elevated ? t.shadow.e2 : {}),
  };
  return (
    <View {...rest} style={[baseStyle, style]}>
      {children}
    </View>
  );
}
