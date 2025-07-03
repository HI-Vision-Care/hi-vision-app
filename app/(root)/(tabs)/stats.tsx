import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const Stats = () => {
  const articles = [
    {
      id: 1,
      category: 'Khoẻ đẹp',
      title: 'Kính chống ánh sáng xanh là gì? Có nên đeo kính chống ánh sáng xanh không?',
      image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=100&h=100&fit=crop',
    },
    {
      id: 2,
      category: 'Phòng bệnh & Sống khoẻ',
      title: 'Mỗi ngày nên ăn mấy quả chuối xanh luộc?',
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=100&h=100&fit=crop',
    },
    {
      id: 3,
      category: 'Giới tính',
      title: 'Hình ảnh nổi mụn ở vùng kín nam: Nhận biết để có phương pháp điều trị phù hợp',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop',
    },
    {
      id: 5,
      category: 'Khoẻ đẹp',
      title: 'Kính chống ánh sáng xanh là gì? Có nên đeo kính chống ánh sáng xanh không?',
      image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=100&h=100&fit=crop',
    },
    {
      id: 6,
      category: 'Phòng bệnh & Sống khoẻ',
      title: 'Mỗi ngày nên ăn mấy quả chuối xanh luộc?',
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=100&h=100&fit=crop',
    },
    {
      id: 7,
      category: 'Giới tính',
      title: 'Hình ảnh nổi mụn ở vùng kín nam: Nhận biết để có phương pháp điều trị phù hợp',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop',
    },
    {
      id: 8,
      category: 'Phòng bệnh & Sống khoẻ',
      title: 'Đi ngoài ra máu tươi là dấu hiệu cảnh báo bệnh gì? Cách xử lý như thế nào?',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Góc sức khoẻ</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="share-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="bag-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentWrapper}>
        <ScrollView style={styles.content}>
          {/* Category Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity style={[styles.tab, styles.activeTab]}>
              <Text style={[styles.tabText, styles.activeTabText]}>
                Phòng bệnh & Sống khoẻ
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>Dinh dưỡng</Text>
            </TouchableOpacity>
          </View>

          {/* Featured Article */}
          <View style={styles.featuredArticle}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=200&fit=crop',
              }}
              style={styles.featuredImage}
            />
            <View style={styles.featuredContent}>
              <Text style={styles.featuredCategory}>Dinh dưỡng</Text>
              <Text style={styles.featuredTitle}>
                Đừng ép ăn nếu chưa hiểu bé 7 tháng ăn bao nhiều ml cháo là đủ
              </Text>
            </View>
          </View>

          {/* Articles List */}
          <View style={styles.articlesList}>
            {articles.map((article) => (
              <TouchableOpacity key={article.id} style={styles.articleItem}>
                <Image source={{ uri: article.image }} style={styles.articleImage} />
                <View style={styles.articleContent}>
                  <Text style={styles.articleCategory}>{article.category}</Text>
                  <Text style={styles.articleTitle} numberOfLines={2}>
                    {article.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4285f4', // Changed from '#f5f5f5' to match header
  },
  header: {
    backgroundColor: '#4285f4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    padding: 4,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  activeTab: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#333',
    fontWeight: '500',
  },
  featuredArticle: {
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  featuredContent: {
    padding: 16,
  },
  featuredCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    lineHeight: 24,
  },
  articlesList: {
    paddingHorizontal: 16,
  },
  articleItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 8,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  articleImage: {
    width: 100,
    height:100,
    borderRadius: 8,
    marginRight: 16,
  },
  articleContent: {
    flex: 1,
    justifyContent: 'center',
  },
  articleCategory: {
    fontSize: 12,
    color: '#4285f4',
    marginBottom: 4,
    fontWeight: '500',
  },
  articleTitle: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
    fontWeight: '500',
  },
});

export default Stats;