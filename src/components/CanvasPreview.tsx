/**
 * CanvasPreview.tsx
 * Side by side view of original and filtered image.
 */
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface CanvasPreviewProps {
  original: HTMLCanvasElement | null;
  filtered: HTMLCanvasElement | null;
  isProcessing: boolean;
}

export default function CanvasPreview({ original, filtered, isProcessing }: CanvasPreviewProps) {
  const originalContainerRef = useRef<HTMLDivElement>(null);
  const filteredContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (original && originalContainerRef.current) {
      originalContainerRef.current.innerHTML = "";
      const clone = document.createElement("canvas");
      clone.width = original.width;
      clone.height = original.height;
      clone.getContext("2d")?.drawImage(original, 0, 0);
      clone.className = "w-full h-full object-contain grayscale opacity-60";
      originalContainerRef.current.appendChild(clone);
    }
  }, [original]);

  useEffect(() => {
    if (filtered && filteredContainerRef.current) {
      filteredContainerRef.current.innerHTML = "";
      const clone = document.createElement("canvas");
      clone.width = filtered.width;
      clone.height = filtered.height;
      clone.getContext("2d")?.drawImage(filtered, 0, 0);
      clone.className = "w-full h-full object-contain";
      filteredContainerRef.current.appendChild(clone);
    }
  }, [filtered]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-full min-h-[400px]">
      <div className="relative border border-zinc-900 bg-surface-container flex flex-col group">
        <div className="absolute top-4 left-4 z-10 bg-zinc-950/80 px-2 py-1 border border-zinc-800">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">ORIGINAL_RAW</span>
        </div>
        <div ref={originalContainerRef} className="flex-1 overflow-hidden" />
      </div>
      <div className="relative border border-white/20 bg-surface-container flex flex-col overflow-hidden">
        <div className="absolute top-4 left-4 z-10 bg-white px-2 py-1">
          <span className="text-[10px] font-bold text-black uppercase tracking-widest">ART_OUTPUT_GEN</span>
        </div>
        
        {isProcessing && (
          <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}

        <div ref={filteredContainerRef} className="flex-1 overflow-hidden" />
      </div>
    </div>
  );
}
