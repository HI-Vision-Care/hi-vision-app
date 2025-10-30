import { HeaderBack, ProfileUpdateSuccessScreen } from "@/components";
import { usePatientProfile } from "@/hooks/usePatientId";
import { useTranslation } from "@/hooks/useTranslation";
import { useUpdatePatientProfile } from "@/services/patient/hooks";
import { useUploadImage } from "@/services/storage/hooks";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type MedicalData = {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  medNo: string;
  medDate: string;
  medFac: string;
};

export default function PersonalInfo() {
  const { t } = useTranslation();
  const { data: profile, isLoading } = usePatientProfile();
  const patientId = profile?.patientID;
  const accountId = profile?.account?.id;

  const [data, setData] = useState<MedicalData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    medNo: "",
    medDate: "",
    medFac: "",
  });
  const [focusedField, setFocusedField] = useState<string>("");
  const [avatarUri, setAvatarUri] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  const updateMutation = useUpdatePatientProfile();
  const uploadImageMutation = useUploadImage();

  useEffect(() => {
    if (!profile) return;
    setData({
      fullName: profile.name || "",
      email: profile.account?.email || "",
      phoneNumber: profile.account?.phone || "",
      dateOfBirth: (profile.dob || "").slice(0, 10),
      gender: profile.gender || "",
      medNo: profile.medNo || "",
      medDate: (profile.medDate || "").slice(0, 10),
      medFac: profile.medFac || "",
    });
    setAvatarUri(profile.account?.avatar || undefined);
  }, [profile]);

  const parseISO = (d: string) => {
    if (!d) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    const m = d.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (m) return `${m[3]}-${m[2]}-${m[1]}`;
    return d;
  };

  const onChange = (field: keyof MedicalData, value: string) => {
    setData((p) => ({ ...p, [field]: value }));
  };

  const pickFromLibrary = async () => {
    setShowAvatarModal(false);
    try {
      const ImagePicker = require("expo-image-picker");
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!res.canceled) setAvatarUri(res.assets?.[0]?.uri);
    } catch (e: any) {
      Alert.alert(
        t("personalInfo.imagePicker"),
        e?.message || t("personalInfo.unableToOpenLibrary")
      );
    }
  };

  const takePhoto = async () => {
    setShowAvatarModal(false);
    try {
      const ImagePicker = require("expo-image-picker");
      await ImagePicker.requestCameraPermissionsAsync();
      const res = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!res.canceled) setAvatarUri(res.assets?.[0]?.uri);
    } catch (e: any) {
      Alert.alert(
        t("personalInfo.camera"),
        e?.message || t("personalInfo.unableToOpenCamera")
      );
    }
  };

  const handleSave = async () => {
    if (!patientId)
      return Alert.alert(
        t("personalInfo.profile"),
        t("personalInfo.missingPatientId")
      );
    setSaving(true);
    try {
      // Upload avatar if changed and get URL
      let avatarUrl = profile?.account?.avatar; // Keep existing avatar if no change

      if (avatarUri && avatarUri !== profile?.account?.avatar) {
        // Upload image to Supabase Storage
        const uploadResult = await uploadImageMutation.mutateAsync({
          imageUri: avatarUri,
          folder: "avatars",
        });
        // Use the new uploaded image URL
        avatarUrl = uploadResult.url;
      }

      // Update profile with avatar URL included
      await updateMutation.mutateAsync({
        patientId,
        payload: {
          name: data.fullName,
          dob: parseISO(data.dateOfBirth),
          gender: data.gender,
          medNo: data.medNo,
          medDate: parseISO(data.medDate),
          medFac: data.medFac,
          avatar: avatarUrl, // Include avatar URL in profile update
        },
      });

      // Show success screen instead of alert
      setShowSuccessScreen(true);
    } catch (e: any) {
      Alert.alert(
        t("personalInfo.updateFailed"),
        e?.message || t("personalInfo.pleaseTryAgain")
      );
    } finally {
      setSaving(false);
    }
  };

  const Field = (
    label: string,
    value: string,
    field: keyof MedicalData,
    icon: React.ReactNode,
    opts?: { dropdown?: boolean; editable?: boolean; multiline?: boolean }
  ) => (
    <View className="mb-5">
      <Text className="text-blue-900 text-sm font-semibold mb-2 ml-1">
        {label}
      </Text>
      <TouchableOpacity
        className={`bg-white rounded-2xl px-4 py-4 border ${
          focusedField === field ? "border-blue-400" : "border-blue-100"
        } shadow-sm`}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View className="w-11 h-11 bg-blue-50 rounded-xl justify-center items-center mr-4">
              {icon}
            </View>
            {opts?.editable === false || opts?.dropdown ? (
              <Text className="flex-1 text-slate-900 text-base font-medium">
                {value}
              </Text>
            ) : (
              <TextInput
                value={value}
                onChangeText={(t) => onChange(field, t)}
                onFocus={() => setFocusedField(field)}
                onBlur={() => setFocusedField("")}
                className="flex-1 text-slate-900 text-base font-medium"
                placeholder={t("personalInfo.enterField", { field: label })}
                placeholderTextColor="#9cb7d1"
                multiline={opts?.multiline}
                numberOfLines={opts?.multiline ? 3 : 1}
                textAlignVertical={opts?.multiline ? "top" : "center"}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  // Show success screen if update was successful
  if (showSuccessScreen) {
    return <ProfileUpdateSuccessScreen />;
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#eaf2fb" />
      <SafeAreaView className="flex-1 bg-blue-50">
        <HeaderBack title={t("personalInfo.title")} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile header */}
          <View className="items-center pt-2 mb-6">
            <TouchableOpacity
              onPress={() => setShowAvatarModal(true)}
              className="relative"
            >
              <View className="w-28 h-28 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden">
                <Image
                  source={
                    avatarUri || profile?.account?.avatar
                      ? {
                          uri: avatarUri || profile?.account?.avatar,
                        }
                      : require("@/assets/images/avatarPlaceholder.jpg")
                  }
                  className="w-full h-full"
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                  onError={(error) => {
                    console.log("Image load error:", error);
                    console.log("Avatar URI:", avatarUri);
                    console.log("Profile avatar:", profile?.account?.avatar);
                  }}
                  onLoad={() => {
                    console.log("Image loaded successfully");
                    console.log("Avatar URI:", avatarUri);
                    console.log("Profile avatar:", profile?.account?.avatar);
                  }}
                />
              </View>
              {/* Edit overlay - only show when no avatar */}
              {!(avatarUri || profile?.account?.avatar) && (
                <View className="absolute inset-0 bg-black bg-opacity-20 rounded-full items-center justify-center">
                  <View className="bg-white bg-opacity-90 rounded-full p-2">
                    <Ionicons name="camera-outline" size={20} color="#2563eb" />
                  </View>
                </View>
              )}
              {/* Camera icon indicator */}
              <View className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-2 border-2 border-white">
                <Ionicons name="camera" size={16} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text className="text-gray-600 text-sm mt-2">
              {t("personalInfo.tapToChangeAvatar")}
            </Text>
          </View>

          <View className="px-6">
            {/* Personal */}
            <Text className="text-blue-900 text-lg font-bold mb-4">
              {t("personalInfo.personalDetails")}
            </Text>
            {Field(
              t("personalInfo.fullName"),
              data.fullName,
              "fullName",
              <Ionicons
                name="person-circle-outline"
                size={20}
                color="#3b82f6"
              />
            )}
            {Field(
              t("personalInfo.emailAddress"),
              data.email,
              "email",
              <Ionicons name="mail-outline" size={20} color="#3b82f6" />
            )}
            {Field(
              t("personalInfo.phoneNumber"),
              data.phoneNumber,
              "phoneNumber",
              <Ionicons name="call-outline" size={20} color="#3b82f6" />
            )}
            {Field(
              t("personalInfo.dateOfBirth"),
              data.dateOfBirth,
              "dateOfBirth",
              <Ionicons name="calendar-outline" size={20} color="#3b82f6" />
            )}
            {Field(
              t("personalInfo.gender"),
              data.gender,
              "gender",
              <Ionicons name="male-female-outline" size={20} color="#3b82f6" />
            )}

            {/* Medical */}
            <Text className="text-blue-900 text-lg font-bold mt-4 mb-4">
              {t("personalInfo.medicalInformation")}
            </Text>
            {Field(
              t("personalInfo.medicalNumber"),
              data.medNo,
              "medNo",
              <Ionicons name="medkit-outline" size={20} color="#3b82f6" />
            )}
            {Field(
              t("personalInfo.medicalDate"),
              data.medDate,
              "medDate",
              <Ionicons name="time-outline" size={20} color="#3b82f6" />
            )}
            {Field(
              t("personalInfo.medicalFacility"),
              data.medFac,
              "medFac",
              <Ionicons name="business-outline" size={20} color="#3b82f6" />
            )}

            {/* Save */}
            <TouchableOpacity
              onPress={handleSave}
              disabled={saving || isLoading}
              className="bg-blue-600 rounded-2xl py-4 shadow-lg flex-row justify-center items-center mt-6 mb-10"
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Ionicons name="save-outline" size={18} color="#fff" />
              )}
              <Text className="text-white text-lg font-bold ml-2">
                {t("personalInfo.saveProfile")}
              </Text>
            </TouchableOpacity>

            {/* Disclaimer */}
            <View className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-8">
              <View className="flex-row items-start">
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#2563eb"
                />
                <View className="flex-1 ml-3">
                  <Text className="text-blue-900 font-semibold text-sm mb-1">
                    {t("personalInfo.medicalInfoNotice")}
                  </Text>
                  <Text className="text-blue-800 text-xs leading-5">
                    {t("personalInfo.medicalInfoNoteText")}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Avatar Selection Modal */}
        <Modal
          visible={showAvatarModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowAvatarModal(false)}
        >
          <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
            <View className="bg-white rounded-2xl mx-8 p-6 w-full max-w-sm">
              <Text className="text-xl font-bold text-gray-900 text-center mb-6">
                {t("personalInfo.changeAvatar")}
              </Text>

              <Text className="text-gray-600 text-center mb-6">
                {t("personalInfo.chooseHowToUpdateAvatar")}
              </Text>

              <View className="space-y-4">
                {/* Camera Option */}
                <TouchableOpacity
                  onPress={takePhoto}
                  className="flex-row items-center p-4 bg-blue-50 rounded-xl border border-blue-200"
                >
                  <View className="w-12 h-12 bg-blue-600 rounded-xl items-center justify-center mr-4">
                    <Ionicons name="camera-outline" size={24} color="#fff" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-semibold text-lg">
                      {t("personalInfo.takePhoto")}
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      {t("personalInfo.useCameraToTakePhoto")}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Library Option */}
                <TouchableOpacity
                  onPress={pickFromLibrary}
                  className="flex-row items-center p-4 bg-green-50 rounded-xl border border-green-200"
                >
                  <View className="w-12 h-12 bg-green-600 rounded-xl items-center justify-center mr-4">
                    <Ionicons name="images-outline" size={24} color="#fff" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-semibold text-lg">
                      {t("personalInfo.chooseFromLibrary")}
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      {t("personalInfo.selectExistingPhoto")}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Cancel Button */}
              <TouchableOpacity
                onPress={() => setShowAvatarModal(false)}
                className="mt-6 py-3 px-6 border border-gray-300 rounded-xl"
              >
                <Text className="text-gray-600 font-medium text-center">
                  {t("common.cancel")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}
