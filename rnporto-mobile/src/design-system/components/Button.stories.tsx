import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { View } from 'react-native';
import { fn } from 'storybook/test';

import { Button, Icon } from '@/design-system';

const meta = {
  title: 'Primitives/Button',
  component: Button,
  args: { onPress: fn(), label: 'Save my spot' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Danger: Story = { args: { variant: 'danger', label: 'Cancel RSVP' } };

export const Sizes: Story = {
  render: (args) => (
    <View style={{ gap: 12 }}>
      <Button {...args} size="sm" label="Small" />
      <Button {...args} size="md" label="Medium" />
      <Button {...args} size="lg" label="Large" />
    </View>
  ),
};

export const WithIcon: Story = {
  args: { variant: 'primary', label: 'Submit a talk' },
  render: (args) => <Button {...args} icon={<Icon name="mic" size={16} color="#fff" />} />,
};
