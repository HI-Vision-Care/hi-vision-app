import { icons, images } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getAllMedicalServices } from "./api";
import { BookingService, UIMedicalService } from "./types";

export const useMedicalServices = () =>
  useQuery<UIMedicalService[]>(
    ["medicalServices"],
    async () => {
      const apiData = await getAllMedicalServices();
      return apiData.map((item) => ({
        ...item,
        iconUri: icons.virus103,
        iconBgColor: item.isOnline ? "#10B981" : "#3B82F6",
        illustrationUri: images.hivtest,
      }));
    },
    { staleTime: 1000 * 60 * 5 }
  );

export const useGetBookingServices = () => {
  return useQuery<BookingService[], Error>(["bookingServices"], async () => {
    const res = await axios.get<BookingService[]>("/medical-service");
    return res.data;
  });
};
