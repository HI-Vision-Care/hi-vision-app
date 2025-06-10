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
  /**
   * Nhãn hiển thị phía trên ô input (ví dụ: "Email Address", "Password", …).
   * Nếu không truyền thì label sẽ không hiện.
   */
  label?: string;

  /**
   * Icon hiển thị bên trái (ví dụ: require('@/assets/icons/mail.png')).
   * Dạng ImageSourcePropType để bạn có thể dùng require(...) hoặc uri.
   */
  icon?: ImageSourcePropType;

  /**
   * Nếu true, TextInput sẽ ẩn ký tự (dành cho password).
   * TextInputProps cũng đã có sẵn secureTextEntry, nhưng để rõ ràng
   * bạn vẫn có thể khai báo lại.
   */
  secureTextEntry?: boolean;

  /**
   * Các style dạng string (NativeWind/Tailwind) để override:
   * - containerStyle: style cho View bao ngoài TextInput
   * - labelStyle: style cho Text label phía trên
   * - inputStyle: style cho chính TextInput (font, màu, padding, v.v.)
   * - iconStyle: style cho Image icon bên trái
   */
  containerStyle?: string;
  labelStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
}

declare interface HealthBackground {
  goal?: string;
  gender?: string;
  weight?: number;
  weightUnit?: "lbs" | "kg";
  age?: number;
  bloodType?: string;
}


declare interface HBContextType  {
  data: HealthBackground;
  setData: React.Dispatch<React.SetStateAction<HealthBackground>>;
};