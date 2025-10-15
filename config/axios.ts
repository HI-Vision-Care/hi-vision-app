// src/config/api.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "https://hivision.io.vn/HiVision",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000, // Tăng timeout lên 30 giây
  // Thêm các options để xử lý network issues
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },
});

// Trước mỗi request, đọc token và gắn vào header
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor để xử lý lỗi tốt hơn
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Chỉ log lỗi quan trọng, không log lỗi 404 "User not found" spam
    const shouldLog =
      error.response?.status >= 500 ||
      (error.response?.status === 404 &&
        !error.config?.url?.includes("blog-post")) ||
      !error.response; // Network errors

    if (shouldLog) {
      console.log("Axios Response Error:", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        config: {
          baseURL: error.config?.baseURL,
          url: error.config?.url,
          method: error.config?.method,
          timeout: error.config?.timeout,
        },
      });
    }

    // Nếu là lỗi network (không có response)
    if (!error.response) {
      // Tạo error message chi tiết hơn
      let errorMessage = "Network Error";

      if (error.code === "ECONNREFUSED") {
        errorMessage = "Connection refused - Server may be down";
      } else if (error.code === "ENOTFOUND") {
        errorMessage = "DNS lookup failed - Check your internet connection";
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Request timeout - Server took too long to respond";
      } else if (error.message.includes("Network Error")) {
        errorMessage =
          "Network request failed - Check your internet connection";
      }

      const networkError = new Error(errorMessage);
      networkError.name = "NetworkError";
      networkError.code = error.code;
      return Promise.reject(networkError);
    }

    return Promise.reject(error);
  }
);

export default api;
