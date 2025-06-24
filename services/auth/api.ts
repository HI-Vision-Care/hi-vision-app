// services/auth/api.ts
import api from "@/config/axios";
import {
  SignInParams,
  SignInResponse,
  SignUpParams,
  SignUpResponse,
} from "./types";

export const signIn = async (params: SignInParams): Promise<SignInResponse> => {
  const response = await api.post("/account/login", {
    username: params.username,
    password: params.password,
  });
  console.log("➡️ login response:", response.data);
  // nếu server trả { token, username } trực tiếp, thì response.data.data sẽ undefined
  // nên ta return phù hợp:
  return response.data.data ?? response.data;
};

// —— MỚI ——
// Params gửi lên register

// Data trả về sau register

/**
 * Gọi API đăng ký tài khoản rồi trả về object bên trong `data`
 */
export const signUp = async (params: SignUpParams): Promise<SignUpResponse> => {
  const { data } = await api.post<{
    code: number;
    data: SignUpResponse;
  }>("/account/register", {
    username: params.username,
    password: params.password,
    email: params.email,
    phone: params.phone,
  });

  return data.data;
};
