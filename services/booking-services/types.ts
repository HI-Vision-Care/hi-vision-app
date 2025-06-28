// services/booking-services/types.ts

export interface BookingService {
  serviceID: string;
  name: string;
  // … các field khác nếu có
}

// Thêm phần type cho payload và response của booking appointment
export interface AppointmentRequest {
  patientID: string;
  serviceID: string;
  doctorID: string;
  appointmentDate: string; // ISO string, ví dụ: "2025-06-28T12:44:00.866Z"
  isAnonymous: boolean;
  note: string;
}

// Nếu server trả về object nào đó, bạn có thể define thêm.
// Còn không, tạm dùng `void` hoặc `unknown`
export type AppointmentResponse = void;
