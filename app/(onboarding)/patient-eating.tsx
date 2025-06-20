import { OnboardingLayout } from "@/components";
import { useOnboardingNavigation } from "@/hooks/useOnboardingNavigation";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const eatingOptions = [
  {
    key: "balanced",
    label: "Balanced Diet",
    icon: <FontAwesome5 name="apple-alt" size={24} color={"#242e49"} />,
  },
  {
    key: "vegetarian",
    label: "Mostly Vegetarian",
    icon: <MaterialCommunityIcons name="leaf" size={24} color={"#242e49"} />,
  },
  {
    key: "lowcarb",
    label: "Low Carb",
    icon: <Ionicons name="restaurant" size={24} color={"#242e49"} />,
  },
  {
    key: "glutenfree",
    label: "Gluten Free",
    icon: <FontAwesome6 name="bone" size={24} color="black" />,
  },
];

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
        {eatingOptions.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            onPress={() => setSelected(opt.key)}
            className={
              `w-[48%] h-[60%] aspect-square rounded-2xl p-4 mb-4 flex items-start justify-between` +
              (selected === opt.key ? " bg-red-400" : " bg-white")
            }
          >
            <View className="w-8 h-8 items-center justify-center rounded-full">
              {React.cloneElement(opt.icon, {
                color: selected === opt.key ? "#fff" : "#242e49",
              })}
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
        ))}
      </View>
    </OnboardingLayout>
  );
};

export default PatientEating;
