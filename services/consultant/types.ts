export interface ConsultationRequest {
  phone: string;
  name: string;
  note: string;
}

export interface ConsultationPayload {
  name: string;            // currentUserName
  status?: string;         // mặc định "REQUIRE", có thể bỏ qua (BE tự set)
  note: string;            // chủ đề được chọn
  createdAt?: string;      // có thể bỏ qua
}

export interface ConsultationRequire {
  patientID?: string;
  name?: string;
  status?: string;
  note?: string;
  createdAt?: string;
}

export interface ConsultationMessage {
  status: string;
  date: string;
  senderName: string;
  message: string;
}