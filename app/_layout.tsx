// app/_layout.tsx

import "@/app/global.css";
import React from "react";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
// Import Provider từ src/context
import { HealthBackgroundProvider } from "@/context/HealthBackgroundContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="light">
      {/* ← Bọc Provider quanh Stack để tất cả màn đều có Context */}
      <HealthBackgroundProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(patient-background)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(root)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </HealthBackgroundProvider>
    </GluestackUIProvider>
  );
}
