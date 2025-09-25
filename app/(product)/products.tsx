import SkeletonCard from "@/components/products/SkeletonCard";
import { useGetProducts } from "@/services/product/hooks";
import { Product } from "@/services/product/types";
import { formatVND } from "@/utils/format";
import { router } from "expo-router";
import { Search, ShoppingBag } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth } = Dimensions.get("window");
const cardWidth = (screenWidth - 48) / 2; // 2 cột với padding ngang

export default function ProductListingScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const { data, isLoading, error, refetch, isRefetching } =
    useGetProducts(true);

  // Danh mục
  const categories = useMemo(() => {
    const names = new Set<string>();
    (data ?? []).forEach((p) => {
      const name = p.category?.categoryName?.trim();
      if (name) names.add(name);
    });
    return ["Tất cả", ...Array.from(names)];
  }, [data]);

  // Lọc sản phẩm
  const filteredProducts = useMemo(() => {
    const list = (data ?? []) as Product[];
    return list.filter((p) => {
      const matchesSearch = (p.productName ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const catName = p.category?.categoryName;
      const matchesCategory =
        selectedCategory === "Tất cả" || catName === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [data, searchQuery, selectedCategory]);

  const navigateToProduct = useCallback((product: Product) => {
    router.push({
      pathname: "/(root)/products/[id]",
      params: {
        id: String(product.id ?? ""),
        // Truyền kèm object đã encode để detail không cần call API lại
        product: encodeURIComponent(JSON.stringify(product)),
      },
    });
  }, []);

  const renderProductCard = useCallback(
    ({ item }: { item: Product }) => (
      <TouchableOpacity
        onPress={() => navigateToProduct(item)}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        style={{ width: cardWidth, marginBottom: 16 }}
      >
        {/* Ảnh sản phẩm */}
        <View className="relative">
          <Image
            source={{ uri: item.imageUrl || "" }}
            className="w-full h-36 bg-gray-100 rounded-t-2xl"
            resizeMode="cover"
          />
        </View>

        {/* Thông tin */}
        <View className="p-3">
          {!!item.category?.categoryName && (
            <View className="mb-2">
              <View className="bg-blue-100 px-2 py-1 rounded-full self-start">
                <Text className="text-blue-700 text-xs font-medium">
                  {item.category.categoryName}
                </Text>
              </View>
            </View>
          )}

          <Text
            className="text-sm font-medium text-gray-900 mb-1 leading-tight"
            numberOfLines={2}
          >
            {item.productName}
          </Text>

          {item.price != null && (
            <Text className="text-base font-bold text-blue-600">
              {formatVND(item.price)}
              {item.unit ? ` / ${item.unit}` : ""}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    ),
    [navigateToProduct]
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Sản phẩm</Text>
            <Text className="text-sm text-gray-500">
              Danh sách sản phẩm y tế
            </Text>
          </View>
          <TouchableOpacity className="p-2 rounded-full bg-blue-100">
            <ShoppingBag size={20} color="#2563EB" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-3 py-2 mb-3 shadow-sm">
          <Search size={18} color="#6B7280" />
          <TextInput
            className="flex-1 ml-2 text-gray-900"
            placeholder="Tìm sản phẩm..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedCategory === category ? "bg-blue-500" : "bg-blue-100"
              }`}
            >
              <Text
                className={`font-medium ${
                  selectedCategory === category ? "text-white" : "text-blue-700"
                }`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Body */}
      <View className="flex-1 px-4 pt-4">
        {isLoading ? (
          <FlatList
            data={Array.from({ length: 6 })}
            renderItem={() => <SkeletonCard />}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(_, idx) => `skeleton-${idx}`}
          />
        ) : error ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              Lỗi tải sản phẩm
            </Text>
            <Text className="text-gray-600 mb-4" numberOfLines={3}>
              {String(error)}
            </Text>
            <TouchableOpacity
              onPress={() => refetch()}
              className="px-4 py-2 rounded-xl bg-blue-500"
            >
              <Text className="text-white font-medium">
                Thử lại {isRefetching ? "…" : ""}
              </Text>
            </TouchableOpacity>
          </View>
        ) : filteredProducts.length > 0 ? (
          <FlatList
            data={filteredProducts}
            renderItem={renderProductCard}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 60 }}
            keyExtractor={(item) => String(item.id)}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Search size={48} color="#9CA3AF" />
            <Text className="text-lg font-semibold text-gray-900 mt-4 mb-2">
              Không tìm thấy sản phẩm
            </Text>
            <Text className="text-gray-600 text-center">
              Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
