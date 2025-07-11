// services/booking-services/types.ts

export interface BookingService {
  serviceID: string;
  name: string;
  // … các field khác nếu có
}

// Thêm phần type cho payload và response của booking appointment

export interface Appointment extends AppointmentForm {
  patientID: string;
  appointmentForm: AppointmentForm;
}

export interface AppointmentRequest {
  patientID: string;
  serviceID: string;
  doctorID: string;
  appointmentDate: string; // ISO string, ví dụ: "2025-06-28T12:44:00.866Z"
  isAnonymous: boolean;
  note: string;
}

export interface AppointmentForm {
  serviceID: number;
  doctorID: string;
  appointmentDate: string;
  isAnonymous: boolean;
  note: string;
}

export interface Account {
  id: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  isDeleted: boolean;
}

export interface Doctor {
  doctorID: string;
  account: Account;
  name: string;
  gender: string;
  specialty: string;
  degrees: string;
  img?: string | null;
}

export interface WorkShiftWeek {
  id: number;
  doctor: Doctor;
  slot: string;
  date: string; // ISO string
  startTime: string; // ISO string
  endTime: string; // ISO string
  status: string;
  note: string | null;
}

// Nếu server trả về object nào đó, bạn có thể define thêm.
// Còn không, tạm dùng `void` hoặc `unknown`
export type AppointmentResponse = void;
