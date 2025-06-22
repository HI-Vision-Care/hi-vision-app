import { icons, images } from "@/constants";
import { CustomButton, PhoneInput } from "@components";
import { router, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Keyboard,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const OtpSetup: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const nav = useRouter();
  const insets = useSafeAreaInsets();

  // Hàm check xem số có “hợp lệ” chưa (ở đây chỉ đơn giản: không rỗng)
  const isValidPhone = phoneNumber.trim().length > 0;

  return (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()}
      accessible={false}
    >
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

        {/* Back button */}
        <TouchableOpacity
          onPress={() => nav.back()}
          className="absolute left-4 top-0 w-10 h-10 rounded-lg border border-gray-600 items-center justify-center"
          style={{ marginTop: insets.top }}
        >
          <Image
            source={icons.chevronLeft}
            className="w-7 h-7"
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Header */}
        <View className="pt-11 items-center">
          <Text className="text-xl font-semibold text-gray-900">OTP Setup</Text>
        </View>

        {/* Content */}
        <View className="flex-1 px-6 mt-6">
          {/* Illustration */}
          <View className="items-center mt-8 mb-10">
            <Image
              source={images.otp}
              className="w-80 h-72"
              resizeMode="contain"
            />
          </View>

          {/* Description */}
          <View className="mb-3">
            <Text className="text-center text-gray-600 text-base leading-6">
              We will send a one time SMS message.{"\n"}
              Carrier rates may apply.
            </Text>
          </View>

          {/* PhoneInput */}
          <PhoneInput value={phoneNumber} onChangeText={setPhoneNumber} />

          {/* Continue Button */}
          <CustomButton
            title="Continue"
            onPress={() => {
              if (isValidPhone) {
                router.push("/otp-security");
              }
              // Nếu không valid thì không làm gì (hoặc show alert/vibe)
            }}
            disabled={!isValidPhone} // disable khi chưa nhập
            className={`
              w-full 
              ${!isValidPhone ? "bg-gray-300" : "bg-blue-600"} 
            `}
            rightIcon={
              <Image
                source={icons.arrow}
                className={`w-6 h-6 ${
                  !isValidPhone ? "tint-gray-500" : "tint-white"
                }`}
                resizeMode="contain"
              />
            }
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default OtpSetup;
