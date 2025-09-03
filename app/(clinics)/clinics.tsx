// app/(clinics)/clinics.tsx
import { useFacilities } from "@/services/clinics/hooks";
import { Facility } from "@/services/clinics/types";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router } from "expo-router";
import { JSX, useCallback, useEffect, useMemo, useState } from "react";
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

type LatLng = { latitude: number; longitude: number };

type ClinicItem = {
  id: string;
  name: string;
  address: string;
  phone?: string;
  img?: string;
  time?: string; // giờ hoạt động do backend trả về (string)
  rating?: number; // chuyển từ string -> number
  coords?: LatLng; // nếu backend có lat/lng
  _distance?: number; // km để sort
};

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

const ClinicsScreen: React.FC = () => {
  const [granted, setGranted] = useState<boolean | null>(null);
  const [coords, setCoords] = useState<LatLng | null>(null);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // đúng module facility (không còn /clinics)
  const {
    data: facilities,
    isLoading: loadingFacilities,
    isRefetching,
    refetch,
  } = useFacilities();

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
      // mềm lỗi UI
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // Chuẩn hoá dữ liệu từ backend -> dữ liệu hiển thị UI
  const base: ClinicItem[] = useMemo(() => {
    const list = (facilities ?? []).map((f: Facility) => {
      // rating backend là string -> number (an toàn NaN)
      const ratingNum =
        f.rating != null && f.rating !== "" ? parseFloat(f.rating) : undefined;

      // latitude/longitude có thể là string -> parse thành number
      const lat =
        f.latitude != null && f.latitude !== ""
          ? parseFloat(f.latitude)
          : undefined;
      const lon =
        f.longitude != null && f.longitude !== ""
          ? parseFloat(f.longitude)
          : undefined;

      const hasCoords =
        typeof lat === "number" &&
        !Number.isNaN(lat) &&
        typeof lon === "number" &&
        !Number.isNaN(lon);

      return {
        id: f.facilityID,
        name: f.name,
        address: f.address,
        phone: f.phone,
        img: f.img,
        time: f.time,
        rating: !Number.isNaN(ratingNum!) ? ratingNum : undefined,
        coords: hasCoords ? { latitude: lat!, longitude: lon! } : undefined,
      };
    });
    return list;
  }, [facilities]);

  // Tìm kiếm theo tên + địa chỉ
  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = base.filter(
      (c) =>
        q.length === 0 ||
        c.name.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
    );

    // sort theo khoảng cách (nếu có vị trí người dùng & coords phòng khám)
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
  }, [base, search, coords]);

  const renderStars = (rating?: number) => {
    if (!rating || Number.isNaN(rating)) return null;
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    const icons: JSX.Element[] = [];
    for (let i = 0; i < full; i++)
      icons.push(
        <Ionicons key={`f${i}`} name="star" size={12} color="#F59E0B" />
      );
    if (half)
      icons.push(
        <Ionicons key="h" name="star-half" size={12} color="#F59E0B" />
      );
    for (let i = 0; i < empty; i++)
      icons.push(
        <Ionicons key={`e${i}`} name="star-outline" size={12} color="#F59E0B" />
      );
    return <View className="flex-row items-center">{icons}</View>;
  };

  const renderItem = ({ item }: { item: ClinicItem }) => (
    <Pressable
      className="bg-white rounded-2xl p-3 mb-4 shadow-sm flex-row"
      onPress={() =>
        router.push({
          pathname: "/clinic/[id]", // route động
          params: { id: String(item.id) }, // truyền id phòng khám
        })
      }
    >
      <Image
        source={{
          uri:
            item.img || "https://via.placeholder.com/160x160.png?text=Clinic",
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
          {renderStars(item.rating)}
        </View>

        {!!item.time && (
          <Text className="text-[12px] text-emerald-700 mt-1" numberOfLines={1}>
            {item.time}
          </Text>
        )}

        <Text className="text-[12px] text-gray-500 mt-1" numberOfLines={2}>
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
                <Text className="text-[12px] text-gray-800">Call</Text>
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
                Directions
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
            Clinic near you
          </Text>
          <Text className="text-[13px] text-gray-500 mt-0.5">
            Quick search – appointment booking – instant directions
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
            placeholder="Search by name or address..."
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

      {/* Cảnh báo quyền vị trí */}
      <View className="px-5 mt-3">
        {granted === false && (
          <View className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <Text className="text-[13px] text-amber-800">
              You have not enabled location permissions. Please enable location
              access to see the nearest clinics.
            </Text>
          </View>
        )}
      </View>

      {/* Danh sách */}
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
                ? "Loading clinic..."
                : "No suitable clinic found."}
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
