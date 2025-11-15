// services/facility/types.ts

// Dùng cho list /facility
export interface Facility {
  facilityID: string;
  name: string;
  address: string;
  phone: string;
  img: string;
  time: string;
  rating: string;
  // Nếu backend sau này có thêm lat/lng thì add vào đây:
  latitude?: string;
  longitude?: string;
}

// Dùng cho chi tiết /facility/{facilityID}
export interface FacilityDetail {
  name: string;
  address: string;
  img: string;
  time: string;
  des: string;
  phone: string;
  doctors: {
    name: string;
    gender: string;
    specialty: string;
    degrees: string;
    avatar: string;
  }[];
  medicalServices: {
    serviceID: number;
    name: string;
    description: string;
    price: number;
    type: string;
    specialty: string;
    isActive: boolean;
    isRequireDoctor: boolean;
    isOnline: boolean;
    createAt: string; // ISO
    img: string;
    testItems: {
      testName: string;
      testDescription: string;
      unit: string;
      referenceRange: string;
    }[];
  }[];
}
