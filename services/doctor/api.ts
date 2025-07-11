import axios from "../../config/axios";
import { Doctor } from "./types";

export const getDoctors = async (): Promise<Doctor[]> => {
  const response = await axios.get<Doctor[]>("/doctor");
  return response.data;
};
