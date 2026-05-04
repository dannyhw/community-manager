import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { View } from 'react-native';

import { Tag } from '@/design-system';

const meta = {
  title: 'Primitives/Tag',
  component: Tag,
  args: { children: '#reanimated' },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Many: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
      <Tag>#talks</Tag>
      <Tag>#reanimated</Tag>
      <Tag>#animations</Tag>
      <Tag>#expo</Tag>
      <Tag>#kickoff</Tag>
    </View>
  ),
};
