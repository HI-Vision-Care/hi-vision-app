// Alternative auth API using fetch instead of axios
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SignInParams,
  SignInResponse,
  SignUpParams,
  SignUpResponse,
} from "./types";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://hivision.io.vn/HiVision";

const makeRequest = async (
  endpoint: string,
  data: any,
  method: string = "POST"
): Promise<any> => {
  const url = `${BASE_URL}${endpoint}`;

  console.log(`Making ${method} request to:`, url);
  console.log("Request data:", data);

  const token = await AsyncStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(30000), // 30 seconds timeout
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          message: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      console.log("Error response data:", errorData);
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    const responseData = await response.json();
    console.log("Success response data:", responseData);

    return responseData.data ?? responseData;
  } catch (error: any) {
    console.log("Request error:", error);

    if (error.name === "AbortError") {
      throw new Error("Request timeout - Server took too long to respond");
    }

    throw error;
  }
};

export const signIn = async (params: SignInParams): Promise<SignInResponse> => {
  try {
    return await makeRequest("/account/login", {
      email: params.email,
      password: params.password,
    });
  } catch (error: any) {
    console.log("SignIn API Error Details:", {
      message: error.message,
      name: error.name,
    });

    throw new Error(error.message);
  }
};

export const signUp = async (params: SignUpParams): Promise<SignUpResponse> => {
  try {
    return await makeRequest("/account/register", {
      password: params.password,
      email: params.email,
      phone: params.phone,
    });
  } catch (error: any) {
    console.log("SignUp API Error Details:", {
      message: error.message,
      name: error.name,
    });

    throw new Error(error.message);
  }
};
