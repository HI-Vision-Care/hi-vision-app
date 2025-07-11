import { usePatientProfile } from "@/hooks/usePatientId";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback } from 'react';

import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { generateContentWithHistory } from "../../services/ai/geminiService";

export type Message = {
  sender: "user" | "bot";
  text: string;
};

export const HEALTH_KEYWORDS = ["tư vấn", "sức khỏe", "triệu chứng", "bệnh"];

export function needsMedicalAdvice(text: string) {
  const lower = text.toLowerCase();
  return HEALTH_KEYWORDS.some((kw) => lower.includes(kw));
}

const SUGGESTIONS = [
  "Tôi cần tư vấn",
  "Truy vấn sức khỏe",
  "Hướng dẫn đặt lịch",
  "Hãy kể chuyện cười",
];

interface FullScreenChatBotProps {
  onBack?: () => void;
}

const { width, height } = Dimensions.get("window");

export default function FullScreenChatBot({ onBack }: FullScreenChatBotProps) {
  const [prompt, setPrompt] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const scrollViewRef = useRef<ScrollView>(null);

  const { data: profile } = usePatientProfile();

  const name = profile?.name ?? "Guest";

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || prompt.trim();
    if (!textToSend) return;

    const userMessage: Message = { sender: "user", text: textToSend };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Get recent conversation history (last 10 messages to avoid token limits)
      const recentHistory = newMessages.slice(-10);

      // Add medical context if needed
      let contextualPrompt = textToSend;
      if (needsMedicalAdvice(textToSend)) {
        contextualPrompt = `Lưu ý: Đây là câu hỏi về sức khỏe. Hãy đưa ra lời khuyên chung và khuyến nghị người dùng tham khảo ý kiến bác sĩ chuyên khoa. Câu hỏi: ${textToSend}`;
      }

      // Call Gemini service directly
      const responseText = await generateContentWithHistory(
        recentHistory.slice(0, -1), // Exclude the current message since we're passing it separately
        contextualPrompt
      );

      const botMessage: Message = { sender: "bot", text: responseText };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error("Error calling Gemini API:", error);
      const errorMessage: Message = {
        sender: "bot",
        text: "Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timer); // Cleanup timeout
    }
  }, [messages]);

  const renderMessage = (msg: Message, index: number) => (
    <View
      key={index}
      style={[
        styles.messageContainer,
        msg.sender === "user"
          ? styles.userMessageContainer
          : styles.botMessageContainer,
      ]}
    >
      {msg.sender === "user" ? (
        <LinearGradient
          colors={["#3B82F6", "#8B5CF6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.userMessage}
        >
          <Text style={styles.userMessageText}>{msg.text}</Text>
        </LinearGradient>
      ) : (
        <View style={styles.botMessage}>
          <Text style={styles.botMessageText}>{msg.text}</Text>
        </View>
      )}
    </View>
  );

  const renderLoadingIndicator = () => (
    <View style={styles.loadingContainer}>
      <View style={styles.loadingMessage}>
        <ActivityIndicator size="small" color="#6B7280" />
        <Text style={styles.loadingText}>Đang trả lời...</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EFF6FF" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              {onBack && (
                <TouchableOpacity
                  onPress={onBack}
                  style={styles.backButton}
                  activeOpacity={0.7}
                >
                  <Ionicons name="arrow-back" size={20} color="#374151" />
                </TouchableOpacity>
              )}
              <LinearGradient
                colors={["#3B82F6", "#8B5CF6"]}
                style={styles.headerIcon}
              >
                <Ionicons name="sparkles" size={16} color="white" />
              </LinearGradient>
              <Text style={styles.headerTitle}>AI Assistant</Text>
            </View>
            <TouchableOpacity style={styles.menuButton} activeOpacity={0.7}>
              <Ionicons name="ellipsis-vertical" size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Chat Content */}
        <View style={styles.chatContent}>
          {messages.length === 0 ? (
            /* Welcome Screen */
            <View style={styles.welcomeContainer}>
              <LinearGradient
                colors={["#EFF6FF", "#F3E8FF"]}
                style={styles.welcomeBackground}
              >
                <View style={styles.welcomeContent}>
                  <LinearGradient
                    colors={["#2563EB", "#8B5CF6", "#EC4899"]}
                    style={styles.welcomeIconContainer}
                  >
                    <Ionicons name="sparkles" size={32} color="white" />
                  </LinearGradient>
                  <Text style={styles.welcomeTitle}>
                    {`Xin chào, ${name}! 👋`}
                  </Text>
                  <Text style={styles.welcomeSubtitle}>
                    Tôi có thể giúp gì cho bạn hôm nay?
                  </Text>
                </View>

                {/* Suggestion Buttons */}
                <View style={styles.suggestionsContainer}>
                  {SUGGESTIONS.map((suggestion, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.suggestionButton}
                      onPress={() => handleSuggestionClick(suggestion)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.suggestionText}>{suggestion}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </LinearGradient>
            </View>
          ) : (
            /* Messages */
            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}
            >
              {messages.map(renderMessage)}
              {loading && renderLoadingIndicator()}
            </ScrollView>
          )}
        </View>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={prompt}
              onChangeText={setPrompt}
              placeholder="Hỏi Gemini"
              placeholderTextColor="#9CA3AF"
              multiline
              maxLength={500}
              editable={!loading}
            />
            <TouchableOpacity style={styles.sparkleButton} activeOpacity={0.7}>
              <Ionicons name="sparkles" size={16} color="#3B82F6" />
            </TouchableOpacity>
          </View>

          {prompt.trim() && (
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => sendMessage()}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  loading ? ["#9CA3AF", "#9CA3AF"] : ["#3B82F6", "#8B5CF6"]
                }
                style={styles.sendButtonGradient}
              >
                <Text style={styles.sendButtonText}>
                  {loading ? "Đang gửi..." : "Gửi"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    marginRight: 8,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
  },
  menuButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  chatContent: {
    flex: 1,
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  welcomeContent: {
    alignItems: "center",
    marginBottom: 40,
  },
  welcomeIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#374151",
    textAlign: "center",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  suggestionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    maxWidth: width - 48,
  },
  suggestionButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minWidth: (width - 84) / 2,
    maxWidth: (width - 84) / 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionText: {
    fontSize: 14,
    color: "#374151",
    textAlign: "center",
    fontWeight: "500",
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 32,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessageContainer: {
    alignItems: "flex-end",
  },
  botMessageContainer: {
    alignItems: "flex-start",
  },
  userMessage: {
    maxWidth: "85%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userMessageText: {
    color: "white",
    fontSize: 15,
    lineHeight: 20,
  },
  botMessage: {
    maxWidth: "85%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  botMessageText: {
    color: "#374151",
    fontSize: 15,
    lineHeight: 20,
  },
  loadingContainer: {
    alignItems: "flex-start",
    marginBottom: 16,
  },
  loadingMessage: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  loadingText: {
    color: "#6B7280",
    fontSize: 15,
    marginLeft: 8,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "white",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: "#374151",
    maxHeight: 120,
    paddingVertical: 0,
  },
  sparkleButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  sendButton: {
    alignSelf: "flex-end",
    borderRadius: 16,
    overflow: "hidden",
  },
  sendButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sendButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
