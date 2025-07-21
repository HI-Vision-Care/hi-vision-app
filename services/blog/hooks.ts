// services/blog/hooks.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { getBlogPosts, getBlogPostDetail } from "./api";
import { BlogPost, BlogPostDetail } from "./types";

// services/blog/hooks.ts
export const useGetBlogPosts = (accountID?: string) =>
  useQuery<BlogPost[], Error>(
    ["blogPosts", accountID],
    () => {
      // đảm bảo accountID luôn có giá trị khi chạy
      if (!accountID) {
        return Promise.reject(new Error("Missing accountID"));
      }
      return getBlogPosts(accountID);
    },
    {
      enabled: Boolean(accountID), // chỉ chạy khi accountID != undefined
    }
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
