import { router } from "expo-router";
import { useRef, useState } from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";

import { icons, onboarding } from "@/constants";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

const Home = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLast = activeIndex === onboarding.length - 1;
  const progress = ((activeIndex + 1) / onboarding.length) * 100;

  return (
    // Chỉ giữ safe-area ở top thôi
    <SafeAreaView edges={["top"]} className="flex-1 bg-white relative">
      {/* === Top row: Progress + Skip === */}
      <View className="flex-row items-center justify-between w-full px-6 pt-5">
        <View className="w-3/4 h-2 bg-[#dce1e8] rounded-full mr-4">
          <View
            className="h-2 bg-[#242e49] rounded-full"
            style={{ width: `${progress}%` }}
          />
        </View>
        <TouchableOpacity
          onPress={() => router.replace("/(auth)/sign-up")}
          className="px-2 py-1"
        >
          <Text className="text-[#242e49] font-JakartaBold">Skip</Text>
        </TouchableOpacity>
      </View>

      {/* === Swiper (overflow-hidden) === */}
      <View className="flex-1 overflow-hidden">
        <Swiper
          ref={swiperRef}
          loop={false}
          showsPagination={false}
          onIndexChanged={setActiveIndex}
        >
          {onboarding.map((item) => (
            // mỗi slide overflow-hidden + relative
            <View key={item.id} className="flex-1 relative overflow-hidden">
              {/* Title + Desc */}
              <View className="px-6 pt-12">
                <Text className="text-gray-900 text-3xl font-bold mb-2">
                  {item.title}
                </Text>
                <Text className="text-gray-500 text-base">
                  {item.description}
                </Text>
              </View>

              {/* Ảnh bự, sát đáy, lấn trái */}
              <Image
                source={item.image}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: -SCREEN_W * 0.1, // lấn 10% về trái
                  width: SCREEN_W * 1.2, // rộng 120% màn hình
                  height: SCREEN_H * 0.7, // cao 70% màn hình
                }}
                resizeMode="contain"
              />
            </View>
          ))}
        </Swiper>
      </View>

      {/* Next / Get Started */}
      <TouchableOpacity
        onPress={() =>
          isLast
            ? router.replace("/(auth)/sign-up")
            : swiperRef.current?.scrollBy(1)
        }
        className="absolute bottom-6 right-6 w-20 h-20 bg-[#242e49] rounded-xl justify-center items-center"
      >
        <Image
          source={icons.arrow}
          className="w-10 h-10"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;
