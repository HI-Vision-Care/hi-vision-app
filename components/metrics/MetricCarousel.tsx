// MetricCarousel.tsx
import React from "react";
import { ScrollView, Text, View } from "react-native";
import MetricCard from "./MetricCard"; // hoặc "@/components/MetricCard" tuỳ path của bạn

const MetricCarousel = () => {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-6 py-2"
        contentContainerClassName="pl-1"
        decelerationRate="fast"
        snapToInterval={160} // width(160) + margin-right(16)
      >
        {/* Heart Rate */}
        <MetricCard
          color="blue"
          title="Heart Rate"
          icon="heart"
          value="78.2"
          unit="BPM"
        >
          <View className="flex-row items-end space-x-1.5">
            <View className="w-2.5 h-8 bg-white/30 rounded-full" />
            <View className="w-2.5 h-12 bg-white rounded-full" />
            <View className="w-2.5 h-6 bg-white/50 rounded-full" />
            <View className="w-2.5 h-10 bg-white/70 rounded-full" />
            <View className="w-2.5 h-8 bg-white/40 rounded-full" />
          </View>
        </MetricCard>

        {/* Blood Pressure */}
        <MetricCard
          color="red"
          title="Blood Pressure"
          icon="pulse"
          value="120"
          unit="mmHg"
        >
          <View className="items-center">
            <View className="bg-white/20 rounded-lg px-4 py-1.5 mb-1">
              <Text className="text-white text-xs font-bold tracking-wide">
                NORMAL
              </Text>
            </View>
            <View className="w-16 h-1 bg-white/30 rounded-full mt-2">
              <View className="w-8 h-1 bg-white rounded-full" />
            </View>
          </View>
        </MetricCard>

        {/* Sleep (giờ sẽ ra màu cyan như Figma) */}
        <MetricCard
          color="teal"
          title="Sleep"
          icon="moon"
          value="87"
          unit="hrs"
        >
          <View className="flex-row items-end space-x-1.5">
            <View className="w-2.5 h-6 bg-white/40 rounded-full" />
            <View className="w-2.5 h-10 bg-white/60 rounded-full" />
            <View className="w-2.5 h-8 bg-white rounded-full" />
            <View className="w-2.5 h-12 bg-white/80 rounded-full" />
            <View className="w-2.5 h-7 bg-white/50 rounded-full" />
          </View>
        </MetricCard>

        {/* Oxygen Level */}
        <MetricCard
          color="emerald"
          title="Oxygen Level"
          icon="fitness"
          value="98"
          unit="%"
        >
          <View className="w-16 h-16 rounded-full border-4 border-white/30 items-center justify-center">
            <View className="w-12 h-12 rounded-full border-4 border-white items-center justify-center">
              <View className="w-2 h-2 bg-white rounded-full" />
            </View>
          </View>
        </MetricCard>
      </ScrollView>
    </View>
  );
};

export default MetricCarousel;
