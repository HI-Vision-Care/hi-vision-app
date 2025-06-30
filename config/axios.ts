// src/config/api.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.100.21:8080/HiVision",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
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

export default api;
