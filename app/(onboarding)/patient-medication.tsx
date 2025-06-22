import { OnboardingLayout } from "@/components";
import { ALPHABET, MEDICATIONS } from "@/constants";
import { useOnboardingNavigation } from "@/hooks/useOnboardingNavigation";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const PatientMedication: React.FC = () => {
  const { handleContinue, handleBack, handleSkip, progress } =
    useOnboardingNavigation();
  const [selectedMeds, setSelectedMeds] = useState<string[]>([]);
  const [filterLetter, setFilterLetter] = useState<string>(ALPHABET[0]);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Lọc theo chữ cái và từ khóa tìm kiếm
  const filtered = MEDICATIONS.filter(
    (med) =>
      med.startsWith(filterLetter) &&
      med.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelect = (med: string) => {
    setSelectedMeds((prev) =>
      prev.includes(med) ? prev.filter((m) => m !== med) : [...prev, med]
    );
  };

  return (
    <OnboardingLayout
      question="What medications do you take?"
      progress={progress}
      onContinue={handleContinue}
      onBack={handleBack}
      onSkip={handleSkip}
      childrenWrapperClassName="flex-1 px-4 pt-4"
    >
      {/* Bar chữ cái + search */}
      <View className="flex-row items-center mb-4">
        <FlatList
          horizontal
          data={ALPHABET}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setFilterLetter(item);
                setSearchQuery("");
              }}
              className={`px-2 py-1 mr-2 rounded-md ${
                filterLetter === item ? "bg-[#0f67fe]" : "bg-gray-200"
              }`}
            >
              <Text
                className={`${
                  filterLetter === item ? "text-white" : "text-gray-700"
                }`}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity
          onPress={() => setSearchMode((v) => !v)}
          className="ml-auto"
        >
          <Ionicons name="search" size={24} color="#242e49" />
        </TouchableOpacity>
      </View>

      {/* Input tìm kiếm */}
      {searchMode && (
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search medications"
          className="bg-gray-100 rounded-md px-4 py-2 mb-4"
        />
      )}

      {/* Danh sách thuốc */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: selectedMeds.length ? 100 : 0 }}
        renderItem={({ item }) => {
          const selected = selectedMeds.includes(item);
          return (
            <TouchableOpacity
              onPress={() => toggleSelect(item)}
              className={`flex-row items-center justify-between px-4 py-3 mb-2 rounded-lg ${
                selected ? "bg-[#0f67fe]" : "bg-white"
              }`}
            >
              <Text className={`${selected ? "text-white" : "text-gray-800"}`}>
                {item}
              </Text>
              {selected && <Ionicons name="checkmark" size={20} color="#fff" />}
            </TouchableOpacity>
          );
        }}
      />

      {/* Tags hiển thị đã chọn */}
      {selectedMeds.length > 0 && (
        <View className="flex-row flex-wrap mb-4">
          <Text className="text-gray-600 mr-2">Selected:</Text>
          {selectedMeds.map((med) => (
            <View
              key={med}
              className="flex-row items-center bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2"
            >
              <Text className="text-gray-800 mr-1">{med}</Text>
              <TouchableOpacity onPress={() => toggleSelect(med)}>
                <Ionicons name="close" size={16} color="#555" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </OnboardingLayout>
  );
};

export default PatientMedication;
