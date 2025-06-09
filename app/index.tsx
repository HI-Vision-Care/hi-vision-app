import { Redirect } from "expo-router";

const Home = () => {
  return <Redirect href="/(auth)/get-started" />;

  // <Redirect href="/(root)/(tabs)/home" />;
};

export default Home;
