import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("token");
      setHasToken(!!token);
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
  return (
    <Redirect href={hasToken ? "/(root)/(tabs)/home" : "/(auth)/get-started"} />
  );

  // <Redirect href="/(root)/(tabs)/home" />;
};

export default Home;
