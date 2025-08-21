import { Stack } from "expo-router";
import React from "react";

const ClinicLayouts = () => {
  return (
    <Stack>
      <Stack.Screen
        name="clinics"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default ClinicLayouts;
