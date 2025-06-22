import { OnboardingLayout } from "@/components";
import { eatingOptions } from "@/constants";
import { useOnboardingNavigation } from "@/hooks/useOnboardingNavigation";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const PatientEating: React.FC<{ navigation?: any }> = () => {
  const { handleContinue, handleBack, handleSkip, progress } =
    useOnboardingNavigation();
  const [selected, setSelected] = useState<string>("balanced");

  return (
    <OnboardingLayout
      question="What is your usual eating habits?"
      progress={progress}
      onContinue={handleContinue}
      onBack={handleBack}
      onSkip={handleSkip}
      childrenWrapperClassName="flex-1 px-6 pt-6"
    >
      <View className="flex-row flex-wrap justify-between">
        {eatingOptions.map((opt) => {
          const Icon = opt.iconLibrary;
          return (
            <TouchableOpacity
              key={opt.key}
              onPress={() => setSelected(opt.key)}
              className={
                `w-[48%] aspect-square rounded-2xl p-4 mb-4 flex items-start justify-between` +
                (selected === opt.key ? " bg-red-400" : " bg-white")
              }
            >
              <View className="w-8 h-8 items-center justify-center rounded-full">
                <Icon
                  name={opt.iconName}
                  size={opt.iconSize}
                  color={selected === opt.key ? "#fff" : opt.iconColor}
                />
              </View>
              <Text
                className={
                  `mt-auto text-base font-medium` +
                  (selected === opt.key ? " text-white" : " text-gray-700")
                }
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </OnboardingLayout>
  );
};

export default PatientEating;
