import { Stack } from "expo-router";

const AppLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="services" options={{ headerShown: false }} />
      <Stack.Screen name="book-service" options={{ headerShown: false }} />
      <Stack.Screen name="forums" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AppLayout;
