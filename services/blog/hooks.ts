// services/blog/hooks.ts
// Import from native bridge file (moved out of app/ to avoid Expo Router scanning)
import { WidgetBridge } from "@/native/WidgetBridge";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getBlogPostDetail, getBlogPosts } from "./api";
import { BlogPost, BlogPostDetail } from "./types";

const DEFAULT_TITLE = "65% người dân ủng hộ hôn nhân đồng giới";
const DEFAULT_BG_URL =
  "https://scontent.fsgn5-9.fna.fbcdn.net/v/t39.30808-6/491419671_122184810890500724_7772420299609524587_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=3C4JwGXC7dAQ7kNvwGxmXNw&_nc_oc=AdnRfhk6SXk-Y0-6MnQu8azbBGwH631Sp_sfPaxv-iUoE4t9clED_imPIYM0kgBIqrI&_nc_zt=23&_nc_ht=scontent.fsgn5-9.fna&_nc_gid=5XpJ4pTtr7R4SblJjzKNJQ&oh=00_AfXVyBGJ6sUOU7IYqubOyoFWJMIk71oP-dRznCip_GgP1Q&oe=68B6661B";

export function useSyncWidgetWithBlog(accountID?: string) {
  const { data, isSuccess } = useGetBlogPosts(accountID);

  // ⬇️ Khi chưa có accountID → set mặc định 1 lần
  useEffect(() => {
    if (!accountID) {
      try {
        WidgetBridge?.setBlogCard?.(DEFAULT_TITLE, DEFAULT_BG_URL);
      } catch (e) {
        console.warn("Set default widget failed:", e);
      }
    }
  }, [accountID]);

  useEffect(() => {
    if (!isSuccess || !data?.length) return;
    const latest = data
      .filter((p) => !p.hide)
      .sort((a, b) => Date.parse(b.createAt) - Date.parse(a.createAt))[0];
    if (!latest) return;

    try {
      WidgetBridge?.setBlogCard?.(
        latest.title || DEFAULT_TITLE,
        latest.banner || DEFAULT_BG_URL
      );
    } catch (e) {
      console.warn("Update widget error:", e);
    }
  }, [isSuccess, data]);
}
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
      enabled: Boolean(accountID && accountID !== "undefined"), // chỉ chạy khi accountID có giá trị hợp lệ
      retry: false, // Không retry khi lỗi để tránh spam API
      staleTime: 5 * 60 * 1000, // Cache 5 phút
      cacheTime: 10 * 60 * 1000, // Cache 10 phút
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
