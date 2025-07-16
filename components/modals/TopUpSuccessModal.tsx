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

const TopUpSuccessModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const scaleValue = React.useRef(new Animated.Value(0)).current;
  const opacityValue = React.useRef(new Animated.Value(0)).current;
  const bounceValue = React.useRef(new Animated.Value(0)).current;

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
        Animated.sequence([
          Animated.timing(bounceValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.spring(bounceValue, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 3,
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
            colors={["#3b82f6", "#2563eb", "#1d4ed8"]}
            className="px-6 py-8 items-center"
          >
            <Animated.View
              className="bg-white/20 p-4 rounded-full mb-4"
              style={{
                transform: [
                  {
                    scale: bounceValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.2],
                    }),
                  },
                ],
              }}
            >
              <View className="bg-white p-3 rounded-full">
                <Ionicons name="wallet" size={32} color="#3b82f6" />
              </View>
            </Animated.View>
            <Text className="text-white text-2xl font-bold mb-2">
              Nạp tiền thành công!
            </Text>
            <Text className="text-white/90 text-center text-base">
              Số dư của bạn đã được cập nhật.
            </Text>
          </LinearGradient>

          {/* Button */}
          <View className="px-6 py-6">
            <TouchableOpacity
              onPress={onClose}
              className="bg-blue-600 rounded-2xl py-4 px-6 flex-row items-center justify-center"
              style={{
                shadowColor: "#3b82f6",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Ionicons name="checkmark-circle" size={18} color="white" />
              <Text className="text-white font-bold text-base ml-1">
                Đã hiểu
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default TopUpSuccessModal;
