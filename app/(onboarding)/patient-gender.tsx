import { GenderCard, OnboardingLayout } from "@/components";
import { icons, images } from "@/constants";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useOnboardingNavigation } from "@/hooks/useOnboardingNavigation";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// Define genders with enhanced color palette
const genders = [
  {
    id: "male",
    label: "I Am Male",
    bgColor: "bg-blue-600",
    textColor: "text-white",
    illustration: images.maleImage,
    simpleIcon: icons.male,
  },
  {
    id: "female",
    label: "I Am Female",
    bgColor: "bg-rose-500",
    textColor: "text-white",
    illustration: images.femaleImage,
    simpleIcon: icons.female,
  },
  {
    id: "other",
    label: "Other",
    bgColor: "bg-purple-600",
    textColor: "text-white",
    illustration: images.transgenderImage,
    simpleIcon: icons.transgender,
  },
];

// Card width used for snapping and scroll calculations
const CARD_WIDTH = 288;

const GenderSelection: React.FC = () => {
  const [selectedGender, setSelectedGender] = useState<string>("male");
  const { handleContinue, handleBack, handleSkip, progress } =
    useOnboardingNavigation();

  const handleGenderSelect = (genderId: string) => {
    setSelectedGender(genderId);
  };

  // Update selectedGender based on scroll position
  const handleScrollEnd = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
    setSelectedGender(genders[index]?.id);
  };

  const { setData } = useOnboarding();

  const handleContinueAndSave = () => {
    setData({ gender: selectedGender });
    handleContinue();
  };

  return (
    <OnboardingLayout
      question="What is your Gender?"
      progress={progress}
      onBack={handleBack}
      onSkip={handleSkip}
      onContinue={handleContinueAndSave}
      disabled={!selectedGender}
      childrenWrapperClassName="flex-1 justify-start"
    >
      {/* Enhanced subtitle */}
      <View className="px-6 mb-8">
        <Text className="text-gray-600 text-lg leading-7 text-center">
          Please select your gender for a more personalized health experience
        </Text>
        <View className="w-12 h-1 bg-blue-500 rounded-full mx-auto mt-3" />
      </View>

      {/* Gender cards container */}
      <View className="flex-1">
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            alignItems: "center",
          }}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH}
          onMomentumScrollEnd={handleScrollEnd}
        >
          {genders.map((gender) => (
            <GenderCard
              key={gender.id}
              id={gender.id}
              label={gender.label}
              bgColor={gender.bgColor}
              textColor={gender.textColor}
              illustration={gender.illustration}
              simpleIcon={gender.simpleIcon}
              isSelected={selectedGender === gender.id}
              onPress={handleGenderSelect}
            />
          ))}
        </ScrollView>

        {/* Selection indicator dots */}
        <View className="flex-row justify-center items-center mt-6 space-x-2">
          {genders.map((gender) => (
            <View
              key={gender.id}
              className={`w-2 h-2 rounded-full ${
                selectedGender === gender.id ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
          ))}
        </View>
      </View>

      {/* Skip option with enhanced styling */}
      <View className="items-center mt-8 mb-4">
        <TouchableOpacity
          onPress={handleSkip}
          className="py-3 px-6 rounded-full bg-gray-100"
          accessibilityRole="button"
          accessibilityLabel="Prefer to skip this question"
        >
          <Text className="text-gray-600 text-base font-medium">
            Prefer to skip this step →
          </Text>
        </TouchableOpacity>
      </View>
    </OnboardingLayout>
  );
};

export default GenderSelection;
