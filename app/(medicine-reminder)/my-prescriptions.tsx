"use client"
import { usePatientProfile } from "@/hooks/usePatientId"
import { useGetArvPrescription } from "@/services/prescription/hooks"
import { View, Text, StatusBar, ScrollView, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const { width } = Dimensions.get("window")

// Loading Skeleton Component
const LoadingSkeleton = () => (
    <View className="px-4 py-6">
        {[1, 2].map((item) => (
            <View key={item} className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
                <View className="flex-row items-center mb-4">
                    <View className="w-12 h-12 bg-gray-200 rounded-full mr-3" />
                    <View className="flex-1">
                        <View className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                        <View className="h-3 bg-gray-200 rounded w-1/2" />
                    </View>
                </View>
                <View className="space-y-2">
                    <View className="h-3 bg-gray-200 rounded w-full" />
                    <View className="h-3 bg-gray-200 rounded w-4/5" />
                    <View className="h-3 bg-gray-200 rounded w-3/5" />
                </View>
            </View>
        ))}
    </View>
)

// Empty State Component với typography cải thiện
const EmptyState = () => (
    <View className="flex-1 items-center justify-center px-6">
        <View className="items-center mb-8">
            {/* Medicine Icon lớn hơn */}
            <View className="w-28 h-28 bg-blue-100 rounded-full items-center justify-center mb-8">
                <View className="w-16 h-16 bg-blue-500 rounded-xl items-center justify-center">
                    <Text className="text-white text-3xl">💊</Text>
                </View>
            </View>

            <Text className="text-2xl font-bold text-gray-900 text-center mb-4">Chưa có đơn thuốc ARV</Text>
            <Text className="text-base text-gray-600 text-center leading-6 mb-8 font-medium">
                Bạn chưa có đơn thuốc ARV nào được kê.{"\n"}
                Vui lòng liên hệ bác sĩ để được tư vấn.
            </Text>
        </View>

        {/* Suggestion Card với typography nổi bật */}
        <View className="bg-blue-50 rounded-2xl p-6 w-full border border-blue-200">
            <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center mr-4">
                    <Text className="text-white text-lg">💡</Text>
                </View>
                <Text className="text-blue-900 font-bold text-lg">Gợi ý</Text>
            </View>
            <Text className="text-blue-800 text-base leading-6 font-medium">
                Thêm lịch nhắc nhở để không bỏ lỡ việc uống thuốc hàng ngày khi có đơn thuốc mới.
            </Text>
        </View>
    </View>
)

// Error State Component
const ErrorState = () => (
    <View className="flex-1 items-center justify-center px-8">
        <View className="w-20 h-20 bg-red-100 rounded-full items-center justify-center mb-6">
            <Text className="text-red-500 text-3xl">⚠️</Text>
        </View>
        <Text className="text-lg font-semibold text-red-600 text-center mb-2">Không thể tải đơn thuốc</Text>
        <Text className="text-sm text-gray-500 text-center">Vui lòng thử lại sau hoặc liên hệ hỗ trợ</Text>
    </View>
)

// Prescription Card Component
const PrescriptionCard = ({ prescription, arvList }: any) => (
    <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
        {/* Header với date nổi bật */}
        <View className="bg-white px-6 py-5 border-b border-gray-100">
            <View className="flex-row items-center">
                <View className="w-12 h-12 bg-blue-100 rounded-xl items-center justify-center mr-4">
                    <Text className="text-blue-600 text-xl">📋</Text>
                </View>
                <View className="flex-1">
                    <Text className="text-gray-500 text-sm font-medium mb-1">Ngày kê đơn</Text>
                    <Text className="text-gray-900 font-bold text-lg">
                        {new Date(prescription.date).toLocaleDateString("vi-VN")}
                    </Text>
                </View>
            </View>
        </View>

        {/* Content */}
        <View className="px-6 py-5">
            {/* Doctor Info với typography cải thiện */}
            <View className="flex-row items-center mb-6 bg-green-50 rounded-xl p-4 border border-green-100">
                <View className="w-14 h-14 bg-green-100 rounded-full items-center justify-center mr-4">
                    <Text className="text-green-600 text-xl">👨‍⚕️</Text>
                </View>
                <View className="flex-1">
                    <Text className="text-green-700 text-sm font-semibold mb-1">Bác sĩ kê đơn</Text>
                    <Text className="text-gray-900 font-bold text-lg">{prescription.prescribeBy}</Text>
                </View>
            </View>

            {/* Medicine List với typography nổi bật */}
            <View>
                <Text className="text-gray-900 font-bold text-xl mb-5">Danh sách thuốc ARV ({arvList?.length || 0} loại)</Text>

                {!arvList || arvList.length === 0 ? (
                    <View className="bg-orange-50 border border-orange-200 rounded-xl p-5">
                        <View className="flex-row items-center">
                            <Text className="text-orange-500 text-xl mr-3">ℹ️</Text>
                            <Text className="text-orange-800 font-medium flex-1">Đơn thuốc này chưa có thuốc ARV được kê.</Text>
                        </View>
                    </View>
                ) : (
                    <View className="space-y-4">
                        {arvList.map((arv: any, index: number) => (
                            <View key={arv.arvId} className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                                <View className="flex-row items-start">
                                    <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center mr-4 mt-1">
                                        <Text className="text-white text-base font-bold">{index + 1}</Text>
                                    </View>
                                    <View className="flex-1">
                                        {/* Tên thuốc nổi bật */}
                                        <Text className="text-gray-900 font-bold text-lg mb-2">{arv.genericName}</Text>

                                        {/* Drug class với design nổi bật */}
                                        <View className="bg-blue-500 self-start px-4 py-2 rounded-full mb-4">
                                            <Text className="text-white text-sm font-bold">{arv.drugClass}</Text>
                                        </View>

                                        {/* Thông tin liều dùng với typography cải thiện */}
                                        <View className="space-y-3">
                                            <View>
                                                <Text className="text-gray-600 text-sm font-semibold mb-1">Liều dùng:</Text>
                                                <Text className="text-gray-900 text-base font-bold">{arv.rcmDosage}</Text>
                                            </View>
                                            <View>
                                                <Text className="text-gray-600 text-sm font-semibold mb-1">Đường dùng:</Text>
                                                <Text className="text-gray-900 text-base font-bold">{arv.admRoute}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </View>
    </View>
)

export default function MyPrescriptions() {
    const { data: profile, isLoading: loadingProfile } = usePatientProfile()
    const patientId = profile?.patientID

    const { data: prescriptionData, isLoading: loadingPrescription, isError } = useGetArvPrescription(patientId ?? "")

    const isLoading = loadingProfile || loadingPrescription

    return (
        <SafeAreaView className="flex-1 bg-blue-500" edges={["top"]}>
            <StatusBar backgroundColor="#3B82F6" barStyle="light-content" />

            {/* Enhanced Header với typography cải thiện */}
            <View className="bg-blue-500 px-4 py-6">
                <View className="flex-row items-center justify-between">
                    <View className="w-10 h-10" />
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-white mb-1">Đơn thuốc ARV</Text>
                        <Text className="text-blue-100 text-base font-medium">Quản lý đơn thuốc của bạn</Text>
                    </View>
                    <View className="w-10 h-10" />
                </View>
            </View>

            {/* Main Content */}
            <View className="flex-1 bg-gray-50">
                {isLoading && <LoadingSkeleton />}

                {isError && <ErrorState />}

                {!isLoading && !isError && (!prescriptionData || !prescriptionData.prescription) && <EmptyState />}

                {!isLoading && !isError && prescriptionData && prescriptionData.prescription && (
                    <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
                        <PrescriptionCard prescription={prescriptionData.prescription} arvList={prescriptionData.arvList} />

                        {/* Footer Info với typography nổi bật */}
                        <View className="bg-yellow-50 rounded-2xl p-5 mt-6 border border-yellow-200">
                            <View className="flex-row items-center">
                                <Text className="text-yellow-600 text-xl mr-3">💡</Text>
                                <Text className="text-yellow-800 text-base font-bold flex-1">
                                    Nhớ uống thuốc đúng giờ và theo chỉ định của bác sĩ
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    )
}
