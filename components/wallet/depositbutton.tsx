import { useCreateWallet, useVNPayCallback } from "@/services/wallet/hooks";
import { VNPayCallbackParams } from "@/services/wallet/types";
import { NavState } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

const VNPAY_CALLBACK_URL = "http://192.168.15.93:8081/success";

const DepositButton = ({
  accountId,
  refetchWallet,
}: {
  accountId?: string;
  refetchWallet?: any;
}) => {
  const [showInput, setShowInput] = useState(false);
  const [amount, setAmount] = useState("");
  const [webviewUrl, setWebviewUrl] = useState<string | null>(null);
  const { mutate: createWallet, isLoading } = useCreateWallet();

  const [callbackParams, setCallbackParams] =
    useState<VNPayCallbackParams | null>(null);
  const {
    data: callbackData,
    isSuccess: isCallbackSuccess,
    isError: isCallbackError,
    error: callbackError,
  } = useVNPayCallback(
    callbackParams || { vnp_TxnRef: "", vnp_ResponseCode: "", vnp_Amount: "" },
    !!callbackParams
  );

  useEffect(() => {
    if (isCallbackSuccess && callbackData) {
      Alert.alert("Nạp tiền thành công", "Số dư của bạn đã được cập nhật!", [
        { text: "Đóng", style: "default" },
      ]);
      refetchWallet?.();
      setCallbackParams(null);
    }
    if (isCallbackError) {
      Alert.alert(
        "Giao dịch lỗi",
        callbackError?.message || "Vui lòng thử lại",
        [{ text: "Đóng", style: "default" }]
      );
      setCallbackParams(null);
    }
  }, [
    isCallbackSuccess,
    isCallbackError,
    callbackData,
    callbackError,
    refetchWallet,
  ]);

  const handleDeposit = () => {
    if (!amount || !accountId) return;

    const numAmount = Number(amount);
    if (numAmount < 10000) {
      Alert.alert("Số tiền không hợp lệ", "Nạp tối thiểu 10,000 VNĐ");
      return;
    }

    createWallet(
      {
        accountId,
        payload: { balance: numAmount },
      },
      {
        onSuccess: (data) => {
          setShowInput(false);
          setAmount("");
          if (data) {
            setWebviewUrl(data);
          } else {
            Alert.alert("Lỗi", "Không thể kết nối VNPay!");
          }
        },
        onError: () => {
          Alert.alert("Lỗi", "Không thể thực hiện giao dịch!");
        },
      }
    );
  };

  const formatCurrency = (value: string) => {
    const numValue = value.replace(/[^0-9]/g, "");
    return numValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleAmountChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setAmount(numericValue);
  };

  const getQueryParams = (url: string): Record<string, string> => {
    const params: Record<string, string> = {};
    const queryString = url.split("?")[1];
    if (!queryString) return params;
    const pairs = queryString.split("&");
    for (let pair of pairs) {
      const [key, value] = pair.split("=");
      params[decodeURIComponent(key)] = decodeURIComponent(value || "");
    }
    return params;
  };

  const handleWebViewNavigationStateChange = (navState: NavState) => {
    if (navState.url.startsWith(VNPAY_CALLBACK_URL)) {
      setWebviewUrl(null);

      const params = getQueryParams(navState.url);
      const { vnp_TxnRef, vnp_ResponseCode, vnp_Amount } = params;

      if (vnp_TxnRef && vnp_ResponseCode && vnp_Amount) {
        setCallbackParams({
          vnp_TxnRef: String(vnp_TxnRef),
          vnp_ResponseCode: String(vnp_ResponseCode),
          vnp_Amount: String(vnp_Amount),
        });
      }
    }
  };

  const quickAmounts = [
    { label: "50K", value: "50000" },
    { label: "100K", value: "100000" },
    { label: "200K", value: "200000" },
    { label: "500K", value: "500000" },
  ];

  return (
    <View className="mx-2">
      {/* Nút mở modal */}
      <TouchableOpacity
        onPress={() => setShowInput(true)}
        className="bg-blue-600 flex-row items-center justify-center rounded-2xl  py-3 w-56"
        activeOpacity={0.85}
        style={{
          shadowColor: "#3B82F6",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.16,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <View className="bg-white/20 rounded-full p-1 mr-2">
          <Ionicons name="add" size={20} color="#fff" />
        </View>
        <Text className="text-white font-bold text-base">Nạp tiền</Text>
      </TouchableOpacity>

      {/* Modal nhập số tiền */}
      <Modal visible={showInput} animationType="slide" transparent>
        <View className="flex-1 bg-black/20 justify-center items-center px-4">
          <View className="w-full bg-white rounded-3xl px-6 py-8">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center">
                <View className="bg-blue-100 rounded-full p-2 mr-2">
                  <Ionicons name="wallet-outline" size={20} color="#3B82F6" />
                </View>
                <Text className="text-xl font-bold text-gray-900">
                  Nạp tiền
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowInput(false)}
                className="bg-gray-100 rounded-full p-2"
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Input tiền */}
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Nhập số tiền muốn nạp
            </Text>
            <View className="bg-gray-50 rounded-2xl flex-row items-center border border-gray-200 px-4 py-3 mb-1">
              <Text className="text-2xl font-bold text-blue-600 mr-1">₫</Text>
              <TextInput
                placeholder="0"
                value={formatCurrency(amount)}
                onChangeText={handleAmountChange}
                keyboardType="numeric"
                className="flex-1 text-2xl font-bold text-gray-900"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            {amount ? (
              <Text className="text-xs text-gray-500 mb-2 text-right">
                {formatCurrency(amount)} VNĐ
              </Text>
            ) : null}

            {/* Quick amounts: chip horizontal */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row mb-6"
            >
              {quickAmounts.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => setAmount(item.value)}
                  className={`py-2 px-5 mr-2 rounded-xl border-2 ${
                    amount === item.value
                      ? "bg-blue-100 border-blue-600"
                      : "bg-white border-gray-200"
                  }`}
                  activeOpacity={0.8}
                >
                  <Text
                    className={`font-bold text-base ${
                      amount === item.value ? "text-blue-600" : "text-gray-700"
                    }`}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Button deposit */}
            <TouchableOpacity
              onPress={handleDeposit}
              disabled={isLoading || !amount || Number(amount) < 10000}
              className={`py-4 rounded-2xl w-full ${
                isLoading || !amount || Number(amount) < 10000
                  ? "bg-gray-300"
                  : "bg-green-600"
              }`}
              activeOpacity={0.85}
            >
              <View className="flex-row items-center justify-center">
                {isLoading ? (
                  <>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text className="text-white font-bold ml-2 text-base">
                      Đang xử lý...
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="card-outline" size={22} color="#fff" />
                    <Text className="text-white font-bold ml-2 text-base">
                      Thanh toán VNPay
                    </Text>
                  </>
                )}
              </View>
            </TouchableOpacity>

            {/* Validation */}
            {Number(amount) > 0 && Number(amount) < 10000 && (
              <View className="bg-red-50 rounded-xl p-3 mt-4 border border-red-200">
                <View className="flex-row items-center">
                  <Ionicons name="warning-outline" size={16} color="#DC2626" />
                  <Text className="text-red-600 text-xs font-medium ml-2">
                    Số tiền tối thiểu là 10,000 VNĐ
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* VNPay Payment Modal giữ nguyên */}
      <Modal visible={!!webviewUrl} animationType="slide">
        <View className="flex-1 bg-white">
          {/* Modal Header */}
          <View className="bg-white border-b border-gray-200 px-4 py-4 pt-12">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => setWebviewUrl(null)}
                  className="bg-gray-100 rounded-full p-2 mr-3"
                  activeOpacity={0.7}
                >
                  <Ionicons name="arrow-back" size={20} color="#374151" />
                </TouchableOpacity>
                <View>
                  <Text className="font-bold text-lg text-gray-900">
                    Thanh toán VNPay
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Giao dịch được bảo mật
                  </Text>
                </View>
              </View>
              <View className="bg-green-100 rounded-full px-3 py-1">
                <View className="flex-row items-center">
                  <Ionicons name="shield-checkmark" size={12} color="#059669" />
                  <Text className="text-green-700 font-medium text-xs ml-1">
                    Bảo mật
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* WebView */}
          <WebView
            source={{ uri: webviewUrl || "" }}
            onNavigationStateChange={handleWebViewNavigationStateChange}
            startInLoadingState
            renderLoading={() => (
              <View className="flex-1 justify-center items-center bg-gray-50">
                <View className="bg-white rounded-2xl p-8 mx-8 items-center shadow-lg">
                  <ActivityIndicator size="large" color="#3B82F6" />
                  <Text className="text-gray-800 font-semibold mt-4 text-center">
                    Đang tải trang thanh toán
                  </Text>
                  <Text className="text-gray-500 text-sm mt-2 text-center">
                    Vui lòng chờ trong giây lát...
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

export default DepositButton;
