import { OnboardingLayout } from "@/components";
import { goals } from "@/constants";
import { router } from "expo-router";
import type React from "react";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const PatientGoal: React.FC = () => {
  const [selected, setSelected] = useState<string[]>(["lose_weight"]);

  const toggleGoal = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    router.replace("/(onboarding)/patient-gender");
  };

  const handleSkip = () => {
    router.replace("/(root)/(tabs)/home");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <OnboardingLayout
      question="What is your health goal for the app?"
      progress={0.2}
      onSkip={handleSkip}
      onContinue={handleContinue}
      onBack={handleBack}
      disabled={selected.length === 0}
      childrenWrapperClassName="space-y-6 mb-6"
    >
      <View className="w-full space-y-6">
        {goals.map((goal) => {
          const isSelected = selected.includes(goal.id);
          return (
            <TouchableOpacity
              key={goal.id}
              onPress={() => toggleGoal(goal.id)}
              className={`
                flex-row items-center justify-between
                px-5 py-5 rounded-2xl mb-4
                ${isSelected ? "bg-blue-500" : "bg-white"}
                shadow-sm border border-gray-100
              `}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={goal.label}
            >
              <View className="flex-row items-center flex-1">
                {/* Icon */}
                <Image
                  source={goal.icon}
                  className="w-6 h-6 mr-4"
                  resizeMode="contain"
                  style={{ tintColor: isSelected ? "#FFFFFF" : goal.color }}
                />
                <Text
                  className={`text-base font-medium flex-1 ${
                    isSelected ? "text-white" : "text-gray-900"
                  }`}
                >
                  {goal.label}
                </Text>
              </View>

              {/* Checkbox */}
              <View
                className={`w-6 h-6 rounded border-2 items-center justify-center ${
                  isSelected
                    ? "bg-white border-white"
                    : "border-gray-300 bg-transparent"
                }`}
              >
                {isSelected && (
                  <Text className="text-blue-500 text-sm font-bold">✓</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </OnboardingLayout>
  );
};

export default PatientGoal;
