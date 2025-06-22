import { OnboardingLayout } from "@/components";
import { useOnboardingNavigation } from "@/hooks/useOnboardingNavigation";
import type React from "react";
import { useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

const BLOOD_TYPES = ["A", "B", "AB", "O"];
const { width: screenWidth } = Dimensions.get("window");

const PatientBlood: React.FC = () => {
  const { handleContinue, handleBack, handleSkip, progress } =
    useOnboardingNavigation();
  const [type, setType] = useState<string>("A");
  const [rhesus, setRhesus] = useState<"+" | "-">("+");

  return (
    <OnboardingLayout
      question="What's your official blood type?"
      progress={progress}
      onContinue={handleContinue}
      onBack={handleBack}
      onSkip={handleSkip}
      childrenWrapperClassName="flex-1 px-6 items-center justify-center"
    >
      <View className="w-full max-w-sm">
        {/* Blood Type Selection Tabs - Enhanced Size */}
        <View
          className="flex-row bg-white rounded-2xl overflow-hidden shadow-lg mb-12"
          style={{
            shadowColor: "#242e49",
            shadowOpacity: 0.1,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          {BLOOD_TYPES.map((bloodType) => (
            <TouchableOpacity
              key={bloodType}
              onPress={() => setType(bloodType)}
              className="flex-1 items-center py-6 px-4"
              style={{
                backgroundColor: type === bloodType ? "#242e49" : "white",
              }}
              activeOpacity={0.7}
            >
              <Text
                className="font-bold text-2xl"
                style={{
                  color: type === bloodType ? "white" : "#242e49",
                }}
              >
                {bloodType}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Blood Type Display - Significantly Enhanced Size */}
        <View className="items-center mb-12">
          <View
            className="bg-white rounded-3xl px-12 py-10 shadow-lg"
            style={{
              shadowColor: "#0f67fe",
              shadowOpacity: 0.15,
              shadowRadius: 15,
              shadowOffset: { width: 0, height: 6 },
              minWidth: screenWidth * 0.7,
            }}
          >
            <View className="items-center">
              <View className="flex-row items-baseline justify-center">
                <Text
                  className="font-bold"
                  style={{
                    fontSize: 120,
                    lineHeight: 130,
                    color: "#242e49",
                  }}
                >
                  {type}
                </Text>
                <Text
                  className="font-bold ml-2"
                  style={{
                    fontSize: 80,
                    lineHeight: 90,
                    color: "#fa4d5e",
                  }}
                >
                  {rhesus}
                </Text>
              </View>
              <Text
                className="text-lg font-medium mt-4"
                style={{ color: "#242e49", opacity: 0.7 }}
              >
                Blood Type
              </Text>
            </View>
          </View>
        </View>

        {/* Rh Factor Selection - Enhanced Size */}
        <View className="items-center mb-8">
          <Text
            className="text-lg font-semibold mb-6"
            style={{ color: "#242e49" }}
          >
            Rh Factor
          </Text>
          <View className="flex-row space-x-6 gap-3">
            {["+", "-"].map((sign) => (
              <TouchableOpacity
                key={sign}
                onPress={() => setRhesus(sign as "+" | "-")}
                className="rounded-2xl shadow-lg items-center justify-center "
                style={{
                  width: 150,
                  height: 70,
                  backgroundColor: rhesus === sign ? "#0f67fe" : "white",
                  shadowColor: rhesus === sign ? "#0f67fe" : "#242e49",
                  shadowOpacity: rhesus === sign ? 0.3 : 0.1,
                  shadowRadius: rhesus === sign ? 12 : 8,
                  shadowOffset: { width: 0, height: rhesus === sign ? 6 : 4 },
                }}
                activeOpacity={0.7}
              >
                <Text
                  className="font-bold"
                  style={{
                    fontSize: 36,
                    color: rhesus === sign ? "white" : "#242e49",
                  }}
                >
                  {sign}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </OnboardingLayout>
  );
};

export default PatientBlood;
