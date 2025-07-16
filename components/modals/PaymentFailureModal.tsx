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

interface PaymentFailureModalProps {
  visible: boolean;
  onClose: () => void;
  onTopUp?: () => void;
  // attemptedAmount?: string;
  // currentBalance?: string;
  // requiredAmount?: string;
}

const PaymentFailureModal: React.FC<PaymentFailureModalProps> = ({
  visible,
  onClose,
  onTopUp,
  // attemptedAmount = "0",
  // currentBalance = "0",
  // requiredAmount = "0",
}) => {
  const scaleValue = React.useRef(new Animated.Value(0)).current;
  const opacityValue = React.useRef(new Animated.Value(0)).current;
  const shakeValue = React.useRef(new Animated.Value(0)).current;

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
      ]).start(() => {
        // Shake animation for error emphasis
        Animated.sequence([
          Animated.timing(shakeValue, {
            toValue: 10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeValue, {
            toValue: -10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeValue, {
            toValue: 10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeValue, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();
      });
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
            transform: [{ scale: scaleValue }, { translateX: shakeValue }],
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 20 },
            shadowOpacity: 0.25,
            shadowRadius: 25,
            elevation: 25,
          }}
        >
          {/* Error Header */}
          <LinearGradient
            colors={["#ef4444", "#dc2626", "#b91c1c"]}
            className="px-6 py-8 items-center"
          >
            <View className="bg-white/20 p-4 rounded-full mb-4">
              <View className="bg-white p-3 rounded-full">
                <Ionicons name="close-circle" size={32} color="#ef4444" />
              </View>
            </View>
            <Text className="text-white text-2xl font-bold mb-2">
              Payment Failed
            </Text>
            <Text className="text-white/90 text-center text-base">
              Insufficient balance to complete this transaction
            </Text>
          </LinearGradient>

          {/* Error Details */}
          <View className="px-6 py-6">
            <View className="bg-red-50 rounded-2xl p-4 mb-6 border border-red-100">
              <View className="flex-row items-center mb-4">
                <Ionicons name="information-circle" size={20} color="#ef4444" />
                <Text className="text-red-700 font-semibold ml-2">
                  Transaction Details
                </Text>
              </View>

              {/* <View className="space-y-3">
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-600 font-medium">
                    Attempted Amount
                  </Text>
                  <Text className="text-gray-900 font-bold">
                    {attemptedAmount}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-600 font-medium">
                    Current Balance
                  </Text>
                  <Text className="text-red-600 font-bold">
                    {currentBalance}
                  </Text>
                </View>
                <View className="h-px bg-gray-200 my-2" />
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-600 font-medium">
                    Amount Needed
                  </Text>
                  <Text className="text-orange-600 font-bold">
                    {requiredAmount}
                  </Text>
                </View>
              </View> */}
            </View>

            {/* Action Buttons */}
            <View className="space-y-3">
              {onTopUp && (
                <TouchableOpacity
                  onPress={() => {
                    onClose();
                    onTopUp();
                  }}
                  className="bg-blue-600 rounded-2xl py-4 px-6 flex-row items-center justify-center"
                  style={{
                    shadowColor: "#3b82f6",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                >
                  <Ionicons name="wallet" size={20} color="white" />
                  <Text className="text-white font-bold text-lg ml-2">
                    Top Up Now
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={onClose}
                className="bg-gray-100 rounded-2xl py-4 px-6 flex-row items-center justify-center"
              >
                <Text className="text-gray-700 font-semibold text-base">
                  Try Again Later
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default PaymentFailureModal;
