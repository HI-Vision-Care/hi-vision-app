import { NativeModules } from "react-native";

type WidgetManagerType = {
  requestPinWidget: () => void;
};

const NativeWidgetManager = NativeModules.WidgetManager as WidgetManagerType | undefined;

export const WidgetManager = {
  requestPinWidget: () => {
    if (NativeWidgetManager?.requestPinWidget) {
      NativeWidgetManager.requestPinWidget();
    } else {
      console.warn("WidgetManager native module is unavailable");
    }
  },
};
