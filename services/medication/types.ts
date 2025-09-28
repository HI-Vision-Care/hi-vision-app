export type MedicationSlot = "morning" | "noon" | "afternoon" | "evening" | "custom";

export type MedicationDoseInstance = {
  id: string;
  planId: string;
  medicineName: string;
  timeISO: string;
  slot: MedicationSlot;
  label: string;
  note?: string;
  quantity?: number;
};

export type MedicationPlanMeta = {
  id: string;
  name: string;
  medicineName: string;
  color?: string;
  icon?: string;
  notes?: string;
  regimenType: "custom" | "arv" | "prep";
  createdAtISO: string;
  startDateISO: string;
  endDateISO?: string;
  totalDays: number;
};

export type MedicationPlan = MedicationPlanMeta & {
  doses: MedicationDoseInstance[];
};

export type MedicationPlanInput = {
  name: string;
  medicineName: string;
  regimenType?: "custom" | "arv" | "prep";
  color?: string;
  icon?: string;
  notes?: string;
  startDate: Date;
  totalDays: number;
  slots: Array<{
    slot: MedicationSlot;
    time: Date;
    quantity?: number;
    note?: string;
    label?: string;
  }>;
};

export type MedicationSummary = {
  plans: MedicationPlan[];
  upcomingDoses: MedicationDoseInstance[];
};
