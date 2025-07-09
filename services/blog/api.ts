// services/blog/api.ts
import axios from "@/config/axios";
import { BlogPost, BlogPostDetail } from "./types";

/** Lấy danh sách bài viết */
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const res = await axios.get<BlogPost[]>("/blog-post");
  return res.data;
};

/** Lấy chi tiết (có nội dung) của 1 bài viết theo ID */
export const getBlogPostDetail = async (
  blogID: number
): Promise<BlogPostDetail> => {
  const res = await axios.get<BlogPostDetail>(
    `/blog-post/content/${blogID}`
  );
  return res.data;
};
