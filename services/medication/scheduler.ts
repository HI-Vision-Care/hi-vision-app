import {
  cancelAllArvNotifications,
  scheduleArvNotifications,
} from "@/services/notification/arv-notification";
import {
  type NotificationSchedule,
  cancelAll as cancelAllNotifications,
  scheduleNotifications,
} from "@/services/notification/prep-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  clearMedicationPlans,
  loadMedicationPlans,
  upsertMedicationPlan,
} from "./storage";
import type {
  MedicationDoseInstance,
  MedicationPlan,
  MedicationPlanInput,
  MedicationSlot,
} from "./types";

const SLOT_LABELS: Record<MedicationSlot, string> = {
  morning: "Sáng",
  noon: "Trưa",
  afternoon: "Chiều",
  evening: "Tối",
  custom: "",
};

const CONFIRMED_DOSES_KEY = "confirmedDoses";

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `med_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalizeTime(base: Date, source: Date): Date {
  const next = new Date(base);
  next.setHours(source.getHours(), source.getMinutes(), 0, 0);
  return next;
}

function sortDoses(doses: MedicationDoseInstance[]): MedicationDoseInstance[] {
  return [...doses].sort(
    (a, b) => new Date(a.timeISO).getTime() - new Date(b.timeISO).getTime()
  );
}

function buildDoseLabel(
  medicineName: string,
  slot: MedicationSlot,
  customLabel?: string,
  note?: string,
  quantity?: number
): string {
  const slotLabel = customLabel || SLOT_LABELS[slot] || "";
  const quantityLabel = quantity ? `${quantity} viên` : undefined;
  return [medicineName, slotLabel, quantityLabel, note]
    .filter(Boolean)
    .join(" • ");
}

async function scheduleNotificationsForPlan(
  plan: MedicationPlan,
  includeAdvanced = false
) {
  const now = Date.now();
  const reminders: NotificationSchedule[] = [];

  for (const dose of plan.doses) {
    const time = new Date(dose.timeISO);
    if (time.getTime() < now) continue;
    const note = [
      dose.medicineName,
      SLOT_LABELS[dose.slot] || dose.slot,
      dose.note,
    ]
      .filter(Boolean)
      .join(" • ");
    reminders.push({
      time,
      note: note || `${dose.medicineName} – ${dose.label}`,
      pills: dose.quantity ?? 1,
    });
  }

  if (reminders.length && !includeAdvanced) {
    await scheduleNotifications(reminders, plan.name, plan.notes ?? "");
  }

  if (includeAdvanced) {
    for (const dose of plan.doses) {
      const time = new Date(dose.timeISO);
      if (time.getTime() < now) continue;
      await scheduleArvNotifications(time, false);
    }
  }
}

export async function createMedicationPlan(
  input: MedicationPlanInput
): Promise<MedicationPlan> {
  const slots = input.slots.filter((slot) => slot.time instanceof Date);
  if (!slots.length) {
    throw new Error("Cần ít nhất một thời điểm uống thuốc");
  }

  const planId = createId();
  const createdAt = new Date();
  const doses: MedicationDoseInstance[] = [];

  for (let day = 0; day < input.totalDays; day++) {
    const dayDate = new Date(input.startDate);
    dayDate.setDate(input.startDate.getDate() + day);

    for (const slot of slots) {
      const time = normalizeTime(dayDate, slot.time);
      if (time.getTime() < Date.now() - 60 * 1000) continue;
      const timeISO = time.toISOString();
      doses.push({
        id: createId(),
        planId,
        medicineName: input.medicineName,
        timeISO,
        slot: slot.slot,
        label: slot.label ?? buildDoseLabel(input.medicineName, slot.slot),
        note: slot.note,
        quantity: slot.quantity,
      });
    }
  }

  const sortedDoses = sortDoses(doses);

  const plan: MedicationPlan = {
    id: planId,
    name: input.name,
    medicineName: input.medicineName,
    regimenType: input.regimenType ?? "custom",
    color: input.color,
    icon: input.icon,
    notes: input.notes,
    createdAtISO: createdAt.toISOString(),
    startDateISO: input.startDate.toISOString(),
    endDateISO: sortedDoses.length
      ? new Date(sortedDoses[sortedDoses.length - 1].timeISO).toISOString()
      : undefined,
    totalDays: input.totalDays,
    doses: sortedDoses,
  };

  await upsertMedicationPlan(plan);
  await scheduleNotificationsForPlan(plan, input.regimenType === "arv");
  return plan;
}

export async function getUpcomingMedicationSummary(limit = 10) {
  const plans = await loadMedicationPlans();
  const now = Date.now();
  const all = plans.flatMap((plan) =>
    plan.doses.map((dose) => ({ plan, dose }))
  );
  const upcoming = all
    .filter((item) => new Date(item.dose.timeISO).getTime() >= now)
    .sort(
      (a, b) =>
        new Date(a.dose.timeISO).getTime() - new Date(b.dose.timeISO).getTime()
    )
    .slice(0, limit);
  return {
    plans,
    upcoming,
  };
}

export async function clearAllMedicationPlans(): Promise<void> {
  await clearMedicationPlans();

  try {
    await cancelAllNotifications();
  } catch (error) {
    console.warn("Failed to cancel scheduled notifications", error);
  }

  try {
    await cancelAllArvNotifications();
  } catch (error) {
    console.warn("Failed to cancel ARV notifications", error);
  }

  try {
    await AsyncStorage.removeItem(CONFIRMED_DOSES_KEY);
  } catch (error) {
    console.warn("Failed to clear confirmed doses", error);
  }
}
