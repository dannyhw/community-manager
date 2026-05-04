import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { View } from 'react-native';

import { Icon, IconName, Text, useTheme } from '@/design-system';

const NAMES: IconName[] = [
  'search', 'calendar', 'pin', 'ticket', 'user', 'bell', 'home',
  'arrow', 'play', 'heart', 'check', 'plus', 'close', 'chev', 'globe', 'mic', 'qr',
];

const meta = {
  title: 'Primitives/Icon',
  component: Icon,
  args: { name: 'search', size: 24 },
  argTypes: {
    name: { control: 'select', options: NAMES },
    size: { control: { type: 'range', min: 12, max: 48, step: 2 } },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const All: Story = {
  render: () => {
    const t = useTheme();
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
        {NAMES.map((n) => (
          <View key={n} style={{ width: 64, alignItems: 'center', gap: 6 }}>
            <Icon name={n} size={24} color={t.fg.primary} />
            <Text variant="caption">{n}</Text>
          </View>
        ))}
      </View>
    );
  },
};
