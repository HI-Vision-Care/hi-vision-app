import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
  isLoading?: boolean;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  visible,
  onClose,
  onConfirm,
  userName = "User",
  isLoading = false,
}) => {
  const [confirmText, setConfirmText] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const requiredText = "DELETE";

  const handleTextChange = (text: string) => {
    setConfirmText(text);
    setIsConfirmed(text === requiredText);
  };

  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm();
      // Reset modal state
      setConfirmText("");
      setIsConfirmed(false);
    }
  };

  const handleClose = () => {
    setConfirmText("");
    setIsConfirmed(false);
    onClose();
  };

  const warningItems = [
    "Tất cả dữ liệu cá nhân sẽ bị xóa vĩnh viễn",
    "Lịch sử khám bệnh và kết quả xét nghiệm sẽ mất",
    "Đơn thuốc và lịch nhắc uống thuốc sẽ bị xóa",
    "Ví điện tử và số dư sẽ không thể khôi phục",
    "Không thể hoàn tác hành động này",
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <BlurView
        intensity={20}
        tint="dark"
        className="flex-1 justify-center items-center px-6"
      >
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
          {/* Header */}
          <View className="items-center mb-6">
            <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="warning" size={32} color="#EF4444" />
            </View>
            <Text className="text-xl font-bold text-gray-800 text-center mb-2">
              Xóa Tài Khoản
            </Text>
            <Text className="text-gray-600 text-center">
              Bạn có chắc chắn muốn xóa tài khoản{" "}
              <Text className="font-semibold text-red-600">{userName}</Text>?
            </Text>
          </View>

          {/* Warning List */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-800 mb-3">
              ⚠️ Cảnh báo: Hành động này sẽ dẫn đến:
            </Text>
            {warningItems.map((item, index) => (
              <View key={index} className="flex-row items-start mb-2">
                <Text className="text-red-500 mr-2">•</Text>
                <Text className="text-gray-700 flex-1 text-sm leading-5">
                  {item}
                </Text>
              </View>
            ))}
          </View>

          {/* Confirmation Input */}
          <View className="mb-6">
            <Text className="text-sm text-gray-600 mb-2">
              Để xác nhận, vui lòng gõ{" "}
              <Text className="font-bold text-red-600">DELETE</Text> vào ô bên
              dưới:
            </Text>
            <TextInput
              value={confirmText}
              onChangeText={handleTextChange}
              placeholder="Nhập DELETE để xác nhận"
              className={`border rounded-lg p-3 text-base ${
                confirmText.length > 0 && !isConfirmed
                  ? "border-red-300 bg-red-50 text-red-600"
                  : isConfirmed
                  ? "border-green-300 bg-green-50 text-green-600"
                  : "border-gray-300 text-gray-800"
              }`}
              autoCapitalize="characters"
              autoCorrect={false}
              autoComplete="off"
            />
            {confirmText.length > 0 && !isConfirmed && (
              <Text className="text-red-500 text-xs mt-1">
                Vui lòng gõ chính xác "DELETE"
              </Text>
            )}
            {isConfirmed && (
              <View className="flex-row items-center mt-1">
                <Ionicons name="checkmark-circle" size={12} color="#16A34A" />
                <Text className="text-green-600 text-xs ml-1">
                  Xác nhận thành công
                </Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View className="flex-row space-x-3 gap-1">
            <TouchableOpacity
              onPress={handleClose}
              className="flex-1 bg-gray-100 py-3 px-4 rounded-lg"
              disabled={isLoading}
            >
              <Text className="text-gray-700 font-semibold text-center">
                Hủy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleConfirm}
              className={`flex-1 py-3 px-4 rounded-lg ${
                isConfirmed && !isLoading ? "bg-red-600" : "bg-gray-300"
              }`}
              disabled={!isConfirmed || isLoading}
            >
              <Text
                className={`font-semibold text-center ${
                  isConfirmed && !isLoading ? "text-white" : "text-gray-500"
                }`}
              >
                {isLoading ? "Đang xóa..." : "Xóa Tài Khoản"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Additional Warning */}
          <View className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <Text className="text-red-700 text-xs text-center">
              <Ionicons name="information-circle" size={12} color="#DC2626" />
              <Text className="ml-1">
                Chúng tôi không thể khôi phục tài khoản sau khi xóa
              </Text>
            </Text>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default DeleteAccountModal;
