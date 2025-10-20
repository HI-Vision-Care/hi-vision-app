// services/auth/api.ts
import api from "@/config/axios";
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
    console.log("SignUp API Error Details:", {
      message: err.message,
      code: err.code,
      response: err.response?.data,
      status: err.response?.status,
      statusText: err.response?.statusText,
    });

    const backendMsg = err.response?.data?.message;
    throw new Error(backendMsg ?? err.message);
  }
};

/**
 * Gọi API quên mật khẩu để gửi OTP về email
 */
export const forgotPassword = async (
  params: ForgotPasswordParams
): Promise<ForgotPasswordResponse> => {
  try {
    const requestBody = {
      email: params.email,
    };
    console.log("Request body:", requestBody);

    // Skip authentication cho public endpoint
    const response = await api.post<ForgotPasswordResponse>(
      "/account/forgot-password",
      requestBody,
      {
        skipAuth: true, // Flag để interceptor skip
      } as any
    );

    console.log("ForgotPassword Success Response:", response.data);
    return response.data;
  } catch (err: any) {
    console.log("=== ForgotPassword API Error ===");
    console.log("Error Details:", {
      message: err.message,
      code: err.code,
      response: err.response?.data,
      status: err.response?.status,
      statusText: err.response?.statusText,
      url: err.config?.url,
      fullUrl: err.config?.baseURL + err.config?.url,
      requestData: err.config?.data, // Log cả data đã gửi
      requestHeaders: err.config?.headers,
    });

    const backendMsg = err.response?.data?.message;
    throw new Error(backendMsg ?? err.message);
  }
};

/**
 * Gọi API xác thực OTP
 */
export const verifyOtp = async (
  params: VerifyOtpParams
): Promise<VerifyOtpResponse> => {
  try {
    // Skip authentication cho public endpoint
    const response = await api.post<VerifyOtpResponse>(
      "/account/verify-otp",
      {
        email: params.email,
        otp: params.otp,
      },
      {
        skipAuth: true, // Flag để interceptor skip
      } as any
    );
    return response.data;
  } catch (err: any) {
    console.log("VerifyOtp API Error Details:", {
      message: err.message,
      code: err.code,
      response: err.response?.data,
      status: err.response?.status,
      statusText: err.response?.statusText,
    });

    const backendMsg = err.response?.data?.message;
    throw new Error(backendMsg ?? err.message);
  }
};

/**
 * Gọi API reset mật khẩu với OTP đã xác thực
 */
export const resetPassword = async (
  params: ResetPasswordParams
): Promise<ResetPasswordResponse> => {
  try {
    // Skip authentication cho public endpoint
    const response = await api.post<ResetPasswordResponse>(
      "/account/reset-password",
      {
        email: params.email,
        otp: params.otp,
        newPassword: params.newPassword,
      },
      {
        skipAuth: true, // Flag để interceptor skip
      } as any
    );
    return response.data;
  } catch (err: any) {
    console.log("ResetPassword API Error Details:", {
      message: err.message,
      code: err.code,
      response: err.response?.data,
      status: err.response?.status,
      statusText: err.response?.statusText,
    });

    const backendMsg = err.response?.data?.message;
    throw new Error(backendMsg ?? err.message);
  }
};
