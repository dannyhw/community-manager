import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Button,
  Card,
  Icon,
  MotifAtom,
  Text,
  useTheme,
  useThemeControls,
  withAlpha,
} from '@/design-system';
import { EVENTS, RnpEvent, TALKS } from '@/data/events';

function HeroHeader() {
  const t = useTheme();
  const { motifOn } = useThemeControls();
  const parts = [
    { n: '03', l: 'days' },
    { n: '14', l: 'hrs' },
    { n: '22', l: 'min' },
  ];
  return (
    <View
      style={{
        position: 'relative',
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 22,
        backgroundColor: t.bg.surface,
        borderBottomColor: t.line.hairline,
        borderBottomWidth: 1,
        overflow: 'hidden',
      }}
    >
      {motifOn ? (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <View style={{ position: 'absolute', right: -30, top: -20 }}>
            <MotifAtom color={t.accent} size={200} strokeWidth={0.75} opacity={t.mode === 'dark' ? 0.18 : 0.14} />
          </View>
          <View style={{ position: 'absolute', left: -40, bottom: -40 }}>
            <MotifAtom color={t.accent} size={140} strokeWidth={0.75} opacity={t.mode === 'dark' ? 0.12 : 0.1} />
          </View>
        </View>
      ) : null}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <MotifAtom color={t.fg.primary} size={20} strokeWidth={1.4} />
          <Text variant="callout" style={{ fontWeight: '600' }}>
            React Native Porto
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {(['search', 'bell'] as const).map((name) => (
            <View
              key={name}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: t.bg.elevated,
                borderWidth: 1,
                borderColor: t.line.divider,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name={name} size={15} color={t.fg.primary} />
              {name === 'bell' ? (
                <View
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    width: 7,
                    height: 7,
                    borderRadius: 4,
                    backgroundColor: t.accent,
                    borderWidth: 1.5,
                    borderColor: t.bg.elevated,
                  }}
                />
              ) : null}
            </View>
          ))}
        </View>
      </View>

      <Text variant="display" style={{ letterSpacing: -0.72 }}>
        Olá, devs{'\n'}do Porto.
      </Text>

      <View
        style={{
          marginTop: 16,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 14,
          paddingVertical: 12,
          borderRadius: t.radius.md,
          backgroundColor: t.bg.elevated,
          borderWidth: 1,
          borderColor: t.line.hairline,
          gap: 14,
        }}
      >
        <Text
          mono
          color={t.accent}
          style={{ fontSize: 9.5, fontWeight: '600', letterSpacing: 1.3, textTransform: 'uppercase' }}
        >
          T-MINUS
        </Text>
        <View style={{ width: 1, alignSelf: 'stretch', backgroundColor: t.line.divider }} />
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
          {parts.map((p, i) => (
            <React.Fragment key={p.l}>
              {i > 0 ? (
                <Text mono color={t.fg.tertiary} style={{ fontSize: 22, fontWeight: '300', alignSelf: 'center' }}>
                  :
                </Text>
              ) : null}
              <View style={{ alignItems: 'center' }}>
                <Text mono style={{ fontSize: 26, fontWeight: '600', letterSpacing: -0.52, lineHeight: 28 }}>
                  {p.n}
                </Text>
                <Text mono color={t.fg.tertiary} style={{ fontSize: 9, fontWeight: '600', letterSpacing: 0.9, textTransform: 'uppercase', marginTop: 5 }}>
                  {p.l}
                </Text>
              </View>
            </React.Fragment>
          ))}
        </View>
      </View>
    </View>
  );
}

function FeaturedEvent({ event, onPress }: { event: RnpEvent; onPress: () => void }) {
  const t = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: t.radius.lg,
        backgroundColor: t.bg.elevated,
        borderWidth: 1,
        borderColor: t.line.hairline,
        overflow: 'hidden',
        ...t.shadow.e2,
      }}
    >
      <View
        style={{
          paddingHorizontal: 14,
          paddingTop: 12,
          paddingBottom: 16,
          backgroundColor: t.accent,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            right: -10,
            top: -6,
            width: 130,
            height: 130,
            opacity: 0.95,
          }}
        >
          <View style={{ ...StyleSheet.absoluteFillObject, opacity: 0.28 }}>
            <MotifAtom color={t.accentInk} size={130} strokeWidth={1} />
          </View>
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              mono
              color={t.accentInk}
              style={{ fontSize: 56, fontWeight: '700', letterSpacing: -2.24, lineHeight: 56, opacity: 0.45 }}
            >
              {event.n.replace('#', '')}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <View
            style={{
              borderColor: t.accentInk,
              borderWidth: 1,
              borderRadius: 999,
              paddingHorizontal: 7,
              paddingVertical: 2,
            }}
          >
            <Text
              mono
              color={t.accentInk}
              style={{ fontSize: 9.5, fontWeight: '600', letterSpacing: 0.95, opacity: 0.9 }}
            >
              {event.n} · NEXT UP
            </Text>
          </View>
          <Text mono color={t.accentInk} style={{ fontSize: 9.5, fontWeight: '600', letterSpacing: 0.57, opacity: 0.85 }}>
            {event.dow} {event.date.toUpperCase()}
          </Text>
        </View>

        <Text variant="title3" color={t.accentInk} style={{ marginTop: 4, maxWidth: '70%' }}>
          {event.title}
        </Text>
      </View>

      <View style={{ paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text variant="bodyMed" numberOfLines={1}>
            {event.going} of {event.capacity} going
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 }}>
            <Icon name="pin" size={12} color={t.fg.secondary} />
            <Text variant="caption" color={t.fg.secondary} numberOfLines={1}>
              {event.venue}
            </Text>
          </View>
        </View>
        <Button label="RSVP" size="sm" onPress={onPress} />
      </View>
    </Pressable>
  );
}

export function HomeScreen() {
  const t = useTheme();
  const { motifOn } = useThemeControls();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const next = EVENTS.find((e) => !e.past)!;
  const past = EVENTS.filter((e) => e.past);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.bg.canvas }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      <HeroHeader />
      <FeaturedEvent event={next} onPress={() => router.push(`/event/${next.id}`)} />

      <View style={{ marginHorizontal: 16, marginTop: 12 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <Text mono color={t.fg.tertiary} style={{ fontSize: 10.5, fontWeight: '600', letterSpacing: 0.84, textTransform: 'uppercase' }}>
            Lineup
          </Text>
          <Text variant="caption" color={t.accent} style={{ fontWeight: '500' }}>
            See schedule →
          </Text>
        </View>
        <View
          style={{
            borderRadius: t.radius.lg,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: t.line.hairline,
            backgroundColor: t.bg.elevated,
          }}
        >
          {TALKS.slice(0, 3).map((talk, i) => (
            <View
              key={talk.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 14,
                paddingVertical: 11,
                gap: 12,
                borderBottomWidth: i < 2 ? 1 : 0,
                borderBottomColor: t.line.hairline,
              }}
            >
              <Text mono color={t.accent} style={{ width: 38, fontSize: 11, fontWeight: '600' }}>
                {talk.time}
              </Text>
              <View style={{ flex: 1 }}>
                <Text variant="callout" numberOfLines={1}>
                  {talk.title}
                </Text>
                <Text variant="caption" color={t.fg.tertiary} style={{ marginTop: 2 }}>
                  {talk.speaker} · {talk.length}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={{ marginTop: 22 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            marginBottom: 10,
          }}
        >
          <View>
            <Text mono color={t.fg.tertiary} style={{ fontSize: 10.5, fontWeight: '600', letterSpacing: 0.84, textTransform: 'uppercase' }}>
              Archive · 2026
            </Text>
            <Text variant="title3" style={{ marginTop: 2 }}>
              Past editions
            </Text>
          </View>
          <Text variant="caption" color={t.accent} style={{ fontWeight: '500' }}>
            All →
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
        >
          {past.map((e) => (
            <View
              key={e.id}
              style={{
                width: 168,
                borderRadius: t.radius.lg,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: t.line.hairline,
                backgroundColor: t.bg.elevated,
              }}
            >
              <View
                style={{
                  height: 70,
                  paddingHorizontal: 12,
                  paddingTop: 10,
                  backgroundColor: t.bg.sunken,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <Text
                  mono
                  style={{
                    position: 'absolute',
                    right: -6,
                    bottom: -22,
                    fontSize: 78,
                    fontWeight: '700',
                    color: withAlpha(t.fg.primary, 0.06),
                    letterSpacing: -3.12,
                    lineHeight: 78,
                  }}
                >
                  {e.n.replace('#', '')}
                </Text>
                <Text mono color={t.accent} style={{ fontSize: 10, fontWeight: '600', letterSpacing: 0.6 }}>
                  {e.n}
                </Text>
                <Text mono color={t.fg.tertiary} style={{ fontSize: 10, marginTop: 2 }}>
                  {e.dow} · {e.date}
                </Text>
              </View>
              <View style={{ paddingHorizontal: 12, paddingVertical: 12 }}>
                <Text variant="callout" style={{ minHeight: 36 }}>
                  {e.title}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 8,
                  }}
                >
                  <Text variant="caption" color={t.fg.tertiary}>
                    {e.going} attended
                  </Text>
                  <Icon name="chev" size={12} color={t.fg.tertiary} />
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
        <Card padding={0}>
          <View style={{ position: 'relative', overflow: 'hidden', padding: 18, borderRadius: t.radius.lg }}>
            {motifOn ? (
              <View style={{ position: 'absolute', right: -30, top: -30, opacity: 0.18 }}>
                <MotifAtom color={t.accent} size={140} strokeWidth={0.9} />
              </View>
            ) : null}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: t.success,
                }}
              />
              <Text mono color={t.fg.tertiary} style={{ fontSize: 10.5, fontWeight: '600', letterSpacing: 0.84, textTransform: 'uppercase' }}>
                CFP open · closes 24 Apr
              </Text>
            </View>
            <Text variant="title2" style={{ marginBottom: 6 }}>
              Got a talk in you?
            </Text>
            <Text variant="body" color={t.fg.secondary} style={{ marginBottom: 14, maxWidth: 280 }}>
              We pick 2–3 talks per event. 8, 20, or 25 minutes. Beginners very welcome.
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Button
                label="Submit a talk"
                icon={<Icon name="mic" size={16} color={t.accentInk} />}
              />
              <Button label="Past talks" variant="ghost" />
            </View>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}
