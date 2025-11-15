import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import {
  forgotPassword,
  resetPassword,
  signIn,
  signUp,
  verifyOtp,
} from "./api";
import {
  ForgotPasswordParams,
  ForgotPasswordResponse,
  ResetPasswordParams,
  ResetPasswordResponse,
  SignInParams,
  SignInResponse,
  SignUpParams,
  SignUpResponse,
  VerifyOtpParams,
  VerifyOtpResponse,
} from "./types";

export const useSignIn = () => {
  return useMutation<SignInResponse, Error, SignInParams>({
    mutationFn: signIn,
    onSuccess: async (data) => {
      try {
        if (data?.token) {
          await AsyncStorage.setItem("token", data.token);
        }
      } catch (storageError) {
        console.error("Failed to save token:", storageError);
        throw new Error("Không thể lưu thông tin đăng nhập. Vui lòng thử lại.");
      }
    },
    onError: (error) => {
      // Log error but don't throw - let the component handle it
      console.error("SignIn failed:", error.message);
      // Ensure error has a message
      if (!error.message) {
        error.message = "Đăng nhập thất bại. Vui lòng thử lại.";
      }
    },
  });
};

export const useSignUp = () => {
  return useMutation<SignUpResponse, Error, SignUpParams>({
    mutationFn: signUp,
    onSuccess: async (data) => {
      if (data?.token) {
        await AsyncStorage.setItem("token", data.token);
      }
    },
  });
};

export const useForgotPassword = () => {
  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordParams>({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      console.log("ForgotPassword success:", data.message);
    },
    onError: (error) => {
      console.error("ForgotPassword failed:", error.message);
    },
  });
};

export const useVerifyOtp = () => {
  return useMutation<VerifyOtpResponse, Error, VerifyOtpParams>({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      console.log("VerifyOtp success:", data.message);
    },
    onError: (error) => {
      console.error("VerifyOtp failed:", error.message);
    },
  });
};

export const useResetPassword = () => {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordParams>({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      console.log("ResetPassword success:", data.message);
    },
    onError: (error) => {
      console.error("ResetPassword failed:", error.message);
    },
  });
};
