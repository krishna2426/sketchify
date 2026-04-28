/**
 * useArtFilter.ts
 * Coordinates the application of filters with debouncing and non-blocking execution.
 */
import { useState, useEffect, useRef } from "react";
import * as filters from "../utils/filters";

export type FilterStyle = "Pencil" | "Charcoal" | "Crosshatch" | "Watercolor" | "Ink" | "Halftone";

export const useArtFilter = (
  originalCanvas: HTMLCanvasElement | null,
  style: FilterStyle,
  intensity: number,
  contrast: number
) => {
  const [outputCanvas, setOutputCanvas] = useState<HTMLCanvasElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const debounceTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!originalCanvas) return;

    const process = () => {
      setIsProcessing(true);
      
      // Use setTimeout to make processing non-blocking
      setTimeout(() => {
        const ctx = originalCanvas.getContext("2d");
        if (!ctx) return;

        const { width, height } = originalCanvas;
        const imageData = ctx.getImageData(0, 0, width, height);
        
        let result: ImageData;
        switch (style) {
          case "Charcoal": result = filters.charcoal(imageData, width, height, intensity, contrast); break;
          case "Crosshatch": result = filters.crosshatch(imageData, width, height, intensity, contrast); break;
          case "Watercolor": result = filters.watercolor(imageData, width, height, intensity, contrast); break;
          case "Ink": result = filters.inkDrawing(imageData, width, height, intensity, contrast); break;
          case "Halftone": result = filters.halftone(imageData, width, height, intensity, contrast); break;
          default: result = filters.pencilSketch(imageData, width, height, intensity, contrast);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const outCtx = canvas.getContext("2d");
        if (outCtx) {
          outCtx.putImageData(result, 0, 0);
        }
        
        setOutputCanvas(canvas);
        setIsProcessing(false);
      }, 0);
    };

    if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
    debounceTimer.current = window.setTimeout(process, 200);

    return () => {
      if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
    };
  }, [originalCanvas, style, intensity, contrast]);

  return { outputCanvas, isProcessing };
};
