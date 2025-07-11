import { images } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";

interface ModalSuccessProps {
  visible: boolean;
  onClose: () => void;
  image?: any;
}

const ModalSuccess = ({ visible, onClose, image }: ModalSuccessProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/20 justify-center items-center px-6">
        <View className="w-full max-w-sm bg-white rounded-3xl items-center px-5 py-7 shadow-xl">
          {/* Hình minh họa */}
          <View className="bg-blue-50 rounded-2xl p-3 mb-4">
            <Image
              source={images.success}
              className="w-32 h-24"
              resizeMode="contain"
            />
          </View>
          {/* Tiêu đề */}
          <Text className="text-lg font-bold text-gray-900 text-center mb-2">
            Welcome to HiVision!
          </Text>
          {/* Mô tả */}
          <Text className="text-gray-500 text-base text-center mb-5">
            Your profile setup is complete.{"\n"}
            You can now start exploring all the features of our health app.
            {"\n\n"}
            Wishing you a great wellness journey with HiVision! 🚀
          </Text>
          {/* Nút */}
          <TouchableOpacity
            className="bg-blue-600 rounded-xl flex-row items-center justify-center px-6 py-3 w-full"
            activeOpacity={0.85}
            onPress={onClose}
          >
            <Text className="text-white font-bold text-base mr-2">
              Get Started
            </Text>
            <Ionicons name="checkmark-done" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalSuccess;
