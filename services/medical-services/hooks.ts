import { icons, images } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getAllMedicalServices, getDoctorsBySpecialty } from "./api";
import { BookingService, Doctor, UIMedicalService } from "./types";

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
        // Đảm bảo giữ lại testItems, type và mọi trường mới từ BE:
        testItems: item.testItems,
        type: item.type,
        // specialty vẫn optional, backend mới trả thì lấy, không có thì bỏ
        specialty: item.specialty,
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

export const useDoctorsBySpecialty = (specialty: string) =>
  useQuery<Doctor[]>(
    ["doctorsBySpecialty", specialty],
    async () => {
      // Gọi API trả về danh sách bác sĩ
      const apiData = await getDoctorsBySpecialty(specialty);
      // Nếu cần mapping UI (thêm trường gì cho UI) thì mapping tại đây
      return apiData;
    },
    {
      enabled: !!specialty, // Chỉ chạy khi specialty có giá trị
      staleTime: 1000 * 60 * 5, // Nếu bạn muốn cache lâu hơn
    }
  );
