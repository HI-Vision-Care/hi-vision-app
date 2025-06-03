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
  errorMessage, // chuỗi lỗi (nếu có)
  errorIcon, // icon báo lỗi (nếu muốn custom), mặc định dùng icons.warning
  containerStyle = "",
  labelStyle = "",
  inputStyle = "",
  iconStyle = "",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Giá trị icon lỗi mặc định
  const _errorIcon = errorIcon ?? icons.warning;

  // Nếu đang có lỗi, override màu viền và nền
  const borderColor = errorMessage
    ? "border-red-500"
    : isFocused
    ? "border-blue-500"
    : "border-gray-300";

  // Nếu có lỗi, nền container thành hồng nhạt, còn không thì trắng
  const backgroundColor = errorMessage ? "bg-red-50" : "bg-white";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
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

          {/* === Container input chính === */}
          <View
            className={`
              flex-row items-center rounded-xl
              border-2 ${borderColor}
              ${backgroundColor}
              px-4 h-16
              ${containerStyle}
            `}
          >
            {/* Icon bên trái (nếu có) */}
            {icon && (
              <Image
                source={icon}
                className={`w-6 h-6 mr-3 ${iconStyle}`}
                resizeMode="contain"
              />
            )}

            {/* TextInput */}
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

            {/* Eye toggle nếu đây là trường mật khẩu */}
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

          {/* === Nếu có lỗi, hiển thị box thông báo lỗi bên dưới === */}
          {errorMessage && (
            <View
              className="
                flex-row items-center
                bg-red-50 border-2 border-red-500
                rounded-xl px-4 py-3 mt-2
              "
            >
              <Image
                source={_errorIcon}
                className="w-5 h-5 mr-2"
                resizeMode="contain"
              />
              <Text className="text-red-600 text-base font-medium">
                {errorMessage}
              </Text>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;
