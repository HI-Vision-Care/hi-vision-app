import { icons, images } from "@/constants";
import { useTranslation } from "@/hooks/useTranslation";
import { useSignIn } from "@/services/auth/hooks";
import { authErrorHandler } from "@/utils/error-handler";
import { CustomButton, InputField } from "@components";
import { router } from "expo-router";
import { useState } from "react";
import { Image, StatusBar, Text, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const SignIn: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const insets = useSafeAreaInsets();

  const { mutateAsync: login, isLoading } = useSignIn();

  const handleSignIn = async () => {
    try {
      await login({ email, password }); // token đã được lưu bởi hook!
      router.replace("/(root)/(tabs)/home");
    } catch (err: any) {
      authErrorHandler(err);
    }
  };

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-white">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* === Header: background tràn lên notch === */}
      <View
        className="bg-gray-700 rounded-b-3xl items-center justify-center px-6"
        style={{
          height: 150 + insets.top,
          paddingTop: insets.top,
        }}
      >
        <View className="items-center">
          <View className="w-8 h-8  items-center justify-center mb-4">
            <Image
              source={images.logo}
              className="w-14 h-14"
              resizeMode="contain"
            />
          </View>
          <Text className="text-white text-2xl font-semibold">
            {t("auth.signIn")}
          </Text>
        </View>
      </View>

      {/* === Content phía dưới Header === */}
      <View className="flex-1 px-6 py-8">
        {/* Input Email */}
        <InputField
          label={t("auth.emailAddress")}
          icon={icons.email}
          placeholder={t("auth.enterEmail")}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* Input Password */}
        <InputField
          label={t("auth.password")}
          icon={icons.password}
          placeholder={t("auth.enterPassword")}
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        {/* === Forgot Password Link === */}
        <View className="w-full flex-row justify-end mb-6">
          <TouchableOpacity
            onPress={() => router.push("/(auth)/forgot-password")}
          >
            <Text className="text-red-500 font-medium underline text-sm">
              {t("auth.forgotPassword")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign In Button */}
        <CustomButton
          title={t("auth.signIn")}
          onPress={handleSignIn}
          variant="primary"
          className="mb-6 mx-0 shadow-lg"
          isLoading={isLoading}
          rightIcon={
            <Image
              source={icons.arrow}
              className="w-6 h-6"
              resizeMode="contain"
            />
          }
        />

        {/* OR Divider */}
        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-4 text-gray-500 text-sm">{t("auth.or")}</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        {/* Sign Up Link */}
        <View className="flex-row justify-center mb-8">
          <Text className="text-gray-600 text-base">
            {t("auth.noAccount")}{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
            <Text className="text-red-500 font-medium underline text-base">
              {t("auth.signUp")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
