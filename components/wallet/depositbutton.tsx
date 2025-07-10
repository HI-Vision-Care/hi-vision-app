import { useCreateWallet, useVNPayCallback } from "@/services/wallet/hooks";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
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

  const [callbackParams, setCallbackParams] = useState(null);
  const {
    data: callbackData,
    isLoading: isCallbackLoading,
    isSuccess: isCallbackSuccess,
    isError: isCallbackError,
    error: callbackError,
  } = useVNPayCallback(
    callbackParams || { vnp_TxnRef: "", vnp_ResponseCode: "", vnp_Amount: "" },
    !!callbackParams
  );

  useEffect(() => {
    if (isCallbackSuccess && callbackData) {
      Alert.alert("Nạp tiền thành công", "Số dư sẽ được cập nhật!");
      refetchWallet?.(); // GỌI LẠI QUERY!
      setCallbackParams(null);
    }
    if (isCallbackError) {
      Alert.alert(
        "Có lỗi khi xác thực giao dịch!",
        callbackError?.message || ""
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
    createWallet(
      {
        accountId,
        payload: { balance: Number(amount) },
      },
      {
        onSuccess: (data) => {
          setShowInput(false);
          setAmount("");
          if (data) {
            setWebviewUrl(data);
          } else {
            Alert.alert("Lỗi", "Không lấy được link thanh toán VNPay!");
          }
        },
        onError: () => {
          Alert.alert("Lỗi", "Không nạp được tiền. Thử lại!");
        },
      }
    );
  };

  const getQueryParams = (url) => {
    const params = {};
    const queryString = url.split("?")[1];
    if (!queryString) return params;
    const pairs = queryString.split("&");
    for (let pair of pairs) {
      const [key, value] = pair.split("=");
      params[decodeURIComponent(key)] = decodeURIComponent(value || "");
    }
    return params;
  };

  // Hàm lắng nghe callback url của VNPay
  const handleWebViewNavigationStateChange = (navState) => {
    if (navState.url.startsWith(VNPAY_CALLBACK_URL)) {
      setWebviewUrl(null);

      // Parse param từ url callback bằng JS thuần
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

  return (
    <>
      {showInput ? (
        <View className="flex-row items-center">
          <View className="bg-gray-100 rounded-xl px-3 py-2 mr-2">
            <Text>₫</Text>
            <TextInput
              placeholder="Số tiền"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={{ minWidth: 80 }}
            />
          </View>
          <TouchableOpacity
            onPress={handleDeposit}
            disabled={isLoading || !amount}
            className="bg-green-500 rounded-xl px-4 py-2"
          >
            <Text className="text-white font-bold">
              {isLoading ? "Đang chuyển..." : "Nạp"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowInput(false)}
            className="ml-2"
          >
            <Ionicons name="close" size={22} color="#555" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => setShowInput(true)}
          className="bg-blue-600 rounded-xl px-4 py-3"
          style={{
            shadowColor: "#3B82F6",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 6,
            elevation: 4,
          }}
        >
          <View className="flex-row items-center">
            <Ionicons name="add-circle" size={22} color="#fff" />
            <Text className="text-white font-bold ml-2">Nạp tiền</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Modal chứa WebView thanh toán */}
      <Modal visible={!!webviewUrl} animationType="slide">
        <View style={{ flex: 1 }}>
          <View
            style={{
              height: 50,
              flexDirection: "row",
              alignItems: "center",
              padding: 8,
            }}
          >
            <TouchableOpacity onPress={() => setWebviewUrl(null)}>
              <Ionicons name="close" size={28} color="#222" />
            </TouchableOpacity>
            <Text style={{ marginLeft: 16, fontWeight: "bold", fontSize: 18 }}>
              Thanh toán VNPay
            </Text>
          </View>
          <WebView
            source={{ uri: webviewUrl || "" }}
            onNavigationStateChange={handleWebViewNavigationStateChange}
            startInLoadingState
          />
          {isCallbackLoading && (
            <View style={{ position: "absolute", top: 100, left: 0, right: 0 }}>
              <Text style={{ textAlign: "center", color: "#222" }}>
                Đang xác thực giao dịch...
              </Text>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
};

export default DepositButton;
