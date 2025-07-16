import { images } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ModalSuccessProps {
  visible: boolean;
  onClose: () => void;
  image?: any;
}

const ModalSuccess = ({ visible, onClose, image }: ModalSuccessProps) => {
  const screenWidth = Dimensions.get("window").width;
  const modalWidth = Math.min(screenWidth * 0.85, 340);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/40 justify-center items-center px-4">
        {/* Modal Container */}
        <View
          className="bg-white rounded-3xl items-center shadow-2xl"
          style={{
            width: modalWidth,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 25,
          }}
        >
          {/* Content Container */}
          <View className="px-6 py-8 items-center w-full">
            {/* Illustration Container */}
            <View className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 mb-6 shadow-sm">
              <Image
                source={image || images.success}
                className="w-28 h-28"
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
      </View>
    </Modal>
  );
};

export default ModalSuccess;
