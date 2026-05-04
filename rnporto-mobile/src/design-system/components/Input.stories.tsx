import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';

import { Icon, Input, useTheme } from '@/design-system';

const meta = {
  title: 'Primitives/Input',
  component: Input,
  args: { placeholder: 'Search by name or company' },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

function Live(props: React.ComponentProps<typeof Input>) {
  const [v, setV] = useState('');
  return <Input {...props} value={v} onChangeText={setV} />;
}

export const Default: Story = { render: (args) => <Live {...args} /> };

export const WithLabel: Story = {
  args: { label: 'Your name', placeholder: 'Inês Almeida' },
  render: (args) => <Live {...args} />,
};

export const WithLeading: Story = {
  args: { placeholder: 'Search' },
  render: (args) => {
    const t = useTheme();
    return <Live {...args} leading={<Icon name="search" size={16} color={t.fg.tertiary} />} />;
  },
};
