// services/storage/imageUpload.ts
// Supabase Storage implementation

import { supabase } from "@/services/storage/supabaseClient";
import * as FileSystem from "expo-file-system/legacy";

export interface UploadResult {
  url: string; // URL để hiển thị (public)
  filename: string; // Đường dẫn trong storage: "avatars/<key>"
}

export const uploadImageToStorage = async (
  imageUri: string,
  bucket: string = "avatars"
): Promise<UploadResult> => {
  try {
    // 1) Tạo tên file duy nhất
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    const extension = imageUri.split(".").pop()?.toLowerCase() || "jpg";
    const objectKey = `${timestamp}_${randomString}.${extension}`;
    const storagePath = `${bucket}/${objectKey}`;

    // 2) Đọc file thành base64 (sử dụng legacy API)
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // 3) Convert base64 thành ArrayBuffer
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // 4) Upload lên Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(objectKey, byteArray, {
        upsert: false,
        contentType: `image/${extension}`,
      });

    if (error) {
      console.error("❌ Supabase upload error:", error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    // 5) Lấy public URL từ Supabase Storage
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(objectKey);

    if (!urlData?.publicUrl) {
      throw new Error("Cannot get public URL from Supabase");
    }

    // 6) Tạo URL đúng từ Supabase project
    const supabaseUrl =
      process.env.EXPO_PUBLIC_SUPABASE_URL ||
      "https://lbijtyumwpjnmqrrmtpe.supabase.co";
    const correctUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${objectKey}`;

    return {
      url: correctUrl, // Sử dụng URL được tạo thủ công
      filename: storagePath,
    };
  } catch (error) {
    console.error("❌ Upload error:", error);
    throw error;
  }
};

export const deleteImageFromStorage = async (
  filename: string
): Promise<void> => {
  try {
    // filename dạng "avatars/xxx.jpg"
    const [bucket, ...rest] = filename.split("/");
    const key = rest.join("/");

    const { error } = await supabase.storage.from(bucket).remove([key]);

    if (error) {
      console.error("❌ Delete error:", error);
      throw error;
    }
  } catch (error) {
    console.error("❌ Delete error:", error);
    throw error;
  }
};
