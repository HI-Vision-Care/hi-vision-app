import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
// Biometric login screen removed from flow; keep simple token check

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("token");
      setHasToken(!!token);
      
      // No biometric redirect; sign-in screen now has inline biometric option
      
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

  // Nếu đã đăng nhập nhưng chưa có biometric, vào app luôn
  return <Redirect href="/(root)/(tabs)/home" />;
};

export default Home;
