import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useGetBlogPostDetail } from '@/services/blog/hooks';
import { BlogPostDetail } from '@/services/blog/types';
import BlogDetails from '@/components/blog/BlogDetails';

const BlogDetailScreen: React.FC = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const blogID = parseInt(id, 10);

    const {
        data: post,
        isLoading,
        isError,
        error,
    } = useGetBlogPostDetail(blogID);

    if (isLoading) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator size="large" color="#4285f4" />
            </SafeAreaView>
        );
    }

    if (isError || !post) {
        return (
            <SafeAreaView style={styles.center}>
                <Text style={styles.errorText}>{error?.message || 'Không tải được chi tiết bài viết'}</Text>
            </SafeAreaView>
        );
    }

    return (
        <BlogDetails
            post={post as BlogPostDetail}
            onBack={() => router.back()}
        />
    );
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    errorText: {
        color: '#333',
        fontSize: 16,
    },
});

export default BlogDetailScreen;
