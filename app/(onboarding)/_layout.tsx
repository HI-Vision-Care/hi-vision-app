// app/(onboarding)/_layout.tsx
import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen name="patient-age" options={{ headerShown: false }} />
      <Stack.Screen name="patient-gender" options={{ headerShown: false }} />
      <Stack.Screen name="patient-goal" options={{ headerShown: false }} />
      <Stack.Screen name="patient-weight" options={{ headerShown: false }} />
      <Stack.Screen name="patient-blood" options={{ headerShown: false }} />
    </Stack>
  );
}
