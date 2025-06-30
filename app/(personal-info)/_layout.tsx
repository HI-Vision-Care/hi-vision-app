// app/(onboarding)/_layout.tsx
import { Stack } from "expo-router";

export default function SettingLayout() {
  return (
    <Stack>
      <Stack.Screen name="gold" options={{ headerShown: false }} />
      <Stack.Screen name="history" options={{ headerShown: false }} />
      <Stack.Screen name="personalinfo" options={{ headerShown: false }} />
    </Stack>
  );
}
