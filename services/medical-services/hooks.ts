import { icons, images } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { getAllMedicalServices } from "./api";
import { UIMedicalService } from "./types";

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
        duration: "15 minutes",
      }));
    },
    { staleTime: 1000 * 60 * 5 }
  );
