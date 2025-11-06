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

/* ORIGINAL CODE COMMENTED OUT FOR APPLE REVIEW:
import { usePatientProfile } from "@/hooks/usePatientId";
import { useTranslation } from "@/hooks/useTranslation";
import {
  bookConsultationGuest,
  bookConsultationWithAccount,
} from "@/services/consultant/api";
import { ConsultationRequest } from "@/services/consultant/types";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ... rest of the original code ...
*/
