// services/storage/imageUpload.ts
// Supabase Storage implementation

import { supabase } from "@/services/storage/supabaseClient";
import * as FileSystem from "expo-file-system/legacy";

export interface UploadResult {
  url: string; // URL để hiển thị (public)
  filename: string; // Đường dẫn trong storage: "avatars/<key>"
}

// Retry helper function
const retry = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0) {
      console.log(`Retrying upload... (${retries} attempts left)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retry(fn, retries - 1, delay * 2); // Exponential backoff
    }
    throw error;
  }
};

export const uploadImageToStorage = async (
  imageUri: string,
  bucket: string = "avatars"
): Promise<UploadResult> => {
  try {
    // Validate imageUri
    if (!imageUri) {
      throw new Error("Image URI is required");
    }

    // Check if it's a local file (file://) or remote URL
    const isLocalFile = imageUri.startsWith("file://") || imageUri.startsWith("ph://") || imageUri.startsWith("assets-library://");

    // 1) Tạo tên file duy nhất
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    
    // Get extension from URI, fallback to jpg if not found
    // On iOS, URI might not have extension, so we default to jpg
    let extension = "jpg";
    const uriParts = imageUri.split(".");
    if (uriParts.length > 1) {
      const lastPart = uriParts[uriParts.length - 1].toLowerCase();
      // Check if it's a valid image extension
      if (["jpg", "jpeg", "png", "gif", "webp"].includes(lastPart.split("?")[0])) {
        extension = lastPart.split("?")[0];
      }
    }
    
    const objectKey = `${timestamp}_${randomString}.${extension}`;
    const storagePath = `${bucket}/${objectKey}`;

    // 2) Đọc file thành base64 (chỉ cho local files)
    let byteArray: Uint8Array;
    let contentType = `image/${extension === "jpg" ? "jpeg" : extension}`;

    if (isLocalFile) {
      try {
        // Normalize file URI for iOS (remove ph:// or assets-library://)
        let normalizedUri = imageUri;
        if (imageUri.startsWith("ph://") || imageUri.startsWith("assets-library://")) {
          // For iOS photo library, we need to use a different approach
          // Try to read as base64 directly
          normalizedUri = imageUri;
        }

        const base64 = await FileSystem.readAsStringAsync(normalizedUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // 3) Convert base64 thành ArrayBuffer
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        byteArray = new Uint8Array(byteNumbers);
        
        // Try to detect content type from file signature (magic bytes)
        if (byteArray.length >= 4) {
          // JPEG: FF D8 FF
          if (byteArray[0] === 0xff && byteArray[1] === 0xd8 && byteArray[2] === 0xff) {
            contentType = "image/jpeg";
            extension = "jpg";
          }
          // PNG: 89 50 4E 47
          else if (byteArray[0] === 0x89 && byteArray[1] === 0x50 && byteArray[2] === 0x4e && byteArray[3] === 0x47) {
            contentType = "image/png";
            extension = "png";
          }
          // GIF: 47 49 46 38
          else if (byteArray[0] === 0x47 && byteArray[1] === 0x49 && byteArray[2] === 0x46 && byteArray[3] === 0x38) {
            contentType = "image/gif";
            extension = "gif";
          }
        }
      } catch (readError: any) {
        console.error("❌ Error reading file:", readError);
        console.error("Image URI:", imageUri);
        throw new Error(`Failed to read image file: ${readError.message}`);
      }
    } else {
      // If it's already a URL, fetch it
      try {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        byteArray = new Uint8Array(arrayBuffer);
        
        // Update content type from blob if available
        if (blob.type) {
          contentType = blob.type;
        }
      } catch (fetchError: any) {
        console.error("❌ Error fetching image:", fetchError);
        throw new Error(`Failed to fetch image: ${fetchError.message}`);
      }
    }

    // 4) Upload lên Supabase Storage với retry logic
    const uploadWithRetry = async () => {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(objectKey, byteArray, {
          upsert: false,
          contentType: contentType,
        });

      if (error) {
        console.error("❌ Supabase upload error:", error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      return data;
    };

    const uploadData = await retry(uploadWithRetry, 3, 1000);

    // 5) Lấy public URL từ Supabase Storage
    const supabaseUrl =
      process.env.EXPO_PUBLIC_SUPABASE_URL ||
      "https://lbijtyumwpjnmqrrmtpe.supabase.co";
    const correctUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${objectKey}`;

    return {
      url: correctUrl,
      filename: storagePath,
    };
  } catch (error: any) {
    console.error("❌ Upload error:", error);

    // Provide more user-friendly error messages
    let errorMessage = "Upload failed";
    if (
      error?.message?.includes("Network request failed") ||
      error?.message?.includes("Unable to resolve host")
    ) {
      errorMessage =
        "Network error. Please check your internet connection and try again.";
    } else if (error?.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
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
