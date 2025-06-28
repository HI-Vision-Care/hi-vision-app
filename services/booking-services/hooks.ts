// services/booking-services/hooks.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookAppointment } from "./api";
import { AppointmentRequest, AppointmentResponse } from "./types";

export const useBookAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation<AppointmentResponse, Error, AppointmentRequest>(
    (data) => bookAppointment(data),
    {
      onSuccess: () => {
        // tuỳ bạn: có thể invalidate list appointments hoặc hiển thị toast…
        queryClient.invalidateQueries(["appointments"]);
      },
    }
  );
};
