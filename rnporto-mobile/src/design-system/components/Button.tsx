import React from 'react';
import { Pressable, PressableProps, StyleSheet, View, ViewStyle } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth,
  style,
  ...rest
}: ButtonProps) {
  const t = useTheme();
  const heights = { sm: 32, md: 44, lg: 52 } as const;
  const paddings = { sm: 12, md: 18, lg: 22 } as const;
  const fontSize = size === 'sm' ? 13 : size === 'lg' ? 16 : 15;

  const palettes = {
    primary: { bg: t.accent, fg: t.accentInk, border: 'transparent' },
    secondary: { bg: t.bg.elevated, fg: t.fg.primary, border: t.line.divider },
    ghost: { bg: 'transparent', fg: t.fg.primary, border: 'transparent' },
    danger: { bg: t.danger, fg: '#fff', border: 'transparent' },
  } as const;
  const p = palettes[variant];

  return (
    <Pressable
      {...rest}
      style={({ pressed }) => [
        styles.button,
        {
          height: heights[size],
          paddingHorizontal: paddings[size],
          borderRadius: t.radius.md,
          backgroundColor: p.bg,
          borderColor: p.border,
          borderWidth: variant === 'secondary' ? 1 : 0,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        style,
      ]}
    >
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text
        variant="bodyMed"
        color={p.fg}
        style={{ fontSize, fontWeight: '600', letterSpacing: -0.075 }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
});
