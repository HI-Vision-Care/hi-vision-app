// services/auth/api.ts
import api from "@/config/axios";

export interface SignInParams {
  username: string;
  password: string;
}
export interface SignInResponse {
  token: string;
  username: string;
}
export const signIn = async (params: SignInParams): Promise<SignInResponse> => {
  const { data } = await api.post<{ code: number; data: SignInResponse }>(
    "/account/login",
    {
      username: params.username,
      password: params.password,
    }
  );
  return data.data;
};

// —— MỚI ——
// Params gửi lên register
export interface SignUpParams {
  username: string;
  password: string;
  email: string;
  phone: string;
}
// Data trả về sau register
export interface SignUpResponse {
  id: string;
  username: string;
  password: string; // đây là password đã được hash
  email: string;
  phone: string;
}

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
