import { MaterialIcons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";

const initialMessages = [
  {
    id: "1",
    sender: "Customer",
    content: "Hi, could you please confirm my order status?",
    time: "09:45 AM",
    sentByMe: false,
  },
  {
    id: "2",
    sender: "You",
    content: "Yes, I’ve picked it up. Will reach in 15 mins.",
    time: "09:47 AM",
    sentByMe: true,
  },
  {
    id: "3",
    sender: "Customer",
    content: "Perfect! Thank you 😊",
    time: "09:48 AM",
    sentByMe: false,
  },
];

const MessageScreen: React.FC = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [riderInput, setRiderInput] = useState("");
  const [riderTyping, setRiderTyping] = useState(false);
  const [customerTyping, setCustomerTyping] = useState(false);

  const flatListRef = useRef<FlatList>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const headerHeight = useHeaderHeight();

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Simulate customer typing
  useEffect(() => {
    const typingInterval = setInterval(() => {
      setCustomerTyping(true);
      setTimeout(() => setCustomerTyping(false), 2000);
    }, 15000);
    return () => clearInterval(typingInterval);
  }, []);

  const handleRiderTyping = (text: string) => {
    setRiderInput(text);
    setRiderTyping(true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setRiderTyping(false);
    }, 1500);
  };

  const sendMessage = () => {
    if (!riderInput.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: "You",
      content: riderInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sentByMe: true,
    };

    setMessages([...messages, newMessage]);
    setRiderInput("");
    setRiderTyping(false);
  };

  const handleCall = () => {
    Linking.openURL("tel:+1234567890"); // Replace with the actual phone number
  };

  const renderMessage = ({ item }: { item: typeof initialMessages[0] }) => (
    <View
      style={[
        styles.messageBox,
        item.sentByMe ? styles.sentMessage : styles.receivedMessage,
      ]}
    >
      {!item.sentByMe && <Text style={styles.senderText}>{item.sender}</Text>}
      <Text style={[styles.messageText, item.sentByMe && { color: "#fff" }]}>
        {item.content}
      </Text>
      <Text
        style={[
          styles.timeText,
          item.sentByMe ? { color: "#E0E7FF" } : { color: "#9CA3AF" },
        ]}
      >
        {item.time}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.headerTitle}>Order #4521</Text>
            <Text style={styles.headerSubtitle}>Customer: John Doe</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleCall}>
          <MaterialIcons name="phone" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={headerHeight}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10 }}
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}
        />

        {customerTyping || riderTyping ? (
          <View style={styles.typingContainer}>
            {customerTyping && (
              <Text style={styles.typingText}>Customer is typing...</Text>
            )}
            {riderTyping && (
              <Text style={styles.typingText}>You are typing...</Text>
            )}
          </View>
        ) : null}

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            value={riderInput}
            onChangeText={handleRiderTyping}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <MaterialIcons name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#4F46E5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },
  headerSubtitle: { color: "#E0E7FF", fontSize: 12 },
  messageBox: { maxWidth: "80%", borderRadius: 10, padding: 10, marginBottom: 10 },
  sentMessage: { backgroundColor: "#4F46E5", alignSelf: "flex-end", borderTopRightRadius: 2 },
  receivedMessage: { backgroundColor: "#F9FAFB", alignSelf: "flex-start", borderTopLeftRadius: 2 },
  senderText: { fontSize: 12, fontWeight: "600", color: "#6B7280", marginBottom: 2 },
  messageText: { fontSize: 14, lineHeight: 20, color: "#111827" },
  timeText: { fontSize: 10, alignSelf: "flex-end", marginTop: 4 },
  typingContainer: { alignItems: "center", paddingVertical: 6 },
  typingText: { fontSize: 12, fontStyle: "italic", color: "#6B7280" },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
  },
  input: { flex: 1, fontSize: 15, color: "#111827", paddingVertical: 6 },
  sendButton: { backgroundColor: "#4F46E5", padding: 10, borderRadius: 50, marginLeft: 10 },
});

export default MessageScreen;