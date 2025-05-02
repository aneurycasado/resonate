// src/app/(main)/_layout.tsx
import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Journal",
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="entry/[id]/index"
        options={{
          title: "Entry",
          headerBackTitle: "Journal",
        }}
      />
      <Stack.Screen
        name="settings/index"
        options={{
          title: "Settings",
        }}
      />
    </Stack>
  );
}
