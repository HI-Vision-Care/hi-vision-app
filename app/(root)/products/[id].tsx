import { AddToCartModal } from "@/components";
import { usePatientProfile } from "@/hooks/usePatientId";
import { useCreateOrder } from "@/services/order/hooks";
import { Product } from "@/services/product/types";
import { formatVND } from "@/utils/format";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Share2 } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductDetailsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const { data: profile } = usePatientProfile();
  const patientId = profile?.patientID;
  const params = useLocalSearchParams<{
    id?: string;
    product?: string;
  }>();

  // Lấy product từ params (đã encode ở màn list)
  const product: Product | null = useMemo(() => {
    try {
      if (!params?.product) return null;
      return JSON.parse(decodeURIComponent(String(params.product)));
    } catch {
      return null;
    }
  }, [params]);

  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // mutation tạo order
  const { mutate: createOrder, isPending } = useCreateOrder(); // isPending = đang gọi API

  const handleBackPress = () => router.back();

  const handleSharePress = () => {
    Alert.alert("Chia sẻ", "Tính năng chia sẻ sẽ được bổ sung.");
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (!patientId) {
      Alert.alert(
        "Thiếu thông tin",
        "Không tìm thấy patientId. Vui lòng đăng nhập/chọn bệnh nhân hoặc truyền patientId khi điều hướng từ danh sách."
      );
      return;
    }

    createOrder(
      {
        patientId,
        payload: {
          productId: Number(product.id),
          quantity: 1, // có thể thay bằng selector số lượng sau
        },
      },
      {
        onSuccess: (order) => {
          Alert.alert("Thành công", "Sản phẩm đã được thêm vào giỏ.");
          // Điều hướng giỏ hàng nếu muốn:
          // router.push("/(cart)/cart");
        },
        onError: (err: any) => {
          Alert.alert("Lỗi", String(err?.message ?? "Không thể tạo đơn hàng"));
        },
      }
    );
  };

  if (!product) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-lg font-semibold text-gray-900 mb-2">
          Không có dữ liệu sản phẩm
        </Text>
        <Text className="text-gray-600 text-center mb-4">
          Vui lòng quay lại danh sách và chọn sản phẩm.
        </Text>
        <TouchableOpacity
          onPress={handleBackPress}
          className="px-4 py-2 rounded-xl bg-blue-500"
        >
          <Text className="text-white font-medium">Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const categoryName = product.category?.categoryName;
  const supplierName = product.supplier?.supplierName;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity
          onPress={handleBackPress}
          className="p-2 rounded-full bg-blue-100"
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
        >
          <ArrowLeft size={20} color="#2563EB" />
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-gray-900">
          Chi tiết sản phẩm
        </Text>

        <TouchableOpacity
          onPress={handleSharePress}
          className="p-2 rounded-full bg-blue-100"
          accessibilityRole="button"
          accessibilityLabel="Chia sẻ sản phẩm"
        >
          <Share2 size={20} color="#2563EB" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Ảnh */}
        <View className="bg-gray-50 mx-4 mt-4 rounded-2xl overflow-hidden">
          <View className="relative">
            <Image
              source={{ uri: product.imageUrl || "" }}
              className="w-full h-80"
              resizeMode="cover"
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
            />

            {imageLoading && (
              <View className="absolute inset-0 bg-gray-200 items-center justify-center">
                <Text className="text-gray-500">Đang tải ảnh…</Text>
              </View>
            )}

            {imageError && (
              <View className="absolute inset-0 bg-gray-200 items-center justify-center">
                <Text className="text-gray-500">Không hiển thị được ảnh</Text>
              </View>
            )}

            {!!categoryName && (
              <View className="absolute bottom-4 left-4">
                <View className="bg-blue-600 px-3 py-1.5 rounded-full">
                  <Text className="text-white text-sm font-medium">
                    {categoryName}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Thông tin */}
        <View className="px-4 mt-6">
          <Text
            className="text-2xl font-bold text-gray-900 leading-tight"
            accessibilityRole="header"
          >
            {product.productName}
          </Text>

          <View className="flex-row items-baseline mt-3 mb-6">
            {product.price != null && (
              <Text className="text-3xl font-bold text-blue-600">
                {formatVND(product.price)}
              </Text>
            )}
            {!!product.unit && (
              <Text className="text-lg text-gray-600 ml-2">
                / {product.unit}
              </Text>
            )}
          </View>

          {!!supplierName && (
            <View className="bg-gray-50 rounded-2xl p-4 mb-6">
              <Text className="text-sm font-medium text-gray-500 mb-1">
                Nhà cung cấp
              </Text>
              <Text className="text-lg font-semibold text-gray-900">
                {supplierName}
              </Text>
            </View>
          )}

          {!!product.description && (
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                Mô tả
              </Text>
              <Text className="text-gray-700 leading-relaxed text-base">
                {product.description}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      {!modalVisible && ( // ⬅ ẩn đi khi modal mở
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="bg-blue-600 rounded-2xl py-4 px-6 shadow-lg flex-row items-center justify-center"
          >
            <Text className="text-white text-lg font-semibold">
              Thêm vào giỏ
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <AddToCartModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        product={product}
        onConfirm={(quantity) => {
          // gọi useCreateOrder ở đây với quantity
          createOrder({
            patientId,
            payload: { productId: product.id, quantity },
          });
          setModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
}
