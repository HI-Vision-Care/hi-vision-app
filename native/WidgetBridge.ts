import { NativeModules } from "react-native";

type WidgetBridgeType = {
  setBlogCard: (title: string, imageUrl?: string | null) => void;
  setMedicationReminder?: (payloadJson: string) => void;
  recordMedicationConfirmation?: (
    scheduleIso: string,
    confirmedAtIso?: string
  ) => void;
  getMedicationConfirmedHistory?: () => Promise<string[]>;
  clearMedicationConfirmedHistory?: () => Promise<void>;
};

const NativeWidgetBridge = NativeModules.WidgetBridge as WidgetBridgeType | undefined;

export const WidgetBridge: WidgetBridgeType | undefined = NativeWidgetBridge;
