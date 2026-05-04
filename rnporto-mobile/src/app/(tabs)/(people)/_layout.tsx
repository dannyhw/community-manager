import { Stack } from "expo-router";
import React from "react";

export default function PeopleStack() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "People",
          headerLargeTitle: true,
          headerTransparent: true,
          headerBlurEffect: "systemChromeMaterial",
          headerLargeStyle: {
            backgroundColor: "transparent",
          },
        }}
      />
    </Stack>
  );
}
