import { useCreateWallet, useVNPayCallback } from "@/services/wallet/hooks";
import { VNPayCallbackParams } from "@/services/wallet/types";
import { NavState } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

const VNPAY_CALLBACK_URL = "http://192.168.100.21:8081/success";

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
      Alert.alert("Deposit successful", "Your balance has been updated!", [
        { text: "Close", style: "default" },
      ]);
      refetchWallet?.();
      setCallbackParams(null);
    }
    if (isCallbackError) {
      Alert.alert(
        "Error Transaction",
        callbackError?.message || "Please try again",
        [{ text: "Close", style: "default" }]
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
      Alert.alert("Invalid amount", "Minimum deposit amount is 10,000 VND");
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
            Alert.alert("Error", "Can not connect to VNPay!");
          }
        },
        onError: () => {
          Alert.alert("Error", "Transaction cannot be performed!");
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
    <View className="mx-4">
      {showInput ? (
        <View className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <View className="bg-blue-100 rounded-full p-2 mr-3">
                <Ionicons name="wallet-outline" size={20} color="#3B82F6" />
              </View>
              <Text className="text-xl font-bold text-gray-900">Deposit</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowInput(false)}
              className="bg-gray-100 rounded-full p-2"
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Amount Input Section */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-3">
              Enter the amount you want to deposit
            </Text>
            <View className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
              <View className="flex-row items-center">
                <Text className="text-2xl font-bold text-blue-600 mr-3">₫</Text>
                <TextInput
                  placeholder="0"
                  value={formatCurrency(amount)}
                  onChangeText={handleAmountChange}
                  keyboardType="numeric"
                  className="flex-1 text-2xl font-bold text-gray-900"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {amount && (
                <Text className="text-sm text-gray-500 mt-2">
                  {formatCurrency(amount)} VNĐ
                </Text>
              )}
            </View>
          </View>

          {/* Quick Amount Buttons */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-3">
              Chọn nhanh
            </Text>
            <View className="flex-row justify-between">
              {quickAmounts.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setAmount(item.value)}
                  className={`flex-1 py-3 px-2 rounded-xl border-2 mx-1 ${
                    amount === item.value
                      ? "bg-blue-50 border-blue-500"
                      : "bg-white border-gray-200"
                  }`}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-center font-semibold ${
                      amount === item.value ? "text-blue-600" : "text-gray-700"
                    }`}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Deposit Button */}
          <TouchableOpacity
            onPress={handleDeposit}
            disabled={isLoading || !amount || Number(amount) < 10000}
            className={`py-4 px-6 rounded-2xl ${
              isLoading || !amount || Number(amount) < 10000
                ? "bg-gray-300"
                : "bg-green-600"
            }`}
            activeOpacity={0.8}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <View className="flex-row items-center justify-center">
              {isLoading ? (
                <>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text className="text-white font-bold ml-2 text-lg">
                    Processing...
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="card-outline" size={22} color="#fff" />
                  <Text className="text-white font-bold ml-2 text-lg">
                    Thanh toán VNPay
                  </Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          {/* Validation Message */}
          {Number(amount) > 0 && Number(amount) < 10000 && (
            <View className="bg-red-50 rounded-xl p-3 mt-4 border border-red-200">
              <View className="flex-row items-center">
                <Ionicons name="warning-outline" size={16} color="#DC2626" />
                <Text className="text-red-600 text-sm font-medium ml-2">
                  Minimum deposit amount is 10,000 VND
                </Text>
              </View>
            </View>
          )}
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => setShowInput(true)}
          className="bg-blue-600 rounded-2xl px-6 py-4"
          activeOpacity={0.8}
          style={{
            shadowColor: "#3B82F6",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <View className="flex-row items-center justify-center">
            <View className="bg-white/20 rounded-full p-1 mr-3">
              <Ionicons name="add" size={20} color="#fff" />
            </View>
            <Text className="text-white font-bold text-lg">Nạp tiền</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* VNPay Payment Modal */}
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
                    Loading payment page
                  </Text>
                  <Text className="text-gray-500 text-sm mt-2 text-center">
                    Please wait a moment...
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
