import { getHealthServices } from "@/constants/healthServices";
import { useTranslation } from "@/hooks/useTranslation";
import { Ionicons } from "@expo/vector-icons";
import React, { memo, useCallback, useRef } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 0;
const HORIZONTAL_PADDING = 0;
const cardWidth = (width / 1.6 - HORIZONTAL_PADDING - CARD_MARGIN) / 2;

interface HealthService {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap | string;
  iconColor: string;
  backgroundColor: string;
  gradientColors: string[];
  onPress: () => void;
}

const HealthServicesSwiperBase: React.FC = () => {
  const { t, isReady } = useTranslation();
  const flatListRef = useRef<FlatList<HealthService> | null>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  if (!isReady) {
    return null;
  }

  // Get health services with translations
  const healthServices = getHealthServices(t);

  // Keep listener in case you want side-effects later; it’s noop now and cheap.
  const onScroll = useCallback((_: NativeSyntheticEvent<NativeScrollEvent>) => {
    /* no-op: we drive UI directly from scrollX */
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: HealthService; index: number }) => {
      const inputRange = [
        (index - 1) * cardWidth - cardWidth / 2,
        index * cardWidth - cardWidth / 2,
        (index + 1) * cardWidth - cardWidth / 2,
      ];

      const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0.7, 1, 0.4],
        extrapolate: "clamp",
      });

      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.7, 1, 0.3],
        extrapolate: "clamp",
      });

      const translateY = scrollX.interpolate({
        inputRange,
        outputRange: [10, -10, 10],
        extrapolate: "clamp",
      });

      return (
        <Animated.View
          style={{ transform: [{ scale }, { translateY }], opacity }}
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
                  {/* Ionicons accepts string union names at runtime */}
                  <Ionicons
                    name={item.icon as keyof typeof Ionicons.glyphMap}
                    size={40}
                    color={item.iconColor}
                  />
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

  const renderProgressBar = useCallback(() => {
    const totalWidth = cardWidth * healthServices.length;
    const maxScrollX = Math.max(totalWidth - width, 1); // guard divide-by-zero
    const trackWidth = 120;
    const thumbWidth = 24;

    const thumbPosition = scrollX.interpolate({
      inputRange: [0, maxScrollX],
      outputRange: [0, trackWidth - thumbWidth],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressThumb,
              { transform: [{ translateX: thumbPosition }], width: thumbWidth },
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
          <Text style={styles.headerText}>{t("home.healthServices")}</Text>
          <Text style={styles.subHeaderText}>
            {t("home.comprehensiveHealthcare")}
          </Text>
        </View>
      </View>

      <Animated.FlatList<HealthService>
        ref={flatListRef}
        // If your imported constant has loose typing, the cast narrows it to our item type.
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
        snapToInterval={cardWidth}
        snapToAlignment="start"
      />

      {renderProgressBar()}
    </View>
  );
};

HealthServicesSwiperBase.displayName = "HealthServicesSwiper";

const styles = StyleSheet.create({
  wrapper: { marginBottom: 32 },
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
  listContainer: { paddingHorizontal: HORIZONTAL_PADDING },
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
  progressContainer: {
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  progressTrack: {
    width: 120,
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    position: "relative",
    overflow: "visible",
  },
  progressThumb: {
    height: 6,
    backgroundColor: "#3B82F6",
    borderRadius: 3,
    position: "absolute",
    top: 0,
    left: 0,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default memo(HealthServicesSwiperBase);
