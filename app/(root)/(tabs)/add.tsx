import { Redirect } from "expo-router";

const DISABLED_REDIRECT = "/(root)/(tabs)/home";

export default function ConsultationForm() {
  return <Redirect href={DISABLED_REDIRECT} />;
}

/*
// COMMENTED OUT FOR APPLE REVIEW - Health Consultation removed
// All medical consultation features have been commented out

import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConsultationForm() {
  // Empty placeholder for Apple review
  return (
    <SafeAreaView
      edges={["top", "left", "right", "bottom"]}
      style={{ flex: 1, backgroundColor: "#FAFBFC" }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}
      >
        <Text style={{ textAlign: "center", color: "#6B7280", fontSize: 16 }}>
          This feature is temporarily unavailable.
        </Text>
      </View>
    </SafeAreaView>
  );
}

// ORIGINAL CODE COMMENTED OUT FOR APPLE REVIEW:
// ...
*/
