import { Stack } from "expo-router";

export default function ConsultantLayout() {
  return (
    <Stack>
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
