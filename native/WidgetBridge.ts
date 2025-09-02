import { NativeModules } from "react-native";

type WidgetBridgeType = {
  setBlogCard: (title: string, imageUrl?: string | null) => void;
};

export const WidgetBridge: WidgetBridgeType = NativeModules.WidgetBridge;

