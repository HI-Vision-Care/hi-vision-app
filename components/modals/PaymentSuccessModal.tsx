import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Animated,
  Modal,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface PaymentSuccessModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
  visible,
  onClose,
  title = "Thanh toán thành công!",
  subtitle = "Bạn đã đặt lịch và thanh toán thành công.",
}) => {
  const scaleValue = React.useRef(new Animated.Value(0)).current;
  const opacityValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
      <Animated.View
        className="flex-1 bg-black/50 justify-center items-center px-6"
        style={{ opacity: opacityValue }}
      >
        <Animated.View
          className="bg-white rounded-3xl w-full max-w-sm overflow-hidden"
          style={{
            transform: [{ scale: scaleValue }],
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 20 },
            shadowOpacity: 0.25,
            shadowRadius: 25,
            elevation: 25,
          }}
        >
          {/* Success Header */}
          <LinearGradient
            colors={["#10b981", "#059669", "#047857"]}
            className="px-6 py-8 items-center"
          >
            <View className="bg-white/20 p-4 rounded-full mb-4">
              <View className="bg-white p-3 rounded-full">
                <Ionicons name="checkmark" size={32} color="#10b981" />
              </View>
            </View>
            <Text className="text-white text-2xl font-bold mb-2">{title}</Text>
            <Text className="text-white/90 text-center text-base">
              {subtitle}
            </Text>
          </LinearGradient>

          <View className="px-6 py-6">
            <TouchableOpacity
              onPress={onClose}
              className="bg-green-600 rounded-2xl py-4 px-6 flex-row items-center justify-center"
              style={{
                shadowColor: "#10b981",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text className="text-white font-bold text-lg ml-2">Đã hiểu</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default PaymentSuccessModal;
