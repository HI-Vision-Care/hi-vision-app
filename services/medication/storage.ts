import AsyncStorage from "@react-native-async-storage/async-storage";
import { MedicationPlan } from "./types";

const STORAGE_KEY = "medication_plans_v1";

export async function loadMedicationPlans(): Promise<MedicationPlan[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MedicationPlan[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (error) {
    console.warn("Failed to load medication plans", error);
    return [];
  }
}

export async function saveMedicationPlans(plans: MedicationPlan[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  } catch (error) {
    console.warn("Failed to save medication plans", error);
  }
}

export async function clearMedicationPlans(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear medication plans", error);
  }
}

export async function upsertMedicationPlan(newPlan: MedicationPlan): Promise<MedicationPlan[]> {
  const plans = await loadMedicationPlans();
  const idx = plans.findIndex((plan) => plan.id === newPlan.id);
  if (idx >= 0) {
    plans[idx] = newPlan;
  } else {
    plans.push(newPlan);
  }
  await saveMedicationPlans(plans);
  return plans;
}

export async function deleteMedicationPlan(planId: string): Promise<MedicationPlan[]> {
  const plans = await loadMedicationPlans();
  const filtered = plans.filter((plan) => plan.id !== planId);
  await saveMedicationPlans(filtered);
  return filtered;
}
