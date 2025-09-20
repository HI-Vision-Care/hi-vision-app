import { router } from "expo-router";
import {
  ArrowLeft,
  Award,
  ChevronRight,
  Heart,
  Share2,
  Shield,
  Star,
  Truck,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth } = Dimensions.get("window");

// Sample product data
const productData = {
  productName: "Digital Blood Pressure Monitor",
  description:
    "Professional-grade digital blood pressure monitor with advanced accuracy technology. Features automatic inflation, memory storage for up to 120 readings, and WHO classification indicator. Clinically validated for accuracy and designed for both home and clinical use. Includes pre-formed cuff suitable for standard and large arm sizes.",
  price: 89.99,
  unit: "each",
  imageUrl:
    "https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=800",
  category: "Monitoring Equipment",
  supplier: "MedTech Solutions Inc.",
  rating: 4.8,
  reviewCount: 247,
  inStock: true,
  features: [
    "Clinical Accuracy ±3 mmHg",
    "Large LCD Display",
    "120 Memory Storage",
    "WHO Classification",
    "Automatic Inflation",
  ],
};

export default function ProductDetailsScreen() {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const heartScale = useSharedValue(1);
  const fadeAnim = useSharedValue(0);

  React.useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 800 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: withTiming(fadeAnim.value === 1 ? 0 : 20) }],
    };
  });

  const heartAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: heartScale.value }],
    };
  });

  const handleFavoritePress = () => {
    heartScale.value = withSpring(1.2, { duration: 150 }, () => {
      heartScale.value = withSpring(1, { duration: 150 });
    });

    runOnJS(setIsFavorited)(!isFavorited);
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleSharePress = () => {
    Alert.alert("Share", "Share functionality would be implemented here");
  };

  const handleAddToCart = () => {
    Alert.alert(
      "Added to Cart",
      `${productData.productName} has been added to your cart`
    );
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={14} color="#0066CC" fill="#0066CC" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" size={14} color="#0066CC" fill="#0066CC" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={14} color="#E5E7EB" fill="#E5E7EB" />
      );
    }

    return stars;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity
          onPress={handleBackPress}
          className="p-2 rounded-full bg-medical-light"
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={20} color="#0066CC" />
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-gray-900">
          Product Details
        </Text>

        <TouchableOpacity
          onPress={handleSharePress}
          className="p-2 rounded-full bg-medical-light"
          accessibilityRole="button"
          accessibilityLabel="Share product"
        >
          <Share2 size={20} color="#0066CC" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Animated.View style={animatedStyle}>
          {/* Product Image */}
          <View className="bg-medical-accent mx-4 mt-4 rounded-2xl overflow-hidden">
            <View className="relative">
              <Image
                source={{ uri: productData.imageUrl }}
                className="w-full h-80"
                resizeMode="cover"
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
              />

              {imageLoading && (
                <View className="absolute inset-0 bg-gray-200 items-center justify-center">
                  <Text className="text-gray-500">Loading...</Text>
                </View>
              )}

              {imageError && (
                <View className="absolute inset-0 bg-gray-200 items-center justify-center">
                  <Text className="text-gray-500">Image unavailable</Text>
                </View>
              )}

              {/* Favorite Button */}
              <TouchableOpacity
                onPress={handleFavoritePress}
                className="absolute top-4 right-4 p-3 rounded-full bg-white/90 shadow-lg"
                accessibilityRole="button"
                accessibilityLabel={
                  isFavorited ? "Remove from favorites" : "Add to favorites"
                }
              >
                <Animated.View style={heartAnimatedStyle}>
                  <Heart
                    size={20}
                    color={isFavorited ? "#EF4444" : "#6B7280"}
                    fill={isFavorited ? "#EF4444" : "none"}
                  />
                </Animated.View>
              </TouchableOpacity>

              {/* Category Badge */}
              <View className="absolute bottom-4 left-4">
                <View className="bg-medical-primary px-3 py-1.5 rounded-full">
                  <Text className="text-white text-sm font-medium">
                    {productData.category}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Product Information */}
          <View className="px-4 mt-6">
            {/* Product Name */}
            <Text
              className="text-2xl font-bold text-gray-900 leading-tight"
              accessibilityRole="header"
            >
              {productData.productName}
            </Text>

            {/* Rating and Reviews */}
            <View className="flex-row items-center mt-2 mb-4">
              <View className="flex-row items-center mr-3">
                {renderStars(productData.rating)}
              </View>
              <Text className="text-medical-primary font-medium">
                {productData.rating}
              </Text>
              <Text className="text-gray-500 ml-1">
                ({productData.reviewCount} reviews)
              </Text>
            </View>

            {/* Price */}
            <View className="flex-row items-baseline mb-6">
              <Text
                className="text-3xl font-bold text-medical-primary"
                accessibilityLabel={`Price: ${productData.price} dollars per ${productData.unit}`}
              >
                ${productData.price}
              </Text>
              <Text className="text-lg text-gray-600 ml-2">
                / {productData.unit}
              </Text>
            </View>

            {/* Stock Status */}
            <View className="flex-row items-center mb-6">
              <View
                className={`w-2 h-2 rounded-full mr-2 ${
                  productData.inStock ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <Text
                className={`font-medium ${
                  productData.inStock ? "text-green-700" : "text-red-700"
                }`}
              >
                {productData.inStock ? "In Stock" : "Out of Stock"}
              </Text>
            </View>

            {/* Features */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                Key Features
              </Text>
              {productData.features.map((feature, index) => (
                <View key={index} className="flex-row items-center mb-2">
                  <View className="w-1.5 h-1.5 rounded-full bg-medical-primary mr-3" />
                  <Text className="text-gray-700 flex-1">{feature}</Text>
                </View>
              ))}
            </View>

            {/* Description */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                Description
              </Text>
              <Text
                className="text-gray-700 leading-relaxed text-base"
                accessibilityRole="text"
              >
                {productData.description}
              </Text>
            </View>

            {/* Trust Indicators */}
            <View className="bg-medical-light rounded-2xl p-4 mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                Why Choose This Product
              </Text>

              <View className="space-y-3">
                <View className="flex-row items-center">
                  <View className="p-2 rounded-full bg-white mr-3">
                    <Shield size={16} color="#0066CC" />
                  </View>
                  <Text className="text-gray-700 flex-1">
                    Clinically validated accuracy
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <View className="p-2 rounded-full bg-white mr-3">
                    <Award size={16} color="#0066CC" />
                  </View>
                  <Text className="text-gray-700 flex-1">
                    FDA approved medical device
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <View className="p-2 rounded-full bg-white mr-3">
                    <Truck size={16} color="#0066CC" />
                  </View>
                  <Text className="text-gray-700 flex-1">
                    Free shipping on orders over $50
                  </Text>
                </View>
              </View>
            </View>

            {/* Supplier Information */}
            <View className="bg-gray-50 rounded-2xl p-4 mb-6">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-500 mb-1">
                    Supplied by
                  </Text>
                  <Text className="text-lg font-semibold text-gray-900">
                    {productData.supplier}
                  </Text>
                </View>
                <ChevronRight size={20} color="#6B7280" />
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <TouchableOpacity
          onPress={handleAddToCart}
          className="bg-medical-primary rounded-2xl py-4 px-6 shadow-lg"
          accessibilityRole="button"
          accessibilityLabel="Add to cart"
          disabled={!productData.inStock}
          style={{ opacity: productData.inStock ? 1 : 0.6 }}
        >
          <Text className="text-white text-lg font-semibold text-center">
            {productData.inStock ? "Add to Cart" : "Out of Stock"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
