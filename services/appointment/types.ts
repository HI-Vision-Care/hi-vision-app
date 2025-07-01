// types.ts

export interface Account {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  isDeleted: boolean;
}

export interface Patient {
  patientID: string;
  account: Account;
  name: string;
  dob: string;
  gender: string;
  medNo: string;
  medDate: string;
  medFac: string;
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

export interface AppointmentDetail {
  appointmentID: string;
  patient: Patient;
  doctor: Doctor;
  // Thêm các trường khác nếu backend trả về
}
