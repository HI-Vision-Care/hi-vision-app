import CustomButton from "@/components/CustomButton";
import { icons, images } from "@/constants";
import { PasswordSentModalProps } from "@/types/type";
import React from "react";
import {
  Image,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
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
      {/* Overlay đen mờ */}
      <View className="flex-1 bg-black/50 justify-center items-center">
        {/* Card trắng nằm giữa */}
        <View className="w-11/12 bg-white rounded-2xl pt-5 px-6 pb-12 items-center relative">
          {/* Hình minh họa (vẫn to hẳn ra) */}
          <Image
            source={images.passwordSent}
            className="w-full h-96 mb-6 rounded-lg"
            resizeMode="contain"
          />

          {/* Container bọc text để căn trái */}
          <View className="w-full px-2 mb-8 items-start">
            {/* Tiêu đề “Password Sent!” căn trái */}
            <Text className="text-[24px] font-bold text-gray-900 mb-2 text-left">
              Password Sent!
            </Text>

            {/* Dòng mô tả căn trái */}
            <Text className="text-base text-gray-600 leading-6 text-left">
              We’ve sent the password to{"\n"}
              <Text className="font-semibold text-gray-900">
                {obfuscateEmail(email)}
              </Text>
            </Text>
          </View>

          {/* Nút “Re-Sent Code” (vẫn full-width) */}
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

          {/* Nút “X” để đóng modal (đẩy ra xa modal hơn) */}
          <TouchableOpacity
            onPress={onClose}
            className={`
              w-16 h-16 bg-white rounded-md 
              items-center justify-center 
              absolute -bottom-28 
              ${Platform.OS === "ios" ? "shadow-lg" : "shadow-md"}
            `}
          >
            <Image
              source={icons.close}
              className="w-8 h-8 tint-gray-500"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
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
