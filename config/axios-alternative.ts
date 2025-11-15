// Alternative axios configuration for debugging
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const apiAlternative = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "https://hivision.io.vn/HiVision",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "User-Agent": "HiVision-Mobile-App/1.0.0",
  },
  timeout: 60000, // 60 giây timeout
  // Thêm các options để xử lý network issues
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Accept more status codes
  },
  // Thêm proxy configuration nếu cần
  // proxy: false,
  // Thêm SSL/TLS options
  httpsAgent: {
    rejectUnauthorized: false, // Chỉ dùng trong development
  },
});

// Request interceptor
apiAlternative.interceptors.request.use(
  async (config) => {
    console.log("Making request to:", config.baseURL + config.url);
    const token = await AsyncStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiAlternative.interceptors.response.use(
  (response) => {
    console.log("Response received:", {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.log("Alternative API Error:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      stack: error.stack,
    });

    return Promise.reject(error);
  }
);

export default apiAlternative;
