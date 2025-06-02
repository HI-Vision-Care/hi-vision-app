// components/InputField.tsx
import { icons } from "@/constants";
import { InputFieldProps } from "@/types/type";
import React, { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  secureTextEntry = false,
  placeholder,
  value,
  onChangeText,
  containerStyle = "",
  labelStyle = "",
  inputStyle = "",
  iconStyle = "",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      // w-full mb-4 từ Tailwind
      className="w-full mb-4"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          {/* --- Label phía trên --- */}
          {label && (
            <Text
              className={`text-gray-700 text-base font-medium mb-2 ${labelStyle}`}
            >
              {label}
            </Text>
          )}

          {/* --- Container input với height cố định và border-2 --- */}
          <View
            className={`
              flex-row items-center bg-white rounded-xl
              border-2
              ${isFocused ? "border-blue-500" : "border-gray-300"}
              px-4 h-16
              ${containerStyle}
            `}
          >
            {/* Icon bên trái (nếu có) */}
            {icon && (
              <Image
                source={icon}
                className={`w-5 h-5 mr-3 ${iconStyle}`}
                resizeMode="contain"
              />
            )}

            {/* 
              TextInput: 
              - flex-1 h-full text-gray-800 text-base là class Tailwind
              - includeFontPadding + style={{ paddingVertical: 0 }} để iOS căn giữa
            */}
            <TextInput
              className={`flex-1 h-full text-gray-800 text-base ${inputStyle}`}
              placeholder={placeholder}
              placeholderTextColor="#9CA3AF"
              secureTextEntry={secureTextEntry && !showPassword}
              value={value}
              onChangeText={onChangeText}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              textAlignVertical="center"
              includeFontPadding={false}
              style={{ paddingVertical: 0 }}
              {...props}
            />

            {/* Eye toggle nếu secureTextEntry=true */}
            {secureTextEntry && (
              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                className="ml-2"
              >
                {showPassword ? (
                  <Image
                    source={icons.eyeOpen}
                    className="w-5 h-5"
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={icons.eyeOff}
                    className="w-5 h-5"
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;
