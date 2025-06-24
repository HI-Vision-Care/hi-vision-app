export interface MedicalService {
  serviceID: number;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  isRequireDoctor: boolean;
  isOnline: boolean;
  createAt: string; // ISO timestamp
  // nếu backend trả thêm gì, cứ bổ sung ở đây
}

export interface UIMedicalService extends MedicalService {
  iconUri: any;
  iconBgColor: string;
  illustrationUri: any;
  duration: string;
}
