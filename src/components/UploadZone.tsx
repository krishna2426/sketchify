/**
 * UploadZone.tsx
 * Drag and drop interface for image selection.
 */
import { Upload } from "lucide-react";
import { useCallback, useRef } from "react";

interface UploadZoneProps {
  onFiles: (files: FileList | null) => void;
  error: string | null;
}

export default function UploadZone({ onFiles, error }: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFiles(e.dataTransfer.files);
  };

  return (
    <div 
      className="flex flex-col gap-4 w-full max-w-3xl mx-auto"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="relative group border border-dashed border-zinc-800 hover:border-white h-80 flex flex-col items-center justify-center bg-zinc-950/50 cursor-pointer transition-all duration-300"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-zinc-800 to-zinc-900 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"></div>
        <Upload className="text-zinc-600 group-hover:text-white w-10 h-10 mb-6 transition-colors" />
        <p className="text-zinc-400 group-hover:text-white text-xs uppercase tracking-widest text-center px-4">
          Drop your photo here or <span className="text-white underline">click to upload</span>
        </p>
        <p className="mt-4 text-[10px] text-zinc-600 uppercase tracking-widest">
          Supported: JPG, PNG, WEBP (Max 10MB)
        </p>
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="image/*"
          onChange={(e) => onFiles(e.target.files)}
        />
      </div>
      {error && (
        <div className="text-red-500 text-[10px] uppercase tracking-widest text-center py-2 bg-red-500/5 border border-red-500/20">
          Error: {error}
        </div>
      )}
    </div>
  );
}
