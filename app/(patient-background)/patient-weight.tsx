"use client"

import type React from "react"
import { useContext, useState, useRef } from "react"
import { View, Text, TouchableOpacity, SafeAreaView, Animated, PanResponder, Dimensions } from "react-native"
import * as Haptics from "expo-haptics"
import { useRouter } from "expo-router"
import { HealthBackgroundContext } from "@/context/HealthBackgroundContext"
import { ChevronLeft } from "lucide-react-native"

const PatientWeightScreen: React.FC = () => {
    const ctx = useContext(HealthBackgroundContext)
    const router = useRouter()
    const [unit, setUnit] = useState<"lbs" | "kg">("kg") // Default to kg for 10kg increments
    const [weight, setWeight] = useState<number>(
        ctx?.data.weight != null ? ctx.data.weight : 70
    );
    const initialWeightRef = useRef<number>(weight);
    const screenWidth = Dimensions.get("window").width
    const sliderWidth = screenWidth - 48

    // Animation values
    const pan = useRef(new Animated.Value(0)).current
    const sliderPan = useRef(new Animated.Value(0)).current
    const scaleAnim = useRef(new Animated.Value(1)).current
    const glowAnim = useRef(new Animated.Value(0)).current

    // Weight constraints and increments
    const minWeight = unit === "kg" ? 30 : 66 // 30kg = ~66lbs
    const maxWeight = unit === "kg" ? 200 : 440 // 200kg = ~440lbs
    const increment = unit === "kg" ? 1 : 22 // 10kg = ~22lbs
    const sensitivity = 20 // pixels per increment (less sensitive for larger increments)

    const triggerHaptic = async (type: "selection" | "light" | "medium" | "success") => {
        try {
            switch (type) {
                case "selection":
                    await Haptics.selectionAsync()
                    break
                case "light":
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                    break
                case "medium":
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                    break
                case "success":
                    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
                    break
            }
        } catch {
            // Silent if not supported
        }
    }

    // Pan responder for horizontal swipe gestures
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
            onPanResponderGrant: () => {
                // Animate glow effect when touch starts
                Animated.parallel([
                    Animated.spring(scaleAnim, {
                        toValue: 1.02,
                        useNativeDriver: false,
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: false,
                    }),
                ]).start()
                triggerHaptic("selection")
            },
            onPanResponderMove: (_, gestureState) => {
                // Update slider animation
                sliderPan.setValue(gestureState.dx)

                // Calculate weight change based on gesture (10kg increments)
                const steps = Math.round(gestureState.dx / sensitivity)
                const weightChange = steps * increment
                const newWeight = Math.max(minWeight, Math.min(maxWeight, weight + weightChange))

                // Update weight if it has changed by at least one increment
                if (Math.abs(newWeight - weight) >= increment) {
                    setWeight(newWeight)
                    triggerHaptic("medium")
                }
            },
            onPanResponderRelease: () => {
                // Reset animations
                Animated.parallel([
                    Animated.spring(sliderPan, {
                        toValue: 0,
                        useNativeDriver: false,
                    }),
                    Animated.spring(scaleAnim, {
                        toValue: 1,
                        useNativeDriver: false,
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: false,
                    }),
                ]).start()
                triggerHaptic("success")
            },
        }),
    ).current

    // Handle unit toggle with weight conversion
    const toggleUnit = (selectedUnit: "lbs" | "kg") => {
        if (unit !== selectedUnit) {
            setUnit(selectedUnit);
            let converted: number;
            if (selectedUnit === "kg") {
                converted = Math.round((weight * 0.453592) / 10) * 10;
            } else {
                converted = Math.round(weight / 0.453592 / 22) * 22;
            }
            setWeight(converted);
            initialWeightRef.current = converted;
            triggerHaptic("selection");
        }
    };

    // Generate enhanced ruler marks
    const generateRulerMarks = () => {
        const marks: React.ReactNode[] = []
        const totalMarks = 21 // Fewer marks for cleaner look with larger increments
        const centerIndex = 10

        for (let i = 0; i < totalMarks; i++) {
            const isCenter = i === centerIndex
            const isMajor = (i - centerIndex) % 2 === 0 // Every other mark is major
            const markHeight = isCenter ? 50 : isMajor ? 30 : 20
            const markWidth = isCenter ? 4 : isMajor ? 3 : 2
            const markColor = isCenter ? "#4361EE" : isMajor ? "#2D3142" : "#D1D5DB"
            const left = i * (sliderWidth / (totalMarks - 1)) - markWidth / 2

            marks.push(
                <View
                    key={`mark-${i}`}
                    style={{
                        position: "absolute",
                        left,
                        height: markHeight,
                        width: markWidth,
                        backgroundColor: markColor,
                        borderRadius: markWidth / 2,
                    }}
                />,
            )

            // Add weight labels for major marks
            if (isMajor && !isCenter) {
                const steps = (i - centerIndex) / 2
               const labelWeight = initialWeightRef.current + steps * increment;
                if (labelWeight >= minWeight && labelWeight <= maxWeight) {
                    marks.push(
                        <Text
                            key={`label-${i}`}
                            style={{
                                position: "absolute",
                                left: left - 20,
                                top: 60,
                                width: 40,
                                textAlign: "center",
                                color: "#9CA3AF",
                                fontSize: 14,
                                fontWeight: "600",
                            }}
                        >
                            {labelWeight}
                        </Text>,
                    )
                }
            }
        }
        return marks
    }

    const onContinue = () => {
        if (!ctx) return
        const weightInKg = unit === "kg" ? weight : Math.round((weight * 0.453592) / 10) * 10
        ctx.setData((prev) => ({ ...prev, weight: weightInKg }))
        triggerHaptic("success")
        router.push("./patient-height")
    }

    const onSkip = () => {
        router.push("./patient-height")
    }

    if (!ctx) {
        router.replace("/")
        return null
    }

    return (
        <SafeAreaView className="flex-1 bg-white">


            <View className="flex-1 px-6 mt-8">
                <Text className="text-3xl font-bold text-[#2D3142] mb-2">What is your weight?</Text>
                <Text className="text-gray-500 mb-8">
                    Swipe left or right to adjust by {increment} {unit} increments
                </Text>

                {/* Unit toggle */}
                <View className="flex-row bg-gray-100 p-1 rounded-full mb-12">
                    {(["lbs", "kg"] as const).map((u) => (
                        <TouchableOpacity
                            key={u}
                            onPress={() => toggleUnit(u)}
                            activeOpacity={0.7}
                            className={`flex-1 py-3 rounded-full ${unit === u ? "bg-[#2D3142]" : ""}`}
                        >
                            <Text className={`text-center font-medium ${unit === u ? "text-white" : "text-[#2D3142]"}`}>{u}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Fixed Weight Display */}
                <View className="items-center mb-16">
                    <Animated.View
                        style={{
                            transform: [{ scale: scaleAnim }],
                            shadowColor: "#4361EE",
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: glowAnim,
                            shadowRadius: 20,
                            elevation: glowAnim._value * 10,
                        }}
                        className="items-center bg-white rounded-3xl p-8"
                    >
                        <Text className="text-8xl font-bold text-[#2D3142]">{weight}</Text>
                        <Text className="text-3xl text-gray-500 mt-2">{unit}</Text>
                    </Animated.View>

                    {/* Increment indicator */}
                    <Animated.View
                        style={{ opacity: glowAnim }}
                        className="absolute -bottom-8 bg-[#4361EE] px-6 py-3 rounded-full"
                    >
                        <Text className="text-white text-sm font-medium">
                            ±{increment} {unit} per swipe
                        </Text>
                    </Animated.View>
                </View>

                {/* Interactive Slider */}
                <View className="h-32 mb-8">
                    <Text className="text-center text-gray-400 text-sm mb-4">Swipe the slider to adjust weight</Text>
                    <View {...panResponder.panHandlers} className="h-20 relative bg-gray-50 rounded-xl shadow-inner">
                        <Animated.View style={{ transform: [{ translateX: sliderPan }] }} className="h-full w-full relative">
                            {generateRulerMarks()}
                        </Animated.View>

                        {/* Center indicator line with enhanced styling */}
                        <View
                            className="absolute top-0 bottom-0 left-1/2 w-1 bg-[#4361EE] rounded-full shadow-lg"
                            style={{ marginLeft: -2 }}
                        >
                            <View
                                className="absolute -top-2 left-1/2 w-4 h-4 bg-[#4361EE] rounded-full shadow-lg"
                                style={{ marginLeft: -8 }}
                            />
                            <View
                                className="absolute -bottom-2 left-1/2 w-4 h-4 bg-[#4361EE] rounded-full shadow-lg"
                                style={{ marginLeft: -8 }}
                            />
                        </View>
                    </View>
                </View>

                {/* Weight range and increment info */}
                <View className="bg-gray-50 rounded-xl p-4 mb-8">
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-600 text-sm font-medium">Range:</Text>
                        <Text className="text-gray-800 text-sm font-semibold">
                            {minWeight} - {maxWeight} {unit}
                        </Text>
                    </View>
                    <View className="flex-row justify-between">
                        <Text className="text-gray-600 text-sm font-medium">Increment:</Text>
                        <Text className="text-[#4361EE] text-sm font-semibold">
                            {increment} {unit} per swipe
                        </Text>
                    </View>
                </View>
            </View>

            {/* Continue button */}
            <View className="px-6 pb-8">
                <TouchableOpacity
                    onPress={onContinue}
                    activeOpacity={0.7}
                    className="flex-row items-center justify-center w-full py-4 bg-[#4361EE] rounded-xl shadow-lg"
                    style={{
                        shadowColor: "#4361EE",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 8,
                    }}
                >
                    <Text className="text-white font-semibold text-lg mr-2">Continue</Text>
                    <Text className="text-white text-xl">→</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default PatientWeightScreen
