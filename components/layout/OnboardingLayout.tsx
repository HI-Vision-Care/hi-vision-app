import { icons } from "@/constants";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  type ImageSourcePropType,
} from "react-native";
import { CustomButton } from "../common";

interface OnboardingLayoutProps {
  title?: string;
  question: string;
  progress: number;
  onContinue: () => void;
  onSkip?: () => void;
  onBack?: () => void;
  disabled?: boolean;
  className?: string;
  childrenWrapperClassName?: string;
  backIcon?: ImageSourcePropType;
  children: React.ReactNode;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  title,
  question,
  progress,
  onContinue,
  onSkip,
  onBack,
  disabled = false,
  className = "",
  childrenWrapperClassName = "",
  backIcon,
  children,
}) => {
  return (
    <SafeAreaView className={`flex-1 bg-gray-50 ${className}`.trim()}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4">
        {/* Back Button */}
        <TouchableOpacity
          onPress={onBack}
          className="w-12 h-12 bg-white rounded-xl items-center justify-center shadow-sm border border-gray-100"
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text className="text-gray-700 text-lg font-medium">←</Text>
        </TouchableOpacity>

        {/* Progress Bar */}
        <View className="flex-1 mx-6">
          <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-gray-800 rounded-full"
              style={{
                width: `${Math.max(0, Math.min(100, progress * 100))}%`,
              }}
            />
          </View>
        </View>

        {/* Skip Button */}
        {onSkip ? (
          <TouchableOpacity
            onPress={onSkip}
            accessibilityRole="button"
            accessibilityLabel="Skip this step"
          >
            <Text className="text-gray-600 text-base font-medium">Skip</Text>
          </TouchableOpacity>
        ) : (
          <View className="w-8" />
        )}
      </View>

      {/* Content */}
      <View className="flex-1 px-5">
        {/* Question */}
        <Text className="text-2xl font-bold text-gray-900 leading-8 mb-8 mt-4">
          {question}
        </Text>

        {/* Children Container */}
        <View className={`flex-1 ${childrenWrapperClassName}`.trim()}>
          {children}
        </View>
      </View>

      {/* Footer */}
      <View className="px-5 pb-8 pt-4">
        <CustomButton
          title="Continue"
          onPress={onContinue}
          disabled={disabled}
          className="w-full"
          rightIcon={
            <Image
              source={icons.arrow}
              className="w-6 h-6"
              resizeMode="contain"
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default OnboardingLayout;
