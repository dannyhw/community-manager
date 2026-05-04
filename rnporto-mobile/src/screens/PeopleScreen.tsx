import { Stack, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Avatar, Badge, Row, Text, useTheme } from '@/design-system';
import { PEOPLE } from '@/data/events';

export function PeopleScreen() {
  const t = useTheme();
  const navigation = useNavigation();
  const [query, setQuery] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: 'Search by name or company',
        hideWhenScrolling: false,
        onChangeText: (e: { nativeEvent: { text: string } }) =>
          setQuery(e.nativeEvent.text),
        onCancelButtonPress: () => setQuery(''),
      },
    });
  }, [navigation]);

  const filtered = PEOPLE.filter((p) =>
    `${p.n} ${p.r}`.toLowerCase().includes(query.toLowerCase())
  );
  const speakers = PEOPLE.filter((p) => p.b === 'Speaker').length;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.bg.canvas }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Stack.Screen options={{ title: 'People' }} />
      <View style={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 12 }}>
        <Text variant="caption" color={t.fg.secondary}>
          {PEOPLE.length} going · {speakers} speakers
        </Text>
      </View>

      <View
        style={{
          marginHorizontal: 16,
          borderRadius: t.radius.lg,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: t.line.hairline,
          backgroundColor: t.bg.elevated,
        }}
      >
        {filtered.map((p, i) => (
          <Row
            key={p.i}
            divider={i < filtered.length - 1}
            leading={<Avatar initials={p.i} />}
            title={p.n}
            subtitle={p.r}
            trailing={
              p.b ? (
                <Badge tone={p.b === 'Speaker' ? 'accent' : 'warn'}>{p.b}</Badge>
              ) : null
            }
          />
        ))}
      </View>
    </ScrollView>
  );
}
