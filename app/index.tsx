import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { isBiometricEnabled, checkBiometricSupport } from "@/services/auth/biometric";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);
  const [hasBiometricSetup, setHasBiometricSetup] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("token");
      setHasToken(!!token);
      
      if (token) {
        // Kiểm tra xem đã thiết lập biometric chưa
        const enabled = await isBiometricEnabled();
        const biometricInfo = await checkBiometricSupport();
        setHasBiometricSetup(enabled && biometricInfo.available);
      }
      
      setLoading(false);
    })();
  }, []);

  if (loading) {
    // Bạn có thể thay ActivityIndicator bằng splash screen custom
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!hasToken) {
    return <Redirect href="/(auth)/get-started" />;
  }

  // Nếu đã đăng nhập và có biometric, chuyển đến màn hình đăng nhập sinh trắc học
  if (hasToken && hasBiometricSetup) {
    return <Redirect href="/(auth)/biometric-login" />;
  }

  // Nếu đã đăng nhập nhưng chưa có biometric, vào app luôn
  return <Redirect href="/(root)/(tabs)/home" />;
};

export default Home;
