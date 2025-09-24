import { Platform } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { WidgetBridge } from "@/native/WidgetBridge";
import {
  cancelAllArvNotifications,
  scheduleArvNotifications,
} from "@/services/notification/arv-notification";
import {
  type NotificationSchedule,
  cancelAll as cancelAllNotifications,
  scheduleNotifications,
} from "@/services/notification/prep-notification";

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

const MAX_PREVIEW = 12;

const CONFIRMED_DOSES_KEY = "confirmedDoses";
const DEFAULT_WIDGET_TITLE = "65% người dân ủng hộ hôn nhân đồng giới";

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
  return [...doses].sort((a, b) => new Date(a.timeISO).getTime() - new Date(b.timeISO).getTime());
}

function buildDoseLabel(
  medicineName: string,
  slot: MedicationSlot,
  customLabel?: string,
  note?: string,
  quantity?: number,
): string {
  const slotLabel = customLabel || SLOT_LABELS[slot] || "";
  const quantityLabel = quantity ? `${quantity} viên` : undefined;
  return [medicineName, slotLabel, quantityLabel, note].filter(Boolean).join(" • ");
}

async function scheduleNotificationsForPlan(plan: MedicationPlan, includeAdvanced = false) {
  const now = Date.now();
  const reminders: NotificationSchedule[] = [];

  for (const dose of plan.doses) {
    const time = new Date(dose.timeISO);
    if (time.getTime() < now) continue;
    const note = [dose.medicineName, SLOT_LABELS[dose.slot] || dose.slot, dose.note]
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

async function getConfirmationSet(): Promise<Set<string>> {
  const items = new Set<string>();

  try {
    const stored = await AsyncStorage.getItem(CONFIRMED_DOSES_KEY);
    if (stored) {
      for (const value of JSON.parse(stored) as string[]) {
        if (typeof value === "string" && value) {
          items.add(value);
        }
      }
    }
  } catch (error) {
    console.warn("Failed to load confirmed doses", error);
  }

  if (WidgetBridge?.getMedicationConfirmedHistory) {
    try {
      const nativeValues = await WidgetBridge.getMedicationConfirmedHistory();
      nativeValues?.forEach((value) => {
        if (typeof value === "string" && value) {
          items.add(value);
        }
      });
    } catch (error) {
      console.warn("Failed to load widget confirmation history", error);
    }
  }

  return items;
}

function getWeekStart(date: Date): Date {
  const start = new Date(date);
  const day = start.getDay(); // 0 = Sunday
  const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function buildWeeklyProgress(
  plans: MedicationPlan[],
  confirmationSet: Set<string>,
): Array<{ dateISO: string; total: number; confirmed: number }> {
  const start = getWeekStart(new Date());
  const stats = new Map<string, { total: number; confirmed: number }>();

  for (const plan of plans) {
    for (const dose of plan.doses) {
      const doseDate = new Date(dose.timeISO);
      const key = formatDateKey(doseDate);
      const entry = stats.get(key) ?? { total: 0, confirmed: 0 };
      entry.total += 1;
      if (confirmationSet.has(dose.timeISO)) {
        entry.confirmed += 1;
      }
      stats.set(key, entry);
    }
  }

  const result: Array<{ dateISO: string; total: number; confirmed: number }> = [];
  for (let i = 0; i < 7; i++) {
    const current = new Date(start);
    current.setDate(start.getDate() + i);
    const key = formatDateKey(current);
    const entry = stats.get(key);
    result.push({
      dateISO: current.toISOString(),
      total: entry?.total ?? 0,
      confirmed: entry?.confirmed ?? 0,
    });
  }

  return result;
}

async function buildWidgetPayload(plans: MedicationPlan[]) {
  const allDoses = plans.flatMap((plan) => plan.doses.map((dose) => ({ plan, dose })));
  const sorted = allDoses.sort(
    (a, b) => new Date(a.dose.timeISO).getTime() - new Date(b.dose.timeISO).getTime(),
  );
  const now = Date.now();
  const upcoming = sorted.filter((item) => new Date(item.dose.timeISO).getTime() >= now);

  const next = upcoming[0];
  const preview = upcoming.slice(0, MAX_PREVIEW).map(({ plan, dose }) => ({
    timeISO: dose.timeISO,
    label: buildDoseLabel(
      dose.medicineName,
      dose.slot,
      undefined,
      dose.note,
      dose.quantity,
    ),
    note: dose.note,
    planName: plan.name,
    medicine: dose.medicineName,
    pills: dose.quantity ?? 1,
  }));

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC";
  const confirmationSet = await getConfirmationSet();
  const weeklyProgress = buildWeeklyProgress(plans, confirmationSet);

  return {
    version: 2,
    timezone,
    generatedAt: new Date().toISOString(),
    summary: {
      totalPlans: plans.length,
      totalUpcoming: upcoming.length,
      totalDoses: sorted.length,
    },
    next: next
      ? {
          planName: next.plan.name,
          medicine: next.dose.medicineName,
          timeISO: next.dose.timeISO,
          label: buildDoseLabel(
            next.dose.medicineName,
            next.dose.slot,
            undefined,
            next.dose.note,
            next.dose.quantity,
          ),
          note: next.dose.note,
          pills: next.dose.quantity ?? 1,
        }
      : null,
    preview,
    weeklyProgress,
  };
}

async function syncWidget(plans: MedicationPlan[]) {
  if (!WidgetBridge?.setMedicationReminder || Platform.OS !== "android") return;
  const payload = await buildWidgetPayload(plans);
  try {
    WidgetBridge.setMedicationReminder(JSON.stringify(payload));
  } catch (error) {
    console.warn("Failed to push medication widget payload", error);
  }
}

export async function createMedicationPlan(input: MedicationPlanInput): Promise<MedicationPlan> {
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

  const plans = await upsertMedicationPlan(plan);
  await scheduleNotificationsForPlan(plan, input.regimenType === "arv");
  await syncWidget(plans);
  return plan;
}

export async function getUpcomingMedicationSummary(limit = 10) {
  const plans = await loadMedicationPlans();
  const now = Date.now();
  const all = plans.flatMap((plan) => plan.doses.map((dose) => ({ plan, dose })));
  const upcoming = all
    .filter((item) => new Date(item.dose.timeISO).getTime() >= now)
    .sort((a, b) => new Date(a.dose.timeISO).getTime() - new Date(b.dose.timeISO).getTime())
    .slice(0, limit);
  return {
    plans,
    upcoming,
  };
}

export async function syncMedicationWidget() {
  const plans = await loadMedicationPlans();
  await syncWidget(plans);
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

  if (WidgetBridge?.clearMedicationConfirmedHistory) {
    try {
      await WidgetBridge.clearMedicationConfirmedHistory();
    } catch (error) {
      console.warn("Failed to clear widget confirmation history", error);
    }
  }

  if (WidgetBridge?.setBlogCard) {
    try {
      WidgetBridge.setBlogCard(DEFAULT_WIDGET_TITLE, undefined);
    } catch (error) {
      console.warn("Failed to reset widget to default blog", error);
    }
  }
}
