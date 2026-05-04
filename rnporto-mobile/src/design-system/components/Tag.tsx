import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

export type TagProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export function Tag({ children, style }: TagProps) {
  const t = useTheme();
  return (
    <View
      style={[
        styles.tag,
        {
          borderColor: t.line.divider,
          borderRadius: t.radius.xs,
        },
        style,
      ]}
    >
      <Text
        mono
        style={{
          color: t.fg.secondary,
          fontSize: 11,
          fontWeight: '500',
          lineHeight: 14,
          letterSpacing: 0.11,
        }}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    height: 20,
    paddingHorizontal: 6,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
});
