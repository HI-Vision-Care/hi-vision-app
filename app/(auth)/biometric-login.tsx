import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Image, BackHandler } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTranslation } from "@/hooks/useTranslation";
import { CustomButton } from "@components";
import { icons, images } from "@/constants";
import {
  checkBiometricSupport,
  authenticateWithBiometric,
  isBiometricEnabled,
  BiometricType,
} from "@/services/auth/biometric";
import { useSignIn } from "@/services/auth/hooks";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export default function BiometricLogin() {
  const { t } = useTranslation();
  const [biometricInfo, setBiometricInfo] = useState<BiometricType | null>(null);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const { mutateAsync: login, isLoading: isLoginLoading } = useSignIn();

  useEffect(() => {
    initializeAuth();
  }, []);

  // Disable Android hardware back on this screen (prevents going back after sign-out)
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => true;
      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription.remove();
    }, [])
  );

  const initializeAuth = async () => {
    setLoading(true);
    try {
      // Kiểm tra sinh trắc học
      const info = await checkBiometricSupport();
      setBiometricInfo(info);

      // Kiểm tra sinh trắc học đã được bật chưa
      const enabled = await isBiometricEnabled();
      setBiometricEnabled(enabled && info.available);

      // Tự động thử xác thực nếu có sinh trắc học
      if (enabled && info.available) {
        // Đợi một chút để UI render xong rồi mới trigger authentication
        setTimeout(() => {
          handleBiometricAuth();
        }, 300);
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const result = await authenticateWithBiometric(t("auth.biometricLoginReason"));

      if (result.success) {
        // Lấy thông tin đăng nhập đã lưu (ưu tiên SecureStore)
        let savedEmail = await SecureStore.getItemAsync("saved_email");
        let savedPassword = await SecureStore.getItemAsync("saved_password");
        
        if (!savedEmail || !savedPassword) {
          // Fallback to AsyncStorage
          savedEmail = await AsyncStorage.getItem("saved_email");
          savedPassword = await AsyncStorage.getItem("saved_password");
        }

        if (savedEmail && savedPassword) {
          await login({ email: savedEmail, password: savedPassword });
          router.replace("/(root)/(tabs)/home");
        } else {
          // Không có thông tin đăng nhập, chuyển sang màn hình đăng nhập thông thường
          router.replace("/(auth)/sign-in");
        }
      }
      // Nếu user cancel hoặc thất bại, không làm gì cả - họ có thể thử lại hoặc dùng password
    } catch (error: any) {
      console.error("Biometric auth error:", error);
    }
  };

  const handleUsePassword = () => {
    router.replace("/(auth)/sign-in");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#ef4444" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={images.logo}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {biometricInfo?.available && biometricEnabled ? (
          <View style={styles.biometricContainer}>
            <Text style={styles.title}>{t("auth.biometricLogin")}</Text>
            <Text style={styles.subtitle}>
              {t("auth.biometricLoginSubtitleSystemPin", { type: biometricInfo.name })}
            </Text>

            <View style={styles.biometricIcon}>
              <Text style={styles.biometricIconText}>
                {biometricInfo.type === "face" ? "👤" : "👆"}
              </Text>
            </View>

            <Text style={styles.noteText}>
              {t("auth.systemPinFallbackNote")}
            </Text>

            <CustomButton
              title={t("auth.useBiometric", { type: biometricInfo.name })}
              onPress={handleBiometricAuth}
              variant="primary"
              className="mb-4"
            />

            <TouchableOpacity onPress={handleUsePassword}>
              <Text style={styles.switchText}>{t("auth.usePassword")}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.biometricContainer}>
            <Text style={styles.title}>{t("auth.biometricLogin")}</Text>
            <Text style={styles.subtitle}>
              {t("auth.biometricNotSetup")}
            </Text>

            <TouchableOpacity onPress={handleUsePassword} style={styles.passwordButton}>
              <Text style={styles.passwordButtonText}>{t("auth.usePassword")}</Text>
            </TouchableOpacity>
          </View>
        )}

        {isLoginLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#ef4444" />
            <Text style={styles.loadingText}>{t("auth.signingIn")}</Text>
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
    paddingTop: 60,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
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
    marginBottom: 24,
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
    marginBottom: 24,
    paddingHorizontal: 24,
    lineHeight: 20,
  },
  switchText: {
    color: "#ef4444",
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
  },
  passwordButton: {
    marginTop: 24,
    paddingVertical: 12,
  },
  passwordButtonText: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
});
