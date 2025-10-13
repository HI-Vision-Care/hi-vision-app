import { useState } from "react";
import {
  bookConsultationGuest,
  bookConsultationWithAccount,
  getConsultationRequire,
} from "./api";
import { ConsultationRequest, ConsultationRequire } from "./types";

// Hook lấy yêu cầu tư vấn
export function useGetConsultationRequire(patientID?: string) {
  const [data, setData] = useState<ConsultationRequire | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetch = async () => {
    if (!patientID) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getConsultationRequire(patientID);
      setData(res);
    } catch (err) {
      setError(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetch };
}

// Hook cho bookConsultationGuest
export function useBookConsultationGuest() {
  const [data, setData] = useState<ConsultationRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const submit = async (body: ConsultationRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await bookConsultationGuest(body);
      setData(res);
      return res;
    } catch (err) {
      setError(err);
      setData(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, submit };
}

// Hook cho bookConsultationWithAccount
export function useBookConsultationWithAccount() {
  const [data, setData] = useState<ConsultationRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const submit = async (patientId: string, body: ConsultationRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await bookConsultationWithAccount(patientId, body);
      setData(res);
      return res;
    } catch (err) {
      setError(err);
      setData(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, submit };
}
