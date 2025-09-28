import { Product } from "@/services/product/types";
import { formatVND } from "@/utils/format";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  onClose: () => void;
  product: Product;
  onConfirm: (quantity: number) => void;
};

export default function AddToCartModal({
  visible,
  onClose,
  product,
  onConfirm,
}: Props) {
  const [quantity, setQuantity] = useState(1);
  const insets = useSafeAreaInsets();

  const dec = () => quantity > 1 && setQuantity(quantity - 1);
  const inc = () =>
    setQuantity((q) => Math.min(q + 1, Number(product.stock ?? 999)));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
      hardwareAccelerated
    >
      {/* Backdrop phủ kín + chặn click */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        />
      </TouchableWithoutFeedback>

      {/* Bottom sheet */}
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
        }}
        pointerEvents="box-none"
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 16,
            paddingBottom: 16 + insets.bottom, // ⬅ che kín home indicator
            shadowColor: "#000",
            shadowOpacity: 0.12,
            shadowRadius: 12,
            elevation: 12,
          }}
        >
          {/* Header rút gọn */}
          <View style={{ flexDirection: "row" }}>
            <Image
              source={{ uri: product.imageUrl || "" }}
              style={{
                width: 72,
                height: 72,
                borderRadius: 12,
                backgroundColor: "#F3F4F6",
              }}
              resizeMode="cover"
            />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text
                style={{ fontSize: 16, fontWeight: "600", color: "#111827" }}
                numberOfLines={2}
              >
                {product.productName}
              </Text>
              {!!product.price && (
                <Text
                  style={{
                    marginTop: 4,
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#2563EB",
                  }}
                >
                  {formatVND(product.price)}
                </Text>
              )}
              <Text style={{ marginTop: 2, fontSize: 12, color: "#6B7280" }}>
                Kho: {product.stock ?? 0}
              </Text>
            </View>
          </View>

          {/* Số lượng */}
          <View style={{ marginTop: 16 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: "#374151",
                marginBottom: 8,
              }}
            >
              Số lượng
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#E5E7EB",
                borderRadius: 10,
                alignSelf: "flex-start",
              }}
            >
              <TouchableOpacity
                onPress={dec}
                style={{ paddingHorizontal: 14, paddingVertical: 8 }}
              >
                <Text style={{ fontSize: 18, fontWeight: "700" }}>−</Text>
              </TouchableOpacity>
              <Text style={{ minWidth: 28, textAlign: "center", fontSize: 16 }}>
                {quantity}
              </Text>
              <TouchableOpacity
                onPress={inc}
                style={{ paddingHorizontal: 14, paddingVertical: 8 }}
              >
                <Text style={{ fontSize: 18, fontWeight: "700" }}>＋</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Actions */}
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <TouchableOpacity
              onPress={onClose}
              style={{
                flex: 1,
                backgroundColor: "#E5E7EB",
                paddingVertical: 12,
                borderRadius: 12,
                alignItems: "center",
                marginRight: 8,
              }}
            >
              <Text style={{ color: "#374151", fontWeight: "600" }}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onConfirm(quantity)}
              style={{
                flex: 1,
                backgroundColor: "#2563EB",
                paddingVertical: 12,
                borderRadius: 12,
                alignItems: "center",
                marginLeft: 8,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
