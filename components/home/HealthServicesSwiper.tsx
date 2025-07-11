import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 0;
const HORIZONTAL_PADDING = 0;
const cardWidth = (width / 1.6 - HORIZONTAL_PADDING - CARD_MARGIN) / 2;

// Tính toán số items hiển thị cùng lúc
const ITEMS_PER_PAGE = 3;
const TOTAL_PAGES = Math.ceil(5 / ITEMS_PER_PAGE); // 5 items total = 2 pages

interface HealthService {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  backgroundColor: string;
  gradientColors: string[];
  onPress: () => void;
}

const healthServices: HealthService[] = [
  {
    id: "1",
    title: "Chat với AI",
    icon: "chatbubble-ellipses",
    iconColor: "#FFFFFF",
    backgroundColor: "#3B82F6",
    gradientColors: ["#3B82F6", "#1D4ED8"],
    onPress: () => {
      router.push("/(chat-bot)/chat-bot");
    },
  },
  {
    id: "2",
    title: "Nhắc uống\nthuốc",
    icon: "medical",
    iconColor: "#FFFFFF",
    backgroundColor: "#10B981",
    gradientColors: ["#10B981", "#059669"],
    onPress: () => {
      router.push("/(medicine-reminder)/medicine-calendar");
    },
  },
  {
    id: "3",
    title: "Tiêm Vắc\nxin",
    icon: "shield-checkmark",
    iconColor: "#FFFFFF",
    backgroundColor: "#8B5CF6",
    gradientColors: ["#8B5CF6", "#7C3AED"],
    onPress: () => console.log("Tiêm Vắc xin"),
  },
  {
    id: "4",
    title: "Đơn của\ntôi",
    icon: "receipt",
    iconColor: "#FFFFFF",
    backgroundColor: "#F59E0B",
    gradientColors: ["#F59E0B", "#D97706"],
    onPress: () => console.log("Đơn của tôi"),
  },
  {
    id: "5",
    title: "Tìm bác sĩ\ntheo khoa",
    icon: "people",
    iconColor: "#FFFFFF",
    backgroundColor: "#EF4444",
    gradientColors: ["#EF4444", "#DC2626"],
    onPress: () => console.log("Tìm bác sĩ"),
  },
];

const HealthServicesSwiper: React.FC = React.memo(() => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<HealthService>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Sửa lại logic tính toán page dựa trên scroll position
  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = event.nativeEvent.contentOffset.x;
      const totalWidth = cardWidth * healthServices.length;
      const pageWidth = totalWidth / TOTAL_PAGES;
      const currentPage = Math.round(x / pageWidth);
      setActiveIndex(Math.max(0, Math.min(currentPage, TOTAL_PAGES - 1)));
    },
    []
  );

  const renderItem = useCallback(
    ({ item, index }: { item: HealthService; index: number }) => {
      // Approach đơn giản: tính dựa trên scroll position và vị trí item
      const inputRange = [
        (index - 1) * cardWidth - cardWidth / 2,
        index * cardWidth - cardWidth / 2,
        (index + 1) * cardWidth - cardWidth / 2,
      ];

      const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0.7, 1, 0.4], // Center item to hơn
        extrapolate: "clamp",
      });

      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.7, 1, 0.3],
        extrapolate: "clamp",
      });

      // Thêm translateY để tạo hiệu ứng item center nổi lên
      const translateY = scrollX.interpolate({
        inputRange,
        outputRange: [10, -10, 10], // Center item sẽ cao hơn
        extrapolate: "clamp",
      });

      return (
        <Animated.View
          style={{
            transform: [{ scale }, { translateY }],
            opacity,
          }}
        >
          <TouchableOpacity
            onPress={item.onPress}
            style={[styles.card, { width: cardWidth }]}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: item.backgroundColor },
                ]}
              >
                <View style={styles.iconInner}>
                  <Ionicons name={item.icon} size={40} color={item.iconColor} />
                </View>
              </View>
              <Text style={styles.title}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      );
    },
    [scrollX]
  );

  const renderSeparator = useCallback(
    () => <View style={{ width: CARD_MARGIN }} />,
    []
  );

  // Tạo thanh progress bar với chấm di chuyển
  const renderProgressBar = useCallback(() => {
    const totalWidth = cardWidth * healthServices.length;
    const maxScrollX = totalWidth - width; // Tổng khoảng cách có thể scroll
    const trackWidth = 120; // Chiều rộng của track
    const thumbWidth = 24; // Chiều rộng của chấm di chuyển

    // Tính vị trí của chấm di chuyển
    const thumbPosition = scrollX.interpolate({
      inputRange: [0, maxScrollX],
      outputRange: [0, trackWidth - thumbWidth], // Chấm di chuyển từ 0 đến cuối track
      extrapolate: "clamp",
    });

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          {/* Chấm di chuyển */}
          <Animated.View
            style={[
              styles.progressThumb,
              {
                transform: [{ translateX: thumbPosition }],
                width: thumbWidth,
              },
            ]}
          />
        </View>
      </View>
    );
  }, [scrollX]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerText}>Dịch vụ sức khỏe</Text>
          <Text style={styles.subHeaderText}>Chăm sóc sức khỏe toàn diện</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <Animated.FlatList
        ref={flatListRef}
        data={healthServices}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false, listener: onScroll }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={renderSeparator}
        renderItem={renderItem}
        decelerationRate="fast"
        snapToInterval={cardWidth} // Snap theo page thay vì item
        snapToAlignment="start"
      />

      {/* Progress bar với chấm di chuyển */}
      {renderProgressBar()}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.5,
  },
  subHeaderText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6B7280",
    marginTop: 2,
  },
  moreButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  listContainer: {
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 0,
  },
  cardContent: {
    padding: 10,
    alignItems: "center",
    minHeight: 140,
    justifyContent: "space-between",
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  iconInner: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
    color: "#111827",
    textAlign: "center",
    letterSpacing: -0.2,
  },
  // Styles cho progress bar với chấm di chuyển
  progressContainer: {
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  progressTrack: {
    width: 120, // Chiều rộng tổng của track
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    position: "relative",
    overflow: "visible", // Cho phép chấm nhô ra ngoài track
  },
  progressThumb: {
    height: 6,
    backgroundColor: "#3B82F6",
    borderRadius: 3,
    position: "absolute",
    top: 0,
    left: 0,
    // Thêm shadow để chấm nổi bật hơn
    shadowColor: "#3B82F6",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default HealthServicesSwiper;
