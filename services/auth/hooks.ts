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
    // mutation function chính
    mutationFn: signIn,

    // tuỳ chọn khi thành công (ví dụ lưu token, invalidate cache…)
    onSuccess: (data) => {
      // ví dụ: lưu token vào AsyncStorage, rồi invalidate user-profile query
      // AsyncStorage.setItem("token", data.token);
      // queryClient.invalidateQueries(["userProfile"]);
    },

    // tuỳ chọn khi lỗi
    onError: (error) => {
      // có thể show toast hoặc log
      console.error("SignIn failed:", error.message);
    },
  });
};

export const useSignUp = () => {
  return useMutation<SignUpResponse, Error, SignUpParams>({
    mutationFn: signUp,
    onSuccess: async (data) => {
      // Ví dụ: sau khi register thành công, tự động login luôn?
      // Nếu API của bạn trả token ngay sau signup, bạn có thể lưu và redirect:
      // await AsyncStorage.setItem("token", data.token);
      // queryClient.invalidateQueries(["userProfile"]);
    },
    onError: (error) => {},
  });
};
