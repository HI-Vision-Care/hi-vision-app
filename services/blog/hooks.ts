// services/blog/hooks.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getBlogPosts,
  getBlogPostDetail,
} from "./api";
import { BlogPost, BlogPostDetail } from "./types";

/** Hook để lấy list bài viết */
export const useGetBlogPosts = () =>
  useQuery<BlogPost[], Error>(
    ["blogPosts"],
    () => getBlogPosts()
  );

/** Hook để lấy chi tiết 1 bài viết, chỉ chạy khi có blogID */
export const useGetBlogPostDetail = (blogID?: number) =>
  useQuery<BlogPostDetail, Error>(
    ["blogPostDetail", blogID],
    () => getBlogPostDetail(blogID!),
    {
      enabled: typeof blogID === "number",
    }
  );
