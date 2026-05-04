import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';

import { MotifAtom, useTheme } from '@/design-system';

const meta = {
  title: 'Motifs/MotifAtom',
  component: MotifAtom,
  args: { size: 120, strokeWidth: 1, opacity: 1 },
  argTypes: {
    size: { control: { type: 'range', min: 32, max: 320, step: 8 } },
    strokeWidth: { control: { type: 'range', min: 0.5, max: 3, step: 0.25 } },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
  },
} satisfies Meta<typeof MotifAtom>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const t = useTheme();
    return <MotifAtom {...args} color={t.accent} />;
  },
};
