/**
 * imageUtils.ts
 * Helpers for loading images and resizing them to fit within a maximum dimension.
 */

export const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });
};

export const resizeImage = (
  img: HTMLImageElement,
  maxDim: number = 1200
): { width: number; height: number; canvas: HTMLCanvasElement } => {
  let width = img.width;
  let height = img.height;

  if (width > maxDim || height > maxDim) {
    if (width > height) {
      height = (height / width) * maxDim;
      width = maxDim;
    } else {
      width = (width / height) * maxDim;
      height = maxDim;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.drawImage(img, 0, 0, width, height);
  }

  return { width, height, canvas };
};
