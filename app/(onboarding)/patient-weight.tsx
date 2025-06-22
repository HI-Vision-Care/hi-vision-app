import { OnboardingLayout } from "@/components";
import { useOnboardingNavigation } from "@/hooks/useOnboardingNavigation";
import { MaterialIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import type React from "react";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const PatientWeight: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [weight, setWeight] = useState<number>(70);
  const { handleContinue, handleBack, handleSkip, progress } =
    useOnboardingNavigation();

  const adjustWeight = (increment: number) => {
    const newWeight = Math.max(30, Math.min(200, weight + increment));
    setWeight(newWeight);
  };

  return (
    <OnboardingLayout
      question="What's Your Current Weight?"
      progress={progress}
      onContinue={handleContinue}
      onBack={handleBack}
      onSkip={handleSkip}
      disabled={false}
      childrenWrapperClassName="flex-1 px-6 py-8"
    >
      <View className="flex-1 justify-center items-center">
        {/* Icon Container */}
        <View
          className="bg-white rounded-full p-6 shadow-sm mb-8"
          style={{ shadowColor: "#242e49", shadowOpacity: 0.1 }}
        >
          <MaterialIcons name="fitness-center" size={48} color="#0f67fe" />
        </View>

        {/* Weight Display Card */}
        <View
          className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-sm mb-8"
          style={{ shadowColor: "#242e49", shadowOpacity: 1 }}
        >
          <View className="items-center mb-6">
            <Text
              className="text-6xl font-bold mb-2"
              style={{ color: "#0f67fe" }}
            >
              {weight.toFixed(1)}
            </Text>
            <Text className="text-xl font-medium" style={{ color: "#242e49" }}>
              kilograms
            </Text>
          </View>

          {/* Quick Adjustment Buttons */}
          <View className="flex-row justify-center items-center mb-6 space-x-4">
            <TouchableOpacity
              onPress={() => adjustWeight(-1)}
              className="bg-gray-100 rounded-full p-3"
              activeOpacity={0.7}
            >
              <MaterialIcons name="remove" size={24} color="#242e49" />
            </TouchableOpacity>

            <View className="mx-8">
              <Text
                className="text-sm font-medium text-center"
                style={{ color: "#242e49" }}
              >
                Tap to adjust
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => adjustWeight(1)}
              className="rounded-full p-3"
              style={{ backgroundColor: "#0f67fe" }}
              activeOpacity={0.7}
            >
              <MaterialIcons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Slider */}
          <View className="w-full">
            <Slider
              minimumValue={30}
              maximumValue={200}
              step={0.1}
              value={weight}
              onValueChange={setWeight}
              thumbTintColor="#0f67fe"
              minimumTrackTintColor="#0f67fe"
              maximumTrackTintColor="#e2e8f0"
              style={{ height: 40 }}
            />
            <View className="flex-row justify-between mt-2 px-1">
              <Text
                className="text-sm font-medium"
                style={{ color: "#242e49", opacity: 0.6 }}
              >
                30 kg
              </Text>
              <Text
                className="text-sm font-medium"
                style={{ color: "#242e49", opacity: 0.6 }}
              >
                200 kg
              </Text>
            </View>
          </View>
        </View>

        {/* Weight Categories Info */}
        <View
          className="bg-white rounded-2xl p-4 w-full max-w-sm"
          style={{ backgroundColor: "rgba(15, 103, 254, 0.05)" }}
        >
          <View className="flex-row items-center justify-center">
            <MaterialIcons name="info-outline" size={16} color="#0f67fe" />
            <Text
              className="ml-2 text-sm font-medium"
              style={{ color: "#242e49" }}
            >
              Your weight helps us personalize your experience
            </Text>
          </View>
        </View>
      </View>
    </OnboardingLayout>
  );
};

export default PatientWeight;
