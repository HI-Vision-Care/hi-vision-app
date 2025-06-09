// models/ui/controls.types.ts
import {
  GestureResponderEvent,
  ImageSourcePropType,
  TextInputProps,
  TouchableOpacityProps,
} from "react-native";

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
  textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  className?: string;
}

export interface CustomButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: "primary" | "outline" | "secondary";
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface InputFieldProps extends TextInputProps {
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
