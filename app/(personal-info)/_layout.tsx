// app/(onboarding)/_layout.tsx
import { Stack } from "expo-router";

export default function SettingLayout() {
  return (
    <Stack>
      <Stack.Screen name="gold" options={{ headerShown: false }} />
      <Stack.Screen name="history" options={{ headerShown: false }} />
      <Stack.Screen name="personalinfo" options={{ headerShown: false }} />
      <Stack.Screen name="preferences" options={{ headerShown: false }} />
      <Stack.Screen name="about" options={{ headerShown: false }} />
      <Stack.Screen name="terms" options={{ headerShown: false }} />
      <Stack.Screen name="privacy" options={{ headerShown: false }} />
      <Stack.Screen name="help" options={{ headerShown: false }} />
      <Stack.Screen name="contact" options={{ headerShown: false }} />
    </Stack>
  );
}
