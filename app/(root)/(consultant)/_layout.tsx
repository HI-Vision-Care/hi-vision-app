// services/_layout.tsx
import { Stack } from "expo-router";

export default function ConsultantLayout() {
  return (
    <Stack>
      {/* Với màn hình [id].tsx */}
      <Stack.Screen
        name="chatbox"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="meetingchat"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
