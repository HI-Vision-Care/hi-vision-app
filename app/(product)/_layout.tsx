import { Stack } from "expo-router";
import React from "react";

const ProductLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="products"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default ProductLayout;
