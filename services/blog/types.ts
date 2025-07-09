// services/blog/types.ts

/** Summary của 1 bài viết khi gọi GET /blog-post */
export interface BlogPost {
  id: number;
  author: string;
  title: string;
  topic: string;
  banner: string;
  createAt: string;    // Lưu ý: API trả về "createAt"
}

/** Khối nội dung trong chi tiết bài viết */
export interface ContentBlock {
  header: string;
  body: string;
  photo: string;
}

/** Chi tiết bài viết khi gọi GET /blog-post/content/{blogID} */
export interface BlogPostDetail extends BlogPost {
  contents: ContentBlock[];
}
