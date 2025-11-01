import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTranslation } from "@/hooks/useTranslation";
import {
  checkBiometricSupport,
  authenticateWithBiometric,
  setBiometricEnabled,
  BiometricType,
} from "@/services/auth/biometric";
import { CustomButton } from "@components";

export default function BiometricSetup() {
  const { t } = useTranslation();
  const [step, setStep] = useState<"biometric" | "done">("biometric");
  const [biometricInfo, setBiometricInfo] = useState<BiometricType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkBiometric();
  }, []);

  const checkBiometric = async () => {
    const info = await checkBiometricSupport();
    setBiometricInfo(info);
    
    // Nếu không có hỗ trợ sinh trắc học, bỏ qua setup
    if (!info.available) {
      await setBiometricEnabled(false);
      setStep("done");
      setTimeout(() => {
        router.replace("/(root)/(tabs)/home");
      }, 1500);
    }
  };

  const handleSkipBiometric = async () => {
    await setBiometricEnabled(false);
    setStep("done");
    setTimeout(() => {
      router.replace("/(root)/(tabs)/home");
    }, 1500);
  };

  const handleEnableBiometric = async () => {
    setLoading(true);
    try {
      const result = await authenticateWithBiometric(
        t("auth.enableBiometricReason")
      );

      if (result.success) {
        await setBiometricEnabled(true);
        Alert.alert(
          t("common.success"),
          t("auth.biometricEnabled"),
          [
            {
              text: t("common.confirm"),
              onPress: () => {
                setStep("done");
                setTimeout(() => {
                  router.replace("/(root)/(tabs)/home");
                }, 1500);
              },
            },
          ]
        );
      } else {
        // Nếu user cancel hoặc thất bại, vẫn cho phép skip
        if (result.error === "Đã hủy xác thực") {
          // User đã cancel, không làm gì cả
        } else {
          Alert.alert(t("common.error"), result.error || t("auth.biometricSetupError"));
        }
      }
    } catch (error: any) {
      Alert.alert(t("common.error"), error.message || t("auth.biometricSetupError"));
    } finally {
      setLoading(false);
    }
  };

  if (step === "done") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.successText}>✓</Text>
          <Text style={styles.successMessage}>{t("auth.setupComplete")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <View style={styles.biometricContainer}>
          <Text style={styles.title}>{t("auth.enableBiometric")}</Text>
          <Text style={styles.subtitle}>
            {biometricInfo?.available
              ? t("auth.enableBiometricSubtitleSystemPin", { type: biometricInfo.name })
              : t("auth.biometricNotAvailable")}
          </Text>

          {biometricInfo?.available && (
            <>
              <View style={styles.biometricIcon}>
                <Text style={styles.biometricIconText}>
                  {biometricInfo.type === "face" ? "👤" : "👆"}
                </Text>
              </View>

              <Text style={styles.noteText}>
                {t("auth.systemPinNote")}
              </Text>
            </>
          )}

          <View style={styles.buttonContainer}>
            {biometricInfo?.available && (
              <CustomButton
                title={t("auth.enableBiometricButton", { type: biometricInfo.name })}
                onPress={handleEnableBiometric}
                variant="primary"
                isLoading={loading}
                className="mb-4"
              />
            )}

            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkipBiometric}
              disabled={loading}
            >
              <Text style={styles.skipButtonText}>{t("common.skip")}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#ef4444" />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 24,
  },
  biometricContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  biometricIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 32,
  },
  biometricIconText: {
    fontSize: 60,
  },
  noteText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 24,
    lineHeight: 20,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 24,
  },
  skipButton: {
    paddingVertical: 16,
    alignItems: "center",
  },
  skipButtonText: {
    color: "#666",
    fontSize: 16,
  },
  successText: {
    fontSize: 80,
    color: "#10b981",
    marginBottom: 20,
  },
  successMessage: {
    fontSize: 20,
    color: "#1a1a1a",
    textAlign: "center",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
});

