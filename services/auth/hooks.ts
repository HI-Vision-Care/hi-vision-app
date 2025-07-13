import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { signIn, signUp } from "./api";
import {
  SignInParams,
  SignInResponse,
  SignUpParams,
  SignUpResponse,
} from "./types";

export const useSignIn = () => {
  return useMutation<SignInResponse, Error, SignInParams>({
    mutationFn: signIn,
    onSuccess: async (data) => {
      if (data?.token) {
        await AsyncStorage.setItem("token", data.token);
      }
      // Có thể invalidate cache hoặc fetch profile ở đây nếu muốn
    },
    onError: (error) => {
      console.error("SignIn failed:", error.message);
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
