// services/storage/hooks.ts
import { useMutation } from "@tanstack/react-query";
import {
  deleteImageFromStorage,
  uploadImageToStorage,
  UploadResult,
} from "./imageUpload";

export const useUploadImage = () => {
  return useMutation<
    UploadResult,
    Error,
    { imageUri: string; folder?: string }
  >({
    mutationFn: ({ imageUri, folder }) =>
      uploadImageToStorage(imageUri, folder || "avatars"),
  });
};

export const useDeleteImage = () => {
  return useMutation<void, Error, string>({
    mutationFn: (filename) => deleteImageFromStorage(filename),
  });
};
