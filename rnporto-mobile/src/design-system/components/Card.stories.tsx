import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';

import { Card, Text } from '@/design-system';

const meta = {
  title: 'Primitives/Card',
  component: Card,
  args: { padding: 16 },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <Text variant="title3">Reanimated 4</Text>
      <Text variant="caption" style={{ marginTop: 4 }}>30 Apr · Blip · Boavista</Text>
    </Card>
  ),
};

export const Elevated: Story = {
  args: { elevated: true },
  render: (args) => (
    <Card {...args}>
      <Text variant="title3">Elevated card</Text>
      <Text variant="caption" style={{ marginTop: 4 }}>Shadowed surface</Text>
    </Card>
  ),
};
