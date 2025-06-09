// models/auth/auth.types.ts

// --- reset / OTP flow:
export interface ResetOptionCardProps {
  icon: any; // ví dụ icons.email
  title: string; // "Send via Email"
  subtitle: string; // "Reset password via email."
  selected?: boolean;
  onPress: () => void;
}

export interface PasswordSentModalProps {
  visible: boolean;
  email: string;
  onResend: () => void;
  onClose: () => void;
}

export interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onCountryPress?: () => void;
}

export interface OTPInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  onChangeText?: (otp: string) => void;
}
