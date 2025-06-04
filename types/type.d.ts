import { ImageSourcePropType, TextInputProps } from "react-native";

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
