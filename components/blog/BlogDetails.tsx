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
import { BlogPostDetail } from '@/services/blog/types';

interface BlogDetailsProps {
    post: BlogPostDetail;
    onBack: () => void;
}

const BlogDetails: React.FC<BlogDetailsProps> = ({ post, onBack }) => {
    const formattedDate = new Date(post.createAt || post.createAt).toLocaleDateString();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết bài viết</Text>
            </View>
            <ScrollView contentContainerStyle={styles.contentWrapper}>
                {post.banner ? (
                    <Image source={{ uri: post.banner }} style={styles.bannerImage} />
                ) : null}
                <View style={styles.metaContainer}>
                    <Text style={styles.topicBadge}>{post.topic.toUpperCase()}</Text>
                    <Text style={styles.title}>{post.title}</Text>
                    <View style={styles.metaInfo}>
                        <Text style={styles.metaText}>By {post.author}</Text>
                        <Text style={styles.metaText}> • {formattedDate}</Text>
                    </View>
                </View>
                {post.contents?.map((block, idx) => (
                    <View key={idx} style={styles.blockContainer}>
                        <Text style={styles.blockHeader}>{block.header}</Text>
                        <Text style={styles.blockBody}>{block.body}</Text>
                        {block.photo ? (
                            <Image source={{ uri: block.photo }} style={styles.blockImage} />
                        ) : null}
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    backButton: { marginRight: 12 },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    contentWrapper: { padding: 16 },
    bannerImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
    },
    metaContainer: { marginBottom: 24 },
    topicBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#4285f4',
        color: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 8,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#222',
        marginBottom: 8,
    },
    metaInfo: { flexDirection: 'row' },
    metaText: { fontSize: 12, color: '#666' },
    blockContainer: { marginBottom: 24 },
    blockHeader: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    blockBody: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
        marginBottom: 12,
    },
    blockImage: {
        width: '100%',
        height: 180,
        borderRadius: 8,
        marginTop: 8,
    },
});

export default BlogDetails;
