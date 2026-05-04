import { Stack } from "expo-router";
import React from "react";

export default function TicketStack() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Ticket",
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
