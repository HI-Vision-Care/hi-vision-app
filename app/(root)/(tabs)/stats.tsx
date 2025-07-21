import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useGetBlogPosts } from '@/services/blog/hooks';
import { BlogPost } from '@/services/blog/types';
import { usePatientProfile } from '@/hooks/usePatientId';



const Stats = () => {
  const { data: profile } = usePatientProfile();
  const patientAccountId = profile?.account.id;
  const { data: posts, isLoading, isError, error, refetch } = useGetBlogPosts(patientAccountId);        
  const [refreshing, setRefreshing] = useState(false);

  // Đảm bảo newest blog lên đầu (nếu backend không sort sẵn)
  const orderedPosts = posts?.slice().sort(
    (a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
  ) || [];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch?.(); // nếu hook trả về refetch
    setRefreshing(false);
  }, [refetch]);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#4285f4" />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error?.message || 'Lỗi tải bài viết'}</Text>
      </SafeAreaView>
    );
  }

  const featured = orderedPosts.length > 0 ? orderedPosts[0] : null;
  const list = orderedPosts.length > 1 ? orderedPosts.slice(1) : [];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trang tin tức</Text>
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
        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#4285f4"]}
            />
          }
        >
          {/* Category Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity style={[styles.tab, styles.activeTab]}>
              <Text style={[styles.tabText, styles.activeTabText]}>Bừng Sáng</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>Sống khoẻ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>Dinh dưỡng</Text>
            </TouchableOpacity>
          </View>

          {/* Featured Article */}
          {featured && (
            <TouchableOpacity
              style={styles.featuredArticle}
              onPress={() =>
                router.push({
                  pathname: '/forums/[id]',
                  params: { id: featured.id.toString() },
                })
              }
            >
              <Image source={{ uri: featured.banner }} style={styles.featuredImage} />
              <View style={styles.featuredContent}>
                <Text style={styles.featuredCategory}>{featured.topic}</Text>
                <Text style={styles.featuredTitle} numberOfLines={2}>
                  {featured.title}
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Articles List */}
          <View style={styles.articlesList}>
            {list.map((post: BlogPost) => (
              <TouchableOpacity
                key={post.id}
                style={styles.articleItem}
                onPress={() =>
                  router.push({
                    pathname: '/forums/[id]',
                    params: { id: post.id.toString() },
                  })
                }
              >
                <Image source={{ uri: post.banner }} style={styles.articleImage} />
                <View style={styles.articleContent}>
                  <Text style={styles.articleCategory}>{post.topic}</Text>
                  <Text style={styles.articleTitle} numberOfLines={2}>
                    {post.title}
                  </Text>
                  <Text style={styles.articleMeta}>
                    {new Date(post.createAt).toLocaleDateString()}
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
    backgroundColor: '#4285f4',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
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
    paddingLeft: 30,
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
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredImage: {
    width: '100%',
    height: 220,
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  articleImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  articleContent: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  articleCategory: {
    fontSize: 12,
    color: '#4285f4',
    marginBottom: 5,
    fontWeight: '500',
  },
  articleTitle: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
    fontWeight: '500',
  },
  articleMeta: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default Stats;
