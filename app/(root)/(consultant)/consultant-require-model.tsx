import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// Dùng @react-native-picker/picker nếu dùng RN mới
import { useTranslation } from "@/hooks/useTranslation";
import { Picker } from "@react-native-picker/picker";

const getTopicOptions = (t: any) => [
  t("chat.medicationConsultation"),
  t("chat.testConsultation"),
  t("chat.psychologicalConsultation"),
  t("chat.healthcareConsultation"),
];

interface ConsultantRequireModalProps {
  visible: boolean;
  onClose: () => void;
  stompClient: any; // hoặc type Client nếu bạn đã có
  chatID: string;
  currentUserName: string;
}

export default function ConsultantRequireModal({
  visible,
  onClose,
  stompClient,
  chatID,
  currentUserName,
}: ConsultantRequireModalProps) {
  const { t } = useTranslation();
  const topicOptions = getTopicOptions(t);
  const [selectedTopic, setSelectedTopic] = useState(topicOptions[0]);
  const [requireLoading, setRequireLoading] = useState(false);

  const sendRequire = () => {
    if (!stompClient || !currentUserName || !chatID) {
      return;
    }
    setRequireLoading(true);
    const payload = {
      name: currentUserName,
      note: selectedTopic,
      accountID: chatID,
    };

    stompClient.publish({
      destination: `/app/requirement/${chatID}`,
      body: JSON.stringify(payload),
    });
    setTimeout(() => {
      setRequireLoading(false);
      onClose();
    }, 600); // Sau này có thể chuyển thành chờ phản hồi thực tế
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.3)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 50,
            borderRadius: 12,
            width: 300,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>
            {t("chat.consultationRequest")}
          </Text>
          <Text style={{ marginBottom: 8 }}>{t("chat.selectTopic")}</Text>
          <Picker
            selectedValue={selectedTopic}
            style={{ height: 100, marginBottom: 16 }}
            onValueChange={(itemValue) => setSelectedTopic(itemValue)}
          >
            {topicOptions.map((option) => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
          <TouchableOpacity
            style={{
              backgroundColor: requireLoading ? "#ccc" : "#4285f4",
              padding: 12,
              borderRadius: 8,
              alignItems: "center",
            }}
            disabled={requireLoading}
            onPress={sendRequire}
          >
            {requireLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                {t("chat.sendRequest")}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
