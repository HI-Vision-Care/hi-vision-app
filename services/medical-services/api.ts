import api from "@/config/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MedicalService } from "./types";

export const getAllMedicalServices = async (): Promise<MedicalService[]> => {
  const token = await AsyncStorage.getItem("token"); // <— dùng đúng key
  if (!token) throw new Error("No auth token found");
  const { data } = await api.get<MedicalService[]>("/medical-service", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getDoctorsBySpecialty = async (specialty: string) => {
  const res = await api.get(`/doctor/specialty/${specialty}`);
  return res.data;
};
