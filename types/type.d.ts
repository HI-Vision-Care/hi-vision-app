import { ImageSourcePropType, TextInputProps } from "react-native";

import { IoniconsGlyphs } from "@expo/vector-icons/build/Ionicons";

declare interface MarkerData {
  latitude: number;
  longitude: number;
  id: number;
  title: string;
  profile_image_url: string;
  car_image_url: string;
  car_seats: number;
  rating: number;
  first_name: string;
  last_name: string;
  time?: number;
  price?: string;
}

declare interface ButtonProps extends TouchableOpacityProps {
  title: string;
  bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
  textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  className?: string;
}

declare interface CustomButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: "primary" | "outline" | "secondary";
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  leftIcon?: React.ReactNode; // <-- cho phép nhận React element
  rightIcon?: React.ReactNode; // <-- cho phép nhận React element
}

declare interface InputFieldProps extends TextInputProps {
  label?: string;
  icon?: ImageSourcePropType;
  secureTextEntry?: boolean;
  errorMessage?: string;
  errorIcon?: any;
  containerStyle?: string;
  labelStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
}

declare interface ResetOptionCardProps {
  icon: any; // Icon object (ví dụ icons.email)
  title: string; // "Send via Email"
  subtitle: string; // "Reset password via email."
  selected?: boolean;
  onPress: () => void;
}

declare interface PasswordSentModalProps {
  visible: boolean;
  email: string;
  onResend: () => void;
  onClose: () => void;
}

declare interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onCountryPress?: () => void;
}

declare interface OTPInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  onChangeText?: (otp: string) => void;
}

export interface ActivityIcon {
  name: string;
  color: string;
  bg: string;
}

export type ActivityType = "linear" | "status" | "tags" | "circular";

export interface ActivityData {
  id: number;
  title: string;
  icon: ActivityIcon;
  type: ActivityType;
  currentValue?: number;
  targetValue?: number;
  unit?: string;
  description?: string;
  tags?: string[];
  progress?: number;
}

declare interface ActivityItemProps {
  item: ActivityData;
}

export interface MetricCardProps {
  color: string;
  title: string;
  icon: IoniconsGlyphs;
  value: string;
  unit: string;
  children: React.ReactNode;
}

export interface MenuItems {
  key: string;
  title: string;
  icon: any;
  bgColor: string;
  duration: string;
  price: string;
  illustration: any;
  iconBgColor: string;
}

export interface BookingData {
  service: string;
  doctor: string;
  date: Date;
  isAnonymous: boolean;
  notes: string;
}

export interface MenuItem {
  id: string;
  title: string;
  icon: string;
  hasArrow?: boolean;
  isToggle?: boolean;
  toggleValue?: boolean;
  isDanger?: boolean;
  iconColor?: string;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export interface FeatureCard {
  id: string;
  title: string;
  icon: string;
  hasBadge?: boolean;
  badgeCount?: number;
}

export type Service = {
  serviceID: number;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  isRequireDoctor: boolean;
  isOnline: boolean;
  specialty: string;
  img: string;
  illustrationUri?: string;
  iconBgColor?: string;
};

export interface Account {
  id: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  isDeleted: boolean;
}

export interface Patient {
  patientID: string;
  account: Account;
  name: string;
  dob: string;
  gender: string;
  medNo: string;
  medDate: string;
  medFac: string;
}

export interface Doctor {
  doctorID: string;
  account: Account;
  name: string;
  gender: string;
  specialty: string;
  degrees: string;
  img: string | null;
}

export interface MedicalRecord {
  appointmentID: string;
  id?: string;
  isAnnoymous?: boolean;
  patient: Patient;
  doctor: Doctor;
  date?: string;
  status?: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  medicalService: {
    name: string;
  };
  appointmentDate?: date;
}

export interface LabResult {
  recordId: string;
  testType: string;
  resultValue: string;
  testDate: string;
}

export interface ConsultationRequest {
  phone: string;
  name: string;
  note: string;
}