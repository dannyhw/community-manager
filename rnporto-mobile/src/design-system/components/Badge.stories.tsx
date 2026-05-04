import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { View } from 'react-native';

import { Badge } from '@/design-system';

const meta = {
  title: 'Primitives/Badge',
  component: Badge,
  args: { children: 'Speaker' },
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'accent', 'success', 'warn', 'danger'] },
    solid: { control: 'boolean' },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Accent: Story = { args: { tone: 'accent' } };
export const Success: Story = { args: { tone: 'success', children: 'Confirmed' } };
export const Warn: Story = { args: { tone: 'warn', children: 'Lightning' } };
export const Neutral: Story = { args: { tone: 'neutral', children: 'Past' } };
export const Solid: Story = { args: { tone: 'accent', solid: true, children: 'Live' } };

export const AllTones: Story = {
  render: () => (
    <View style={{ gap: 8, alignItems: 'flex-start' }}>
      <Badge tone="neutral">Neutral</Badge>
      <Badge tone="accent">Accent</Badge>
      <Badge tone="success">Success</Badge>
      <Badge tone="warn">Warn</Badge>
      <Badge tone="danger">Danger</Badge>
      <Badge tone="accent" solid>Solid accent</Badge>
    </View>
  ),
};
