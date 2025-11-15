import { Stack } from "expo-router";
import React from "react";

const ProductsLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default ProductsLayout;
