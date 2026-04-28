/**
 * useImageUpload.ts
 * Manages photo selection via input or drag & drop.
 */
import { useState, useCallback } from "react";
import { loadImage, resizeImage } from "../utils/imageUtils";

export const useImageUpload = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [originalCanvas, setOriginalCanvas] = useState<HTMLCanvasElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please upload a PNG, JPG, or WEBP image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large (max 10MB).");
      return;
    }

    setError(null);
    const url = URL.createObjectURL(file);
    try {
      const img = await loadImage(url);
      const { canvas } = resizeImage(img, 1200);
      setImage(img);
      setOriginalCanvas(canvas);
    } catch (e) {
      setError("Failed to load image.");
    }
  }, []);

  return { image, originalCanvas, error, handleFiles };
};
