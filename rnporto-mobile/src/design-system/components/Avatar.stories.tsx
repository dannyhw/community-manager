import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { View } from 'react-native';

import { Avatar } from '@/design-system';

const meta = {
  title: 'Primitives/Avatar',
  component: Avatar,
  args: { initials: 'IA', size: 36 },
  argTypes: { size: { control: { type: 'range', min: 16, max: 96, step: 4 } } },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Group: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {['IA', 'TR', 'MS', 'JC', 'RP'].map((i) => (
        <Avatar key={i} initials={i} />
      ))}
    </View>
  ),
};
