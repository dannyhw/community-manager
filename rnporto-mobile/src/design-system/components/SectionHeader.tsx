import React from 'react';
import { View } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

export type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
};

export function SectionHeader({ eyebrow, title, action }: SectionHeaderProps) {
  const t = useTheme();
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 8,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
      }}
    >
      <View>
        {eyebrow ? (
          <Text
            mono
            color={t.accent}
            style={{
              fontSize: 11,
              fontWeight: '600',
              letterSpacing: 0.66,
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            {eyebrow}
          </Text>
        ) : null}
        <Text variant="title2">{title}</Text>
      </View>
      {action}
    </View>
  );
}
