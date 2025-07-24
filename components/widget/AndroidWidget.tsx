import React from "react";
import { Button, NativeModules, View } from "react-native";

type RNAndroidWidgetType = {
  sendData: (key: string, value: string) => void;
  refreshWidget: (widgetName: string) => void;
};

const { RNAndroidWidget } = NativeModules as {
  RNAndroidWidget: RNAndroidWidgetType;
};

const UpdateWidgetButton = () => {
  const updateWidget = () => {
    RNAndroidWidget.sendData("widgetText", "Nội dung mới từ app React Native!");
    RNAndroidWidget.refreshWidget("MyFirstWidget");
  };

  return (
    <View>
      <Button title="Cập nhật widget" onPress={updateWidget} />
    </View>
  );
};

export default UpdateWidgetButton;
