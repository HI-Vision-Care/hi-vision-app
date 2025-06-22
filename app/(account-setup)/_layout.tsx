import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="otp-setup" options={{ headerShown: false }} />
      <Stack.Screen name="otp-security" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
