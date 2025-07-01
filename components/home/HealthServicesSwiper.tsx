import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 12;
const HORIZONTAL_PADDING = 16;
const cardWidth = (width - HORIZONTAL_PADDING * 2 - CARD_MARGIN) / 2;

interface HealthService {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  backgroundColor: string;
  onPress: () => void;
}

const healthServices: HealthService[] = [
  {
    id: "1",
    title: "Tra thuốc\nchính hãng",
    icon: "document-text",
    iconColor: "#3B82F6",
    backgroundColor: "#EFF6FF",
    onPress: () => console.log("Tra thuốc chính hãng"),
  },
  {
    id: "2",
    title: "Nhắc uống\nthuốc",
    icon: "medical",
    iconColor: "#3B82F6",
    backgroundColor: "#EFF6FF",
    onPress: () => {
      router.push("/(medicine-reminder)/medicine-calendar");
    },
  },
  {
    id: "3",
    title: "Tiêm Vắc\nxin",
    icon: "medical-outline",
    iconColor: "#3B82F6",
    backgroundColor: "#EFF6FF",
    onPress: () => console.log("Tiêm Vắc xin"),
  },
  {
    id: "4",
    title: "Đơn của\ntôi",
    icon: "receipt",
    iconColor: "#3B82F6",
    backgroundColor: "#EFF6FF",
    onPress: () => console.log("Đơn của tôi"),
  },
  {
    id: "5",
    title: "Tìm bác sĩ\ntheo khoa",
    icon: "person-add",
    iconColor: "#3B82F6",
    backgroundColor: "#EFF6FF",
    onPress: () => console.log("Tìm bác sĩ"),
  },
];

const HealthServicesSwiper: React.FC = React.memo(() => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<HealthService>>(null);

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / (cardWidth + CARD_MARGIN));
    setActiveIndex(index);
  }, []);

  const renderItem = useCallback(({ item, index }: { item: HealthService; index: number }) => (
    <TouchableOpacity
      key={item.id}
      onPress={item.onPress}
      style={[
        styles.card,
        { width: cardWidth, marginRight: index % 2 === 1 ? 0 : CARD_MARGIN },
      ]}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.backgroundColor }]}>
        <Ionicons name={item.icon} size={28} color={item.iconColor} />
      </View>
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  ), []);

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Dịch vụ sức khỏe</Text>
        <Ionicons name="ellipsis-horizontal" size={20} color="#9CA3AF" />
      </View>

      <FlatList
        ref={flatListRef}
        data={healthServices}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listContainer}
        renderItem={renderItem}
      />

      <View style={styles.dotsContainer}>
        {healthServices.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              activeIndex === idx && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: { marginBottom: 24 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  headerText: { fontSize: 18, fontWeight: "600", color: "#111827" },
  listContainer: { paddingHorizontal: HORIZONTAL_PADDING },
  card: { backgroundColor: "#FFF", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#F3F4F6", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  iconContainer: { width: 64, height: 64, borderRadius: 16, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  title: { fontSize: 14, fontWeight: "500", lineHeight: 20, color: "#111827" },
  dotsContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#D1D5DB", marginHorizontal: 4 },
  activeDot: { backgroundColor: "#3B82F6" },
});

export default HealthServicesSwiper;
