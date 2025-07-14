// types.ts

export interface Account {
  id: string
  username: string
  email: string
  phone: string
  avatar: string
  role: string
  isDeleted: boolean
}

export interface Disease {
  diseaseID: number
  name: string
}

export interface PatientDisease {
  patientDiseaseID: number
  patient: string
  disease: Disease
}

export interface Patient {
  patientID: string
  account: Account
  name: string
  dob: string
  gender: string
  medNo: string
  medDate: string
  medFac: string
  patientDiseases: PatientDisease[]
}

export interface Prescription {
  prescriptionID: string
  patient: Patient
  date: string
  prescribeBy: string
  status: string
}

export interface ArvDrug {
  arvId: string
  genericName: string
  drugClass: string
  dosageStrength: string
  admRoute: string
  rcmDosage: string
  shelfLife: string
  fundingSource: string
  regimenLevel: string
  lastUpdated: string
}

export interface PrescriptionARVResponse {
  prescription: Prescription
  arvList: ArvDrug[]
}
