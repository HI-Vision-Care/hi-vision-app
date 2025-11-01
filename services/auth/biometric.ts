import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export interface BiometricType {
  available: boolean;
  type: "fingerprint" | "face" | "iris" | "none";
  name: string;
}

export interface AuthenticationResult {
  success: boolean;
  error?: string;
}

const PIN_KEY = "user_pin";
const BIOMETRIC_ENABLED_KEY = "biometric_enabled";
const LAST_AUTH_TIME_KEY = "last_auth_time";
const AUTH_TIMEOUT = 5 * 60 * 1000; // 5 phút

/**
 * Kiểm tra thiết bị có hỗ trợ sinh trắc học không
 */
export async function checkBiometricSupport(): Promise<BiometricType> {
  try {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      return {
        available: false,
        type: "none",
        name: "Không hỗ trợ",
      };
    }

    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) {
      return {
        available: false,
        type: "none",
        name: "Chưa thiết lập",
      };
    }

    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    
    let type: "fingerprint" | "face" | "iris" = "fingerprint";
    let name = "Vân tay";

    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      type = "face";
      name = Platform.OS === "ios" ? "Face ID" : "Nhận diện khuôn mặt";
    } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      type = "iris";
      name = "Iris";
    } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      type = "fingerprint";
      name = Platform.OS === "ios" ? "Touch ID" : "Vân tay";
    }

    return {
      available: true,
      type,
      name,
    };
  } catch (error) {
    console.error("Error checking biometric support:", error);
    return {
      available: false,
      type: "none",
      name: "Không hỗ trợ",
    };
  }
}

/**
 * Xác thực bằng sinh trắc học
 */
export async function authenticateWithBiometric(
  reason: string = "Xác thực danh tính của bạn"
): Promise<AuthenticationResult> {
  try {
    const biometric = await checkBiometricSupport();
    if (!biometric.available) {
      return {
        success: false,
        error: "Thiết bị không hỗ trợ hoặc chưa thiết lập sinh trắc học",
      };
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: reason,
      cancelLabel: "Hủy",
      disableDeviceFallback: false, // Cho phép fallback về system PIN/password
      fallbackLabel: Platform.OS === "ios" ? "Nhập mã PIN" : "Sử dụng mã PIN",
    });

    if (result.success) {
      await saveLastAuthTime();
      return { success: true };
    } else {
      return {
        success: false,
        error: result.error === "user_cancel" 
          ? "Đã hủy xác thực" 
          : "Xác thực thất bại",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Lỗi xác thực sinh trắc học",
    };
  }
}

/**
 * Lưu mã PIN
 */
export async function savePin(pin: string): Promise<boolean> {
  try {
    await SecureStore.setItemAsync(PIN_KEY, pin);
    return true;
  } catch (error) {
    console.error("Error saving PIN:", error);
    return false;
  }
}

/**
 * Kiểm tra mã PIN
 */
export async function verifyPin(pin: string): Promise<boolean> {
  try {
    const savedPin = await SecureStore.getItemAsync(PIN_KEY);
    if (!savedPin) {
      return false;
    }
    return pin === savedPin;
  } catch (error) {
    console.error("Error verifying PIN:", error);
    return false;
  }
}

/**
 * Kiểm tra đã có PIN chưa
 */
export async function hasPin(): Promise<boolean> {
  try {
    const pin = await SecureStore.getItemAsync(PIN_KEY);
    return pin !== null;
  } catch (error) {
    return false;
  }
}

/**
 * Xóa PIN
 */
export async function deletePin(): Promise<boolean> {
  try {
    await SecureStore.deleteItemAsync(PIN_KEY);
    return true;
  } catch (error) {
    console.error("Error deleting PIN:", error);
    return false;
  }
}

/**
 * Bật/tắt sinh trắc học
 */
export async function setBiometricEnabled(enabled: boolean): Promise<boolean> {
  try {
    await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, enabled ? "true" : "false");
    return true;
  } catch (error) {
    console.error("Error setting biometric enabled:", error);
    return false;
  }
}

/**
 * Kiểm tra sinh trắc học đã được bật chưa
 */
export async function isBiometricEnabled(): Promise<boolean> {
  try {
    const enabled = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);
    return enabled === "true";
  } catch (error) {
    return false;
  }
}

/**
 * Lưu thời gian xác thực cuối cùng
 */
async function saveLastAuthTime(): Promise<void> {
  try {
    await SecureStore.setItemAsync(LAST_AUTH_TIME_KEY, Date.now().toString());
  } catch (error) {
    console.error("Error saving last auth time:", error);
  }
}

/**
 * Kiểm tra xác thực còn hiệu lực không (trong vòng 5 phút)
 */
export async function isAuthStillValid(): Promise<boolean> {
  try {
    const lastAuthTime = await SecureStore.getItemAsync(LAST_AUTH_TIME_KEY);
    if (!lastAuthTime) {
      return false;
    }

    const time = parseInt(lastAuthTime, 10);
    const now = Date.now();
    return (now - time) < AUTH_TIMEOUT;
  } catch (error) {
    return false;
  }
}

/**
 * Xóa tất cả dữ liệu xác thực
 */
export async function clearAllAuthData(): Promise<void> {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(PIN_KEY),
      SecureStore.deleteItemAsync(BIOMETRIC_ENABLED_KEY),
      SecureStore.deleteItemAsync(LAST_AUTH_TIME_KEY),
    ]);
  } catch (error) {
    console.error("Error clearing auth data:", error);
  }
}

