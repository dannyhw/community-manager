import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';

import { SectionHeader, Text, useTheme } from '@/design-system';

const meta = {
  title: 'Primitives/SectionHeader',
  component: SectionHeader,
  args: { title: 'Past editions', eyebrow: 'Archive · 2026' },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  render: (args) => {
    const t = useTheme();
    return <SectionHeader {...args} action={<Text variant="caption" color={t.accent}>All →</Text>} />;
  },
};
