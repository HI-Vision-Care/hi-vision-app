import { MIN_WITHDRAW, quickAmounts } from "@/constants";
import { useRequestWithdraw } from "@/services/wallet/hooks";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
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

type Props = {
  accountId?: string;
  refetchWallet?: () => void;
};

export const WithdrawButton = ({ accountId, refetchWallet }: Props) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");

  const { mutate: requestWithdraw, isLoading } = useRequestWithdraw();

  const formatCurrency = (value: string) => {
    const num = value.replace(/[^0-9]/g, "");
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const onChangeAmount = (txt: string) => setAmount(txt.replace(/[^0-9]/g, ""));

  const canSubmit =
    !!accountId &&
    Number(amount) >= MIN_WITHDRAW &&
    !!accountName.trim() &&
    !!accountNumber.trim() &&
    !!bankName.trim();

  const onSubmit = () => {
    if (!accountId) return;

    requestWithdraw(
      {
        accountId,
        payload: {
          amount: Number(amount),
          accountName: accountName.trim(),
          accountNumber: accountNumber.trim(),
          bankName: bankName.trim(),
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
          setAmount("");
          setAccountName("");
          setAccountNumber("");
          setBankName("");
          refetchWallet?.();
          Alert.alert("Đã gửi yêu cầu", "Yêu cầu rút tiền đang được xử lý.");
        },
        onError: (err: any) => {
          Alert.alert(
            "Không thể rút tiền",
            err?.message || "Vui lòng thử lại sau."
          );
        },
      }
    );
  };

  return (
    <View className="mx-2">
      {/* Nút mở modal */}
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.85}
        className="bg-rose-600 flex-row items-center justify-center rounded-2xl py-3 w-56"
        style={{
          shadowColor: "#DC2626",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.16,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <View className="bg-white/20 rounded-full p-1 mr-2">
          <Ionicons name="swap-vertical" size={20} color="#fff" />
        </View>
        <Text className="text-white font-bold text-base">Rút tiền</Text>
      </TouchableOpacity>

      {/* Modal rút tiền */}
      <Modal visible={open} animationType="slide" transparent>
        <View className="flex-1 bg-black/20 justify-center items-center px-4">
          <View className="w-full bg-white rounded-3xl px-6 py-8">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center">
                <View className="bg-rose-100 rounded-full p-2 mr-2">
                  <Ionicons name="cash-outline" size={20} color="#DC2626" />
                </View>
                <Text className="text-xl font-bold text-gray-900">
                  Rút tiền
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setOpen(false)}
                className="bg-gray-100 rounded-full p-2"
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Amount */}
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Số tiền muốn rút
            </Text>
            <View className="bg-gray-50 rounded-2xl flex-row items-center border border-gray-200 px-4 py-3 mb-1">
              <Text className="text-2xl font-bold text-rose-600 mr-1">₫</Text>
              <TextInput
                placeholder="0"
                value={formatCurrency(amount)}
                onChangeText={onChangeAmount}
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

            {/* Quick amounts */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row mb-4"
            >
              {quickAmounts.map((q) => (
                <TouchableOpacity
                  key={q.value}
                  onPress={() => setAmount(q.value)}
                  className={`py-2 px-5 mr-2 rounded-xl border-2 ${
                    amount === q.value
                      ? "bg-rose-100 border-rose-600"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <Text
                    className={`font-bold text-base ${
                      amount === q.value ? "text-rose-600" : "text-gray-700"
                    }`}
                  >
                    {q.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Bank info */}
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Thông tin ngân hàng nhận
            </Text>
            <View className="space-y-3 mb-4 ">
              <TextInput
                placeholder="Tên chủ tài khoản"
                value={accountName}
                onChangeText={setAccountName}
                className="bg-gray-50 rounded-2xl border border-gray-200 px-4 py-3"
                placeholderTextColor="#9CA3AF"
              />
              <TextInput
                placeholder="Số tài khoản"
                value={accountNumber}
                onChangeText={setAccountNumber}
                keyboardType="number-pad"
                className="bg-gray-50 rounded-2xl border border-gray-200 px-4 py-3"
                placeholderTextColor="#9CA3AF"
              />
              <TextInput
                placeholder="Tên ngân hàng"
                value={bankName}
                onChangeText={setBankName}
                className="bg-gray-50 rounded-2xl border border-gray-200 px-4 py-3"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Submit */}
            <TouchableOpacity
              onPress={onSubmit}
              disabled={!canSubmit || isLoading}
              activeOpacity={0.85}
              className={`py-4 rounded-2xl w-full ${
                !canSubmit || isLoading ? "bg-gray-300" : "bg-rose-600"
              }`}
            >
              <View className="flex-row items-center justify-center">
                {isLoading ? (
                  <>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text className="text-white font-bold ml-2 text-base">
                      Đang gửi yêu cầu...
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="paper-plane" size={22} color="#fff" />
                    <Text className="text-white font-bold ml-2 text-base">
                      Xác nhận rút tiền
                    </Text>
                  </>
                )}
              </View>
            </TouchableOpacity>

            {/* Rule note */}
            {Number(amount) > 0 && Number(amount) < MIN_WITHDRAW && (
              <View className="bg-red-50 rounded-xl p-3 mt-4 border border-red-200">
                <View className="flex-row items-center">
                  <Ionicons name="warning-outline" size={16} color="#DC2626" />
                  <Text className="text-red-600 text-xs font-medium ml-2">
                    Số tiền tối thiểu là {MIN_WITHDRAW.toLocaleString()} VNĐ
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default WithdrawButton;
