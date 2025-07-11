import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
// Dùng @react-native-picker/picker nếu dùng RN mới
import { Picker } from '@react-native-picker/picker';

const TOPIC_OPTIONS = [
    "Tư vấn thuốc",
    "Tư vấn xét nghiệm",
    "Tư vấn tâm lý",
    "Tư vấn chăm sóc sức khỏe",
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
    const [selectedTopic, setSelectedTopic] = useState(TOPIC_OPTIONS[0]);
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
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
        >
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: 'white', padding: 24, borderRadius: 12, width: 300 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Yêu cầu tư vấn</Text>
                    <Text style={{ marginBottom: 8 }}>Chủ đề muốn tư vấn:</Text>
                    <Picker
                        selectedValue={selectedTopic}
                        style={{ height: 44, marginBottom: 16 }}
                        onValueChange={(itemValue) => setSelectedTopic(itemValue)}
                    >
                        {TOPIC_OPTIONS.map(option => (
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
                        {requireLoading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "bold" }}>Gửi yêu cầu</Text>}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
