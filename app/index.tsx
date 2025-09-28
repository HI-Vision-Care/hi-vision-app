import { Redirect } from "expo-router";


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
    // <Redirect href="/+not-found" />
  );
};

export default Home;
