import { Stack } from "expo-router";
import React from "react";

export default function ScheduleStack() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Schedule",
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
