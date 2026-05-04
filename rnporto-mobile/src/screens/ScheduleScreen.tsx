import React from 'react';
import { ScrollView, View } from 'react-native';

import { Avatar, Text, useTheme } from '@/design-system';
import { SCHEDULE, ScheduleItem } from '@/data/events';

function kindColor(t: ReturnType<typeof useTheme>, k: ScheduleItem['kind']) {
  if (k === 'Talk') return t.accent;
  if (k === 'Lightning') return t.warn;
  return t.fg.tertiary;
}

export function ScheduleScreen() {
  const t = useTheme();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.bg.canvas }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        <Text mono color={t.fg.tertiary} style={{ fontSize: 11, fontWeight: '600', letterSpacing: 0.88, textTransform: 'uppercase' }}>
          RNP #3
        </Text>
        <Text variant="title3" style={{ marginTop: 4 }}>
          Thu 30 Apr
        </Text>
        <Text mono variant="caption" color={t.fg.secondary} style={{ marginTop: 4 }}>
          18:30 → 21:00 · Blip, Av. da Boavista
        </Text>
      </View>

      <View style={{ paddingHorizontal: 16, position: 'relative' }}>
        <View
          style={{
            position: 'absolute',
            left: 16 + 56,
            top: 8,
            bottom: 8,
            width: 1,
            backgroundColor: t.line.divider,
          }}
        />

        {SCHEDULE.map((item, i) => (
          <View
            key={i}
            style={{
              flexDirection: 'row',
              gap: 14,
              paddingVertical: 6,
              position: 'relative',
            }}
          >
            <View style={{ width: 56, paddingTop: 14 }}>
              <Text
                mono
                color={item.faded ? t.fg.tertiary : t.fg.primary}
                style={{ fontSize: 14, fontWeight: '600', letterSpacing: -0.14 }}
              >
                {item.time}
              </Text>
              <Text mono color={t.fg.tertiary} style={{ fontSize: 10 }}>
                {item.dur}
              </Text>
            </View>
            <View
              style={{
                position: 'absolute',
                left: 56 - 4,
                top: 19,
                zIndex: 1,
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: t.bg.canvas,
                borderWidth: 2,
                borderColor: kindColor(t, item.kind),
              }}
            />
            <View
              style={{
                flex: 1,
                marginLeft: 16,
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderRadius: t.radius.md,
                backgroundColor: item.faded ? 'transparent' : t.bg.elevated,
                borderWidth: item.faded ? 0 : 1,
                borderColor: t.line.hairline,
                opacity: item.faded ? 0.75 : 1,
                ...(item.faded ? {} : t.shadow.e1),
              }}
            >
              <Text
                mono
                color={kindColor(t, item.kind)}
                style={{
                  fontSize: 9.5,
                  fontWeight: '600',
                  letterSpacing: 0.95,
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}
              >
                {item.kind}
              </Text>
              <Text variant="bodyMed" color={item.faded ? t.fg.secondary : t.fg.primary}>
                {item.title}
              </Text>
              {item.who ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
                  <Avatar initials={item.initials!} size={20} />
                  <Text variant="caption" color={t.fg.secondary}>
                    {item.who}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
