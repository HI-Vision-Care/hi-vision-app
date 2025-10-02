// types.ts

export interface Account {
  id: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  isDeleted: boolean;
  authorities?: {
    authority: string;
  }[];
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
  underlyingDiseases: string[];
}

export interface Doctor {
  doctorID: string;
  name: string;
  gender: string;
  email: string;
  phone: string;
  specialty: string;
  degrees: string;
  avatar: string;
}

export interface TestItem {
  testName: string;
  testDescription: string;
  unit: string;
  referenceRange: string;
}

export interface MedicalService {
  serviceID: number;
  name: string;
  description: string;
  price: number;
  type: string;
  specialty: string;
  isActive: boolean;
  isRequireDoctor: boolean;
  isOnline: boolean;
  createAt: string;
  img: string;
  testItems: TestItem[];
}

export interface AppointmentFacility {
  name: string;
  address: string;
  phone: string;
  des: string;
  img: string;
  time: string;
  rating: string;
  latitude: string;
  longitude: string;
}

export interface AppointmentDetail {
  appointmentID: string;
  patient: Patient;
  doctor: Doctor;
  medicalService: MedicalService;
  facility: AppointmentFacility;
  appointmentDate: string;
  slot: string;
  isAnonymous: boolean;
  isRecordCreated: boolean;
  isPrescriptionCreated: boolean | null;
  note: string;
  urlLink: string;
  status: string;
  paymentStatus: string;
  createAt: string;
}