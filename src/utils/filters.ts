/**
 * filters.ts
 * Core pixel manipulation logic for 6 distinct art styles.
 * All functions follow (imageData, width, height, intensity, contrast) => ImageData signature.
 */

// Helper for grayscale
const getGrayscale = (data: Uint8ClampedArray, i: number) => {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  return 0.299 * r + 0.587 * g + 0.114 * b;
};

// Helper for contrast
const applyContrast = (value: number, contrast: number) => {
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  return factor * (value - 128) + 128;
};

// Faster Box Blur implementation
const boxBlur = (data: Uint8ClampedArray, w: number, h: number, radius: number): Uint8ClampedArray => {
  const result = new Uint8ClampedArray(data.length);
  const size = radius * 2 + 1;

  for (let y = 0; y < h; y++) {
    let sum = 0;
    // Initial sum
    for (let i = -radius; i <= radius; i++) {
      sum += data[y * w + Math.min(w - 1, Math.max(0, i))];
    }
    for (let x = 0; x < w; x++) {
      result[y * w + x] = sum / size;
      const nextX = x + radius + 1;
      const prevX = x - radius;
      sum += data[y * w + Math.min(w - 1, nextX)] - data[y * w + Math.max(0, prevX)];
    }
  }

  const verticalResult = new Uint8ClampedArray(data.length);
  for (let x = 0; x < w; x++) {
    let sum = 0;
    for (let i = -radius; i <= radius; i++) {
      sum += result[Math.min(h - 1, Math.max(0, i)) * w + x];
    }
    for (let y = 0; y < h; y++) {
      verticalResult[y * w + x] = sum / size;
      const nextY = y + radius + 1;
      const prevY = y - radius;
      sum += result[Math.min(h - 1, nextY) * w + x] - result[Math.max(0, prevY) * w + x];
    }
  }

  return verticalResult;
};

// 1. Pencil Sketch (Dodge Blur technique)
export const pencilSketch = (imageData: ImageData, w: number, h: number, intensity: number, contrast: number): ImageData => {
  const data = imageData.data;
  const len = data.length;
  const grayscale = new Uint8ClampedArray(w * h);

  for (let i = 0; i < len; i += 4) {
    grayscale[i / 4] = getGrayscale(data, i);
  }

  const inverted = new Uint8ClampedArray(grayscale.length);
  for (let i = 0; i < grayscale.length; i++) {
    inverted[i] = 255 - grayscale[i];
  }

  const blurRadius = Math.max(1, Math.floor(intensity / 10));
  const blurred = boxBlur(inverted, w, h, blurRadius);

  const result = new Uint8ClampedArray(len);
  for (let i = 0; i < grayscale.length; i++) {
    const target = grayscale[i];
    const blend = blurred[i];
    
    // Color Dodge Blend
    let dodge = blend === 255 ? blend : (target * 255) / (255 - blend);
    dodge = applyContrast(dodge, contrast - 50);

    const idx = i * 4;
    result[idx] = result[idx + 1] = result[idx + 2] = Math.min(255, Math.max(0, dodge));
    result[idx + 3] = 255;
  }

  return new ImageData(result, w, h);
};

// 2. Charcoal
export const charcoal = (imageData: ImageData, w: number, h: number, intensity: number, contrast: number): ImageData => {
  const data = imageData.data;
  const result = new Uint8ClampedArray(data.length);
  const cFactor = (contrast / 100) * 128;

  for (let i = 0; i < data.length; i += 4) {
    let g = getGrayscale(data, i);
    g = applyContrast(g, cFactor + 20); // Heavier contrast for charcoal
    
    // Add "grain" noise based on intensity
    const noise = (Math.random() - 0.5) * (100 - intensity);
    g = Math.min(255, Math.max(0, g + noise));

    result[i] = result[i+1] = result[i+2] = g < 128 ? g * 0.8 : g; // Deep shadows
    result[i+3] = 255;
  }
  return new ImageData(result, w, h);
};

// 3. Crosshatch
export const crosshatch = (imageData: ImageData, w: number, h: number, intensity: number, contrast: number): ImageData => {
  const data = imageData.data;
  const result = new Uint8ClampedArray(data.length).fill(255);
  const spacing = Math.max(2, Math.floor(12 - (intensity / 10)));

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const g = getGrayscale(data, i);
      const c = applyContrast(g, contrast - 50);
      
      let draw = false;
      if (c < 50 && (x + y) % spacing === 0) draw = true;
      if (c < 100 && (x - y) % spacing === 0) draw = true;
      if (c < 150 && x % spacing === 0) draw = true;
      if (c < 200 && y % spacing === 0) draw = true;

      if (draw) {
        const idx = (y * w + x) * 4;
        result[idx] = result[idx + 1] = result[idx + 2] = 40;
        result[idx + 3] = 255;
      }
    }
  }
  return new ImageData(result, w, h);
};

// 4. Watercolor
export const watercolor = (imageData: ImageData, w: number, h: number, intensity: number, contrast: number): ImageData => {
  const data = imageData.data;
  const result = new Uint8ClampedArray(data.length);
  const blurRadius = Math.floor(intensity / 20) + 1;

  // Simple box blur approximation for bleeding effect
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let r = 0, g = 0, b = 0, count = 0;
      for (let dy = -blurRadius; dy <= blurRadius; dy++) {
        for (let dx = -blurRadius; dx <= blurRadius; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
            const idx = (ny * w + nx) * 4;
            r += data[idx];
            g += data[idx + 1];
            b += data[idx + 2];
            count++;
          }
        }
      }
      const outIdx = (y * w + x) * 4;
      result[outIdx] = applyContrast(r / count, contrast - 50);
      result[outIdx + 1] = applyContrast(g / count, contrast - 50);
      result[outIdx + 2] = applyContrast(b / count, contrast - 50);
      result[outIdx + 3] = 255;
    }
  }
  return new ImageData(result, w, h);
};

// 5. Ink Drawing
export const inkDrawing = (imageData: ImageData, w: number, h: number, intensity: number, contrast: number): ImageData => {
  const data = imageData.data;
  const result = new Uint8ClampedArray(data.length);
  const threshold = 127 + (intensity - 50) * 2;

  for (let i = 0; i < data.length; i += 4) {
    const g = getGrayscale(data, i);
    const c = applyContrast(g, contrast - 50);
    const val = c < threshold ? 0 : 255;
    result[i] = result[i + 1] = result[i + 2] = val;
    result[i + 3] = 255;
  }
  return new ImageData(result, w, h);
};

// 6. Halftone
export const halftone = (imageData: ImageData, w: number, h: number, intensity: number, contrast: number): ImageData => {
  const data = imageData.data;
  const result = new Uint8ClampedArray(data.length).fill(255);
  const dotSize = Math.max(4, Math.floor(intensity / 5));

  for (let y = 0; y < h; y += dotSize) {
    for (let x = 0; x < w; x += dotSize) {
      const idx = (Math.min(h - 1, y) * w + Math.min(w - 1, x)) * 4;
      const g = getGrayscale(data, idx);
      const c = applyContrast(g, contrast - 50);
      
      const radius = (dotSize / 2) * (1 - c / 255);
      
      for (let dy = 0; dy < dotSize; dy++) {
        for (let dx = 0; dx < dotSize; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < w && ny < h) {
            const dist = Math.sqrt((dx - dotSize/2)**2 + (dy - dotSize/2)**2);
            if (dist < radius) {
              const outIdx = (ny * w + nx) * 4;
              result[outIdx] = result[outIdx + 1] = result[outIdx + 2] = 0;
            }
          }
        }
      }
    }
  }
  return new ImageData(result, w, h);
};
