// usePatientProfile.ts
import { useGetPatientProfile } from "@/services/patient/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

export function usePatientProfile() {
  const [accountId, setAccountId] = useState<string>();
  useEffect(() => {
    AsyncStorage.getItem("token").then((token) => {
      if (token) {
        try {
          const { sub } = jwtDecode(token);
          setAccountId(sub);
        } catch {
          setAccountId(undefined);
        }
      }
    });
  }, []);
  // Để nguyên lấy profile từ backend
  return useGetPatientProfile(accountId ?? "");
}
