// src/config/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.100.21:8080/HiVision",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

export default api;
