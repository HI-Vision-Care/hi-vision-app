// services/facility/hooks.ts
import { useQuery } from "@tanstack/react-query";
import { getFacilities, getFacilityById } from "./api";
import type { Facility, FacilityDetail } from "./types";

/** Danh sách /facility */
export const useFacilities = () =>
  useQuery<Facility[], Error>(["facilities"], getFacilities, {
    staleTime: 5 * 60 * 1000,
  });

/** Chi tiết /facility/{id} */
export const useFacility = (facilityID?: string) =>
  useQuery<FacilityDetail, Error>(
    ["facility", facilityID],
    () => getFacilityById(facilityID as string),
    {
      enabled: !!facilityID, // chỉ gọi khi có id
      staleTime: 5 * 60 * 1000,
    }
  );
