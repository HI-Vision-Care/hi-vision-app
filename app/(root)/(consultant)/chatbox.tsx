import { usePatientProfile } from "@/hooks/usePatientId";
import { getConsultationMessages } from "@/services/consultant/api";
import { useGetConsultationRequire } from "@/services/consultant/hooks";
import { Ionicons } from "@expo/vector-icons";
import { Client, Frame, IMessage } from "@stomp/stompjs";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SockJS from "sockjs-client";
import ConsultantRequireModal from "./consultant-require-model";

// Định nghĩa interface khớp với MessageDTO từ backend
interface Message {
  senderName: string;
  message: string;
  status: string;
  date: string;
}

const WS_ENDPOINT = process.env.EXPO_PUBLIC_WS_ENDPOINT;

const ChatBox = () => {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const stompClient = useRef<Client | null>(null);
  const [requireModalVisible, setRequireModalVisible] = useState(false);
  // TODO: Lấy tên người gửi thực tế từ auth context hoặc props

  const { data: profile } = usePatientProfile();
  const chatID = profile?.account.id;
  const currentUserName = profile?.name;
  const { data, loading, fetch } = useGetConsultationRequire(chatID);

  useEffect(() => {
    if (!chatID) return;
    // Lấy tin nhắn cũ từ API khi vừa vào màn hình/chatID đổi
    getConsultationMessages(chatID)
      .then((oldMessages) => {
        // Nếu API trả về đúng định dạng [{...}]
        setMessages(oldMessages);
      })
      .catch((err) => {
        console.error("Lỗi lấy tin nhắn cũ:", err);
      });
  }, [chatID]);

  useEffect(() => {
    console.log("ChatBox mounted with chatID:", chatID);
    if (chatID) fetch();
    // Chỉ chạy khi chatID thay đổi, không đưa fetch vào dependency nếu fetch là một function bất biến
  }, [chatID]);

  useEffect(() => {
    if (loading) return; // tránh blink khi đang fetch
    if (!data || data.status === "DEFAULT" || data.status === "COMPLETE") {
      setRequireModalVisible(true); // Hiện modal nếu chưa "REQUIRE"
    } else {
      setRequireModalVisible(false); // Ẩn modal nếu đã "REQUIRE"
    }
  }, [data, loading]);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_ENDPOINT || ""),
      reconnectDelay: 5000,
      debug: (msg) => console.log("[STOMP]", msg),
    });

    client.onConnect = (frame: Frame) => {
      console.log("✔ STOMP connected");
      setConnected(true);

      client.subscribe(`/box/${chatID}`, (message: IMessage) => {
        try {
          const msg: Message = JSON.parse(message.body);
          setMessages((prev) => [...prev, msg]);
          if (
            msg.message === "Tư vấn kết thúc"
          ) {
            setRequireModalVisible(true);
          }
        } catch (e) {
          console.error("Invalid msg format", e);
        }
      });
    };

    client.onStompError = (frame: Frame) => {
      console.error("✖ Broker error:", frame.headers["message"], frame.body);
      setConnected(false);
    };

    client.onWebSocketError = (evt) => {
      console.error("✖ WebSocket error", evt);
      setConnected(false);
    };

    client.onWebSocketClose = (evt) => {
      console.log("ℹ WebSocket closed", evt);
      setConnected(false);
    };

    client.activate();
    stompClient.current = client;

    return () => client.deactivate();
  }, [chatID]);

  const sendMessage = () => {
    if (!connected || !inputText.trim() || !stompClient.current) {
      console.warn("Cannot send – not connected");
      return;
    }
    const outgoing = {
      senderName: currentUserName,
      message: inputText.trim(),
      accountID: chatID,
      status: "SENT",

      date: new Date().toISOString(),
    };

    stompClient.current.publish({
      destination: `/app/message/${chatID}`,
      body: JSON.stringify(outgoing),
    });
    setInputText("");
  };

  const renderItem: ListRenderItem<Message> = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.senderName === currentUserName
          ? styles.userMessage
          : styles.agentMessage,
      ]}
    >
      <Text style={styles.senderName}>{item.senderName}</Text>
      <Text style={styles.messageText}>{item.message}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ConsultantRequireModal
        visible={requireModalVisible}
        onClose={() => setRequireModalVisible(false)}
        stompClient={stompClient.current}
        chatID={chatID as string}
        currentUserName={currentUserName as string}
      />
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.chatList}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Nhập tin nhắn..."
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  chatList: { padding: 16 },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    maxWidth: "80%",
  },
  userMessage: { backgroundColor: "#4285f4", alignSelf: "flex-end" },
  agentMessage: { backgroundColor: "#e5e5e5", alignSelf: "flex-start" },
  senderName: { fontWeight: "bold", marginBottom: 4 },
  messageText: { color: "#000" },
  inputContainer: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#4285f4",
    borderRadius: 20,
    padding: 10,
    marginLeft: 8,
    justifyContent: "center",
  },
});

export default ChatBox;
