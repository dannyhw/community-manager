import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from './Text';

export type AvatarProps = {
  size?: number;
  initials: string;
  tone?: string;
};

const PALETTE = ['#C2502A', '#1F4FD6', '#3F7D4E', '#7847B0', '#B98425', '#2A8E9E'];

export function Avatar({ size = 36, initials, tone }: AvatarProps) {
  const idx = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % PALETTE.length;
  const bg = tone ?? PALETTE[idx];
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
      ]}
    >
      <Text
        color="#fff"
        style={{
          fontSize: size * 0.38,
          fontWeight: '600',
          letterSpacing: 0.4,
          lineHeight: size * 0.38 + 2,
        }}
      >
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
