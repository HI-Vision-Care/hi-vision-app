/* GenderCard.tsx */
import { Image, Text, TouchableOpacity, View } from "react-native";

interface GenderCardProps {
  id: string;
  label: string;
  bgColor: string;
  textColor: string;
  illustration: any; // image source
  simpleIcon?: any; // icon source for header
  isSelected: boolean;
  onPress: (id: string) => void;
}

const GenderCard: React.FC<GenderCardProps> = ({
  id,
  label,
  bgColor,
  textColor,
  illustration,
  simpleIcon,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(id)}
      className={`relative rounded-2xl overflow-hidden w-72 h-96 mx-2 ${
        isSelected ? "shadow-xl" : "shadow-md"
      }`}
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: isSelected ? 8 : 4,
        },
        shadowOpacity: isSelected ? 0.25 : 0.15,
        shadowRadius: isSelected ? 12 : 6,
        elevation: isSelected ? 12 : 6,
      }}
      accessibilityRole="radio"
      accessibilityState={{ checked: isSelected }}
      accessibilityLabel={label}
      accessibilityHint={`Select ${label} as your gender`}
    >
      {/* Background gradient overlay */}
      <View className={`absolute inset-0 ${bgColor}`} />

      {/* Selection border */}
      {isSelected && (
        <View className="absolute inset-0 border-4 border-white rounded-2xl" />
      )}

      {/* Content container */}
      <View className="flex-1 p-6">
        {/* Header section */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center flex-1">
            {simpleIcon && (
              <View className="w-8 h-8 mr-3 items-center justify-center">
                <Image
                  source={simpleIcon}
                  className="w-6 h-6"
                  resizeMode="contain"
                  style={{ tintColor: "#FFFFFF" }}
                />
              </View>
            )}
            <Text
              className={`text-xl font-bold ${textColor} flex-1`}
              numberOfLines={2}
            >
              {label}
            </Text>
          </View>

          {/* Selection indicator */}
          <View
            className={`w-8 h-8 rounded-full items-center justify-center ${
              isSelected ? "bg-white" : "bg-white/20"
            }`}
          >
            {isSelected ? (
              <Text className="text-blue-600 font-bold text-lg">✓</Text>
            ) : (
              <View className="w-4 h-4 rounded-full border-2 border-white/60" />
            )}
          </View>
        </View>

        {/* Illustration container */}
        <View className="flex-1 items-center justify-center">
          <View className="w-full h-full max-w-[200px] max-h-[200px]">
            <Image
              source={illustration}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GenderCard;
