import { NativeModules } from "react-native";

type WidgetBridgeType = {
  setBlogCard: (title: string, imageUrl?: string | null) => void;
  setMedicationReminder?: (payloadJson: string) => void;
};

const NativeWidgetBridge = NativeModules.WidgetBridge as WidgetBridgeType | undefined;

export const WidgetBridge: WidgetBridgeType | undefined = NativeWidgetBridge;
