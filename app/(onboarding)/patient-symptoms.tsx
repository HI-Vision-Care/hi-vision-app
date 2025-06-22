import { OnboardingLayout } from "@/components";
import { images } from "@/constants";
import { useOnboardingNavigation } from "@/hooks/useOnboardingNavigation";
import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

const MAX_TAGS = 10;

const PatientSymptoms: React.FC = () => {
  const { handleContinue, handleBack, handleSkip, progress } =
    useOnboardingNavigation();
  const [tags, setTags] = useState<string[]>(["Headache", "Muscle Fatigue"]);
  const [text, setText] = useState<string>("");

  const addTag = () => {
    const trimmed = text.trim();
    if (trimmed && tags.length < MAX_TAGS && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setText("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <OnboardingLayout
      question="Do you have any symptoms/allergy?"
      progress={progress}
      onContinue={handleContinue}
      onBack={handleBack}
      onSkip={handleSkip}
      childrenWrapperClassName="flex-1 px-6 pt-4"
    >
      {/* Illustration */}
      <Image
        source={images.symptoms}
        className="w-full h-40 mb-6"
        resizeMode="contain"
      />

      {/* Tag Input Container */}
      <View className="border border-blue-600 rounded-xl px-4 py-2 mb-6">
        {/* Tags List */}
        <View className="flex-row flex-wrap mb-2">
          {tags.map((tag) => (
            <View
              key={tag}
              className="flex-row items-center bg-blue-100 rounded-full px-3 py-1 mr-2 mb-2"
            >
              <Text className="text-blue-800 mr-1">{tag}</Text>
              <TouchableOpacity onPress={() => removeTag(tag)}>
                <Text className="text-blue-800 text-lg">×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Input Row */}
        <View className="flex-row items-center">
          <TextInput
            value={text}
            onChangeText={setText}
            onSubmitEditing={addTag}
            placeholder="Enter symptom"
            className="flex-1 py-1 text-gray-700"
          />
          <TouchableOpacity
            onPress={addTag}
            disabled={!text.trim() || tags.length >= MAX_TAGS}
          >
            <Text
              className={`text-lg ${
                !text.trim() || tags.length >= MAX_TAGS
                  ? "text-gray-400"
                  : "text-blue-600"
              }`}
            >
              +
            </Text>
          </TouchableOpacity>
        </View>

        {/* Counter */}
        <Text className="text-gray-500 text-right mt-1">
          {tags.length}/{MAX_TAGS}
        </Text>
      </View>
    </OnboardingLayout>
  );
};

export default PatientSymptoms;
