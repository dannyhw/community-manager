import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { ScrollView, View } from 'react-native';

import { AccentPresets, Text, useTheme, useThemeControls } from '@/design-system';

const meta = {
  title: 'Tokens/Theme',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function ColorTokens() {
  const t = useTheme();
  const groups = [
    { label: 'bg', items: Object.entries(t.bg) },
    { label: 'fg', items: Object.entries(t.fg) },
    { label: 'line', items: Object.entries(t.line) },
    {
      label: 'semantic',
      items: [
        ['accent', t.accent],
        ['accentInk', t.accentInk],
        ['success', t.success],
        ['warn', t.warn],
        ['danger', t.danger],
      ] as [string, string][],
    },
  ];
  return (
    <View style={{ gap: 16 }}>
      {groups.map((g) => (
        <View key={g.label}>
          <Text mono color={t.fg.tertiary} style={{ fontSize: 11, letterSpacing: 0.66, textTransform: 'uppercase', marginBottom: 6 }}>
            {g.label}
          </Text>
          <View style={{ gap: 6 }}>
            {g.items.map(([k, v]) => (
              <View key={k} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    backgroundColor: v as string,
                    borderWidth: 1,
                    borderColor: t.line.divider,
                  }}
                />
                <Text variant="callout" style={{ flex: 1 }}>{k}</Text>
                <Text mono color={t.fg.secondary}>{String(v)}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

export const Colors: Story = {
  render: () => (
    <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
      <ColorTokens />
    </ScrollView>
  ),
};

export const Accents: Story = {
  render: () => {
    const t = useTheme();
    const { setAccent, setMode, mode } = useThemeControls();
    return (
      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 24 }}>
        <Text variant="caption" color={t.fg.secondary}>
          Tap a swatch to set accent · current mode: {mode}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {AccentPresets.map((p) => (
            <View
              key={p.id}
              onTouchEnd={() => setAccent(p.hex)}
              style={{
                width: 64,
                height: 64,
                borderRadius: 8,
                backgroundColor: p.hex,
                borderWidth: 2,
                borderColor: t.accent === p.hex ? t.fg.primary : 'transparent',
              }}
            />
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Text
            onPress={() => setMode('light')}
            style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, backgroundColor: t.bg.elevated, borderWidth: 1, borderColor: t.line.divider }}
          >
            Light
          </Text>
          <Text
            onPress={() => setMode('dark')}
            style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, backgroundColor: t.bg.elevated, borderWidth: 1, borderColor: t.line.divider }}
          >
            Dark
          </Text>
        </View>
      </ScrollView>
    );
  },
};
