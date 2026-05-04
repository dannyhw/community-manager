import React from 'react';
import { ScrollView, View } from 'react-native';
import Svg, { G, Rect } from 'react-native-svg';

import { Badge, MotifAtom, Text, useTheme, useThemeControls } from '@/design-system';

function FakeQR({ size = 140 }: { size?: number }) {
  const t = useTheme();
  const cells = 17;
  const cell = size / cells;
  const grid: React.ReactNode[] = [];
  const seed = (i: number, j: number) => ((i * 73 + j * 31 + i * j * 7) % 100) > 52;

  for (let i = 0; i < cells; i++) {
    for (let j = 0; j < cells; j++) {
      const inCorner =
        (i < 7 && j < 7) || (i < 7 && j > cells - 8) || (i > cells - 8 && j < 7);
      if (inCorner) continue;
      if (seed(i, j)) {
        grid.push(
          <Rect
            key={`${i}-${j}`}
            x={i * cell}
            y={j * cell}
            width={cell}
            height={cell}
            fill={t.fg.primary}
          />
        );
      }
    }
  }

  const finder = (cx: number, cy: number, key: string) => (
    <G key={key}>
      <Rect x={cx} y={cy} width={cell * 7} height={cell * 7} fill={t.fg.primary} />
      <Rect x={cx + cell} y={cy + cell} width={cell * 5} height={cell * 5} fill={t.bg.elevated} />
      <Rect x={cx + cell * 2} y={cy + cell * 2} width={cell * 3} height={cell * 3} fill={t.fg.primary} />
    </G>
  );

  return (
    <View
      style={{
        backgroundColor: t.bg.elevated,
        borderRadius: t.radius.sm,
        borderWidth: 1,
        borderColor: t.line.hairline,
        overflow: 'hidden',
      }}
    >
      <Svg width={size} height={size}>
        {grid}
        {finder(0, 0, 'tl')}
        {finder((cells - 7) * cell, 0, 'tr')}
        {finder(0, (cells - 7) * cell, 'bl')}
      </Svg>
    </View>
  );
}

export function TicketScreen() {
  const t = useTheme();
  const { motifOn } = useThemeControls();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.bg.canvas }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        paddingBottom: 100,
        paddingHorizontal: 16,
      }}
    >
      <Text variant="caption" color={t.fg.secondary} style={{ marginTop: 4, marginBottom: 18 }}>
        Show this at the door.
      </Text>

      <View
        style={{
          backgroundColor: t.bg.elevated,
          borderColor: t.line.hairline,
          borderWidth: 1,
          borderRadius: t.radius.lg,
          overflow: 'hidden',
          ...t.shadow.e2,
        }}
      >
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 14,
            backgroundColor: t.accent,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {motifOn ? (
            <View style={{ position: 'absolute', right: -10, top: -10, opacity: 0.3 }}>
              <MotifAtom color={t.accentInk} size={120} strokeWidth={0.8} />
            </View>
          ) : null}
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <View>
              <Text mono color={t.accentInk} style={{ fontSize: 11, fontWeight: '600', letterSpacing: 1.1, opacity: 0.85 }}>
                RNP · #3
              </Text>
              <Text variant="title2" color={t.accentInk} style={{ marginTop: 2 }}>
                Reanimated 4
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text mono color={t.accentInk} style={{ fontSize: 11, opacity: 0.85 }}>
                30 APR · 18:30
              </Text>
              <Text mono color={t.accentInk} style={{ fontSize: 11, opacity: 0.85 }}>
                BLIP · BOAVISTA
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 18, position: 'relative' }}>
          <View
            style={{
              position: 'absolute',
              left: -10,
              top: 4,
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: t.bg.canvas,
              borderWidth: 1,
              borderColor: t.line.hairline,
            }}
          />
          <View
            style={{
              position: 'absolute',
              right: -10,
              top: 4,
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: t.bg.canvas,
              borderWidth: 1,
              borderColor: t.line.hairline,
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: 14,
              right: 14,
              top: '50%',
              borderTopWidth: 1,
              borderTopColor: t.line.divider,
              borderStyle: 'dashed',
            }}
          />
        </View>

        <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 18, gap: 12 }}>
          <FakeQR />
          <Text mono color={t.fg.secondary} style={{ fontSize: 12, letterSpacing: 0.96 }}>
            RNP-3-IA-08F2
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderTopColor: t.line.hairline,
            borderTopWidth: 1,
          }}
        >
          <View>
            <Text variant="caption" color={t.fg.tertiary}>
              Holder
            </Text>
            <Text variant="bodyMed">Inês Almeida</Text>
          </View>
          <Badge tone="success">Confirmed</Badge>
        </View>
      </View>
    </ScrollView>
  );
}
