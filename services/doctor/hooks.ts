import { useQuery } from "@tanstack/react-query";
import { getDoctors } from "./api";
import { Doctor } from "./types";

export const useGetDoctors = () => {
  return useQuery<Doctor[], Error>(["doctors"], () => getDoctors());
};
