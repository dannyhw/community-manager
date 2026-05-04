import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Avatar,
  Button,
  Card,
  Icon,
  MotifAtom,
  Row,
  Tag,
  Text,
  mix,
  useTheme,
  useThemeControls,
} from '@/design-system';
import { EVENTS, TALKS } from '@/data/events';

export function EventDetailScreen() {
  const t = useTheme();
  const { motifOn } = useThemeControls();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const event = EVENTS.find((e) => e.id === id) ?? EVENTS[0];

  return (
    <View style={{ flex: 1, backgroundColor: t.bg.canvas }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View
          style={{
            height: 220 + insets.top,
            paddingTop: insets.top,
            backgroundColor: mix(event ? t.accent : t.fg.primary, t.fg.primary, 0.85),
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {motifOn ? (
            <View style={{ position: 'absolute', right: -40, top: insets.top + 10, opacity: 0.3 }}>
              <MotifAtom color="#fff" size={260} strokeWidth={0.8} />
            </View>
          ) : null}
          <View style={{ position: 'absolute', left: 16, right: 16, bottom: 16 }}>
            <Text mono color="#fff" style={{ fontSize: 11, fontWeight: '600', letterSpacing: 0.66, opacity: 0.9 }}>
              {event.n} · {event.dow} · {event.date} · {event.time}
            </Text>
            <Text variant="title1" color="#fff" style={{ marginTop: 6 }}>
              {event.title}
            </Text>
          </View>
        </View>

        <View style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {event.tags.map((tag) => (
              <Tag key={tag}>#{tag}</Tag>
            ))}
          </View>

          <Card padding={0} style={{ marginBottom: 16 }}>
            <Row
              leading={
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: t.radius.md,
                    backgroundColor: t.bg.sunken,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name="pin" size={18} color={t.accent} />
                </View>
              }
              title={event.venue}
              subtitle="Open map · 7 min walk from Casa da Música"
            />
            <Row
              divider={false}
              leading={
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: t.radius.md,
                    backgroundColor: t.bg.sunken,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name="ticket" size={18} color={t.accent} />
                </View>
              }
              title="Free · RSVP required"
              subtitle={`${event.going} going · ${event.capacity - event.going} spots left`}
            />
          </Card>

          <Text
            mono
            color={t.fg.tertiary}
            style={{ fontSize: 11, fontWeight: '600', letterSpacing: 0.88, textTransform: 'uppercase', marginBottom: 8 }}
          >
            Schedule · 3 talks
          </Text>
          <Card padding={0} style={{ marginBottom: 24 }}>
            {TALKS.map((talk, i) => (
              <Row
                key={talk.id}
                divider={i < TALKS.length - 1}
                leading={<Avatar initials={talk.initials} size={36} />}
                title={talk.title}
                subtitle={`${talk.speaker} · ${talk.length}`}
                trailing={<Icon name="chev" size={14} color={t.fg.tertiary} />}
              />
            ))}
          </Card>
        </View>
      </ScrollView>

      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: insets.bottom + 12,
          backgroundColor: t.bg.canvas,
          borderTopColor: t.line.hairline,
          borderTopWidth: 1,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text variant="caption" color={t.fg.tertiary}>
            You're not RSVP'd yet
          </Text>
          <Text variant="bodyMed">Free</Text>
        </View>
        <Button label="Save my spot" size="lg" />
      </View>
    </View>
  );
}
