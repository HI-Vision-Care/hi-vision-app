import { HeaderBack } from "@/components";
import { usePatientProfile } from "@/hooks/usePatientId";
import { useUpdatePatientProfile, useUploadAccountAvatar } from "@/services/patient/hooks";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
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
  underlyingDiseases: string;
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
    underlyingDiseases: "",
  });
  const [focusedField, setFocusedField] = useState<string>("");
  const [avatarUri, setAvatarUri] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  const updateMutation = useUpdatePatientProfile();
  const uploadAvatarMutation = useUploadAccountAvatar();

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
      underlyingDiseases:
        (profile.patientDiseases || [])
          .map((pd) => pd?.disease?.name)
          .filter(Boolean)
          .join(", ") || "",
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
      await updateMutation.mutateAsync({
        patientId,
        payload: {
          name: data.fullName,
          dob: parseISO(data.dateOfBirth),
          gender: data.gender,
          medNo: data.medNo,
          medDate: parseISO(data.medDate),
          medFac: data.medFac,
          underlyingDiseases: data.underlyingDiseases,
        },
      });
      if (avatarUri && accountId) {
        await uploadAvatarMutation.mutateAsync({ accountId, uri: avatarUri });
      }
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
            <View className="relative">
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
              <View className="absolute -bottom-2 left-0 right-0 flex-row gap-3 justify-center">
                <TouchableOpacity
                  onPress={takePhoto}
                  className="bg-blue-600 rounded-full px-3 py-2 items-center flex-row"
                >
                  <Ionicons name="camera-outline" size={16} color="#fff" />
                  <Text className="text-white ml-1">Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={pickFromLibrary}
                  className="bg-white border border-blue-200 rounded-full px-3 py-2 items-center flex-row"
                >
                  <Ionicons name="images-outline" size={16} color="#2563eb" />
                  <Text className="text-blue-700 ml-1">Library</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View className="px-6">
            {/* Personal */}
            <Text className="text-blue-900 text-lg font-bold mb-4">Personal Details</Text>
            {Field("Full Name", data.fullName, "fullName", (
              <Ionicons name="person-circle-outline" size={20} color="#3b82f6" />
            ))}
            {Field("Email Address", data.email, "email", (
              <Ionicons name="mail-outline" size={20} color="#3b82f6" />
            ))}
            {Field("Phone Number", data.phoneNumber, "phoneNumber", (
              <Ionicons name="call-outline" size={20} color="#3b82f6" />
            ))}
            {Field("Date of Birth", data.dateOfBirth, "dateOfBirth", (
              <Ionicons name="calendar-outline" size={20} color="#3b82f6" />
            ))}
            {Field("Gender", data.gender, "gender", (
              <Ionicons name="male-female-outline" size={20} color="#3b82f6" />
            ))}

            {/* Medical */}
            <Text className="text-blue-900 text-lg font-bold mt-4 mb-4">Medical Information</Text>
            {Field("Medical Number", data.medNo, "medNo", (
              <Ionicons name="medkit-outline" size={20} color="#3b82f6" />
            ))}
            {Field("Medical Date", data.medDate, "medDate", (
              <Ionicons name="time-outline" size={20} color="#3b82f6" />
            ))}
            {Field("Medical Facility", data.medFac, "medFac", (
              <Ionicons name="business-outline" size={20} color="#3b82f6" />
            ))}
            {Field(
              "Underlying Diseases",
              data.underlyingDiseases,
              "underlyingDiseases",
              <Ionicons name="document-text-outline" size={20} color="#3b82f6" />,
              { multiline: true }
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
              <Text className="text-white text-lg font-bold ml-2">Save Profile</Text>
            </TouchableOpacity>

            {/* Disclaimer */}
            <View className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-8">
              <View className="flex-row items-start">
                <Ionicons name="information-circle-outline" size={20} color="#2563eb" />
                <View className="flex-1 ml-3">
                  <Text className="text-blue-900 font-semibold text-sm mb-1">
                    Medical Information Notice
                  </Text>
                  <Text className="text-blue-800 text-xs leading-5">
                    Your information is confidential. Ensure it’s accurate and up-to-date.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

