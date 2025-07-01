export interface MedicalService {
  serviceID: number;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  isRequireDoctor: boolean;
  img: string;
  isOnline: boolean;
  createAt: string; // ISO timestamp
  specialty: string;
  // nếu backend trả thêm gì, cứ bổ sung ở đây
}

export interface UIMedicalService extends MedicalService {
  iconUri: any;
  iconBgColor: string;
  illustrationUri: any;
  specialty: string;
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
}

export interface Doctor {
  doctorID: string;
  name: string;
  gender: string;
  specialty: string;
  degrees: string;
  avatar: string;
}
