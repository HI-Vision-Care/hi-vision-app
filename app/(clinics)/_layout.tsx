import { Stack } from "expo-router";
import React from "react";

const ClinicsLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="clinics"
        options={{
          title: "AI Chat",
        }}
      />
    </Stack>
  );
};

export default ClinicsLayout;
