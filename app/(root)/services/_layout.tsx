// services/_layout.tsx
import { Stack } from "expo-router";

export default function ServicesLayout() {
  return (
    <Stack>
      {/* Với màn hình [id].tsx */}
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false, // <-- tắt header
        }}
      />
    </Stack>
  );
}
