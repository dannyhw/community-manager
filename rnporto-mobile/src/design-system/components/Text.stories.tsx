import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { View } from 'react-native';

import { Text } from '@/design-system';

const meta = {
  title: 'Primitives/Text',
  component: Text,
  args: { children: 'Olá, devs do Porto', variant: 'title2' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['display', 'title1', 'title2', 'title3', 'body', 'bodyMed', 'callout', 'caption', 'micro', 'mono'],
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TypeScale: Story = {
  render: () => (
    <View style={{ gap: 8 }}>
      <Text variant="display">Display</Text>
      <Text variant="title1">Title 1</Text>
      <Text variant="title2">Title 2</Text>
      <Text variant="title3">Title 3</Text>
      <Text variant="bodyMed">Body medium</Text>
      <Text variant="body">Body regular</Text>
      <Text variant="callout">Callout</Text>
      <Text variant="caption">Caption</Text>
      <Text variant="micro" style={{ textTransform: 'uppercase' }}>MICRO EYEBROW</Text>
      <Text variant="mono" mono>MONO 12 · 1F4FD6</Text>
    </View>
  ),
};
