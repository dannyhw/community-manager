import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { mix, withAlpha } from '../theme/tokens';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warn' | 'danger';

export type BadgeProps = {
  children: React.ReactNode;
  tone?: BadgeTone;
  solid?: boolean;
  style?: ViewStyle;
};

export function Badge({ children, tone = 'neutral', solid = false, style }: BadgeProps) {
  const t = useTheme();
  const tones: Record<BadgeTone, { bg: string; fg: string }> = {
    neutral: { bg: t.bg.sunken, fg: t.fg.secondary },
    accent: solid
      ? { bg: t.accent, fg: t.accentInk }
      : { bg: mix(t.accent, t.bg.canvas, 0.14), fg: t.accent },
    success: { bg: mix(t.success, t.bg.canvas, 0.14), fg: t.success },
    warn: { bg: mix(t.warn, t.bg.canvas, 0.16), fg: t.warn },
    danger: { bg: mix(t.danger, t.bg.canvas, 0.14), fg: t.danger },
  };
  const c = tones[tone];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: c.bg,
          borderRadius: t.radius.pill,
        },
        style,
      ]}
    >
      <Text
        style={{
          color: c.fg,
          fontSize: 11,
          fontWeight: '600',
          lineHeight: 14,
          letterSpacing: 0.22,
        }}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    height: 22,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

// keep import to avoid unused warning in some configs
void withAlpha;
