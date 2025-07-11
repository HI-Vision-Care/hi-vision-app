// services/auth/api.ts
import api from "@/config/axios";
import {
  SignInParams,
  SignInResponse,
  SignUpParams,
  SignUpResponse,
} from "./types";

export const signIn = async (params: SignInParams): Promise<SignInResponse> => {
  try {
    const response = await api.post<{
      code: number;
      message: string;
      data: SignInResponse;
    }>("/account/login", {
      email: params.email,
      password: params.password,
    });
    return response.data.data ?? response.data;
  } catch (err: any) {
    const backendMsg = err.response?.data?.message;
    throw new Error(backendMsg ?? err.message);
  }
};

// —— MỚI ——
// Params gửi lên register

// Data trả về sau register

/**
 * Gọi API đăng ký tài khoản rồi trả về object bên trong `data`
 */
export const signUp = async (params: SignUpParams): Promise<SignUpResponse> => {
  try {
    const response = await api.post<{
      code: number;
      message: string;
      data: SignUpResponse;
    }>("/account/register", {
      password: params.password,
      email: params.email,
      phone: params.phone,
    });
    return response.data.data ?? response.data;
  } catch (err: any) {
    const backendMsg = err.response?.data?.message;
    throw new Error(backendMsg ?? err.message);
  }
};
