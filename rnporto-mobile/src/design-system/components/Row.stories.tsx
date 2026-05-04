import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { View } from 'react-native';

import { Avatar, Badge, Card, Icon, Row, useTheme } from '@/design-system';

const meta = {
  title: 'Primitives/Row',
  component: Row,
  args: { title: 'Inês Almeida', subtitle: 'Senior Engineer · Remote' },
} satisfies Meta<typeof Row>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const t = useTheme();
    return (
      <Card padding={0} style={{ alignSelf: 'stretch' }}>
        <Row {...args} leading={<Avatar initials="IA" />} trailing={<Badge tone="accent">Speaker</Badge>} />
        <Row title="Tomás Ribeiro" subtitle="Mobile Lead · Blip"
          leading={<Avatar initials="TR" />} trailing={<Icon name="chev" size={14} color={t.fg.tertiary} />} />
        <Row divider={false} title="Marta Sá" subtitle="Indie"
          leading={<Avatar initials="MS" />} trailing={<Badge tone="warn">Lightning</Badge>} />
      </Card>
    );
  },
};

void View;
