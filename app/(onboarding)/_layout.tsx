import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { Stack } from "expo-router";

// app/(onboarding)/_layout.tsx
export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack>
        <Stack.Screen name="patient-goal" options={{ headerShown: false }} />
        <Stack.Screen name="patient-gender" options={{ headerShown: false }} />
        <Stack.Screen name="patient-name" options={{ headerShown: false }} />
        <Stack.Screen name="patient-age" options={{ headerShown: false }} />
        <Stack.Screen
          name="patient-medicalcard"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="patient-blood" options={{ headerShown: false }} />
        <Stack.Screen name="patient-eating" options={{ headerShown: false }} />
        <Stack.Screen
          name="patient-medication"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="patient-symptoms"
          options={{ headerShown: false }}
        />
      </Stack>
    </OnboardingProvider>
  );
}
