import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

export type RowProps = {
  leading?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  trailing?: React.ReactNode;
  divider?: boolean;
  onPress?: () => void;
};

export function Row({ leading, title, subtitle, trailing, divider = true, onPress }: RowProps) {
  const t = useTheme();
  const Component: any = onPress ? Pressable : View;
  return (
    <Component
      onPress={onPress}
      style={[
        styles.row,
        divider ? { borderBottomColor: t.line.hairline, borderBottomWidth: 1 } : null,
      ]}
    >
      {leading}
      <View style={{ flex: 1, minWidth: 0, marginLeft: leading ? 12 : 0 }}>
        <Text variant="bodyMed" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" color={t.fg.secondary} numberOfLines={1} style={{ marginTop: 2 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing}
    </Component>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
});
