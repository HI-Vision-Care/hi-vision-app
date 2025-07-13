// services/patient/types.ts

/** Thông tin account trong profile */
export interface Account {
  id: string;
  username: string;
  email: string;
  phone: string;
  avatar: string; // ví dụ "avatar0.png"
  role: string; // ví dụ "PATIENT"
  isDeleted: boolean;
}

/** Kết quả trả về của GET /patient/profile/{accountId} */
export interface PatientProfile {
  patientID: string;
  account: Account;
  name: string;
  dob: string; // ISO date string
  gender: string;
  medID: string;
  medDate: string; // ISO date string
  medFac: string;
  // nếu còn field khác, bạn mở rộng thêm ở đây
}

export interface DeleteAccountResponse {
  code: number;
  message: string;
  data: string;
}

export interface LabResult {
  recordId: string;
  testType: string;
  resultValue: string;
  testDate: string; // ISO date string
}

export interface UpdatePatientProfilePayload {
  name: string;
  dob: string; // ISO string
  gender: string;
  medNo: string;
  medDate: string; // ISO string
  medFac: string;
  underlyingDiseases: string;
}
