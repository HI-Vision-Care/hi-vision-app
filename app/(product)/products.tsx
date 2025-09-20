import { router } from "expo-router";
import { Heart, Search, ShoppingBag, Star } from "lucide-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth } = Dimensions.get("window");
const cardWidth = (screenWidth - 48) / 2; // 2 columns with padding

// Sample products data
const productsData = [
  {
    id: "1",
    productName: "Digital Blood Pressure Monitor",
    price: 89.99,
    imageUrl:
      "https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Monitoring",
    rating: 4.8,
    reviewCount: 247,
    inStock: true,
    isFavorite: false,
  },
  {
    id: "2",
    productName: "Digital Thermometer",
    price: 24.99,
    imageUrl:
      "https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Monitoring",
    rating: 4.6,
    reviewCount: 189,
    inStock: true,
    isFavorite: true,
  },
  {
    id: "3",
    productName: "Pulse Oximeter",
    price: 45.99,
    imageUrl:
      "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Monitoring",
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    isFavorite: false,
  },
  {
    id: "4",
    productName: "Stethoscope Professional",
    price: 129.99,
    imageUrl:
      "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Diagnostic",
    rating: 4.9,
    reviewCount: 324,
    inStock: true,
    isFavorite: false,
  },
  {
    id: "5",
    productName: "First Aid Kit Complete",
    price: 34.99,
    imageUrl:
      "https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Emergency",
    rating: 4.5,
    reviewCount: 98,
    inStock: false,
    isFavorite: true,
  },
  {
    id: "6",
    productName: "Blood Glucose Meter",
    price: 67.99,
    imageUrl:
      "https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Monitoring",
    rating: 4.4,
    reviewCount: 203,
    inStock: true,
    isFavorite: false,
  },
];

const categories = ["All", "Monitoring", "Diagnostic", "Emergency", "Supplies"];

export default function ProductListingScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState(productsData);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.productName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, isFavorite: !product.isFavorite }
          : product
      )
    );
  };

  const navigateToProduct = (product: any) => {
    router.push("/(root)/products/[id]");
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={10} color="#0066CC" fill="#0066CC" />);
    }

    const remainingStars = 5 - fullStars;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={10} color="#E5E7EB" fill="#E5E7EB" />
      );
    }

    return stars;
  };

  const renderProductCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => navigateToProduct(item)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden"
      style={{ width: cardWidth }}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${item.productName}`}
    >
      {/* Product Image */}
      <View className="relative">
        <Image
          source={{ uri: item.imageUrl }}
          className="w-full h-32"
          resizeMode="cover"
        />

        {/* Favorite Button */}
        <TouchableOpacity
          onPress={() => toggleFavorite(item.id)}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 shadow-sm"
          accessibilityRole="button"
          accessibilityLabel={
            item.isFavorite ? "Remove from favorites" : "Add to favorites"
          }
        >
          <Heart
            size={14}
            color={item.isFavorite ? "#EF4444" : "#6B7280"}
            fill={item.isFavorite ? "#EF4444" : "none"}
          />
        </TouchableOpacity>

        {/* Stock Status */}
        {!item.inStock && (
          <View className="absolute bottom-2 left-2">
            <View className="bg-red-500 px-2 py-1 rounded-full">
              <Text className="text-white text-xs font-medium">
                Out of Stock
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View className="p-3">
        {/* Category Badge */}
        <View className="mb-2">
          <View className="bg-medical-light px-2 py-1 rounded-full self-start">
            <Text className="text-medical-primary text-xs font-medium">
              {item.category}
            </Text>
          </View>
        </View>

        {/* Product Name */}
        <Text
          className="text-sm font-semibold text-gray-900 mb-1 leading-tight"
          numberOfLines={2}
        >
          {item.productName}
        </Text>

        {/* Rating */}
        <View className="flex-row items-center mb-2">
          <View className="flex-row items-center mr-1">
            {renderStars(item.rating)}
          </View>
          <Text className="text-xs text-gray-600">
            {item.rating} ({item.reviewCount})
          </Text>
        </View>

        {/* Price */}
        <Text className="text-lg font-bold text-medical-primary">
          ${item.price}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-medical-accent">
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-2xl font-bold text-gray-900">
            Medical Products
          </Text>
          <TouchableOpacity
            className="p-2 rounded-full bg-medical-light"
            accessibilityRole="button"
            accessibilityLabel="Shopping cart"
          >
            <ShoppingBag size={20} color="#0066CC" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-50 rounded-xl px-3 py-2 mb-3">
          <Search size={18} color="#6B7280" />
          <TextInput
            className="flex-1 ml-2 text-gray-900"
            placeholder="Search products..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="Search products"
          />
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row"
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedCategory === category
                  ? "bg-medical-primary"
                  : "bg-gray-100"
              }`}
              accessibilityRole="button"
              accessibilityLabel={`Filter by ${category}`}
            >
              <Text
                className={`font-medium ${
                  selectedCategory === category ? "text-white" : "text-gray-700"
                }`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Products Grid */}
      <View className="flex-1 px-4 pt-4">
        {filteredProducts.length > 0 ? (
          <FlatList
            data={filteredProducts}
            renderItem={renderProductCard}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Search size={48} color="#9CA3AF" />
            <Text className="text-lg font-semibold text-gray-900 mt-4 mb-2">
              No products found
            </Text>
            <Text className="text-gray-600 text-center">
              Try adjusting your search or filter criteria
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
