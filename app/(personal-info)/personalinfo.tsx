import { HeaderBack } from "@/components";
import { usePatientProfile } from "@/hooks/usePatientId";
import {
  useUpdatePatientProfile,
  useUploadAccountAvatar,
} from "@/services/patient/hooks";
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

  const updateMutation = useUpdatePatientProfile();
  const uploadAvatarMutation = useUploadAccountAvatar();
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
      Alert.alert("Image Picker", e?.message || "Unable to open library");
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
      Alert.alert("Camera", e?.message || "Unable to open camera");
    }
  };

  const handleSave = async () => {
    if (!patientId) return Alert.alert("Profile", "Missing patient id");
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

      Alert.alert("Success", "Profile updated");
    } catch (e: any) {
      Alert.alert("Update failed", e?.message || "Please try again");
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
                placeholder={`Enter ${label.toLowerCase()}`}
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

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#eaf2fb" />
      <SafeAreaView className="flex-1 bg-blue-50">
        <HeaderBack title="Personal Information" />
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile header */}
          <View className="items-center pt-2 mb-6">
            <TouchableOpacity
              onPress={() => setShowAvatarModal(true)}
              className="relative"
            >
              <View className="w-28 h-28 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden">
                <Image
                  source={{
                    uri:
                      avatarUri ||
                      profile?.account?.avatar ||
                      "https://via.placeholder.com/120x120.png?text=Avatar",
                  }}
                  className="w-full h-full"
                />
              </View>
              {/* Edit overlay */}
              <View className="absolute inset-0 bg-black bg-opacity-20 rounded-full items-center justify-center">
                <View className="bg-white bg-opacity-90 rounded-full p-2">
                  <Ionicons name="camera-outline" size={20} color="#2563eb" />
                </View>
              </View>
              {/* Camera icon indicator */}
              <View className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-2 border-2 border-white">
                <Ionicons name="camera" size={16} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text className="text-gray-600 text-sm mt-2">
              Tap to change avatar
            </Text>
          </View>

          <View className="px-6">
            {/* Personal */}
            <Text className="text-blue-900 text-lg font-bold mb-4">
              Personal Details
            </Text>
            {Field(
              "Full Name",
              data.fullName,
              "fullName",
              <Ionicons
                name="person-circle-outline"
                size={20}
                color="#3b82f6"
              />
            )}
            {Field(
              "Email Address",
              data.email,
              "email",
              <Ionicons name="mail-outline" size={20} color="#3b82f6" />
            )}
            {Field(
              "Phone Number",
              data.phoneNumber,
              "phoneNumber",
              <Ionicons name="call-outline" size={20} color="#3b82f6" />
            )}
            {Field(
              "Date of Birth",
              data.dateOfBirth,
              "dateOfBirth",
              <Ionicons name="calendar-outline" size={20} color="#3b82f6" />
            )}
            {Field(
              "Gender",
              data.gender,
              "gender",
              <Ionicons name="male-female-outline" size={20} color="#3b82f6" />
            )}

            {/* Medical */}
            <Text className="text-blue-900 text-lg font-bold mt-4 mb-4">
              Medical Information
            </Text>
            {Field(
              "Medical Number",
              data.medNo,
              "medNo",
              <Ionicons name="medkit-outline" size={20} color="#3b82f6" />
            )}
            {Field(
              "Medical Date",
              data.medDate,
              "medDate",
              <Ionicons name="time-outline" size={20} color="#3b82f6" />
            )}
            {Field(
              "Medical Facility",
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
                Save Profile
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
                    Medical Information Notice
                  </Text>
                  <Text className="text-blue-800 text-xs leading-5">
                    Your information is confidential. Ensure it’s accurate and
                    up-to-date.
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
                Change Avatar
              </Text>

              <Text className="text-gray-600 text-center mb-6">
                Choose how you'd like to update your profile picture
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
                      Take Photo
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      Use your camera to take a new photo
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
                      Choose from Library
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      Select an existing photo from your gallery
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
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}
