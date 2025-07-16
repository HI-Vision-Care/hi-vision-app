// Thêm type cho testItems:
export interface TestItem {
  testName: string;
  testDescription: string;
  unit: string;
  referenceRange: string;
}

// Sửa lại MedicalService:
export interface MedicalService {
  serviceID: number;
  name: string;
  description: string;
  price: number;
  type: string; // VD: 'Laboratory' | 'Consultation'
  isActive: boolean;
  isRequireDoctor: boolean;
  isOnline: boolean;
  createAt: string; // ISO timestamp
  img: string;
  specialty?: string; // Có thể vẫn cần, tuỳ backend, nếu không có thì bỏ
  testItems?: TestItem[]; // thêm field này, có thể undefined nếu không có testItems
  // Bạn có thể bổ sung thêm các trường backend trả về khác ở đây nếu cần
}

// UIMedicalService mở rộng từ MedicalService:
export interface UIMedicalService extends MedicalService {
  iconUri: any;
  iconBgColor: string;
  illustrationUri: any;
  specialty?: string;
}

export interface BookingService {
  serviceID: number;
  name: string;
  description: string;
  price: number;
  img: string;
  isActive: boolean;
  isRequireDoctor: boolean;
  isOnline: boolean;
  createAt: string;
  type?: string;
  testItems?: TestItem[];
}

export interface Doctor {
  doctorID: string;
  name: string;
  gender: string;
  specialty: string;
  degrees: string;
  avatar: string;
}
