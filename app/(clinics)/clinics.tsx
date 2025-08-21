// app/(clinics)/clinics.tsx
import { useFacilities } from "@/services/clinics/hooks";
import { Facility } from "@/services/clinics/types";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ✅ NEW: dùng hooks & types từ module facility

// ==============================
// Types
// ==============================
type LatLng = { latitude: number; longitude: number };

type Clinic = {
  id: string;
  name: string;
  specialty?: string;
  address: string;
  phone?: string;
  photo?: string;
  coords?: LatLng; // backend hiện chưa có lat/lng → để optional
  rating?: number; // 0..5
  openNow?: boolean;
  _distance?: number; // tính tạm để sort
};

// ==============================
// Helpers
// ==============================
const kmDistance = (from: LatLng, to: LatLng) => {
  const R = 6371;
  const dLat = ((to.latitude - from.latitude) * Math.PI) / 180;
  const dLon = ((to.longitude - from.longitude) * Math.PI) / 180;
  const lat1 = (from.latitude * Math.PI) / 180;
  const lat2 = (to.latitude * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const openDirections = (coords: LatLng, label?: string) => {
  const { latitude, longitude } = coords;
  const query = label ? encodeURIComponent(label) : `${latitude},${longitude}`;
  const url =
    Platform.select({
      ios: `http://maps.apple.com/?daddr=${latitude},${longitude}&q=${query}`,
      android: `geo:0,0?q=${latitude},${longitude}(${query})`,
      default: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    }) ||
    `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  Linking.openURL(url);
};

// ==============================
// Component
// ==============================
const ClinicsScreen: React.FC = () => {
  const [granted, setGranted] = useState<boolean | null>(null);
  const [coords, setCoords] = useState<LatLng | null>(null);
  const [search, setSearch] = useState("");
  const [activeSpec, setActiveSpec] = useState<string>("Tất cả");
  const [refreshing, setRefreshing] = useState(false);

  // ✅ NEW: fetch danh sách phòng khám từ backend
  const {
    data: facilities,
    isLoading: loadingFacilities,
    isRefetching,
    refetch,
  } = useFacilities();

  // Ask for permission & get current location
  const requestLocation = useCallback(async () => {
    try {
      setRefreshing(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setGranted(false);
        setRefreshing(false);
        return;
      }
      setGranted(true);
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setCoords({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    } catch {
      // keep UI soft-failing
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // ✅ NEW: chuẩn hoá dữ liệu từ backend → format dùng cho UI
  const base: Clinic[] = useMemo(() => {
    const list = (facilities ?? []).map((f: Facility) => ({
      id: f.facilityID,
      name: f.name,
      specialty: "Phòng khám", // backend chưa có -> gắn nhãn chung
      address: f.address,
      phone: f.phone,
      photo: undefined, // nếu backend có ảnh thì map vào đây
      coords: undefined, // nếu backend trả lat/lng thì map: { latitude: f.latitude!, longitude: f.longitude! }
      rating: undefined,
      openNow: undefined,
    }));
    return list;
  }, [facilities]);

  // ✅ NEW: sinh chips theo danh sách thật
  const specialties = useMemo(
    () => [
      "Tất cả",
      ...Array.from(new Set(base.map((c) => c.specialty || "Phòng khám"))),
    ],
    [base]
  );

  // Filter + sort (nearest first if location available && có coords)
  const results = useMemo(() => {
    const q = search.trim().toLowerCase();

    let list = base.filter(
      (c) =>
        (activeSpec === "Tất cả" ||
          (c.specialty || "Phòng khám") === activeSpec) &&
        (q.length === 0 ||
          c.name.toLowerCase().includes(q) ||
          (c.specialty || "").toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q))
    );

    if (coords) {
      list = list
        .map((c) =>
          c.coords ? { ...c, _distance: kmDistance(coords, c.coords) } : c
        )
        .sort((a, b) => {
          if (a._distance == null && b._distance == null) return 0;
          if (a._distance == null) return 1;
          if (b._distance == null) return -1;
          return a._distance - b._distance;
        });
    }

    return list;
  }, [base, search, activeSpec, coords]);

  const renderChip = (label: string) => {
    const selected = activeSpec === label;
    return (
      <Pressable
        key={label}
        onPress={() => setActiveSpec(label)}
        className={`px-3 py-2 mr-2 rounded-full border ${
          selected ? "bg-blue-600 border-blue-600" : "bg-white border-gray-200"
        } shadow-sm`}
      >
        <Text
          className={`text-[13px] ${
            selected ? "text-white font-semibold" : "text-gray-700"
          }`}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  const renderItem = ({ item }: { item: Clinic }) => (
    <Pressable className="bg-white rounded-2xl p-3 mb-4 shadow-sm flex-row">
      <Image
        source={{
          uri:
            item.photo || "https://via.placeholder.com/160x160.png?text=Clinic",
        }}
        className="w-24 h-24 rounded-xl mr-3"
      />
      <View className="flex-1">
        <View className="flex-row items-start justify-between">
          <Text
            className="text-base font-semibold text-gray-900 flex-1 pr-2"
            numberOfLines={2}
          >
            {item.name}
          </Text>
        </View>

        <Text className="text-[12px] text-blue-700 mt-1">
          {item.specialty || "Phòng khám"}
        </Text>
        <Text className="text-[12px] text-gray-500 mt-1" numberOfLines={1}>
          {item.address}
        </Text>

        <View className="flex-row items-center justify-between mt-2">
          <View className="flex-row items-center">
            {typeof item._distance === "number" && (
              <View className="flex-row items-center mr-3">
                <Ionicons name="location" size={14} color="#3B82F6" />
                <Text className="ml-1 text-[12px] text-gray-700">
                  {item._distance < 1
                    ? `${Math.round(item._distance * 1000)} m`
                    : `${item._distance.toFixed(1)} km`}
                </Text>
              </View>
            )}
          </View>

          <View className="flex-row">
            {item.phone && (
              <Pressable
                onPress={() => Linking.openURL(`tel:${item.phone}`)}
                className="px-3 py-2 rounded-xl bg-gray-100 mr-2"
              >
                <Text className="text-[12px] text-gray-800">Gọi</Text>
              </Pressable>
            )}
            <Pressable
              disabled={!item.coords}
              onPress={() =>
                item.coords && openDirections(item.coords, item.name)
              }
              className={`px-3 py-2 rounded-xl ${
                item.coords ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <Text
                className={`text-[12px] ${
                  item.coords ? "text-white" : "text-gray-500"
                }`}
              >
                Chỉ đường
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-5 pt-2 pb-3 flex-row items-center justify-between">
        <View>
          <Text className="text-xl font-bold text-gray-900">
            Phòng khám gần bạn
          </Text>
          <Text className="text-[13px] text-gray-500 mt-0.5">
            Tìm nhanh – đặt khám – chỉ đường tức thì
          </Text>
        </View>
        <Pressable
          onPress={() => {
            requestLocation();
            refetch();
          }}
          className="p-2 rounded-xl bg-white border border-gray-200 shadow-sm"
        >
          <Ionicons name="navigate" size={18} color="#3B82F6" />
        </Pressable>
      </View>

      {/* Search */}
      <View className="px-5">
        <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-3 py-2 shadow-sm">
          <Ionicons name="search" size={18} color="#6B7280" />
          <TextInput
            placeholder="Tìm theo tên, chuyên khoa, địa chỉ..."
            className="ml-2 flex-1 text-[14px] text-gray-800"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {!!search && (
            <Pressable onPress={() => setSearch("")} className="p-1">
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Chips */}
      <View className="px-5 mt-3">
        <FlatList
          data={specialties}
          keyExtractor={(s) => s}
          renderItem={({ item }) => renderChip(item)}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Status / Hint */}
      <View className="px-5 mt-3">
        {granted === false && (
          <View className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <Text className="text-[13px] text-amber-800">
              Bạn chưa bật quyền vị trí. Hãy bật quyền truy cập vị trí để xem
              phòng khám gần nhất.
            </Text>
          </View>
        )}
      </View>

      {/* List */}
      <FlatList
        className="px-5 mt-3"
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Ionicons name="search" size={24} color="#9CA3AF" />
            <Text className="text-[13px] text-gray-500 mt-2">
              {loadingFacilities
                ? "Đang tải phòng khám..."
                : "Không tìm thấy phòng khám phù hợp."}
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing || loadingFacilities || isRefetching}
            onRefresh={() => {
              requestLocation();
              refetch();
            }}
          />
        }
        contentContainerStyle={{ paddingBottom: 28 }}
      />
    </SafeAreaView>
  );
};

export default ClinicsScreen;
