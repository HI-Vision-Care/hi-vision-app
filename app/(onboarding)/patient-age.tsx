"use client";
import { OnboardingLayout } from "@/components";
import { useOnboardingNavigation } from "@/hooks/useOnboardingNavigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Text,
  View,
} from "react-native";

const { height: windowHeight } = Dimensions.get("window");
const ITEM_HEIGHT = 80;

const PatientAge: React.FC<{ navigation: any }> = ({ navigation }) => {
  const minAge = 1;
  const maxAge = 120;
  const ages = Array.from(
    { length: maxAge - minAge + 1 },
    (_, i) => minAge + i
  );

  const [age, setAge] = useState<number>(19);
  const listRef = useRef<FlatList<number>>(null);
  const isScrolling = useRef(false);
  const { handleContinue, handleBack, handleSkip, progress } =
    useOnboardingNavigation();

  // Scroll to initial age on mount
  useEffect(() => {
    const index = ages.indexOf(age);
    if (listRef.current && index >= 0) {
      setTimeout(() => {
        listRef.current?.scrollToOffset({
          offset: index * ITEM_HEIGHT,
          animated: false,
        });
      }, 100);
    }
  }, []);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!isScrolling.current) return;
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const selected = ages[Math.min(Math.max(index, 0), ages.length - 1)];
    if (selected !== age) {
      setAge(selected);
    }
  };

  const onScrollBeginDrag = () => {
    isScrolling.current = true;
  };

  const onScrollEndDrag = () => {
    isScrolling.current = false;
  };

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const selected = ages[Math.min(Math.max(index, 0), ages.length - 1)];
    setAge(selected);
    isScrolling.current = false;
  };

  const renderItem = ({ item, index }: { item: number; index: number }) => {
    const isSelected = item === age;
    const distance = Math.abs(ages.indexOf(age) - index);
    let opacity = 1;
    let fontSize = 24;
    if (distance === 1) {
      opacity = 0.6;
      fontSize = 32;
    } else if (distance === 2) {
      opacity = 0.3;
      fontSize = 24;
    } else if (distance > 2) {
      opacity = 0.2;
      fontSize = 20;
    }
    if (isSelected) {
      opacity = 1;
      fontSize = 48;
    }
    return (
      <View
        style={{
          height: ITEM_HEIGHT,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isSelected ? (
          <View
            className="rounded-2xl px-6 py-4 shadow-lg"
            style={{
              backgroundColor: "#0f67fe",
              shadowColor: "#0f67fe",
              shadowOpacity: 0.3,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              minWidth: 80,
              minHeight: 64,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              className="font-bold text-white text-center"
              style={{ fontSize: 48, lineHeight: 56 }}
            >
              {item}
            </Text>
          </View>
        ) : (
          <Text
            className="font-semibold text-center"
            style={{
              fontSize,
              lineHeight: fontSize * 1.2,
              color: "#242e49",
              opacity,
            }}
          >
            {item}
          </Text>
        )}
      </View>
    );
  };

  return (
    <OnboardingLayout
      question="What is your age?"
      progress={progress}
      onContinue={handleContinue}
      onBack={handleBack}
      onSkip={handleSkip}
      disabled={false}
      childrenWrapperClassName="flex-1"
    >
      <FlatList
        ref={listRef}
        data={ages}
        keyExtractor={(item) => item.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        snapToAlignment="center"
        decelerationRate="fast"
        onScroll={onScroll}
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: windowHeight / 2 - ITEM_HEIGHT / 2 - 100,
          paddingBottom: windowHeight / 2 - ITEM_HEIGHT / 2 - 100,
        }}
        style={{ flex: 1 }}
      />
    </OnboardingLayout>
  );
};

export default PatientAge;
