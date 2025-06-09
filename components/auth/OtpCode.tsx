import { OTPInputProps } from "@/types/type";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, TextInput, View } from "react-native";

const OTPInput: React.FC<OTPInputProps> = ({
  length = 4,
  onComplete,
  onChangeText,
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(0);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Animation values
  const animatedValues = useRef(
    Array(length)
      .fill(0)
      .map(() => new Animated.Value(1))
  );

  // Focus ô đầu tiên khi mount
  useEffect(() => {
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  }, []);

  const handleChangeText = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    const otpString = newOtp.join("");
    onChangeText?.(otpString);

    // Animation khi nhập
    Animated.sequence([
      Animated.timing(animatedValues.current[index], {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValues.current[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-focus ô tiếp theo
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Gọi onComplete nếu đã đầy
    if (otpString.length === length && !otpString.includes("")) {
      onComplete?.(otpString);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Nếu backspace và ô này đang trống, focus về ô trước
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };
  const handleBlur = () => {
    setFocusedIndex(null);
  };
  const handlePress = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const getInputBoxStyle = (index: number) => {
    if (focusedIndex === index) return "shadow-lg"; // ô đang focus
    if (otp[index]) return "shadow-md"; // ô đã có số
    return "shadow-sm"; // ô trống
  };

  return (
    <View className="flex-row justify-center items-center space-x-4 py-4 gap-2">
      {otp.map((digit, index) => (
        <Animated.View
          key={index}
          style={{ transform: [{ scale: animatedValues.current[index] }] }}
          className="shadow-sm"
        >
          <Pressable
            onPress={() => handlePress(index)}
            className={`w-24 h-24 rounded-2xl overflow-hidden ${getInputBoxStyle(
              index
            )}`}
            style={{
              shadowColor: focusedIndex === index ? "#3b82f6" : "#000000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: focusedIndex === index ? 0.3 : 0.1,
              shadowRadius: 8,
              elevation: focusedIndex === index ? 8 : 2,
            }}
          >
            <LinearGradient
              colors={
                focusedIndex === index
                  ? ["#3b82f6", "#2563eb"]
                  : digit
                  ? ["#f9fafb", "#f3f4f6"]
                  : ["#f3f4f6", "#e5e7eb"]
              }
              className="w-full h-full justify-center items-center border-2"
              style={{
                borderColor:
                  focusedIndex === index
                    ? "#2563eb"
                    : digit
                    ? "#d1d5db"
                    : "#e5e7eb",
              }}
            >
              <TextInput
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                value={digit}
                onChangeText={(t) => handleChangeText(t.slice(-1), index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => handleFocus(index)}
                onBlur={handleBlur}
                keyboardType="numeric"
                maxLength={1}
                // BỎ selectTextOnFocus để không tự động highlight nữa
                className={`
                  text-center text-2xl font-bold w-full h-full
                  ${
                    focusedIndex === index
                      ? "text-white"
                      : digit
                      ? "text-gray-900"
                      : "text-gray-400"
                  }
                `}
                placeholder="0"
                placeholderTextColor={
                  focusedIndex === index ? "rgba(255,255,255,0.5)" : "#9ca3af"
                }
                style={{ fontSize: 24 }}
              />
            </LinearGradient>
          </Pressable>

          {/* Indicator nhỏ bên dưới */}
          <View className="items-center mt-2">
            <View
              className={`h-1.5 rounded-full ${
                focusedIndex === index
                  ? "w-4 bg-blue-500"
                  : digit
                  ? "w-2 bg-blue-300"
                  : "w-2 bg-gray-300"
              }`}
            />
          </View>
        </Animated.View>
      ))}
    </View>
  );
};

export default OTPInput;
