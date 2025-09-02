// services/facility/api.ts
import axios from "@/config/axios";
import type { Facility, FacilityDetail } from "./types";

/** Lấy danh sách phòng khám */
export const getFacilities = async (): Promise<Facility[]> => {
  const res = await axios.get<Facility[]>("/facility");
  return res.data;
};

/** Lấy chi tiết phòng khám theo facilityID */
export const getFacilityById = async (
  facilityID: string
): Promise<FacilityDetail> => {
  const res = await axios.get<FacilityDetail>(`/facility/${facilityID}`);
  return res.data;
};
