// components/history/TabLabResults.tsx
import { LabResult } from "@/types/type";
import { format } from "date-fns";
import { ActivityIndicator, Text, View } from "react-native";

type Props = {
  isLoading: boolean;
  isError: boolean;
  error: any;
  labResults?: LabResult[];
};

const TabLabResults: React.FC<Props> = ({
  isLoading,
  isError,
  error,
  labResults,
}) => {
  if (isLoading)
    return (
      <View className="flex-1 items-center justify-center py-12">
        <View className="bg-white rounded-full p-4 shadow-sm mb-4">
          <ActivityIndicator size="large" color="#0F67FE" />
        </View>
        <Text className="text-gray-600 font-medium">
          Loading lab results...
        </Text>
        <Text className="text-gray-400 text-sm mt-1">Please wait a moment</Text>
      </View>
    );
  if (isError)
    return (
      <View className="flex-1 items-center justify-center py-12">
        <View className="bg-red-50 rounded-full p-4 mb-4">
          <Text className="text-red-500 text-2xl">⚠️</Text>
        </View>
        <Text className="text-red-600 font-semibold text-center px-6">
          Unable to load lab results
        </Text>
        <Text className="text-red-400 text-sm text-center px-6 mt-1">
          {error?.message || "Please try again later"}
        </Text>
      </View>
    );
  if (!labResults || labResults.length === 0)
    return (
      <View className="flex-1 items-center justify-center py-12">
        <View className="bg-gray-100 rounded-full p-6 mb-4">
          <Text className="text-gray-400 text-3xl">📋</Text>
        </View>
        <Text className="text-gray-600 font-semibold text-lg">
          No lab results yet
        </Text>
        <Text className="text-gray-400 text-center px-8 mt-2">
          Your lab results will appear here once they&apos;re available
        </Text>
      </View>
    );

  // Group results by date
  const groupedResults = labResults.reduce(
    (groups: { [key: string]: LabResult[] }, result) => {
      const dateKey = format(new Date(result.testDate), "yyyy-MM-dd");
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(result);
      return groups;
    },
    {}
  );
  const sortedDates = Object.keys(groupedResults).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  // Helper function: màu text tuỳ theo giá trị test
  const getResultColor = (testType: string, value: string) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return "text-gray-700";
    if (testType.toLowerCase().includes("glucose")) {
      return numericValue > 140 || numericValue < 70
        ? "text-amber-600"
        : "text-green-600";
    }
    if (testType.toLowerCase().includes("cholesterol")) {
      return numericValue > 200 ? "text-amber-600" : "text-green-600";
    }
    return "text-gray-700";
  };

  return (
    <View className="px-4 py-2">
      <View className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mb-6 border border-blue-100">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-bold text-gray-900">Lab Results</Text>
            <Text className="text-sm text-gray-600 mt-1">
              {labResults.length} test{labResults.length !== 1 ? "s" : ""}{" "}
              available
            </Text>
          </View>
          <View className="bg-blue-100 rounded-full p-3">
            <Text className="text-blue-600 text-xl">🧪</Text>
          </View>
        </View>
      </View>
      {sortedDates.map((dateKey) => {
        const dateResults = groupedResults[dateKey];
        const displayDate = format(new Date(dateKey), "MMMM dd, yyyy");
        return (
          <View key={dateKey} className="mb-6">
            <View className="flex-row items-center mb-3">
              <View className="bg-gray-200 rounded-full w-2 h-2 mr-3" />
              <Text className="text-base font-semibold text-gray-700">
                {displayDate}
              </Text>
              <View className="flex-1 h-px bg-gray-200 ml-3" />
            </View>
            <View className="space-y-3">
              {dateResults.map((result) => {
                const resultColor = getResultColor(
                  result.testType,
                  result.resultValue
                );
                const isAbnormal = resultColor.includes("amber");
                return (
                  <View
                    key={result.recordId}
                    className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${
                      isAbnormal
                        ? "border-l-amber-400 bg-amber-50/30"
                        : "border-l-green-400 bg-green-50/30"
                    }`}
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1">
                        <View className="flex-row items-center mb-2">
                          <Text className="text-base font-semibold text-gray-900 flex-1">
                            {result.testType}
                          </Text>
                          {isAbnormal && (
                            <View className="bg-amber-100 rounded-full px-2 py-1">
                              <Text className="text-amber-700 text-xs font-medium">
                                Review
                              </Text>
                            </View>
                          )}
                        </View>
                        <View className="flex-row items-baseline mb-2">
                          <Text className={`text-2xl font-bold ${resultColor}`}>
                            {result.resultValue}
                          </Text>
                          <Text className="text-sm text-gray-500 ml-1"></Text>
                        </View>
                        <View className="flex-row items-center">
                          <View className="bg-gray-100 rounded-full p-1 mr-2">
                            <Text className="text-gray-500 text-xs">📅</Text>
                          </View>
                          <Text className="text-xs text-gray-500">
                            {format(new Date(result.testDate), "h:mm a")}
                          </Text>
                          <Text className="text-xs text-gray-400 ml-4">
                            ID: {result.recordId.slice(-6)}
                          </Text>
                        </View>
                      </View>
                      <View className="ml-3">
                        <View
                          className={`w-3 h-3 rounded-full ${
                            isAbnormal ? "bg-amber-400" : "bg-green-400"
                          }`}
                        />
                      </View>
                    </View>
                    {!isNaN(parseFloat(result.resultValue)) && (
                      <View className="mt-3">
                        <View className="bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <View
                            className={`h-full rounded-full ${
                              isAbnormal ? "bg-amber-400" : "bg-green-400"
                            }`}
                            style={{
                              width: `${Math.min(
                                Math.max(
                                  (parseFloat(result.resultValue) / 200) * 100,
                                  10
                                ),
                                100
                              )}%`,
                            }}
                          />
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}
      <View className="bg-blue-50 rounded-xl p-4 mt-4 border border-blue-100">
        <Text className="text-sm text-blue-700 text-center">
          💡 Consult with your healthcare provider to discuss these results
        </Text>
      </View>
    </View>
  );
};

export default TabLabResults;
