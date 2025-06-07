import CustomButton from "@/components/CustomButton";
import { icons, images } from "@/constants";
import { PasswordSentModalProps } from "@/types/type";
import React from "react";
import {
  Image,
  Modal,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const PasswordSentModal: React.FC<PasswordSentModalProps> = ({
  visible,
  email,
  onResend,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      {/* Dùng TouchableWithoutFeedback để bắt tap ngoài */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-center items-center">
          {/* 
            Để cho tap vào card bên trong không “rơi xuống” view overlay (và tự động đóng modal), 
            mình đặt một View con có pointerEvents="box-none" để block sự kiện từ TouchableOutside. 
          */}
          <View
            pointerEvents="box-none"
            className="w-11/12 bg-white rounded-2xl pt-5 px-6 pb-12 items-center relative"
          >
            {/* Hình minh họa */}
            <Image
              source={images.passwordSent}
              className="w-full h-96 mb-6 rounded-lg"
              resizeMode="contain"
            />

            {/* Container text */}
            <View className="w-full px-2 mb-8 items-start">
              <Text className="text-[24px] font-bold text-gray-900 mb-2 text-left">
                Password Sent!
              </Text>

              <Text className="text-base text-gray-600 leading-6 text-left">
                We’ve sent the password to{"\n"}
                <Text className="font-semibold text-gray-900">
                  {obfuscateEmail(email)}
                </Text>
              </Text>
            </View>

            {/* Nút “Re-Sent Code” */}
            <CustomButton
              title="Re-Sent Code"
              onPress={onResend}
              variant="primary"
              className="w-full mb-0"
              rightIcon={
                <Image
                  source={icons.arrow}
                  className="w-5 h-5 tint-white"
                  resizeMode="contain"
                />
              }
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

/** Che dấu một phần email, ví dụ "elem@gmail.com" => "elem****@gmail.com" */
function obfuscateEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const keepChars = Math.min(Math.floor(local.length / 2), 4);
  const visiblePart = local.slice(0, keepChars);
  return visiblePart + "****@" + domain;
}

export default PasswordSentModal;
