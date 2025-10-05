// services/storage/imageUpload.backup.ts
// Backup version với mock implementation để test

export interface UploadResult {
  url: string;
  filename: string;
}

export const uploadImageToStorage = async (
  imageUri: string,
  bucket: string = "avatars"
): Promise<UploadResult> => {
  // Simulate upload delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Generate mock URL
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = imageUri.split(".").pop() || "jpg";
  const filename = `${bucket}/${timestamp}_${randomString}.${extension}`;

  const mockUrl = `https://mock-storage.example.com/${filename}`;

  return {
    url: mockUrl,
    filename: filename,
  };
};

export const deleteImageFromStorage = async (
  filename: string
): Promise<void> => {
  console.log("🗑️ Deleting image:", filename);
  // Mock delete
  await new Promise((resolve) => setTimeout(resolve, 500));
};
