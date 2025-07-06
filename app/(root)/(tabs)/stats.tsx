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
      category: 'Bừng Sáng',
      title: '🎙️ CHÍNH THỨC RA MẮT PODCAST “RỰC” 🔥',
      image: 'https://scontent.fsgn5-5.fna.fbcdn.net/v/t39.30808-6/510115691_122207932502500724_7932094556930319225_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_ohc=dHFJoYrl-sAQ7kNvwEeIHZ3&_nc_oc=AdnGwQjqX-XEqKUQdo6R8aN9NF-hGaCTni352QMroJEq8lHQs6Fp7EgZeGn1kcScb34&_nc_zt=23&_nc_ht=scontent.fsgn5-5.fna&_nc_gid=1MjhPnaztlQU6arr0kNHzQ&oh=00_AfROGoGhT1rJOgOUtnD6nzTHxf18x3MGHumxfbPzAYHXQQ&oe=686EBB09',
    },
    {
      id: 2,
      category: 'Sự kiện',
      title: '🏳️‍🌈 Pride Month – Tháng Tự Hào',
      image: 'https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-6/503336153_122204542640500724_3083070366278773332_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=GOx_cNG3fOkQ7kNvwHr7pcd&_nc_oc=Adnrn9-KJM9LkmuvOPwUhpdL9GyyPrmdHiTWxzk0gwVF2WuhJ2F6TyX1niDL7h65RyE&_nc_zt=23&_nc_ht=scontent.fsgn5-10.fna&_nc_gid=Q1j0I0EVPn3rhq8l_ARc5Q&oh=00_AfQ5VLL9NoGPoBi3HesFJLTj2AOZKf66E2ialSCqiEML9w&oe=686EB1AF',
    },
    {
      id: 5,
      category: 'Thông tin',
      title: '🌈 Hiến pháp đang sửa đổi',
      image: 'https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-6/500741364_122202931010500724_914107304753116686_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=kJWnsTt_ka0Q7kNvwHAeBQK&_nc_oc=Adl9ZKVYdQfMTlgfMxwL-hCH2_9lAT8RvG6ubIP03h9hNYooIMmBPALUpYt_1b7vnOw&_nc_zt=23&_nc_ht=scontent.fsgn5-10.fna&_nc_gid=cwwgrGBDQoOx_I0FNMTy3w&oh=00_AfT6XRImrRHZW6tkA1Jm80BuWNUqU8N0d3YZMFzdDpr0MA&oe=686EC1BA',
    },
    {
      id: 6,
      category: 'Sự Kiện',
      title: 'Ngày 30/04 – Hành trình của những con người dám mơ về một tương lai tự do.',
      image: 'https://scontent.fsgn5-14.fna.fbcdn.net/v/t39.30808-6/494046890_122193833852500724_7921167563976051558_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_ohc=2XzOpH2MFzkQ7kNvwGuSqgX&_nc_oc=Adl88YQwsPHfdR8BGM0aMS7fYFyeuj35c1lG8z-AYtOuEXkdunsbeVgq13AfWLHREXs&_nc_zt=23&_nc_ht=scontent.fsgn5-14.fna&_nc_gid=FAzkJpanceh0I5tF4n27Ug&oh=00_AfRdhud_T4BMssvGfczozxnIabIhoxnb0h-Y4yfyWlTDiw&oe=686EBA24',
    },

  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
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
        <ScrollView style={styles.content}>
          {/* Category Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity style={[styles.tab, styles.activeTab]}>
              <Text style={[styles.tabText, styles.activeTabText]}>
              Bừng Sáng
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>Sống khoẻ</Text>
            </TouchableOpacity>
             <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>Dinh dưỡng</Text>
            </TouchableOpacity>
        
          </View>

          {/* Featured Article */}
          <View style={styles.featuredArticle}>
            <Image
              source={{
                uri: 'https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-6/506052891_122206346642500724_8601191760144311831_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=b7KEGqU1oNUQ7kNvwGiLsQ0&_nc_oc=Adk0ZCGeVYbRE_2vJLuA_rvP4CKkwp8iKrwDkdlWdFr3_uFVFH0BEshKJjJrp44LO3w&_nc_zt=23&_nc_ht=scontent.fsgn5-10.fna&_nc_gid=0-WsF-UWunR3LDY1z7xtzg&oh=00_AfQ7ZA52hkk4IeLKxIa6WrOCYOFz_DlFrY944OfVSKm7FQ&oe=686EA98A',
              }}
              style={styles.featuredImage}
            />
            <View style={styles.featuredContent}>
              <Text style={styles.featuredCategory}>Thông tin</Text>
              <Text style={styles.featuredTitle}>
                65% NGƯỜI DÂN VIỆT NAM ỦNG HỘ HÔN NHÂN CÙNG GIỚI
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
    paddingLeft:30,
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
    height: 220,
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
});

export default Stats;