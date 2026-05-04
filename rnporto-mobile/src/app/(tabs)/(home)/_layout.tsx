import { Stack } from 'expo-router';
import React from 'react';

export default function HomeStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="event/[id]"
        options={{
          title: '',
          headerTransparent: true,
          headerBackButtonDisplayMode: 'minimal',
          headerTintColor: '#fff',
        }}
      />
    </Stack>
  );
}
