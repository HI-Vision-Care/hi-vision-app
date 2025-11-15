import CustomButton from "@/components/common/CustomButton";
import { icons } from "@/constants";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface EmailInputModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
  isLoading?: boolean;
}

const EmailInputModal: React.FC<EmailInputModalProps> = ({
  visible,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = () => {
    // Validate email
    if (!email) {
      setError("Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    onSubmit(email);
  };

  const handleClose = () => {
    if (!isLoading) {
      setEmail("");
      setError("");
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <TouchableWithoutFeedback>
            <View className="w-full bg-white rounded-3xl p-6 shadow-2xl">
              {/* Header */}
              <View className="items-center mb-6">
                <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
                  <Image
                    source={icons.email}
                    className="w-8 h-8"
                    style={{ tintColor: "#3b82f6" }}
                    resizeMode="contain"
                  />
                </View>
                <Text className="text-2xl font-bold text-gray-900 mb-2">
                  Nhập Email
                </Text>
                <Text className="text-gray-600 text-center text-sm leading-5">
                  Chúng tôi sẽ gửi mã OTP 6 số đến email của bạn để đặt lại mật
                  khẩu
                </Text>
              </View>

              {/* Email Input */}
              <View className="mb-6">
                <Text className="text-gray-700 text-sm font-semibold mb-2 ml-1">
                  Địa chỉ Email
                </Text>
                <View
                  className={`flex-row items-center bg-gray-50 border ${
                    error ? "border-red-500" : "border-gray-300"
                  } rounded-xl px-4`}
                >
                  <Image
                    source={icons.email}
                    className="w-5 h-5 mr-3"
                    style={{ tintColor: error ? "#ef4444" : "#9ca3af" }}
                    resizeMode="contain"
                  />
                  <TextInput
                    className="flex-1 py-3.5 text-gray-900 text-base"
                    placeholder="your.email@example.com"
                    placeholderTextColor="#9ca3af"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setError("");
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                </View>
                {error ? (
                  <Text className="text-red-500 text-xs mt-1.5 ml-1">
                    {error}
                  </Text>
                ) : null}
              </View>

              {/* Buttons */}
              <View className="space-y-3">
                <CustomButton
                  title={isLoading ? "Đang gửi..." : "Gửi mã OTP"}
                  onPress={handleSubmit}
                  variant="primary"
                  disabled={isLoading}
                  className="w-full mb-2"
                  rightIcon={
                    isLoading ? (
                      <ActivityIndicator color="#ffffff" size="small" />
                    ) : (
                      <Image
                        source={icons.arrow}
                        className="w-5 h-5"
                        style={{ tintColor: "#ffffff" }}
                        resizeMode="contain"
                      />
                    )
                  }
                />

                {!isLoading && (
                  <CustomButton
                    title="Hủy"
                    onPress={handleClose}
                    variant="outline"
                    className="w-full"
                  />
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default EmailInputModal;
