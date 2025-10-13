import { usePatientProfile } from "@/hooks/usePatientId";
import { useTranslation } from "@/hooks/useTranslation";
import { useGetLabResults } from "@/services/lab-results/hooks";
import { format } from "date-fns";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type LabResult = {
  recordId: string;
  testType: string;
  resultText: string | null;
  resultValue: string | null;
  unit: string | null;
  referenceRange: string | null;
  testDate: string;
  performedBy: string | null;
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f8fafc",
  },
  loadingIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
  },
  errorIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#9ca3af",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  headerContainer: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 24,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerGradient: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 24,
    paddingVertical: 32,
    position: "relative",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "white",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  headerRight: {
    alignItems: "flex-end",
  },
  headerDateLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  dateSection: {
    marginBottom: 32,
  },
  dateHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  dateDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
  },
  dateHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginRight: 12,
  },
  latestBadge: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  latestBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1d4ed8",
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
    marginLeft: 16,
  },
  resultsContainer: {
    gap: 16,
  },
  resultCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  resultHeaderLeft: {
    flex: 1,
    marginRight: 12,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 6,
  },
  resultTime: {
    flexDirection: "row",
    alignItems: "center",
  },
  resultTimeText: {
    fontSize: 14,
    color: "#6b7280",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  resultValueContainer: {
    marginBottom: 16,
  },
  resultValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 36,
    fontWeight: "800",
    marginRight: 8,
  },
  resultUnit: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6b7280",
  },
  resultText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  referenceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  referenceText: {
    fontSize: 14,
    color: "#6b7280",
  },
  resultFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#9ca3af",
    marginRight: 16,
  },
  performedByContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  performedByText: {
    fontSize: 12,
    color: "#9ca3af",
  },
  noteContainer: {
    marginHorizontal: 16,
    marginBottom: 32,
    backgroundColor: "#eff6ff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  noteContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  noteIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#dbeafe",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  noteTextContainer: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e40af",
    marginBottom: 4,
  },
  noteText: {
    fontSize: 14,
    color: "#1e40af",
    lineHeight: 20,
  },
});

const TabLabResults: React.FC<{
  isLoading: boolean;
  isError: boolean;
  error?: any;
  labResults?: LabResult[];
}> = ({ isLoading, isError, error, labResults }) => {
  const { t } = useTranslation();
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingIcon}>
          <Text style={{ fontSize: 32, color: "white" }}>🧪</Text>
          <ActivityIndicator
            size="small"
            color="white"
            style={{ position: "absolute", bottom: 8, right: 8 }}
          />
        </View>
        <Text style={styles.loadingTitle}>{t("history.loadingResults")}</Text>
        <Text style={styles.loadingText}>{t("history.fetchingResults")}</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.errorIcon}>
          <Text style={{ fontSize: 32, color: "white" }}>⚠️</Text>
        </View>
        <Text style={styles.loadingTitle}>
          {t("history.unableToLoadResults")}
        </Text>
        <Text style={styles.loadingText}>
          {error?.message || t("history.unexpectedError")}
        </Text>
      </View>
    );
  }

  if (!labResults || labResults.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.emptyIcon}>
          <Text style={{ fontSize: 32, color: "white" }}>🧪</Text>
        </View>
        <Text style={styles.loadingTitle}>
          {t("history.noResultsAvailable")}
        </Text>
        <Text style={styles.loadingText}>{t("history.resultsWillAppear")}</Text>
      </View>
    );
  }

  // Group and sort by date
  const grouped = labResults.reduce<Record<string, LabResult[]>>((acc, r) => {
    const key = r.recordId;
    acc[key] = acc[key] ? [...acc[key], r] : [r];
    return acc;
  }, {});

  const recordIds = Object.keys(grouped).sort((a, b) => {
    // Sort by latest test date in each record
    const aLatest = Math.max(
      ...grouped[a].map((test) => new Date(test.testDate).getTime())
    );
    const bLatest = Math.max(
      ...grouped[b].map((test) => new Date(test.testDate).getTime())
    );
    return bLatest - aLatest;
  });

  const getResultStatus = (
    type: string,
    val: string | null,
    range: string | null
  ) => {
    const num = val ? Number.parseFloat(val) : Number.NaN;

    if (!isNaN(num)) {
      // CD4 Count logic
      if (type.toLowerCase().includes("cd4")) {
        if (num < 200)
          return {
            status: "critical",
            color: "#ef4444",
            bgColor: "#fef2f2",
            icon: "🚨",
          };
        if (num < 500)
          return {
            status: "low",
            color: "#f59e0b",
            bgColor: "#fffbeb",
            icon: "⚠️",
          };
        return {
          status: "normal",
          color: "#10b981",
          bgColor: "#f0fdf4",
          icon: "✅",
        };
      }

      // A1C logic
      if (type.toLowerCase().includes("a1c")) {
        if (num > 7.0)
          return {
            status: "high",
            color: "#ef4444",
            bgColor: "#fef2f2",
            icon: "🚨",
          };
        if (num > 5.6)
          return {
            status: "elevated",
            color: "#f59e0b",
            bgColor: "#fffbeb",
            icon: "⚠️",
          };
        return {
          status: "normal",
          color: "#10b981",
          bgColor: "#f0fdf4",
          icon: "✅",
        };
      }

      // eGFR logic
      if (type.toLowerCase().includes("egfr")) {
        if (num < 60)
          return {
            status: "low",
            color: "#ef4444",
            bgColor: "#fef2f2",
            icon: "🚨",
          };
        if (num < 90)
          return {
            status: "mild",
            color: "#f59e0b",
            bgColor: "#fffbeb",
            icon: "⚠️",
          };
        return {
          status: "normal",
          color: "#10b981",
          bgColor: "#f0fdf4",
          icon: "✅",
        };
      }
    }

    return {
      status: "normal",
      color: "#10b981",
      bgColor: "#f0fdf4",
      icon: "✅",
    };
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "critical":
        return t("history.status.critical");
      case "high":
        return t("history.status.high");
      case "low":
        return t("history.status.low");
      case "elevated":
        return t("history.status.elevated");
      case "mild":
        return t("history.status.mild");
      default:
        return t("history.status.normal");
    }
  };

  // Generate background dots for header
  const backgroundDots = Array.from({ length: 15 }).map((_, i) => (
    <View
      key={i}
      style={{
        position: "absolute",
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: "white",
        opacity: 0.1,
        top: Math.random() * 120,
        left: Math.random() * (width - 32),
      }}
    />
  ));

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerGradient}>
          {/* Background pattern */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            {backgroundDots}
          </View>

          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <View style={styles.headerIconContainer}>
                  <Text style={{ fontSize: 24 }}>📊</Text>
                </View>
                <View>
                  <Text style={styles.headerTitle}>
                    {t("history.labResultsTitle")}
                  </Text>
                  <Text style={styles.headerSubtitle}>
                    {recordIds.length}{" "}
                    {recordIds.length !== 1
                      ? t("history.records")
                      : t("history.record")}{" "}
                    • {labResults.length}{" "}
                    {labResults.length !== 1
                      ? t("history.tests")
                      : t("history.test")}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.headerDateLabel}>
                {t("history.lastUpdated")}
              </Text>
              <Text style={styles.headerDate}>
                {format(
                  new Date(
                    Math.max(
                      ...labResults.map((r) => new Date(r.testDate).getTime())
                    )
                  ),
                  "MMM dd, yyyy"
                )}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Results grouped by recordId */}
      <View style={styles.contentContainer}>
        {recordIds.map((recordId, recordIndex) => {
          const tests = grouped[recordId];
          const latestTestDate = Math.max(
            ...tests.map((test) => new Date(test.testDate).getTime())
          );

          return (
            <View key={recordId} style={styles.dateSection}>
              <Text className="font-bold">{t("history.recordHeader")}</Text>
              {/* Record info */}
              <View style={{ marginBottom: 12, paddingHorizontal: 4 }}>
                <Text style={{ fontSize: 14, color: "#6b7280" }}>
                  {tests.length}{" "}
                  {tests.length !== 1 ? t("history.tests") : t("history.test")}{" "}
                  • {format(new Date(latestTestDate), "MMM dd, yyyy")}
                </Text>
              </View>
              {/* Test results for this record */}
              <View style={styles.resultsContainer}>
                {tests.map((result, testIndex) => {
                  const resultStatus = getResultStatus(
                    result.testType,
                    result.resultValue,
                    result.referenceRange
                  );

                  return (
                    <TouchableOpacity
                      key={`${result.recordId}-${testIndex}`}
                      activeOpacity={0.7}
                      style={[
                        styles.resultCard,
                        { borderLeftColor: resultStatus.color },
                      ]}
                    >
                      {/* Test header */}
                      <View style={styles.resultHeader}>
                        <View style={styles.resultHeaderLeft}>
                          <Text style={styles.resultTitle}>
                            {result.testType}
                          </Text>
                          <View style={styles.resultTime}>
                            <Text style={{ fontSize: 16, marginRight: 6 }}>
                              🕐
                            </Text>
                            <Text style={styles.resultTimeText}>
                              {format(
                                new Date(result.testDate),
                                "MMM dd, yyyy 'at' h:mm a"
                              )}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor: resultStatus.bgColor,
                              borderColor: resultStatus.color + "40",
                            },
                          ]}
                        >
                          <Text style={{ fontSize: 14, marginRight: 4 }}>
                            {resultStatus.icon}
                          </Text>
                          <Text
                            style={[
                              styles.statusBadgeText,
                              { color: resultStatus.color },
                            ]}
                          >
                            {getStatusText(resultStatus.status)}
                          </Text>
                        </View>
                      </View>

                      {/* Result value */}
                      <View style={styles.resultValueContainer}>
                        {result.resultValue ? (
                          <View style={styles.resultValueRow}>
                            <Text
                              style={[
                                styles.resultValue,
                                { color: resultStatus.color },
                              ]}
                            >
                              {result.resultValue}
                            </Text>
                            {result.unit && (
                              <Text style={styles.resultUnit}>
                                {result.unit}
                              </Text>
                            )}
                          </View>
                        ) : result.resultText ? (
                          <Text style={styles.resultText}>
                            {result.resultText}
                          </Text>
                        ) : (
                          <Text
                            style={[
                              styles.resultText,
                              { color: "#9ca3af", fontStyle: "italic" },
                            ]}
                          >
                            {t("history.noResultAvailable")}
                          </Text>
                        )}

                        {result.referenceRange && (
                          <View style={styles.referenceRow}>
                            <Text style={{ fontSize: 14, marginRight: 6 }}>
                              ℹ️
                            </Text>
                            <Text style={styles.referenceText}>
                              {t("history.reference")}: {result.referenceRange}
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* Footer */}
                      <View style={styles.resultFooter}>
                        <View style={styles.footerLeft}>
                          <Text style={styles.footerText}>
                            Record: {result.recordId}
                          </Text>
                          {result.performedBy && (
                            <View style={styles.performedByContainer}>
                              <Text style={{ fontSize: 12, marginRight: 4 }}>
                                👨‍⚕️
                              </Text>
                              <Text style={styles.performedByText}>
                                {result.performedBy}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>

      {/* Footer note */}
      <View style={styles.noteContainer}>
        <View style={styles.noteContent}>
          <View style={styles.noteIcon}>
            <Text style={{ fontSize: 16 }}>💡</Text>
          </View>
          <View style={styles.noteTextContainer}>
            <Text style={styles.noteTitle}>{t("history.importantNote")}</Text>
            <Text style={styles.noteText}>
              {t("history.importantNoteText")}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const LabResultsPage: React.FC = () => {
  const { data: profile } = usePatientProfile();
  const patientId = profile?.patientID;

  const {
    data: labResults,
    isLoading,
    isError,
    error,
  } = useGetLabResults(patientId || "");

  return (
    <SafeAreaView style={styles.container}>
      <TabLabResults
        isLoading={isLoading}
        isError={isError}
        error={error || undefined}
        labResults={labResults}
      />
    </SafeAreaView>
  );
};

export default TabLabResults;
export { LabResultsPage };
