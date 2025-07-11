// types.ts

export interface ARVDrug {
  arvId: string;
  genericName: string;
  drugClass: string;
  dosageStrength: string;
  admRoute: string;
  rcmDosage: string;
  shelfLife: string;
  fundingSource: string;
  regimenLevel: string;
  lastUpdated: string;
}

export interface Prescription {
  prescriptionID: string;
  patient: any; // (đúng kiểu patient bạn đã khai báo)
  date: string;
  prescribeBy: string;
  status: string;
}

export interface ARVPrescription {
  id: number;
  dosage: string;
  duration: string;
  prescription: Prescription;
  arv: ARVDrug;
}

export interface ARVRequest {
  arvID: string;
  dosage: string;
  duration: string;
}

export interface PrescriptionRequest {
  prescribeBy: string;
}

export interface CreateArvPrescriptionPayload {
  prescriptionRequest: PrescriptionRequest;
  arvRequests: ARVRequest[];
}
