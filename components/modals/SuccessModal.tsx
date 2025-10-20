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

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  buttonText?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  buttonText = "OK",
}) => {
  const scaleValue = React.useRef(new Animated.Value(0.9)).current;
  const opacityValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
          tension: 120,
          friction: 10,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 0.9,
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
          <LinearGradient
            colors={["#3B82F6", "#2563EB"]}
            className="px-6 py-8 items-center"
          >
            <View className="bg-white/20 p-4 rounded-full mb-4">
              <View className="bg-white p-3 rounded-full">
                <Ionicons name="checkmark" size={32} color="#2563EB" />
              </View>
            </View>
            <Text className="text-white text-2xl font-bold mb-2 text-center">
              {title}
            </Text>
            {subtitle ? (
              <Text className="text-white/90 text-center text-base">
                {subtitle}
              </Text>
            ) : null}
          </LinearGradient>

          <View className="px-6 py-6">
            <TouchableOpacity
              onPress={onClose}
              className="bg-blue-600 rounded-2xl py-4 px-6 flex-row items-center justify-center"
              style={{
                shadowColor: "#2563EB",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text className="text-white font-bold text-lg ml-2">
                {buttonText}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default SuccessModal;
